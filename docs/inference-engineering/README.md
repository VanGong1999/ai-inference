# 《Inference Engineering》中文译本（Philip Kiely）

> **《Inference Engineering》**（作者 Philip Kiely，Baseten，2026 年 1 月）的中文全译本。原书为 PDF / EPUB 双格式（259 页，正文约 4.6 万英文单词），本目录按章整理为 Markdown。
>
> 作者 Philip Kiely 在 Baseten 从事推理服务四年，本书是其面向「推理工程师（Inference Engineer）」的完整导论：从 CUDA 到 Kubernetes，覆盖运行时、基础设施与工具三层。

## 与仓库内其它内容的关系

| 内容 | 说明 |
|---|---|
| 本目录（`inference-engineering/`） | Philip Kiely《Inference Engineering》中文全译本，**系统、产品与生产导向** |
| [`../book.zh.html`](../book.zh.html) | Vizuara 版《Inference Engineering》中文书（同名异书，课程导向） |
| [`../llm-notes/README.md`](../llm-notes/README.md) | 《Efficient LLM Inference — Interview Pocket Notes》中文译本（面试导向） |
| [`../guides/README.md`](../guides/README.md) | 中文导读层（学习路径、术语表） |
| [`../lecture-notes/l13-production-inference-systems/README.md`](../lecture-notes/l13-production-inference-systems/README.md) | 生产系统笔记（含 `.zh.md` 中文翻译） |

> ⚠️ 注意：本目录与 `book.zh.html` 是**两本同名不同作者**的书。本书（Philip Kiely）侧重「产品 + 生产工程 + 多模态」全景；`book.zh.html`（Vizuara）侧重「roofline 出发的系统性推导」。

## 目录

| 章 | 主题 | 文件 |
|---|---|---|
| 前言 | 为什么推理是 AI 行业最有价值的领域 | [`00-前言.md`](00-前言.md) |
| Ch0 | 推理（三层：运行时/基础设施/工具） | [`01-推理.md`](01-推理.md) |
| Ch1 | 先决条件（规模/应用/模型选择/延迟吞吐） | [`02-先决条件.md`](02-先决条件.md) |
| Ch2 | 模型（神经网络、LLM/图像生成机制、瓶颈） | [`03-模型.md`](03-模型.md) |
| Ch3 | 硬件（GPU 架构、世代、实例、本地推理） | [`04-硬件.md`](04-硬件.md) |
| Ch4 | 软件（CUDA、框架、推理引擎、Dynamo） | [`05-软件.md`](05-软件.md) |
| Ch5 | 技术（量化、投机解码、缓存、并行、分离式） | [`06-技术.md`](06-技术.md) |
| Ch6 | 多模态（VLM/Embedding/ASR/TTS/图像/视频） | [`07-多模态.md`](07-多模态.md) |
| Ch7 | 生产（容器化、自动扩缩、多云、部署） | [`08-生产.md`](08-生产.md) |
| 附录 A | 推理术语表 | [`附录A-术语表.md`](附录A-术语表.md) |
| 附录 B | 推荐阅读 | [`附录B-推荐阅读.md`](附录B-推荐阅读.md) |

## 翻译约定

- 关键术语统一采用「**中文（English）**」格式；完整中英对照见 [`../guides/00-术语表.md`](../guides/00-术语表.md)。
- 原书中的插图（Figure P.1 等）以文字形式标注位置与含义，图片文件未收录（原书为本地 PDF/EPUB，未入库）。
- 章节编号沿用原书的 Chapter 0–7。
- 原书英文版为本地 `Inference Engineering.pdf` / `.epub`（体积较大，未入库，见 `.gitignore`），本目录仅保留中文译本。
