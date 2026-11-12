# 第 02 讲 · KV Cache 的善与恶

> The Good and Evil of the KV Cache

## 本讲讲了什么

这一讲是推理优化的**第一块基石**，讲清楚自回归生成中最重要的一次「从重算到复用」的转变——**KV Cache（KV 缓存）**。

**善（The Good）**：在自回归解码（decode）阶段，每生成一个新 token，都需要它对之前所有 token 做注意力计算。如果不做任何优化，每一轮都会把「历史全部 token」的 K、V 重新算一遍，这是巨大的冗余（redundancy）。KV Cache 的思想是：把每一层注意力里已经算好的 K、V 矩阵**缓存**下来，decode 新 token 时只算新 token 的 Q、K、V，再和缓存的历史 K、V 拼起来做注意力。这样 decode 的计算量从「随序列长度平方增长」降为「与序列长度线性相关」，换来数量级的加速。

**恶（The Evil）**：KV Cache 本身要占显存，而且随「层数 × KV 头数 × 头维度 × 序列长度 × 字节数」线性增长。在长序列 + 大模型 + 多并发请求下，KV Cache 会成为显存（HBM）的巨大负担，甚至成为主要瓶颈。更关键的是，decode 阶段是**内存带宽受限（memory-bound）**的：每生成一个 token 都要把整个 KV Cache 从 HBM 读一遍，所以 KV Cache 越大，decode 越慢。

本讲还会引入两个与硬件紧密相关的量：

- **GPU 的两个主人（VRAM）**：模型权重（weights）与 KV Cache 争夺同一块显存。
- **TurboQuant**：一种通过「旋转（rotation）」来缓解 KV Cache 激活离群值（outliers）的技术，是量化与 KV Cache 结合的实践例子。

最终结论是：KV Cache 是「必要的恶（necessary evil）」——没有它 decode 慢到不可用，有了它又要学会和显存、带宽做斗争。后续讲座（注意力变体、PagedAttention、量化）几乎都在解决它的「恶」的一面。

## 前置知识

- 自回归生成与注意力机制（Q、K、V 的含义）。
- 对 GPU 显存（VRAM/HBM）有初步概念。

## 配套资源

| 资源 | 说明 |
|---|---|
| [Miro 课程笔记](https://miro.com/app/board/uXjVHb72krs=/?share_link_id=970747418881) | 本讲板书与笔记 |
| [TurboQuant 可视化指南](../../turboquant-rotation-visual-guide/index.zh.html) | TurboQuant 旋转的可视化讲解 |
| [DeepSeek V4 KV Cache 可视化指南](../../deepseek-v4-kv-cache-walkthrough/index.zh.html) | DeepSeek V4 的 KV Cache 实战走查 |

### Notebook 与作业

原始目录 `lectures/02-good-and-evil-of-kv-cache/` 包含：

- `1.Good and Evil of KV Cache_L02_KV_Cache_Demo.ipynb` —— KV Cache 演示
- `2.TurboQuant KV Cache_L02_KV_Cache_Demo_TurboQuant.ipynb` —— TurboQuant 演示
- `Assignment KV Cache Pods/` —— 9 个分节作业 notebook（`01_introduction` 到 `09_further_reading`），从「GPU 的两个主人」讲到「TurboQuant 旋转」再到「全景回顾」

## 对应书籍章节

- [Chapter 5: Naive Inference and Its Redundancy](../../book.zh.html#ch05-naive-inference-and-redundancy)
- [Chapter 6: The Machine (A GPU)](../../book.zh.html#ch06-the-machine)
- [Chapter 7: The Good and Evil of the KV Cache](../../book.zh.html#ch07-good-and-evil-of-kv-cache)

## 实践 / 作业

1. 依次跑通 `Assignment KV Cache Pods/` 里的 9 个 notebook，重点理解：
   - 朴素推理循环为什么会重复计算；
   - 加了 KV Cache 后发生了什么变化；
   - KV Cache 的隐藏成本（显存）是如何量化的。
2. 手算：给定层数 `L=80`、KV 头数 `n_kv=8`、头维度 `d=128`、序列长度 `S=8192`、精度 `2 字节`，估算 KV Cache 大小（公式见书籍 ch7）。
3. 思考：为什么 decode 阶段是 memory-bound 而非 compute-bound？用 Roofline 模型解释。
