# L13A - 生产级推理系统（Production Inference Systems）

> 本文为 [`01-production-systems.md`](01-production-systems.md) 的中文翻译，英文原文保留。

## 为什么会有这一讲

前面的讲座教的是「如何让单个请求快速变成 token」：

- 预填充（prefill）与解码（decode）
- KV Cache
- FlashAttention
- PagedAttention
- 前缀缓存（prefix caching）
- 分块预填充（chunked prefill）
- 量化（quantization）
- 连续批处理（continuous batching）
- 投机解码（speculative decoding）
- 张量并行（tensor parallelism）与流水线并行（pipeline parallelism）

生产系统问的是一个不同的问题：

> 我们如何把这些优化变成一个能扛住真实用户、突发流量、部署、安全要求与成本压力的**服务**？

答案是：推理工程此时变成了一个**控制系统（control system）**。网关（gateway）控制谁可以调用模型；路由器（router）控制哪个模型、哪个副本（replica）来服务一个请求；调度器（scheduler）控制批处理与内存；部署系统控制金丝雀（canary）与回滚（rollback）；可观测性（observability）栈决定了我们能否在账单或客户之前发现故障。

## 1. 冷启动（Cold starts）

冷启动不只是「容器启动慢」。对 LLM 服务来说，它通常包括：

1. GPU 分配。
2. 容器启动。
3. CUDA 上下文创建。
4. 模型权重下载或本地磁盘读取。
5. 权重加载进 HBM。
6. 运行时初始化。
7. Kernel 预热或 CUDA Graph 捕获。
8. KV Cache 块池（block pool）分配。
9. Tokenizer 与请求路径预热。

对一个 FP16 的 70B 模型，仅权重内存就约 140 GB。即使做了量化，把权重搬到正确的位置也很昂贵。这就是为什么「从零扩缩容（scale from zero）」对交互式 LLM 通常是错误的选择。

### 预热池策略（Warm-pool strategy）

为每个模型层级保留一小批已加载的副本：

```text
expected burst capacity = p95 requests/sec over warmup window
warm replicas = ceil(expected burst tokens/sec / safe_tokens_per_replica)
```

按以下指标扩缩容：

- 队列深度（queue depth）
- 活跃序列数（active sequences）
- 活跃 token 数（active tokens）
- GPU 内存压力
- TTFT P99
- 解码 ITL
- tokens/sec 需求

**不要**主要按 CPU 利用率扩缩容。一个 GPU 推理服务器可能已经「被淹死」，而 CPU 使用率看起来还很平静。

## 2. 金丝雀部署（Canary deployments）

LLM 的金丝雀必须测量比「错误与延迟」更多的东西。一次模型或 prompt 变更可能悄悄改变：

- 平均输出长度
- 拒答率（refusal rate）
- schema 合法性
- 安全过滤触发率
- 工具调用形态（tool call shape）
- 引用行为（citation behavior）
- 每请求成本
- 前缀缓存命中率

推荐的发布节奏：

1. 离线评测（offline evals）。
2. 影子流量（shadow traffic）。
3. 1% 低风险金丝雀。
4. 5% 金丝雀。
5. 25% 金丝雀。
6. 全量发布。

晋升门槛（promotion gate）：

```text
quality_score >= baseline - tolerance
schema_validity >= baseline
P99_TTFT <= baseline * 1.10
P99_ITL <= baseline * 1.10
avg_output_tokens <= baseline * 1.15
safety_flag_rate <= baseline + guard_band
cost_per_request <= baseline * 1.15
```

## 3. 缓存感知路由（Cache-aware routing）

标准负载均衡会把请求路由到「负载最低」的副本。而 LLM 服务往往需要**缓存感知路由**。

如果请求 A 与请求 B 共享一段 9k token 的前缀，那么请求 B 通常应该被路由到「已经持有请求 A 前缀 KV 块」的那个副本。

决策规则：

