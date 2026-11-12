# Transformer 的 DNA 🧬

**一份完全从零构建的 GPT 内部机制交互式可视化指南。**

🔗 **在线演示：** [vizuaraai.github.io/dna-of-a-transformer](https://vizuaraai.github.io/dna-of-a-transformer/)

---

## 关于本项目

本项目向 [Andrej Karpathy 的 MicroGPT](https://github.com/karpathy/microgpt) 致敬——一个 243 行、零依赖的完整 GPT Python 实现（训练 + 推理）。不用 PyTorch，不用 NumPy，只用纯 Python 和数学。

我们构建了一个交互式、带动画的教育体验，逐行带你走完 transformer 架构的每一层。每个小节都把一张实时图表与真实源代码配对，实时高亮正在被可视化的那几行代码。

---

## 内容概览

### 代码走读（第 01–07 节）

每个小节覆盖 GPT 架构的一个核心组件，并配有同步动画——左侧的图表逐阶段动画，右侧对应的代码行同步高亮。

| 小节 | 组件 | 你会看到什么 |
|---------|-----------|-----------------|
| **01 — Data（数据）** | 分词（Tokenization） | 字符级分词器把 `hello` 映射为 `[7, 4, 11, 11, 14]`，并带有 BOS 词元 |
| **02 — Autograd（自动求导）** | 自动求导引擎 | 计算图构建 → 前向传播 → 带梯度流反向传播 |
| **03 — Architecture（架构）** | GPT 数据流 | 完整的 7 层数据流：嵌入 → RMSNorm → 注意力 → 残差 → MLP → logits |
| **04 — Attention（注意力）** | 多头注意力（Multi-Head Attention） | 实时的因果注意力矩阵，权重脉动，以及 Q/K/V 投影 |
| **05 — Training（训练）** | 训练循环 | 60 步内实时绘制的动画损失曲线 |
| **06 — Inference（推理）** | 文本生成 | 自回归地逐字符生成名字 |

每个小节都包含：
- 来自 243 行源码的真实行号（例如 `L106–142 / 243`）
- 播放/暂停控件和可调节的动画速度（0.3x – 2.5x）
- 文字说明和技术细节标注

### 交互式沙盒（第 08 节）

七个动手工具，让你可以对每一个构建块做实验——按 transformer 数据流的顺序排列：

| 工具 | 作用 |
|------|-------------|
| **实时分词器** | 输入文本，实时查看字符 → 整数映射 |
| **Token 与位置嵌入** | 选一个 token 和位置，观察两个向量逐元素相加 |
| **RMS 归一化** | 拖动输入条，实时查看归一化数学（均值、RMS、缩放） |
| **注意力模式探索器** | 输入文本，悬停查看带逐单元权重的因果注意力热力图 |
| **ReLU 激活** | 可视化哪些神经元存活（激活 vs 被抑制） |
| **前馈网络** | 完整 MLP 管线：Input(4) → fc1 → Hidden(16) → ReLU → fc2 → Output(4) |
| **Temperature 与 Softmax** | 0.1–3.0 的滑块，重塑概率分布条形图 |

---

## 设计

- **Apple 风格极简主义** —— 深色主题（`#0a0a0a`）、Figtree 字体、克制的紫色点缀（`#c8a2ff`）
- **滚动触发动效** —— 滚动时各小节淡入（IntersectionObserver）
- **代码面板** —— macOS 风格的窗口外壳，带语法高亮和行号的代码
- **零构建步骤** —— 单个 `index.html`，从 CDN 加载 React + Babel

---

## 技术栈

| 层 | 技术 |
|-------|-----------|
| 框架 | React 18（CDN，无构建） |
| 样式 | 内联样式（无 CSS 框架） |
| 动画 | CSS keyframes + JS 定时器 |
| 图表 | 手绘 SVG |
| 字体 | [Figtree](https://fonts.google.com/specimen/Figtree)（Google Fonts） |
| 部署 | GitHub Pages |

**总依赖数：0**（和 MicroGPT 本身一样）

---

## 本地运行

```bash
git clone https://github.com/VizuaraAI/dna-of-a-transformer.git
cd dna-of-a-transformer
open index.html
```

无需安装，无需构建，直接打开文件即可。

---

## 致谢

- **MicroGPT** by [Andrej Karpathy](https://github.com/karpathy) —— 启发本项目的 243 行 GPT
- **可视化** by [Vizuara AI](https://github.com/VizuaraAI)

---

## 许可证

MIT License —— 可自由使用、修改与分享。

---

<p align="center">
  <strong>243 行——尽可能原子化的 GPT 实现。</strong><br/>
  <em>每一行都是算法本身，其余的一切都只是效率优化。</em>
</p>
