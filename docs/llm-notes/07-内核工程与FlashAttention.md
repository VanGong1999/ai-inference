# 第 7 章 · 内核工程与 FlashAttention（Kernel Engineering and FlashAttention）

> Efficient LLM Inference — Interview Pocket Notes · 第 7 章

## 7.1 为什么定制 CUDA 内核很重要

PyTorch 等高层框架从库原语组合运算：一个线性层是 `torch.nn.Linear` 调用，它会进 cuBLAS 做 GEMM，把结果写回 HBM，再为下一个运算读回来。这种**急切执行（eager execution）模型**为那些本可留在快速片上内存的中间张量制造了大量 HBM 流量。

**内核融合（kernel fusion）**把多个运算合并进单个 GPU 内核，让中间结果留在寄存器或共享内存中，避免往返 HBM。一个融合的 LayerNorm+Linear+GeLU 内核相比三个独立内核，能把 HBM 流量降低 **3×**。

## 7.2 FlashAttention：IO 感知的精确注意力

标准注意力在 HBM 中物化完整的 `n × n` 注意力矩阵：

```
S = QKᵀ / √d_k,   P = softmax(S),   O = PV
```

对 `n = 16,384` 的 FP16，这个矩阵是 `16,384² × 2 ≈ 537 MB`。在 A100 上读写这个矩阵要约 0.5 ms——而且每次前向传播要做两次（一次算 P，一次训练时的反向传播）。

**FlashAttention**（Dao et al., 2022）通过**分块（tiling）**消除这一点：把注意力计算分解成能装进 SRAM 的块，用 **online softmax** 增量地计算数值稳定的 softmax，从不在 HBM 中物化完整注意力矩阵。

**FlashAttention 复杂度对比**

| | 标准注意力 | FlashAttention |
|---|---|---|
| HBM 读/写 | O(n²) | O(n²/M)（更少的趟数） |
| SRAM 占用 | O(n²) | O(M)（分块大小） |
| 速度 | 基线 | 快 2–4× |
| 序列长度上限 | 受 HBM 限制 | 可支持更长上下文 |

**FlashAttention-2**（Dao, 2023）通过沿序列长度维度把工作分到不同线程块、并减少非矩阵乘运算来改进并行。**FlashAttention-3**（Shah et al., 2024）进一步利用 H100 特性：用 WGMMA（Warpgroup Matrix Multiply Accumulate）指令做异步内存拷贝、支持 FP8 精度，达到约 **75%** 的 H100 峰值 FLOP/s 利用率。

## 7.3 Online Softmax 技巧

分块注意力在数学上的核心挑战是：分块处理序列时如何计算精确 softmax。**Online softmax**（Milakov & Gimelshein, 2018）维护一个运行最大值 `m` 和一个运行和 `ℓ`，无需先看到所有值即可计算 softmax：

```
m_i = max(m_{i−1}, max_j s_ij),   ℓ_i = e^{m_{i−1} − m_i} · ℓ_{i−1} + Σ_j e^{s_ij − m_i}
```

最后 `O = O_running / ℓ` 得到精确的 softmax 输出。这数值稳定，且每行注意力矩阵只需 `O(1)` 的额外状态。

## 7.4 Triton：Python 风格的内核编程

CUDA 内核开发需要 C++ 和 GPU 专属优化的专业知识。**Triton**（Tillet et al., 2019）是一种用 Python 写 GPU 内核的 DSL，它抽象掉底层细节，同时生成高度优化的代码：

```python
import triton
import triton.language as tl

@triton.jit
def fused_softmax_kernel(X, Y, stride, N, BLOCK: tl.constexpr):
    row = tl.program_id(0)
    x_ptrs = X + row * stride + tl.arange(0, BLOCK)
    x = tl.load(x_ptrs, mask=tl.arange(0, BLOCK) < N)
    x_max = tl.max(x, axis=0)
    x = x - x_max
    numerator = tl.exp(x)
    denominator = tl.sum(numerator, axis=0)
    y = numerator / denominator
    tl.store(Y + row * stride + tl.arange(0, BLOCK), y, mask=tl.arange(0, BLOCK) < N)
```

Triton 自动处理共享内存分配、warp 级同步和向量化，让 ML 工程师无需深厚的 CUDA 功底也能写出高性能内核。

---

## 面试准备 · 模拟问答（Mock Q&A）

### Q7.1 解释为什么 FlashAttention 比标准注意力快。它解决的关键瓶颈是什么？

