# 第 03 讲 · 注意力变体 Part 1（MHA / MQA / GQA / MLA）

> Attention Variants Part 1: MHA, MQA, GQA, Latent Attention, Sparse Attention

## 本讲讲了什么

这一讲的目标是**在不显著损失质量的前提下压缩 KV Cache**，方法是改变注意力里 K、V 头的组织方式。核心矛盾来自第 02 讲：KV Cache 大小与「KV 头数」成正比，而标准的多头注意力（MHA）每个查询头都配一组独立的 K、V，KV Cache 巨大。

四种变体的对比：

- **MHA（Multi-Head Attention，多头注意力）**：基线。每个查询头都有独立的 K、V 头，KV Cache 最大，表达力最强。
- **MQA（Multi-Query Attention，多查询注意力）**：所有查询头**共享同一组 K、V**。KV Cache 缩小到原来的 `1/h`（h 为头数），但质量会下降。
- **GQA（Grouped-Query Attention，分组查询注意力）**：把查询头分成若干组，**组内共享** K、V。这是 MHA 与 MQA 的折中——用「组数」这个超参数在质量与显存之间做连续权衡。LLaMA 2/3 等主流模型普遍采用 GQA。
- **MLA（Multi-head Latent Attention，多头潜在注意力，即 Latent Attention）**：DeepSeek 提出的方法，把 K、V 联合压缩到一个低秩的**潜在空间（latent）**，用「吸收技巧（absorption trick）」把部分投影矩阵合并进权重，从而在不损失太多信息的情况下大幅压缩 KV Cache。

本讲还会提到 **Sparse Attention（稀疏注意力）**（以 DeepSeek 的稀疏注意力为代表），作为另一种「不关注所有 token」的压缩思路，为第 04 讲的滑窗与线性注意力做铺垫。

一句话总结：**KV Cache 的压缩本质上是在「每个 token 存多少 K、V 信息」与「生成质量」之间做取舍**，MQA/GQA/MLA 是三种不同的取舍方式。

## 前置知识

- 理解第 02 讲的 KV Cache 及其显存代价。
- 熟悉注意力公式与 Q、K、V 的含义。

## 配套资源

| 资源 | 说明 |
|---|---|
| [Miro 课程笔记](https://miro.com/app/board/uXjVHZulX3g=/?share_link_id=178385252360) | 本讲板书与笔记 |
| [Comparison of Modern LLM Architectures](https://sebastianraschka.com/llm-architecture-gallery/) | Sebastian Raschka 的现代 LLM 架构对比（含 MHA/MQA/GQA） |
| [DeepSeek Sparse Attention 可视化](../../DeepSeek-Sparse/index.zh.html) | 稀疏注意力的可视化讲解 |

### 代码与作业

原始目录 `lectures/03-attention-variants-part-1/` 包含：

- `Clean_KV_Cache_Inference_Benchmark_MHA_GQA_MQA_MLA.ipynb` —— MHA/MQA/GQA/MLA 的 KV Cache 基准
- `run_tinystories_kv_benchmark.py` —— TinyStories 数据集上的基准辅助脚本

**作业**（论文：<https://arxiv.org/pdf/2506.09342>）：

1. 移除 RoPE 部分，构造一个 boilerplate notebook，在 TinyStories 数据集上对以下配置跑消融实验：
   - MQA
   - GQA（把 group size 作为超参数）
   - MLA（把 latent dim 作为超参数）
   - MHA
2. 基准以下指标：
   - **计算指标**：KV Cache 大小、token 间延迟（ITL）、P99、P50
   - **质量指标**：生成文本的语法流畅度、困惑度（perplexity）、验证损失（validation loss）

## 对应书籍章节

- [Chapter 8: Compressing Across Heads](../../book.zh.html#ch08-compress-across-heads)

## 实践 / 作业

1. 打开基准 notebook，先跑通 MHA 与 MQA 两个极端，观察 KV Cache 大小与质量差异。
2. 对 GQA 扫描 group size，画出「KV Cache 大小 vs 质量」的曲线，找到你任务的最优点。
3. 理解 MLA 的「低秩压缩 + 吸收技巧」为什么能同时压缩 K、V 而不显式存完整 KV。
