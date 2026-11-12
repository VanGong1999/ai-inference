# 第 11 讲 · Capstone 项目

> Phase 1 Capstone Project: InferTutor Arena

## 本讲讲了什么

这是 Phase 1 的**结业项目**，把整门课的知识整合到一个真实任务里：在 Modal 上用 vLLM 部署一个**多模态 LLM 服务**（`Qwen/Qwen3-VL-4B-Instruct`），在并发流量下压测，测量生产级指标，并通过工程手段不断优化。

项目叫 **InferTutor Arena**——一个面向推理工程学生的 AI 家教。用户会问关于 KV Cache、批处理、vLLM、延迟尖峰、GPU 瓶颈等问题，也会上传简单图表。你的系统必须又快又稳地服务这些用户。

你要优化的核心指标（competition score）：

```text
Score =
  goodput_tokens_per_second
  * sustained_users
  * quality_pass_rate
  * (1 - error_rate)
  / (p95_TTFT_seconds * p95_ITL_seconds * total_GPU_count)
```

即：**高吞吐、高并发、低错误率、低 P95 首 token 延迟、低 P95 token 间延迟、高效利用 GPU**。

可调旋钮（这是重点，而非写业务代码）：

- `--replicas`（副本数）
- `--max-seqs` / `--max-batch-tokens`（调度参数）
- `--prefix-cache` / `--no-prefix-cache`（前缀缓存）
- `--chunked-prefill` / `--no-chunked-prefill`（分块预填充）
- `--fast-boot` / `--no-fast-boot`（快速启动）
- `--concurrent-inputs`、`--mm-max-pixels`（多模态输入）

两个赛道：

1. **Multimodal Product Track（主赛道）**：`--mode mixed`，混合文本 / 长上下文 / 图像 / 综合 prompt。
2. **Text Speed Track**：`--mode text`，纯文本速度优化。

**评分看重的不只是最终数字，而是「为什么最终配置能赢」**——要记录至少 5 组实验、解释最优配置、以及一个「令人意外的失败或取舍」。

## 前置知识

- 全部 01–08 讲的技术铺垫（尤其 vLLM、PagedAttention、前缀缓存、分块预填充）。
- 第 10 讲的 Modal + vLLM 环境（冒烟测试应已跑通）。

## 配套资源

| 资源 | 说明 |
|---|---|
| [InferTutor Arena Capstone](https://github.com/VanGong1999/ai-inference/tree/main/lectures/10-hardware-labs/infertutor-arena-capstone-main) | Capstone 主仓库（代码） |
| InferTutor_Arena_Capstone.pdf | 作业 PDF（本地保留，体积原因未入库） |
| Modal_vLLM_Runbook.pdf / [Markdown 版](https://github.com/VanGong1999/ai-inference/blob/main/lectures/10-hardware-labs/infertutor-arena-capstone-main/Modal_vLLM_Runbook.md) | Runbook（PDF 本地；仓库内有 Markdown） |

### 原始资料

原始目录 `lectures/11-capstone-project/` 包含：

- `Inference Engg Capstone Project 1 Submissions/` —— 三份往届提交报告 PDF（可参考他人思路）
- `Links.txt`

完整作业与 starter code 在 `lectures/10-hardware-labs/infertutor-arena-capstone-main/`。

## 对应书籍章节

- [Chapter 24: Capstone 1 — Speed-Optimized Server](../../book.zh.html#ch24-capstone1-speed-optimized-server)

> 后续 Capstone 2（扩展到百万用户）与 Capstone 3（OpenClaw-RL）见书籍 [ch25](../../book.zh.html#ch25-capstone2-scale-to-a-million) 与 [ch26](../../book.zh.html#ch26-capstone3-openclaw-rl)。

## 实践 / 作业

1. 按 [`00-环境搭建.md`](../00-环境搭建.md) 第 3 节，跑通冒烟测试，确认基础设施正常。
2. 跑一组 baseline（单 GPU 文本、双 GPU 多模态），记录 TTFT P95、ITL P95、吞吐、错误率。
3. 至少做 5 组实验，系统性地调 `replicas`、`max-seqs`、`max-batch-tokens`、`prefix-cache`、`chunked-prefill` 等，记录每组的指标变化。
4. 撰写提交材料：
   - 最终 benchmark JSON；
   - 最终运行的完整命令；
   - 一页工程报告；
   - ≥5 组实验对比表；
   - 最优配置的解释；
   - 一个「意外失败或取舍」。
5. 实验结束后记得 `modal app stop` 清理资源，避免计费。
