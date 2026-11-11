# L13B - 结构化输出与评测（Structured Output and Evals）

> 本文为 [`02-structured-output-and-evals.md`](02-structured-output-and-evals.md) 的中文翻译，英文原文保留。

## 为什么结构化输出重要

对生产系统来说，「流畅的回答」是不够的。很多应用需要**类型化的、机器可读的、经过校验的**输出：

- 发票抽取
- 工具调用
- 数据库写入
- 医疗或法律分诊
- 检索引用（retrieval citations）
- 工作流状态更新

如果模型返回了格式错误的 JSON，即使文字「看起来对」，产品也已经坏了。

## 1. Schema 即契约（Schema as contract）

发票 schema 示例：

```json
{
  "type": "object",
  "required": ["invoice_id", "total", "currency", "risk_flags"],
  "properties": {
    "invoice_id": {"type": "string"},
    "total": {"type": "number"},
    "currency": {"enum": ["USD", "EUR", "INR"]},
    "risk_flags": {
      "type": "array",
      "items": {"type": "string"}
    }
  }
}
```

Schema 做三件事：

1. 它告诉模型该产出什么形态。
2. 它告诉解码器（decoder）哪些 token 是合法的。
3. 它告诉应用如何校验结果。

## 2. Logit 偏置（Logit biasing）

Logit 偏置在采样前改变 token 概率。

用途：

- 抑制不想要的措辞
- 鼓励精确的标签
- 降低非法枚举值的概率

**不要把它当作保证。** 它是一种软性引导机制（soft steering）。

## 3. 引导解码（Guided decoding）

引导解码用语法（grammar）、JSON schema、正则（regex）或有限状态机（finite-state machine）来屏蔽「不可能出现的下一个 token」。

示例：

```text
Partial output:
{"currency": "

Allowed next tokens:
USD
EUR
INR

Disallowed:
dollars
rupees
N/A
newline
```

采样器在采样前把「不允许的 token」的 logit 设为负无穷。

引导解码给出的是**语法上的保证**，但不保证语义正确。模型可以输出「合法 JSON 但总额是错的」。

## 4. 校验流水线（Validation pipeline）

使用分层检查：

```text
raw output
  -> parse JSON
  -> validate JSON schema
  -> validate business rules
  -> validate semantic consistency
  -> run safety filters
  -> return or repair/fallback
```

业务规则示例：

- total 必须非负
- currency 必须匹配发票所在国
- 日期必须在可接受范围内
- 引用的文档片段必须存在
- 工具调用参数必须匹配工具权限

## 5. 评测脚手架（Eval harnesses）

评测脚手架是「模型行为的 CI」。

最小记录：

```yaml
id: invoice_042
input: "raw invoice text..."
expected:
  invoice_id: INV-2026-042
  total: 1287.50
  currency: USD
checks:
  - parse_json
  - schema_valid
  - exact_match.invoice_id
  - numeric_tolerance.total <= 0.01
  - enum.currency
  - latency_budget.p99_ms <= 1200
```

评测维度：

- 语法合法性（syntax validity）
- 字段级准确率
- 语义正确性
- 拒答正确性（refusal correctness）
- 安全行为
- 延迟
- 成本
- 输出长度

## 6. 基准测试方法论（Benchmarking methodology）

**不要只报一个「延迟」数字。** 要把它拆开：

- 网络时间
- 排队时间
- 分词时间（tokenization）
- 预填充时间（prefill）
- TTFT
- token 间延迟（inter-token latency）
- 总生成时间
- 校验时间
- 护栏时间
- 后处理时间

报百分位，而不只是均值：

```text
P50: 普通用户
P90: 有压力的用户
P99: 那个会开 ticket 的用户
```

## 7. 修复循环（Repair loops）

修复循环应作为「异常处理器」，而不是主路径。

```text
if parse_fails:
  repair_once_with_small_model()
elif schema_fails:
  repair_once_with_error_message()
elif semantic_check_fails:
  route_to_stronger_model_or_human_review()
else:
  return result
```

需要跟踪：

- 解析失败率
- schema 失败率
- 修复率
- 修复成功率
- 新增延迟

如果修复率在一次 prompt、模型、schema 或解码变更后上升，那就是一次生产回归（regression）。

## 8. LLM 评判器（LLM judges）

先用确定性检查：

- 解析 JSON
- 校验 schema
- 精确字段
- 枚举成员
- 数值容差
- 引用存在性

只在「剩余的语义质量」上使用 LLM judge。一个好的 judge 会返回**带证据的结构化分数**，而不是一个含糊的是/否。

坏：

```text
Is this answer good?
```

更好：

```text
Grade 0-2 for:
1. all required fields present
2. values supported by source
3. no unsupported flags
4. no unsafe advice
Return JSON with scores and evidence spans.
```

## 9. 发布门槛（Release gates）

一次模型、prompt、量化或引导解码的变更应该通过：

```text
json_validity >= baseline
field_accuracy >= baseline - tolerance
safety_rate <= baseline + guard_band
P99_latency <= baseline * 1.10
cost_per_request <= baseline * 1.15
```

这把结构化输出又拉回到了生产系统：schema 合法性、延迟与成本都是**服务指标（serving metrics）**。
