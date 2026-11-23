# 《Efficient LLM Inference》中文笔记

> **《Efficient LLM Inference: Systems, Algorithms & Production Engineering — Interview Pocket Notes》**（作者 Lamhot Siagian，AI Engineering Insider，2026 第二版）的中文全量译本。
>
> 原书定位是一本「**面试口袋笔记**」：14 章正文 + 4 个附录，每一章末尾都带 5 道 **Mock Q&A（模拟面试问答）**，共约 70 题，直接对应大模型推理工程师面试的高频考点。

## 与仓库内其它内容的关系

| 内容 | 说明 |
|---|---|
| 本目录（`llm-notes/`） | 《Efficient LLM Inference》中文全译本，按章分文件，**面试导向** |
| [`../book.zh.html`](../book.zh.html) | 《Inference Engineering》（Vizuara）中文书，27 章，**系统学习导向** |
| [`../guides/README.md`](../guides/README.md) | 中文导读层（学习路径、术语表、每讲导读） |
| [`../lecture-notes/l13-production-inference-systems/README.md`](../lecture-notes/l13-production-inference-systems/README.md) | 生产系统笔记（含 `.zh.md` 中文翻译） |
| [`../inference-engineering/README.md`](../inference-engineering/README.md) | Philip Kiely《Inference Engineering》中文译本 |

两本书主题高度重叠（KV Cache、注意力变体、FlashAttention、量化、投机解码、并行等），但侧重不同：`book.zh.html` 讲「**为什么**」（从 roofline 出发的系统性推导），本目录讲「**怎么答**」（面试可直接用的精炼问答 + 数字 + 公式）。建议两本对照阅读。

## 目录

| 章 | 主题 | 文件 |
|---|---|---|
| 1 | 推理问题（训练 vs 推理、铁三角、内存带宽、Roofline） | [`01-推理问题.md`](01-推理问题.md) |
| 2 | 硬件基础（GPU 架构、Tensor Core、内存层级、CPU/边缘、新硬件） | [`02-硬件基础.md`](02-硬件基础.md) |
| 3 | Transformer 推理机制（前向、KV Cache、prefill/decode、注意力变体、RoPE） | [`03-Transformer推理机制.md`](03-Transformer推理机制.md) |
| 4 | 量化（GPTQ、AWQ、QuIP#、AQLM、QAT、激活量化） | [`04-量化.md`](04-量化.md) |
| 5 | 投机解码（draft/verify、树验证、Medusa、EAGLE） | [`05-投机解码.md`](05-投机解码.md) |
| 6 | KV Cache 优化（PagedAttention、前缀缓存、StreamingLLM、KV 量化） | [`06-KV-Cache优化.md`](06-KV-Cache优化.md) |
| 7 | 内核工程与 FlashAttention（内核融合、online softmax、Triton） | [`07-内核工程与FlashAttention.md`](07-内核工程与FlashAttention.md) |
| 8 | 服务系统架构（批处理、分离式服务、SLO 调度） | [`08-服务系统架构.md`](08-服务系统架构.md) |
| 9 | 大模型推理的并行（张量/流水线/专家并行、MoE） | [`09-并行.md`](09-并行.md) |
| 10 | 长上下文与内存管理（Ring Attention、上下文压缩、SSM） | [`10-长上下文与内存管理.md`](10-长上下文与内存管理.md) |
| 11 | 边缘与端侧推理（llama.cpp、MLX、ONNX、NAS） | [`11-边缘与端侧推理.md`](11-边缘与端侧推理.md) |
| 12 | 推理时计算扩展（CoT、PRM、搜索、R1/o1、GRPO） | [`12-推理时计算扩展.md`](12-推理时计算扩展.md) |
| 13 | 可观测性与生产工程（指标、故障排查、成本建模） | [`13-可观测性与生产工程.md`](13-可观测性与生产工程.md) |
| 14 | 推理的未来（扩散、多 token 预测、光计算、inference-first） | [`14-推理的未来.md`](14-推理的未来.md) |
| 附录 | 公式速查 / 论文清单 / 术语表 / 硬件对比 | [`附录.md`](附录.md) |

## 翻译约定

- 关键术语统一采用「**中文（English）**」格式，与仓库内其它中文文档一致；完整中英对照见 [`../guides/00-术语表.md`](../guides/00-术语表.md)。
- 公式、代码、数字、硬件规格原样保留；公式用行内代码 / LaTeX 风格书写。
- 每章末尾的「面试准备 · 模拟问答」按 **QX.Y** 编号，一问一答。
- 原书英文版为本地 PDF（`llm.pdf`，因体积未入库，见 `.gitignore`），本目录仅保留中文译本。
