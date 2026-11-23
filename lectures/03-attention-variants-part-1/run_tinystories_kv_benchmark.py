#!/usr/bin/env python3
"""TinyStories-anchored KV-cache decode benchmark.

This is the headless RunPod runner for the notebook:
Clean_KV_Cache_Inference_Benchmark_MHA_GQA_MQA_MLA.ipynb
"""

import argparse
import math
from dataclasses import dataclass
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from datasets import load_dataset
import tiktoken


DATASET_NAME = "roneneldan/TinyStories"
EOS_ID = 50256


@dataclass
class BenchRow:
    method: str
    batch: int
    context: int
    q_heads: int
    kv_heads: int
    head_dim: int
    cache_mb: float
    bytes_per_token_kb: float
    arithmetic_intensity: float
    ms_per_step: float
    tokens_per_sec: float
    approx_gb_s: float
    speedup_vs_mha: float | None = None
    cache_reduction_vs_mha: float | None = None


def rotate_half(x):
    x1 = x[..., ::2]
    x2 = x[..., 1::2]
    return torch.stack((-x2, x1), dim=-1).flatten(-2)


def rope_cache(seq_len, dim, device, dtype, base=10000.0):
    if dim % 2 != 0:
        raise ValueError("RoPE dimension must be even")
    pos = torch.arange(seq_len, device=device, dtype=torch.float32)
    inv_freq = 1.0 / (base ** (torch.arange(0, dim, 2, device=device, dtype=torch.float32) / dim))
    freqs = torch.einsum("t,d->td", pos, inv_freq)
    emb = torch.repeat_interleave(freqs, 2, dim=-1)
    return emb.cos().to(dtype), emb.sin().to(dtype)


def apply_rope(x, cos, sin):
    return (x * cos[None, None, :, :]) + (rotate_half(x) * sin[None, None, :, :])


class TokenKVBuilder(nn.Module):
    def __init__(self, vocab_size, q_heads, kv_heads, head_dim):
        super().__init__()
        self.q_heads = q_heads
        self.kv_heads = kv_heads
        self.head_dim = head_dim
        self.q_embed = nn.Embedding(vocab_size, q_heads * head_dim)
        self.k_embed = nn.Embedding(vocab_size, kv_heads * head_dim)
        self.v_embed = nn.Embedding(vocab_size, kv_heads * head_dim)

    @torch.inference_mode()
    def build(self, context_tokens, next_tokens, device, dtype):
        batch, context = context_tokens.shape
        q = self.q_embed(next_tokens).view(batch, self.q_heads, 1, self.head_dim)
        k = self.k_embed(context_tokens).view(
            batch, context, self.kv_heads, self.head_dim
        ).transpose(1, 2).contiguous()
        v = self.v_embed(context_tokens).view(
            batch, context, self.kv_heads, self.head_dim
        ).transpose(1, 2).contiguous()

        cos, sin = rope_cache(context + 1, self.head_dim, device, dtype)
        k = apply_rope(k, cos[:context], sin[:context])
        q = apply_rope(q, cos[context : context + 1], sin[context : context + 1])
        return q.contiguous(), k.contiguous(), v.contiguous()


class TokenLatentBuilder(nn.Module):
    def __init__(self, vocab_size, q_heads, latent_dim):
        super().__init__()
        self.q_heads = q_heads
        self.latent_dim = latent_dim
        self.q_embed = nn.Embedding(vocab_size, q_heads * latent_dim)
        self.latent_embed = nn.Embedding(vocab_size, latent_dim)

    @torch.inference_mode()
    def build(self, context_tokens, next_tokens, device, dtype):
        batch, context = context_tokens.shape
        q = self.q_embed(next_tokens).view(batch, self.q_heads, 1, self.latent_dim)
        latent = self.latent_embed(context_tokens).contiguous()
        cos, sin = rope_cache(context + 1, self.latent_dim, device, dtype)
        latent = (latent * cos[:context][None, :, :]) + (
            rotate_half(latent) * sin[:context][None, :, :]
        )
        q = apply_rope(q, cos[context : context + 1], sin[context : context + 1])
        return q.contiguous(), latent.contiguous()


