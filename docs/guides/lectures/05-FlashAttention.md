# 第 05 讲 · FlashAttention 1 / 2 / 3

> All About Flash Attention 1, 2, 3

## 本讲讲了什么

前面的讲座都在「算法层面」减少 KV Cache 或计算量，这一讲则直面一个更底层的问题：**即使算法是对的，标准注意力实现也会因为内存读写（I/O）而浪费大量时间。** FlashAttention 的贡献在于**优化内存访问**，而不是改变数学结果。

核心观察：标准注意力会物化（materialize）完整的 `n×n` 注意力分数矩阵，把它从 HBM（高带宽内存，慢）读进来写出去，而 GPU 片上 SRAM（快）却大部分闲置。注意力是 **memory-bound** 的，真正的瓶颈不是算，而是搬运数据。

FlashAttention 的三个关键思想：

1. **Tiling（分块）**：把 Q、K、V 切成小块，逐块在 SRAM 里计算局部注意力，避免把完整 `n×n` 矩阵写到 HBM。这是第 1 代（FA1）的核心。
2. **Online Softmax（在线 softmax）**：softmax 需要先求全局最大值做数值稳定。online softmax 用「运行中的最大值 + 修正因子」增量更新，让分块计算也能正确归一化，无需多次重读。
3. **三代演进（FA1 → FA2 → FA3）**：
   - **FA1**：首次用 tiling + online softmax 大幅减少 HBM 读写。
   - **FA2**：进一步减少非矩阵乘法（non-matmul）运算，优化并行划分（partitioning）与 warp 调度。
   - **FA3**：针对 Hopper（H100）等新硬件的异步特性（Tensor Memory Accelerator, TMA 与 warp specialization）进一步加速。

最终效果：把注意力从「HBM 带宽受限」推向「算力受限」，在 Roofline 图上向算力屋顶（compute roof）移动。

## 前置知识

- 第 02 讲的 KV Cache 与 memory-bound 概念。
- 对 GPU 内存层级（HBM vs SRAM）有基本了解（可先看下面 brrrviz 的 GPU 架构）。

## 配套资源

| 资源 | 说明 |
|---|---|
| [Miro 课程笔记](https://miro.com/app/board/uXjVHXz5hxs=/?share_link_id=8837796048) | 本讲板书与笔记 |
| [GPU Architecture（brrrviz）](https://brrrviz.com/the-machine/device-architecture) | GPU 内存层级与架构可视化 |
| [FlashAttention 1 vs 2](../../flashattention-1-2.html) | FA1 与 FA2 的可视化 walkthrough |
| [FlashAttention 3](../../flashattention-3.html) | FA3 的可视化 walkthrough |

### Notebook

原始目录 `lectures/05-flash-attention/` 包含：

- `Vizuara_AI_Labs_FlashAttention_Benchmark_RunPod_Executed.ipynb` —— FlashAttention 基准（在 RunPod 上执行过）

## 对应书籍章节

- [Chapter 10: FlashAttention](../../book.zh.html#ch10-flash-attention)

## 实践 / 作业

1. 打开 `flashattention-1-2.html`，重点看「tiling grid」和「online softmax 修正轨迹」两节，搞懂分块后 softmax 是怎么保持正确的。
2. 打开 `flashattention-3.html`，理解 FA3 为什么能在 Hopper 上更快（异步 / TMA / warp specialization）。
3. 跑基准 notebook，对比标准 attention 与 FlashAttention 在长序列下的 I/O 与耗时差异。
4. 思考：FlashAttention 减少的是「HBM 读写量」还是「FLOPs」？为什么它能带来加速？
