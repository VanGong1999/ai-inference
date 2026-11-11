# 中文导读层 · 学习路径总览

欢迎来到本仓库的**中文导读层**。这里的所有内容都是**新增的中文导航**，用于帮助你理解英文原文（书籍、可视化 Walkthrough、笔记）。英文原文本身保持原样，未做任何删改。

## 导读层包含什么

| 文件 | 作用 |
|---|---|
| [`00-学习路径.md`](00-学习路径.md) | 完整学习路线 + 书籍章节 ↔ 讲座 ↔ 导读 三栏对照表 |
| [`00-术语表.md`](00-术语表.md) | 中英对照术语表（KV Cache、PagedAttention、roofline 等） |
| [`00-环境搭建.md`](00-环境搭建.md) | 如何打开 notebook、跑 benchmark、搭 Capstone 环境、本地预览 |
| [`lectures/`](lectures/) | 11 篇每讲中文导读 |

## 建议的阅读顺序

### 第 0 步：了解全貌

- 先读本文件与 [`00-学习路径.md`](00-学习路径.md)，建立对整个学科的地图认知。
- 打开 [`../book.zh.html`](../book.zh.html)（中文版）或 [`../book.zh.html`](../book.zh.html)（英文原著）的目录页，浏览 27 章的结构。

### 第 1 步：打基础（书籍 ch0–ch4）

阅读书籍第 0–4 章，理解：

- **ch0** 推理工程师的世界（The Inference Engineer's World）
- **ch1** 三层架构（The Three Layers）
- **ch2** 五个关键指标（Five Numbers You Will Live By）—— TTFT、ITL/TPOT、吞吐、P99、成本
- **ch3** Roofline 模型（The Roofline Is Our North Star）—— 算术强度与内存带宽
- **ch4** 预训练一页（Pre-Training in One Page）

对应讲座导读：[`lectures/01-推理工程导论.md`](lectures/01-推理工程导论.md)

### 第 2 步：KV Cache 与注意力（书籍 ch5–ch10）

- **ch5** 朴素推理与冗余
- **ch6** 硬件（GPU）
- **ch7** KV Cache 的善与恶
- **ch8** 跨头压缩（MHA/MQA/GQA/MLA）
- **ch9** 跨 token 压缩（滑窗/线性注意力/SSM/Mamba）
- **ch10** FlashAttention

对应导读：`02-KV-Cache-的善与恶`、`03-注意力变体-Part1`、`04-注意力变体-Part2`、`05-FlashAttention`

### 第 3 步：服务优化（书籍 ch11–ch16）

- **ch11** PagedAttention
- **ch12** 前缀缓存 + 分块预填充（chunked prefill）
- **ch13** 量化（Quantization）
- **ch14** 连续批处理（continuous batching）
- **ch15** 投机解码（speculative decoding）
- **ch16** 并行策略（tensor/pipeline/expert parallelism）

对应导读：`06-vLLM-Step-的解剖`、`07-量化`、`08-投机解码`

### 第 4 步：生产级系统（书籍 ch17–ch20 + 笔记）

- **ch17** 分离式服务（disaggregated prefill/decode）
- **ch18** 复制、路由、多区域
- **ch19** vLLM 一步的解剖
- **ch20** 推理引擎全景（2026）

配套笔记（含中文翻译）：[`../lecture-notes/l13-production-inference-systems/`](../lecture-notes/l13-production-inference-systems/)

### 第 5 步：前沿与实战（书籍 ch21–ch26 + 讲座 10/11）

- **ch21** Inference Quest（12 个世界）
- **ch22** 微调、蒸馏、隐式学习
- **ch23** 多模态与具身推理
- **ch24–ch26** 三个 Capstone

对应导读：`10-硬件实验`、`11-Capstone-项目`

## 未被讲座覆盖的书籍章节

以下书籍章节在讲座中没有直接对应，但属于完整的推理工程知识体系，建议通过 `book.html` 自学：

| 章节 | 主题 |
|---|---|
| ch14 | Continuous Batching（连续批处理） |
| ch16 | Parallelism（并行策略） |
| ch17 | Disaggregated Prefill/Decode（分离式服务） |
| ch18 | Replication, Routing, Multi-Region（复制/路由/多区域） |
| ch20 | The Engine Landscape（引擎全景） |
| ch21 | Inference Quest |
| ch22 | Fine-Tuning, Distillation, Subliminal Learning |
| ch23 | Frontiers — Multimodal and Embodied |
| ch25/26 | Capstone 2 / Capstone 3 |

完整三栏对照表见 [`00-学习路径.md`](00-学习路径.md)。