**答**：标准注意力在 HBM 中物化完整的 `n×n` 注意力矩阵（`QKᵀ`）。对长序列，这个矩阵可能数百 MB 到 GB，读写它的 HBM 流量是主要成本——而非实际算术。FlashAttention 更快是因为它**IO 感知（IO-aware）**：它把注意力计算分块装进 GPU 片上 SRAM（共享内存），用 online softmax 增量地计算 softmax。中间结果留在快速 SRAM，从不写回 HBM。每块的最终输出累积后写回 HBM 一次。HBM 流量从 `O(n²)` 降到 `O(n·d)`，匹配读取输入、写出输出的理论最小值。在 A100 上，FlashAttention 对长序列实现 2–4× 加速。

### Q7.2 什么是内核融合，为什么它能提升推理性能？

**答**：内核融合是把多个原本各自启动一个 GPU 内核的计算操作，合并成单个内核，让中间结果留在片上内存（寄存器或共享内存），而不是在操作之间写回 HBM。不融合时：每个操作把输出写回 HBM，下一个再读回来——制造冗余内存流量。融合后：中间张量活在寄存器或共享内存中，有效带宽 >10 TB/s，而非 HBM 的 2–3 TB/s。LLM 推理中常见融合模式：(1) QKV 投影与 RoPE 应用融合；(2) LayerNorm 与后续线性层融合；(3) SiLU/GeLU 门控与 FFN up-projection 融合。TensorRT-LLM 和 vLLM 中的融合内核能同时减少内核启动开销和 HBM 流量，相比未融合基线带来 10–40% 延迟改善。

### Q7.3 Online softmax 技巧如何实现分块注意力计算？

**答**：标准 softmax `softmax(x)_i = e^{x_i} / Σ_j e^{x_j}` 需要先看到整行的所有值才能计算任何输出，阻碍了分块。Online softmax 分块处理一行，维护运行最大值 `m` 和指数和 `ℓ`。新块的值 `x′` 到来时：(1) 更新运行最大值 `m′ = max(m, max(x′))`；(2) 重缩放现有和 `ℓ′ = ℓ · e^{m−m′} + Σ e^{x′_j − m′}`；(3) 重缩放现有输出 `O′ = O · e^{m−m′}/ℓ′ + V′ · e^{x′−m′}/ℓ′`。结束时 `O′` 等于精确的 softmax 加权和。这让 FlashAttention 能分块处理 Q、K、V，产出精确结果而不物化完整注意力矩阵。

### Q7.4 FlashAttention-3 为 H100 引入了哪些改进？它如何利用 H100 专属特性？

**答**：FlashAttention-3 是专为 H100 的新硬件能力而设计的：(1) **WGMMA（Warpgroup Matrix Multiply Accumulate）**：H100 引入了 warpgroup 级的新异步矩阵乘指令，让 FA3 能在分块内重叠内存拷贝与计算，隐藏内存延迟；(2) **TMA（Tensor Memory Accelerator）**：硬件管理的 HBM 与共享内存之间的异步传输，减少数据搬移的软件开销；(3) **FP8 支持**：FA3 支持 FP8 注意力计算，注意力算力有效吞吐翻倍；(4) **乒乓流水线（ping-pong pipelining）**：两个 warpgroup 交替「加载下一块」与「计算当前块」，让 Tensor Core 和内存系统都保持满载。综合起来，FA3 在注意力上达到约 75% 的 H100 理论峰值 FLOP/s，而 FA2 约 35%。

### Q7.5 你何时会用 Triton 而非手写 CUDA？权衡是什么？

**答**：我会在以下情况用 Triton：(1) 需要自定义内核（比如新的融合运算）但团队缺深 CUDA 功底；(2) 内核是「中等复杂度」——不是简单逐元素运算（PyTorch 已覆盖），也不需要手调 warp 级原语；(3) 快速迭代重要——Triton 的 JIT 编译让我能快速实验。Triton 的**优点**：Python 语法、自动共享内存分块、更简单的调试，且生成代码在许多负载上能达到手优化 CUDA 的 10–20% 以内。我会用**手写 CUDA**当：(1) 极限性能至关重要（如 FlashAttention 的注意力内核，需要极精确地控制内存访问模式和 warp 同步）；(2) 需要对 warp 级原语、bank conflict 规避、或异步拷贝流水线（H100 的 TMA/WGMMA）做细粒度控制。权衡是开发时间（CUDA：数周；Triton：数天）vs 峰值性能。

---

[← 上一章：KV Cache 优化](06-KV-Cache优化.md) ｜ [下一章：服务系统架构 →](08-服务系统架构.md)
