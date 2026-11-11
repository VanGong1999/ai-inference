# L13D - 最终系统设计面试答案（Final System Design Interview Answer）

> 本文为 [`04-final-system-design-interview-answer.md`](04-final-system-design-interview-answer.md) 的中文翻译，英文原文保留。

题目：

> 设计一个低延迟、高吞吐、能处理数百万请求的 LLM 推理系统。带我走一遍其中的工程取舍。

## 1. 澄清工作负载（Clarify the workload）

先问清楚：

- 模型大小与模型层级数量
- prompt 长度分布
- 输出长度分布
- 各区域的请求速率
- 并发量
- 流式 vs 非流式
- TTFT SLO
- token 间延迟（ITL）SLO
- 总延迟 SLO
- 结构化输出要求
- 安全要求
- 批量 vs 在线混合

「数百万请求」这个信息不够。**tokens/sec 与上下文长度分布**才真正决定架构。

## 2. 高层架构（High-level architecture）

```text
client
  -> regional edge
  -> API gateway
  -> auth, quota, rate limit
  -> input guardrails
  -> prompt normalization
  -> inference router
       model tier selection
       online vs batch selection
       cache-aware replica selection
       canary/stable routing
       fallback provider routing
  -> serving engine
       prefill
       decode
       stream
  -> output validation
  -> safety filter
  -> telemetry
```

## 3. 服务引擎（Serving engine）

使用 vLLM、TensorRT-LLM 或 SGLang 风格的引擎，具备：

- PagedAttention 做 KV Cache 内存管理
- 连续批处理做高利用率
- 分块预填充保护 decode
- 前缀缓存应对重复 prompt
- 在草稿接受率高的场景用投机解码
- 评测验证质量后使用量化
- 大模型副本用张量并行

## 4. 扩缩容策略（Scaling strategy）

吞吐优先用**副本并行（replica parallelism）**；当模型放不下、或单 GPU 带宽不够时用**张量并行**。尽量把张量并行留在高带宽的 NVLink 域内。

只有当模型容量迫不得已时，才跨节点用**流水线并行**，因为跨节点通信很贵。

当长 prefill 影响 decode SLO 时，用**分离式 prefill/decode 服务**，但要计入 KV 传输时间。

## 5. 路由策略（Routing strategy）

路由器输入：

- prompt 长度
- 期望输出长度
- 模型难度分
- 租户层级
- 前缀哈希
- 缓存命中估计
- 副本队列深度
- 金丝雀策略
- 区域与数据边界

如果「省下的 prefill 时间」大于「额外的排队延迟」，就路由到缓存命中的副本。

## 6. 生产安全（Production safety）

使用：

- 离线评测
- 影子流量
- 金丝雀发布
- 结构化输出校验
- 输出过滤
- 回滚
- 每租户限流
- 滥用检测

跟踪：

- TTFT
- ITL
- 总延迟
- 队列深度
- GPU 利用率
- VRAM
- KV Cache 命中率
- 输出 token 分布
- schema 合法性
- 安全标志
- 每请求成本

## 7. 工程取舍（Engineering trade-offs）

| 选择 | 收益 | 成本 |
|---|---|---|
| 更大 batch | 更高吞吐 | 更高的尾延迟 |
| 预热池 | 更低冷启动 | 空闲 GPU 成本 |
| 缓存感知路由 | 更低 prefill | 负载不均衡 |
| 量化 | 更低内存与成本 | 质量风险 |
| 投机解码 | 更低延迟 | 草稿模型复杂度 |
| 分离式服务 | 保护 decode | KV 传输税 |
| 引导解码 | 合法 JSON | 采样器开销 |
| 严格护栏 | 更安全输出 | 额外延迟 |

## 8. 最终口头答案

我会先澄清工作负载形态：prompt 长度、输出长度、请求速率、并发量、模型大小、流式预期，以及 TTFT、token 间延迟、总延迟与可用性的 SLO。「数百万请求」不是规模单位，**tokens/sec 与上下文长度分布**才是。

我会在系统前放一个**区域网关**，负责认证、配额、限流、请求归一化与输入安全检查。之后是一个**智能推理路由器**：选择模型层级、决定在线还是批量、把缓存敏感请求路由到持有有用前缀 KV 状态的副本、应用金丝雀策略，并在过载或故障时使用回退提供商。

对在线服务，我会用现代推理引擎，具备 PagedAttention、连续批处理、前缀缓存、分块预填充与流式解码。只在评测验证质量后使用量化。如果廉价草稿模型对该工作负载有高接受率，就加投机解码。

对扩缩容，我会用「副本并行」做吞吐，用「张量并行」（在 NVLink 域内）跑大模型，只在必要时跨节点用「流水线并行」。如果长 prompt 影响 decode SLO，我会拆分 prefill 与 decode 池，但只在比较「省下的 decode 延迟」与「KV 传输税」之后。

我会把批量推理放在**独立的优先级通道**上。批量任务应该最大化 GPU 利用率、可以容忍排队；而在线流量需要有界的 TTFT 与稳定的 token 流式输出。

每次发布都经过离线评测、影子流量、金丝雀发布与回滚门槛。生产仪表盘跟踪 TTFT、ITL、队列深度、GPU 利用率、VRAM、KV Cache 命中率、输出 token 分布、schema 合法性、安全标志与每请求成本。

**核心取舍是「延迟 vs 利用率」。** 批处理、缓存、路由、预热池与分离式服务，都是「按请求类别」而不是「全局统一」地做这个取舍的工具。
