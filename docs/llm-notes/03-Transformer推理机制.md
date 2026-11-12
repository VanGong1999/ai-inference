# 第 3 章 · Transformer 推理机制（Transformer Inference Mechanics）

> Efficient LLM Inference — Interview Pocket Notes · 第 3 章

## 3.1 Transformer 前向传播的解剖

一个标准的 decoder-only Transformer（如 GPT、LLaMA、Mistral）把 token 送进一叠 `L` 个相同的层。每层包含两个子组件：一个**多头注意力（Multi-Head Attention, MHA）**块和一个**前馈网络（Feed-Forward Network, FFN）**，各自后面跟着层归一化（layer normalization）和残差连接（residual connection）。

对于一个 `n` 个输入 token、模型维度为 `d` 的序列：

1. **嵌入（Embedding）**：把 token ID 映射成向量 `X ∈ R^(n×d)`。
2. 对每一层 `ℓ = 1 … L`：
   - (a) 计算 query、key、value：`Q = XW_Q`、`K = XW_K`、`V = XW_V`
   - (b) 计算注意力：`Attn(Q, K, V) = softmax(QKᵀ / √d_k) · V`
   - (c) 应用带门控的 FFN：`FFN(x) = σ(xW₁) ⊙ (xW₃) · W₂`
3. **语言模型头（LM head）**：投影到词表 logits 并采样。

## 3.2 KV Cache：它是什么、为什么重要

如果不做缓存，自回归生成每一步都要为所有历史 token 重新计算 key 和 value——这是序列长度的 `O(n²)` 成本。**KV Cache** 解决了这个问题：prefill 阶段之后，我们把每一层、每个已处理 token 的 key 和 value 矩阵存起来，在后续 decode 步中复用。

> **定义：KV Cache**
>
> KV Cache 是一种数据结构，它存储所有此前生成 token 在注意力计算中的 key（K）和 value（V）张量，使 decode 步无需重新计算即可attend到先前的上下文。

单个序列的 **KV Cache 内存占用**：

```
Memory = 2 × L × n × n_heads × d_head × bytes_per_element
```

以 LLaMA-2 70B（80 层、64 头、头维度 128、FP16、4096 上下文）为例：

```
2 × 80 × 4096 × 64 × 128 × 2 ≈ 10.7 GB
```

这种巨大的内存成本，正是 KV Cache 管理成为 LLM 服务核心挑战的原因。

## 3.3 Prefill vs. Decode：两种截然不同的负载

**Prefill 阶段**：在单次前向传播中并行处理全部 `n` 个 prompt token。主导运算是形状 `[n, d] × [d, 4d]` 的 **GEMM（General Matrix Multiplication，通用矩阵乘）**（FFN 层）。对长 prompt（大 `n`）这是**算力受限**的，Tensor Core 利用率高。

**Decode 阶段**：每步处理一个 token。主导运算是形状 `[1, d] × [d, 4d]` 的 **GEMV（General Matrix-Vector Multiply，通用矩阵-向量乘）**。这是**内存带宽受限**的：每步要加载约 140 GB 权重（70B 模型 FP16），却只做微不足道的计算。Tensor Core 的 GPU 利用率通常 **<10%**。

## 3.4 注意力变体：从 MHA 到 MLA

上下文长度的爆炸式增长，催生了一系列降低 KV Cache 大小的注意力架构创新：

- **多头注意力（MHA）**：标准注意力，有 `H` 个头，每个头有自己的 K、V 矩阵。KV Cache 与 `H` 成正比。
- **多查询注意力（MQA）**：所有 query 头共享一组 K、V 矩阵。KV Cache 缩小 `H` 倍，但可能损害模型质量。
- **分组查询注意力（GQA）**：每 `G` 个 query 头共享一组 K、V。用于 LLaMA-3、Mistral、Gemma，是 MHA 与 MQA 之间有原则的折中。
- **多头潜在注意力（MLA）**：DeepSeek-V2 提出。把 key 和 value 投影到低维潜在空间 `c ≪ d`，KV Cache 只存潜在向量。相比 MHA，KV Cache 缩小约 **5–13×**，质量几乎无损。

**KV Cache 大小比：MHA : GQA : MLA ≈ 8 : 2 : 1**

## 3.5 推理时的位置编码

**旋转位置嵌入（RoPE, Rotary Positional Embeddings）**现在是 decoder-only LLM 的主流位置编码方案。RoPE 通过在复平面上旋转 query 和 key 向量来编码位置：

```
q_m = q · e^{imθ},   k_n = k · e^{inθ}
```