def cuda_sync():
    torch.cuda.synchronize()


def time_cuda(fn, warmup, iters):
    for _ in range(warmup):
        fn()
    cuda_sync()
    start = torch.cuda.Event(enable_timing=True)
    end = torch.cuda.Event(enable_timing=True)
    start.record()
    for _ in range(iters):
        fn()
    end.record()
    cuda_sync()
    return start.elapsed_time(end) / iters


def kv_cache_bytes(batch, context, kv_heads, head_dim, element_size):
    return 2 * batch * context * kv_heads * head_dim * element_size


def attention_flops(batch, context, q_heads, head_dim):
    return 4 * batch * q_heads * context * head_dim


def bench_grouped_decode_from_cache(method, q, k, v, warmup, iters):
    batch, q_heads, _, head_dim = q.shape
    _, kv_heads, context, _ = k.shape
    rep = q_heads // kv_heads
    q_grouped = q.view(batch, kv_heads, rep, 1, head_dim)
    scale = 1.0 / math.sqrt(head_dim)

    def step():
        scores = torch.einsum("bhrtd,bhsd->bhrts", q_grouped, k) * scale
        probs = torch.softmax(scores, dim=-1)
        return torch.einsum("bhrts,bhsd->bhrtd", probs, v)

    ms = time_cuda(step, warmup=warmup, iters=iters)
    cache_bytes = kv_cache_bytes(batch, context, kv_heads, head_dim, q.element_size())
    flops = attention_flops(batch, context, q_heads, head_dim)
    return BenchRow(
        method=method,
        batch=batch,
        context=context,
        q_heads=q_heads,
        kv_heads=kv_heads,
        head_dim=head_dim,
        cache_mb=cache_bytes / (1024**2),
        bytes_per_token_kb=(cache_bytes / batch) / 1024,
        arithmetic_intensity=flops / cache_bytes,
        ms_per_step=ms,
        tokens_per_sec=batch * 1000.0 / ms,
        approx_gb_s=cache_bytes / (ms / 1000.0) / 1e9,
    )


