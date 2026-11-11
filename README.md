# AI 推理工程学习仓库

> 系统性学习 **LLM Inference Engineering**（大语言模型推理工程）的中文导航仓库。英文原文完整保留，中文导读层叠加其上。

本仓库将 Vizuara 的《Inference Engineering》课程与书籍重新整理为统一结构：从 KV Cache、注意力变体（MHA/MQA/GQA/MLA）、FlashAttention，一路深入到 vLLM 的一步解剖、量化、投机解码、并行策略与生产级推理系统设计。

## 这个仓库有什么

| 内容 | 位置 | 说明 |
|---|---|---|
| 📖 推理工程书籍（中文） | [`docs/book.zh.html`](docs/book.zh.html) | 中文译本（由 `_part_01`–`_part_07` 拼合）；第 5 章起为中文 |
| 📖 推理工程书籍（英文） | [`docs/book.html`](docs/book.html) | 27 章英文原著 + 4 个 Breadcrumb |
| 🎬 可视化 Walkthrough | [`docs/visual-walkthroughs.html`](docs/visual-walkthroughs.html) | 全部交互式可视化讲解索引（FFT、Mamba、FlashAttention 等 20+ 篇） |
| 🗺️ 中文学习路径 | [`docs/guides/README.md`](docs/guides/README.md) | 学习路线总览 + 章节对照表（站点内用 [`md.html`](docs/md.html?src=guides/README.md) 渲染） |
| 📚 中英术语表 | [`docs/guides/00-术语表.md`](docs/guides/00-术语表.md) | KV Cache、PagedAttention、roofline 等关键术语 |
| 🛠️ 环境搭建 | [`docs/guides/00-环境搭建.md`](docs/guides/00-环境搭建.md) | notebook、benchmark、Capstone、本地预览 |
| 📝 每讲中文导读 | [`docs/guides/lectures/`](docs/guides/lectures/) | 11 讲中文导读（本讲讲了什么 + 资源 + 作业） |
| 📄 生产系统笔记 | [`docs/lecture-notes/`](docs/lecture-notes/) | 4 篇生产推理笔记 + 中文翻译 |
| 🗂 原始讲座资料 | [`lectures/`](lectures/) | 13 个原始讲座目录（PDF、notebook、代码，原样保留） |

## 姊妹知识库

本库与另外两个专题库互补，可按方向跳转：

| 知识库 | 侧重 | 仓库 |
|--------|------|------|
| **FDE 知识库**（本库） | 前线部署角色、交付方法论、企业 AI 落地、面试通关 | [VanGong1999/FDE](https://github.com/VanGong1999/FDE) |
| **AI 推理工程知识库** | 推理 Serving、GPU/显存、批处理、KV Cache、性能与成本 | [VanGong1999/ai-inference](https://github.com/VanGong1999/ai-inference) |
| **AI Agent 知识库** | LLM Agent 面试与系统设计、工具调用、多 Agent、护栏 | [VanGong1999/llm-agents-interview](https://github.com/VanGong1999/llm-agents-interview) |

## 快速开始

**在线阅读（推荐）**：直接打开 [站点门户](https://vanguong1999.github.io/ai-inference/)（部署后生效），或先阅读 [中文学习路径](https://vanguong1999.github.io/ai-inference/md.html?src=guides/README.md)。

**本地预览**：

```bash
cd docs
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000/
# 中文书：http://localhost:8000/book.zh.html
# 导读渲染：http://localhost:8000/md.html?src=guides/lectures/06-vLLM-Step-的解剖.md
```

## 目录结构

```
ai-inference/
├── README.md            # 本文件（中文总入口）
├── DEPLOY.md            # 部署 / 发布说明
├── docs/                # GitHub Pages 根目录（serve from /docs）
│   ├── index.html       # 中文站点门户首页
│   ├── book.zh.html     # 推理工程书籍（中文拼合版）
│   ├── book.html        # 推理工程书籍（英文原文）
│   ├── md.html          # Markdown 渲染页（站点内排版显示导读）
│   ├── _part_01.html … _part_07.html  # 中文译本分卷（拼合源）
│   ├── visual-walkthroughs.html
│   ├── *.html           # 所有可视化 walkthrough（英文原文）
│   ├── figures/         # 书籍插图（约 250+ 张）
│   ├── assets/
│   ├── lecture-notes/   # 生产系统笔记（含 *.zh.md 中文翻译）
│   ├── quantization-visual-walkthrough/
│   └── guides/          # 中文导读层
│       ├── README.md    # 学习路径总览
│       ├── 00-学习路径.md
│       ├── 00-术语表.md
│       ├── 00-环境搭建.md
│       └── lectures/    # 11 篇中文导读
└── lectures/            # 原始讲座资料（原样保留）
    ├── 00-inference-book/
    ├── 00-visual-walkthroughs/
    └── 01-introduction-to-inference-engineering/ ... 11-capstone-project/
```

## 学习路线（简版）

1. **打基础**：读 [`00-学习路径.md`](docs/guides/00-学习路径.md) 与 [`00-术语表.md`](docs/guides/00-术语表.md)，然后读书籍 ch0–ch4（推理工程师的世界、三层架构、五个关键指标、Roofline、预训练一页）。
2. **KV Cache 与注意力**：书籍 ch5–ch9 + 讲座 02/03/04 导读。
3. **FlashAttention 与 PagedAttention**：书籍 ch10–ch12 + 讲座 05/06 导读。
4. **服务优化**：量化、连续批处理、投机解码、并行（书籍 ch13–ch16 + 讲座 07/08）。
5. **生产与系统设计**：书籍 ch17–ch20 + 生产系统笔记。
6. **前沿与实战**：书籍 ch21–ch26 + 讲座 10/11（硬件实验、Capstone）。

完整对照表见 [`docs/guides/00-学习路径.md`](docs/guides/00-学习路径.md)。

## 部署

见 [`DEPLOY.md`](DEPLOY.md)。仓库 `origin` 已指向 `https://github.com/VanGong1999/ai-inference.git`，在 GitHub 设置 Pages → Deploy from branch → `main` → `/docs` 后即可访问。

---

> 本仓库所有英文原文（`book.html`、walkthrough、英文笔记、PDF）均原样保留；中文化仅通过**新增**中文导读层实现，不改写原文。关键英文术语统一采用「中文（English）」格式标注。