从而使点积 `⟨q_m, k_n⟩` 只依赖相对位置 `m − n`。推理时，RoPE 允许通过 **NTK-aware scaling** 或 **YaRN** 做上下文长度外推，让在 4K 上下文训练的模型在合适的位插值下泛化到 128K+ 上下文。

---

## 面试准备 · 模拟问答（Mock Q&A）

### Q3.1 解释 Multi-Query Attention 与 Grouped Query Attention。为什么它们对推理很重要？

**答**：在标准多头注意力中，`H` 个注意力头各有独立的 K、V 投影矩阵，KV Cache 随头数线性增长。**多查询注意力（MQA）**（Shazeer 2019）让所有 query 头共享一组 K、V，KV Cache 缩小 `H` 倍，但全头共享会损害模型质量。**分组查询注意力（GQA）**是推广：头被分成 `G` 组，每组共享一对 K/V，KV Cache 缩小 `H/G` 倍，同时比 MQA 保留更多容量。对推理而言，这些技术直接减轻内存压力，从而支持更长上下文和更大批大小。LLaMA-3 70B 用 GQA，64 个 query 头配 8 个 KV 头，KV 缩减 8×。

### Q3.2 走一遍 7B 模型生成 1000 token 时 KV Cache 会发生什么。

**答**：prefill 期间所有 prompt token 被并行处理，它们的 key 和 value 被计算并存入所有层的 KV Cache。对 7B 模型（32 层、32 头、头维度 128、FP16），每层每 token 的 KV Cache 是 `2 × 32 × 128 × 2 = 16,384` 字节。在 512 token 的 prompt 之上生成 1000 token：KV Cache 从起始的 `512 × 16,384 × 32` 字节增长到末尾约 `1512 × 16,384 × 32 ≈ 790 MB`。每个 decode 步，我们读取整个 KV Cache（随步数增长），对新 query 与所有缓存 key 算注意力，再把新的 key/value 对追加进缓存。这种不断增长的内存读取成本，就是长生成过程中 decode 延迟略微上升的原因。

### Q3.3 注意力的复杂度瓶颈是什么？现代系统如何解决？

**答**：标准注意力在时间和空间上都是 `O(n²)` 复杂度：注意力矩阵 `QKᵀ` 是 `n × n`。对 `n = 128,000` token，这个矩阵是 `128,000² × 2 bytes ≈ 32 GB`——太大，无法在 HBM 中物化。现代系统的解法有：(1) **FlashAttention**：基于分块的计算，避免在 HBM 中物化完整注意力矩阵；(2) **稀疏注意力模式**（Longformer、BigBird）：只attend到部分 token；(3) **线性注意力近似**：用核方法近似 softmax 注意力，达到 `O(n)`；(4) **状态空间模型（Mamba）**：用循环结构完全取代注意力，以 `O(n)` 时间、`O(1)` 内存处理长序列。

### Q3.4 RoPE 如何实现上下文长度外推？如果天真地把上下文扩展到训练长度之外会出什么问题？

**答**：RoPE 用旋转矩阵编码位置，第 `i` 维的旋转角是 `θᵢ = 1/10000^(2i/d)`。这意味着高频维度随位置快速旋转，低频维度旋转慢。如果天真地外推到训练上下文长度 `n` 之外，高频维度会遇到训练中从未见过的旋转角，导致注意力分数分布脱离训练分布（out-of-distribution），模型失去准确区分相对位置的能力。**YaRN** 和 **NTK-aware scaling** 通过根据扩展比例重缩放基频 `θ`，确保所有维度在新的上下文长度下仍保持在分布内。

### Q3.5 为什么 decode 阶段内存带宽受限，而 prefill 是算力受限？这对服务系统设计有什么含义？

**答**：decode 时一次只处理一个 token，矩阵运算是矩阵-向量乘（GEMV），其中一个维度是 1。GEMV 的算术强度约 2 FLOP/byte（加载一次权重矩阵只做一个点积），远低于算力受限的 roofline 阈值，GPU Tensor Core 严重利用不足。prefill 时同时处理 `n` 个 token，运算是矩阵-矩阵乘（GEMM），算术强度高得多（约 `2n/d` FLOP/byte），对大的 `n` 趋近算力饱和。对服务设计的含义是：(1) 用连续批处理提高 decode 阶段的有效批大小；(2) 考虑分离式 prefill-decode 服务（Splitwise、Mooncake），让 prefill 跑在算力优化的节点上、decode 跑在内存带宽优化的节点上。

---

[← 上一章：硬件基础](02-硬件基础.md) ｜ [下一章：量化 →](04-量化.md)
