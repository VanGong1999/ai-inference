# Modelplane 推理工程开放指南（中文翻译）

> **Modelplane Inference Guide**（[原文](https://docs.modelplane.ai/guides/inference-guide/)）的中文译本。面向平台工程师：推理概念、生产运维、工具栈与职业发展。
>
> 原文中的数字、价格和工具版本以 **2026 年 10 月** 为准。

## 与仓库内其它内容的关系

| 内容 | 说明 |
|---|---|
| 本目录（`modelplane-inference-guide-zh/`） | Modelplane 开放指南中文译本，**平台工程 / 生产运维 / 职业路径**导向 |
| [`../book.zh.html`](../book.zh.html) | Vizuara《Inference Engineering》中文书（系统推导） |
| [`../llm-notes/README.md`](../llm-notes/README.md) | 《Efficient LLM Inference》面试口袋笔记 |
| [`../inference-engineering/README.md`](../inference-engineering/README.md) | Philip Kiely《Inference Engineering》（产品 / 生产 / 多模态） |
| [`../guides/README.md`](../guides/README.md) | 中文导读层（学习路径、术语表、每讲导读） |

本指南偏「**平台工程师如何入门并落地推理**」：为什么现在要做、基础概念、生产取舍、技术栈与工具、案例与职业路径；与 Kiely 书的生产全景、Vizuara 的系统推导互补。

## 目录

| 章 | 主题 | 文件 |
|---|---|---|
| 1 | 为什么是现在（平台 → 推理、可迁移技能） | [`01-为什么是现在.md`](01-为什么是现在.md) |
| 2 | 推理基础（GPU 内存、引擎、速度上限） | [`02-推理基础.md`](02-推理基础.md) |
| 3 | 生产环境中的推理（场景优先、延迟/吞吐/成本） | [`03-生产环境中的推理.md`](03-生产环境中的推理.md) |
| 4 | 技术栈与工具（引擎、K8s、网关、可观测性） | [`04-技术栈与工具.md`](04-技术栈与工具.md) |
| 5 | 案例与团队经验 | [`05-案例与团队经验.md`](05-案例与团队经验.md) |
| 6 | 职业发展 | [`06-职业发展.md`](06-职业发展.md) |
| 7 | 来源与延伸阅读 | [`07-来源与延伸阅读.md`](07-来源与延伸阅读.md) |

## 翻译说明

- 技术名词、项目名、API 名称和代码标识尽量保留原文。
- 内容按章节拆分，便于学习和校对。
- 仓库内同步副本：[`lectures/modelplane-inference-guide-zh/`](https://github.com/VanGong1999/ai-inference/tree/main/lectures/modelplane-inference-guide-zh)（原始讲座目录）；站点阅读以本目录为准。
