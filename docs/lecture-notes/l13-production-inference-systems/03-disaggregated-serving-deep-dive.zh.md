# L13C - 分离式服务深入解析（Disaggregated Serving Deep Dive）

> 本文为 [`03-disaggregated-serving-deep-dive.md`](03-disaggregated-serving-deep-dive.md) 的中文翻译，英文原文保留。

## 核心思想

自回归推理有两种工作负载：

- **预填充（prefill）**：处理所有 prompt token，构建 KV Cache。
- **解码（decode）**：每次迭代为每个活跃请求生成一个 token。

Prefill 是「宽而计算密集」的。Decode 是「窄、重复、且内存带宽敏感」的。分离式服务（disaggregated serving）把两者拆到不同的资源池。

## 为什么「合设（colocated）服务」会挣扎

在合设引擎里，同一块 GPU 在以下两者之间交替：

1. 处理新请求的大块 prefill
2. 为已有请求生成 decode token

长 prefill 突发会延迟 decode 迭代。用户会感受到「流式不匀」或高 token 间延迟（ITL）。

## 分离式架构

```text
request
  -> router
  -> prefill pool
       compute prompt KV
       send KV to decode pool
  -> decode pool
       append one token at a time
       stream output
```

系统必须支付一份 **KV 传输税（KV transfer tax）**。

## KV 传输大小

近似 KV Cache 字节数：

```text
KV bytes = tokens
         * layers
         * 2
         * n_kv_heads
         * head_dim
         * bytes_per_element
```

对一个 GQA 模型：

- prompt tokens = 8192
- layers = 80
- n_kv_heads = 8
- head_dim = 128
- bytes = 2

```text
KV bytes = 8192 * 80 * 2 * 8 * 128 * 2
         = 2,684,354,560 bytes
         ~= 2.5 GiB
```

搬 2.5 GiB 不是免费的。只有「省下的干扰」大于「传输开销」时，分离才划算。

## 分离式服务什么时候划算

合适：

- 长 prompt
- 大量活跃 decode 流
- 严格的 ITL SLO
- prefill 突发
- 有独立的硬件池
- 高速互联

不合适：

- 短 prompt
- 极短输出
- 弱网络
- 低流量
- 简单的单副本部署

## 规模直觉（Sizing intuition）

Prefill 容量取决于「输入 tokens/sec」。

Decode 容量取决于「活跃序列数」与「输出 tokens/sec」。

如果流量是「长 prompt + 短输出」，就需要更多 prefill 容量；如果是「短 prompt + 长输出」，就需要更多 decode 容量。

## 干扰轨迹（Interference trace）

示例：

```text
64 active decode streams want one token every ~50 ms.
One new 12k-token prompt arrives.

Unified worker:
  decode step: 45 ms
  long prefill chunk: 180 ms
  next decode step: 45 ms

Expected stream gap: ~50 ms
Observed stream gap: ~225 ms
```

用户看到的是流式抖动（streaming jitter）。模型并没有变差；是调度器把 prefill 工作插进了 decode 迭代之间。

## 盈亏平衡规则（Break-even rule）

```text
benefit =
  avoided_decode_stall_ms
+ avoided_prefill_queue_ms
+ better_pool_utilization_ms

cost =
  KV_transfer_ms
+ connector_overhead_ms
+ extra_failure_retry_ms

Use disaggregation if benefit > cost.
```

GQA 与 MQA 能降低传输税，因为 KV Cache 大小与 KV 头数成正比。

## 与前面讲座的关系

- PagedAttention 让 KV 内存可控。
- 前缀缓存在「需要分离之前」就减少了 prefill 工作。
- 分块预填充是应对 prefill/decode 干扰的第一道防线。
- 张量并行在每个 prefill 或 decode 副本内部仍在使用。
- 量化减少了权重内存与带宽压力。
- 可观测性告诉我们「拆分是否有效」：TTFT 应该改善，而 ITL 不回归。

## 决策规则

在以下情况下使用分离式服务：

```text
saved_decode_delay + saved_prefill_queueing
>
KV_transfer_time + orchestration_overhead
```

这就是全部的取舍。
