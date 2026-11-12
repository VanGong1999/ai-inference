# 第 06 讲 · vLLM 一步的解剖

> 解剖 vLLM 的一步：PagedAttention、调度、前缀缓存与连续批处理如何咬合。

## 本讲讲了什么

这一讲从「单个注意力优化」上升到「整个推理引擎」的层面，解剖 **vLLM 执行一次调度步（scheduling step）时到底发生了什么**。如果说前几讲是理解单个零件，这一讲就是看懂整台发动机如何协同运转。

核心内容是三个层层递进的概念：

- **PagedAttention（分页注意力）**：KV Cache 显存碎片化（fragmentation）是限制并发的主要问题。PagedAttention 借鉴操作系统**虚拟内存（virtual memory）**的思想，把 KV Cache 按固定大小的**块（block）**管理，用一张**块表（block table）**做「逻辑块 → 物理块」的映射。好处：显存利用率大幅提升，且天然支持**前缀共享（prefix sharing，写时复制 copy-on-write）**——共享前缀的多个请求复用同一批 KV 块。
- **Prefix Caching（前缀缓存）+ Chunked Prefill（分块预填充）**：前缀缓存把重复 prompt 的 KV 块缓存下来，命中时跳过 prefill；分块预填充把长 prompt 的 prefill 拆成小块，与 decode 交替执行，避免一个长 prefill 阻塞所有正在流式输出的请求（解决 head-of-line blocking）。
- **Anatomy of a Step（一步的解剖）**：vLLM 的调度循环里，每一步要决定「哪些序列继续、哪些新序列进来、分配多少块、跑 prefill 还是 decode、如何设 `max_num_seqs` 与 `max_num_batched_tokens`」等。这一讲配套的 PDF（`anatomy-of-a-vllm-step.pdf`）会逐项拆解。

本讲还引出 **RadixAttention（基数树注意力）**——SGLang 用基数树（radix tree）做前缀缓存，实现更细粒度的共享。这是理解「为什么不同引擎（vLLM vs SGLang）有不同取舍」的入口。

## 前置知识

- 第 02 讲的 KV Cache 与显存问题。
- 第 05 讲的 memory-bound 与 Roofline 直觉。
- 了解「请求生命周期」（prefill → decode → 流式返回）会更好。

## 配套资源

| 资源 | 说明 |
|---|---|
| [Miro 课程笔记](https://miro.com/app/board/uXjVHW4Tmog=/?share_link_id=647655636179) | 本讲板书与笔记 |
| [From Roofline to vLLM](../../roofline-to-vllm.html) | 从 Roofline 视角理解 vLLM 的可视化 walkthrough |
| [Radix Attention & Semantic Caching](../../radix-and-semantic-caching.html) | SGLang RadixAttention 与语义缓存的可视化 |
| [Basics of SGLang: Radix Attention](https://www.lmsys.org/blog/2024-01-17-sglang/) | LMSYS 的 SGLang RadixAttention 博客 |
| [Basic vLLM Inference（Colab）](https://colab.research.google.com/drive/1QEosGS1_M1LBwcjiRTI4zqxBMCcJj_XN?usp=sharing) | 基础 vLLM 推理的 Colab |

### 讲义

原始目录 `lectures/06-anatomy-of-vllm-step/` 包含：

- `anatomy-of-a-vllm-step.pdf` —— 本讲正式讲义，逐项拆解 vLLM 的一步

## 对应书籍章节

- [Chapter 11: PagedAttention](../../book.zh.html#ch11-paged-attention)
- [Chapter 12: Prefix Caching + Chunked Prefill](../../book.zh.html#ch12-prefix-caching-chunked-prefill)
- [Chapter 19: Anatomy of a vLLM Step](../../book.zh.html#ch19-anatomy-of-vllm)

## 实践 / 作业

1. 打开 `anatomy-of-a-vllm-step.pdf`，对照书籍 ch19，画出「一个 vLLM step」的完整流程图。
2. 理解 PagedAttention 的「块表翻译」：逻辑块如何映射到物理块，前缀共享时如何用写时复制复用块。
3. 思考：为什么 `max_num_seqs`（最大并发序列数）与 `max_num_batched_tokens`（单步最大 batch token 数）是两个关键旋钮？它们分别受什么资源约束？
4. 用 Colab 跑一次基础 vLLM 推理，观察 `--max-num-seqs`、`--max-num-batched-tokens` 等参数对吞吐与延迟的影响。