```text
choose cache-hit replica if:

queue_delay_cache_hit + residual_prefill
<
queue_delay_empty_replica + full_prefill
```

这直接关系到前缀缓存与 RadixAttention。路由不再只关乎「负载」，它关乎「重新计算 token 的代价」。

## 4. 护栏与输出过滤（Guardrails and output filtering）

护栏环绕在推理周围：

```text
request
  -> auth and quota
  -> input classifier
  -> prompt injection checks
  -> model inference
  -> structured output validation
  -> safety classifier
  -> business-rule validation
  -> response or fallback
```

先用廉价、确定性的检查；只在需要的地方（高风险任务、抽样审计、升级）才用昂贵的 judge 模型。

## 5. 批量 vs 在线推理（Batch vs online inference）

在线推理优化「用户感知延迟」：

- 低 TTFT
- 稳定 ITL
- 流式（streaming）
- 有界的排队时间

批量推理优化「吞吐」：

- 大批量
- 高 GPU 利用率
- 重试与续跑（retry and resume）
- 更低的每 token 成本

**绝不要让无界的批量任务与在线解码共享同一个优先级队列。** 批量工作可以用空闲算力，但它必须让位给实时流量。

## 6. 请求生命周期追踪（Request lifecycle trace）

每个请求都应该能被追踪为一串「有明确归属的阶段」：

```text
edge
  -> gateway
  -> input guardrails
  -> smart router
  -> engine queue
  -> prefill
  -> decode
  -> output validation
  -> output filtering
  -> telemetry
```

有用的指标拆解：

| 阶段 | 指标 | 坏味道（Bad smell） |
|---|---|---|
| Gateway | requests/sec、token/min、429s | 一个租户造成全局伤害 |
| Router | 缓存命中率、回退率、模型混合 | 70B 流量无产品理由地上升 |
| Queue | 队列深度、等待时间 | GPU 未饱和时队列却在增长 |
| Prefill | prefill 毫秒数、prompt tokens/sec | prompt 模板变更后 TTFT 跳升 |
| Decode | ITL/TPOT、输出 tok/sec | token 之间流式卡顿 |
| Output | schema 合法性、安全标志 | 流畅文本却破坏了下游应用 |

## 7. 自动扩缩容（Autoscaling）

糟糕的自动扩缩容器：

```text
if cpu_utilization > 70%:
  add_replica()
```

更好的自动扩缩容器：

```text
pressure =
  w1 * queue_time_p95
+ w2 * active_tokens / token_capacity
+ w3 * vram_pressure
+ w4 * p99_ttft_slo_violation
+ w5 * decode_itl_slo_violation
```

如果一个副本需要 45 秒预热，那就在「队列预测到疼痛」时扩缩容，而不是在 P99 已经被打破之后。

## 8. 故障模式（Incident patterns）

| 症状 | 可能原因 | 第一动作 |
|---|---|---|
| TTFT P99 上升，ITL 正常 | prefill 队列、缓存未命中、prompt 长度漂移 | 检查 prompt token 数与前缀命中率 |
| ITL 尖峰，TTFT 正常 | decode 过载、内存带宽压力 | 降低最大 batch token 数或增加 decode 容量 |
| 每请求成本跳升 | 输出长度漂移或模型层级路由漂移 | 对比输出 token 分布与模型混合 |
| GPU 低、队列高 | 调度器/准入问题 | 检查引擎准入日志 |
| 缓存命中率崩盘 | prompt 前缀变了 | diff prompt 模板与前缀哈希 |

## 最终心智模型

生产推理是一组**受控的取舍**：

- 预热池用「成本」换「延迟」
- 批处理用「延迟」换「吞吐」
- 缓存感知路由用「负载均衡」换「更少的 prefill」
- 金丝雀用「发布速度」换「安全」
- 护栏用「延迟」换「正确性与合规」
- 批量通道用「新鲜度」换「效率」
