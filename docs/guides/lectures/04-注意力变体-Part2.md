# 第 04 讲 · 注意力变体 Part 2（滑窗 / SSM / Mamba）

> Attention Variants Part 2: Sliding Window, State Space Models and Mamba

## 本讲讲了什么

第 03 讲在「头」的维度上压缩 KV Cache，这一讲则在「token」维度上压缩——核心问题：**每个 token 真的需要关注所有历史 token 吗？** 由此引出四种「跨 token 压缩」的范式：

- **Sliding Window Attention（滑动窗口注意力）**：每个 token 只关注它附近一个固定窗口内的 token（如 Mistral 的 4096 窗口）。KV Cache 从「随序列线性增长」变成「固定窗口大小」。但单个 token 的**感受野（receptive field）**受窗口限制，需要靠**层层堆叠（layer stacking）**让信息跨层传播，从而间接看到更远的上下文。
- **Linear Attention（线性注意力）**：用**核技巧（kernel trick）**把注意力重写成「先算 `KᵀV`，再乘 Q」的形式，复杂度从 `O(n²)` 降到 `O(n)`。代价是精度下降；它可以用一个**运行状态（running state）**做增量更新，天然适合流式推理。
- **SSM（State Space Model，状态空间模型）**：用递归状态 `h(t)` 描述序列演化，并可表达为**卷积（convolution）**形式，因此既能用递归做快速流式推理，也能用 FFT 做并行训练。它是 Mamba 的理论基础。
- **Mamba（选择性状态空间模型）**：标准 SSM 的状态转移与输入无关（时不变），Mamba 的关键创新是让状态转移参数**依赖输入（selectivity，选择性）**，从而既能「记住该记住的」（如关键信息）又能「忘掉该忘的」（如无关内容）。这一讲配套的多个 walkthrough 会从「为什么需要选择性」讲到「Mamba block 内部结构」。

这一讲的信息密度很高，但它是理解现代高效架构（Mamba、混合架构）的必经之路。

## 前置知识

- 第 03 讲的注意力变体（理解「压缩 KV Cache」的动机）。
- 对卷积（convolution）与 FFT 有基本印象会更好（本讲第一个 walkthrough 就是 FFT）。

## 配套资源

本讲有 **6 个可视化 walkthrough**（本讲的「心脏」，极其详细）：

| 资源 | 说明 |
|---|---|
| [Reducing KV Cache Across Tokens](../../kv-cache-token-reduction-walkthrough/visual-walkthroughs/kv-cache-token-reduction-visual-walkthrough.html) | 整讲的视觉主线：token 被剪枝/压缩/窗口化/摘要时 cache 如何变化 |
| [Why Convolution Is N log N（FFT）](../../fft-visual-walkthrough.html) | 从音乐混响讲到 FFT，解释卷积为何能用 N log N 完成 |
| [Why Mamba Needs Selectivity](../../mamba-why-selectivity-matters.html) | 为什么标准 SSM 不够，选择性为什么重要 |
| [Inside the Mamba Block](../../mamba-architecture-step-by-step.html) | Mamba block 内部结构的逐步走查 |
| [Receptive Field Growth in Sliding Window](../../receptive-field-sliding-window-walkthrough.html) | 滑窗注意力的感受野如何靠层堆叠扩大 |
| [Attention Optimizations Summary](../../attention-variants-inference-comparison.html) | 各种注意力优化的汇总对比 |

其他：

- [Miro 课程笔记](https://miro.com/app/board/uXjVHYq1m0I=/?share_link_id=539633013885)

## 对应书籍章节

- [Chapter 9: Compressing Across Tokens](../../book.zh.html#ch09-compress-across-tokens)

## 实践 / 作业

1. 按顺序看完上面 6 个 walkthrough，重点搞懂：
   - 滑窗注意力如何用「层层堆叠」扩大感受野；
   - 线性注意力的「核技巧」为什么能把复杂度降到 `O(n)`；
   - Mamba 的「选择性」到底解决了 SSM 的什么问题。
2. 思考：滑窗注意力、线性注意力、Mamba 三者各自的 KV Cache（或等价状态）内存是「固定」还是「随序列增长」？
3. 打开书籍 ch9，对照 `ch09-fig9-memory-per-token-bar-chart` 那张图，比较各方法的每 token 内存占用。