def bench_mla_latent_from_cache(q, latent, warmup, iters):
    batch, q_heads, _, latent_dim = q.shape
    context = latent.shape[1]
    scale = 1.0 / math.sqrt(latent_dim)

    def step():
        scores = torch.einsum("bhld,bsd->bhls", q, latent) * scale
        probs = torch.softmax(scores, dim=-1)
        return torch.einsum("bhls,bsd->bhld", probs, latent)

    ms = time_cuda(
        step,
        warmup=max(3, warmup // 2),
        iters=max(10, iters // 2),
    )
    cache_bytes = 2 * batch * context * latent_dim * q.element_size()
    flops = 4 * batch * q_heads * context * latent_dim
    return BenchRow(
        method="MLA-style latent",
        batch=batch,
        context=context,
        q_heads=q_heads,
        kv_heads=1,
        head_dim=latent_dim,
        cache_mb=cache_bytes / (1024**2),
        bytes_per_token_kb=(cache_bytes / batch) / 1024,
        arithmetic_intensity=flops / cache_bytes,
        ms_per_step=ms,
        tokens_per_sec=batch * 1000.0 / ms,
        approx_gb_s=cache_bytes / (ms / 1000.0) / 1e9,
    )


def build_or_load_tinystories_stream(cache_path, min_tokens, enc):
    if cache_path.exists():
        tokens = np.load(cache_path, mmap_mode="r")
        if len(tokens) >= min_tokens:
            print(f"Loaded cached TinyStories token stream: {len(tokens):,} tokens", flush=True)
            return np.asarray(tokens[:min_tokens], dtype=np.int64)

    print(f"Streaming TinyStories until at least {min_tokens:,} tokens...", flush=True)
    ds = load_dataset(DATASET_NAME, split="train", streaming=True)
    chunks = []
    total = 0
    for i, ex in enumerate(ds):
        ids = enc.encode_ordinary(ex["text"])
        ids.append(EOS_ID)
        arr = np.asarray(ids, dtype=np.uint16)
        chunks.append(arr)
        total += len(arr)
        if (i + 1) % 1000 == 0:
            print(f"  read {i + 1:,} stories, {total:,} tokens", flush=True)
        if total >= min_tokens:
            break

    tokens = np.concatenate(chunks).astype(np.uint16)
    np.save(cache_path, tokens)
    print(f"Saved {cache_path} with {len(tokens):,} tokens", flush=True)
    return tokens[:min_tokens].astype(np.int64)


def sample_context_batch(tokens, batch, context, device, seed=0):
    rng = np.random.default_rng(seed + batch * 1009 + context)
    max_start = len(tokens) - context - 2
    starts = rng.integers(0, max_start, size=batch)
    x = np.stack([tokens[s : s + context] for s in starts])
    next_tok = np.asarray([tokens[s + context] for s in starts])
    return (
        torch.tensor(x, device=device, dtype=torch.long),
        torch.tensor(next_tok, device=device, dtype=torch.long),
    )


def add_relative_columns(rows):
    by_shape = {}
    for row in rows:
        if row.method == "MHA":
            by_shape[(row.batch, row.context)] = row
    for row in rows:
        base = by_shape.get((row.batch, row.context))
        if base is not None:
            row.speedup_vs_mha = row.tokens_per_sec / base.tokens_per_sec
            row.cache_reduction_vs_mha = base.cache_mb / row.cache_mb


def save_plots(df, output_prefix):
    plot_batch = int(df["batch"].max())
    plot_df = df[df["batch"] == plot_batch].copy()

    fig, axes = plt.subplots(1, 3, figsize=(18, 5))
    for method, sub in plot_df.groupby("method"):
        sub = sub.sort_values("context")
        axes[0].plot(sub["context"], sub["cache_mb"], marker="o", linewidth=2, label=method)
        axes[1].plot(sub["context"], sub["tokens_per_sec"], marker="o", linewidth=2, label=method)
        axes[2].plot(sub["context"], sub["speedup_vs_mha"], marker="o", linewidth=2, label=method)
    axes[0].set_title(f"KV cache footprint, batch={plot_batch}", fontweight="bold")
    axes[0].set_ylabel("Cache MB")
    axes[1].set_title(f"Decode throughput, batch={plot_batch}", fontweight="bold")
    axes[1].set_ylabel("tokens/sec")
    axes[2].set_title(f"Speedup vs MHA, batch={plot_batch}", fontweight="bold")
    axes[2].set_ylabel("x")
    for ax in axes:
        ax.set_xlabel("TinyStories context length")
        ax.set_xscale("log", base=2)
        ax.grid(True, alpha=0.3)
        ax.legend()
    plt.tight_layout()
    plt.savefig(f"{output_prefix}.png", dpi=160, bbox_inches="tight")
    plt.close(fig)

    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    for method, sub in plot_df.groupby("method"):
        sub = sub.sort_values("context")
        axes[0].plot(sub["context"], sub["bytes_per_token_kb"], marker="o", linewidth=2, label=method)
        axes[1].plot(sub["context"], sub["arithmetic_intensity"], marker="o", linewidth=2, label=method)
    axes[0].set_title("Bytes read per generated token", fontweight="bold")
    axes[0].set_ylabel("KB/token")
    axes[1].set_title("Arithmetic intensity", fontweight="bold")
    axes[1].set_ylabel("FLOPs / byte of cache")
    for ax in axes:
        ax.set_xlabel("TinyStories context length")
        ax.set_xscale("log", base=2)
        ax.grid(True, alpha=0.3)
        ax.legend()
    plt.tight_layout()
    plt.savefig(f"{output_prefix}_memory_intensity.png", dpi=160, bbox_inches="tight")
    plt.close(fig)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--batch-sizes", nargs="+", type=int, default=[1, 4, 16])
    parser.add_argument("--contexts", nargs="+", type=int, default=[1024, 4096, 8192, 16384, 32768])
    parser.add_argument("--q-heads", type=int, default=32)
    parser.add_argument("--head-dim", type=int, default=128)
    parser.add_argument("--gqa-kv-heads", type=int, default=8)
    parser.add_argument("--mla-latent-dim", type=int, default=512)
    parser.add_argument("--warmup", type=int, default=10)
    parser.add_argument("--iters", type=int, default=50)
    parser.add_argument("--output-prefix", default="tinystories_kv_decode_benchmark")
    parser.add_argument("--token-cache", default="tinystories_token_stream.npy")
    args = parser.parse_args()

    if not torch.cuda.is_available():
        raise SystemExit("CUDA GPU required.")

    device = "cuda"
    dtype = torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16
    torch.set_float32_matmul_precision("high")
    torch.backends.cuda.matmul.allow_tf32 = True

    print(f"GPU: {torch.cuda.get_device_name(0)}", flush=True)
    print(f"PyTorch: {torch.__version__}", flush=True)
    print(f"dtype: {dtype}", flush=True)

    enc = tiktoken.get_encoding("gpt2")
    min_tokens = max(args.contexts) * max(args.batch_sizes) + 100_000
    token_stream = build_or_load_tinystories_stream(Path(args.token_cache), min_tokens, enc)

    methods = [
        ("MHA", args.q_heads),
        (f"GQA ({args.gqa_kv_heads} KV heads)", args.gqa_kv_heads),
        ("MQA", 1),
    ]
    rows = []

    for batch in args.batch_sizes:
        for context in args.contexts:
            context_tokens, next_tokens = sample_context_batch(token_stream, batch, context, device, seed=42)
            print(f"\nTinyStories batch={batch}, context={context:,}", flush=True)
            for method, kv_heads in methods:
                try:
                    builder = TokenKVBuilder(enc.n_vocab, args.q_heads, kv_heads, args.head_dim).to(
                        device=device, dtype=dtype
                    ).eval()
                    q, k, v = builder.build(context_tokens, next_tokens, device, dtype)
                    row = bench_grouped_decode_from_cache(method, q, k, v, args.warmup, args.iters)
                    rows.append(row)
                    print(
                        f"  done: {method:22s} cache={row.cache_mb:8.1f} MB "
                        f"tok/s={row.tokens_per_sec:10.1f} speedup={row.speedup_vs_mha}",
                        flush=True,
                    )
                    del builder, q, k, v
                    torch.cuda.empty_cache()
                except torch.cuda.OutOfMemoryError:
                    torch.cuda.empty_cache()
                    print(f"  OOM: {method}", flush=True)

            try:
                builder = TokenLatentBuilder(enc.n_vocab, args.q_heads, args.mla_latent_dim).to(
                    device=device, dtype=dtype
                ).eval()
                q, latent = builder.build(context_tokens, next_tokens, device, dtype)
                row = bench_mla_latent_from_cache(q, latent, args.warmup, args.iters)
                rows.append(row)
                print(
                    f"  done: {'MLA-style latent':22s} cache={row.cache_mb:8.1f} MB "
                    f"tok/s={row.tokens_per_sec:10.1f}",
                    flush=True,
                )
                del builder, q, latent
                torch.cuda.empty_cache()
            except torch.cuda.OutOfMemoryError:
                torch.cuda.empty_cache()
                print("  OOM: MLA-style latent", flush=True)

    add_relative_columns(rows)
    df = pd.DataFrame([r.__dict__ for r in rows])
    df.to_csv(f"{args.output_prefix}.csv", index=False)
    save_plots(df, args.output_prefix)
    print(f"\nSaved {args.output_prefix}.csv", flush=True)
    print(f"Saved {args.output_prefix}.png", flush=True)
    print(f"Saved {args.output_prefix}_memory_intensity.png", flush=True)
    print(df.to_string(index=False), flush=True)


if __name__ == "__main__":
    main()
