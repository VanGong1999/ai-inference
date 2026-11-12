# 附录 A · 推理术语表（Inference Glossary）

> Inference Engineering — Philip Kiely · Appendix A

| 术语 | 中文释义 |
|---|---|
| Activation function（激活函数） | 插入在线性层之间的（基本）可微非线性函数（如 ReLU），防止多层神经网络坍缩成单次 matmul |
| Active–active（双活） | 多个区域/集群同时活跃服务实时流量的高可用姿态；任一面故障，流量在其它面无缝继续 |
| Active–passive（主备） | 保留一个「热备」集群/区域就绪但闲置的故障切换姿态；活跃面故障时切到备面 |
| Ada Lovelace（架构） | NVIDIA 面向图形的 GPU 架构，2022 年与 Hopper 一起发布；适合小模型和成本敏感负载，不适合大规模 LLM 推理 |
| Agent（代理） | 采取行动而非只提供信息的 AI 应用；工作流通常依赖多次推理调用，常跨多模型多模态，并需访问工具 |
| AI-native application（AI 原生应用） | 核心 UX 和价值依赖生成式模型的产品；推理选择下游于应用约束：模态、延迟预算、单位经济性和使用模式 |
| Ampere（架构） | 较旧的 NVIDIA GPU 架构，仍用于遗留或小规模部署；Hopper 和 Blackwell 在原始速度和规模化成本上都通常胜出 |
| API（应用程序接口） | 发送请求、接收响应的结构化接口；推理引擎暴露 API 用于向模型查询 |
| Arithmetic intensity（算术强度） | 给定算法每移动一个字节所执行的运算数；与 GPU 的 ops:byte 比对比，可判断内核是算力受限还是内存受限 |
| Attention（注意力） | transformer 通过 Q/K/V 投影和 softmax 把 token 与先前 token 关联的核心机制；因算力和内存需求大，是优化首要目标 |
| ASR（自动语音识别） | 音频进、文本出的转写模型（如 Whisper）；解码器工作主导运行时间，受益于 LLM 风格优化和 in-flight batching |
| Autoregressive token generation（自回归 token 生成） | 每个 token 依赖每个先前 token 的迭代生成；分为 prefill（处理输入 token）和 decode（生成输出 token）两阶段 |
| Autoscaling（自动扩缩） | 基于流量或利用率自动增减服务给定模型的副本数；让容量匹配需求，维持延迟 SLA、最小化浪费 |
| Autoscaling window（扩缩窗口） | 用于决定扩/缩的滚动时间范围；更长窗口让副本数稳定，更短窗口对尖峰反应更快 |
| B200 | NVIDIA 基于 Blackwell 的数据中心 GPU，192 GB VRAM、8 TB/s 内存带宽、5 petaFLOPS FP8 算力 |
| B300 | NVIDIA 基于 Blackwell 的数据中心 GPU，288 GB VRAM、8 TB/s 内存带宽、5 petaFLOPS FP8 算力 |
| Bandwidth（带宽） | 每秒能通过 VRAM 等内存或 NVLink 等互连的数据量 |
| Baselines（基线） | 应用优化前对性能和质量的初始、仔细记录测量；基线使收益或回归能清晰归因 |
| BLAS（基础线性代数子程序） | 线性代数基础运算的标准接口 |
| Batch（批） | 同时处理多个输入，LLM 推理常用 |
| Batch sizing（批大小） | 推理引擎的核心延迟-吞吐杠杆；更大批改善总吞吐但恶化每用户延迟 |
| Benchmark, intelligence（智能基准） | 模型正确回答问题或采取恰当行动的测量（如 MMLU） |
| Benchmark, performance（性能基准） | 给定模型在定义负载下推理服务延迟和吞吐的测量 |
| BF16 | 16 位浮点格式，指数比 FP16 大，用于训练、有时推理；更高动态范围有助保留离群值 |
| Bin packing, multi-cloud（多云装箱） | 把跨云、区域、集群的异构 GPU 池当作单一可调度资源，由多云容量管理基础设施实现 |
| Blackwell（架构） | NVIDIA 2024 年末 GPU 世代，支持 FP4、微缩放格式（MXFP8/MXFP4/NVFP4）和高内存带宽 |
| Blue-green deployment（蓝绿部署） | 两个并行生产环境（「蓝」「绿」），在二者间切流量实现零停机部署和快速回滚 |
| Cache-aware routing（缓存感知路由） | 把请求导向已持有匹配前缀或所需 LoRA 的副本；更高缓存命中率带来更低 TTFT |
| Canary deployment（金丝雀部署） | 新生产部署从一小份实时流量开始验证稳定性和性能，随时间吸收全部生产流量 |
| Causal language model, CLM（因果语言模型） | 仅解码器 transformer，给定先前上下文预测下一 token；本书所有生成式 LLM 都是 CLM |
| CPU（中央处理器） | 为串行负载优化的通用处理器；用于编排、调度、网络和预处理，但很少直接做生成式 AI 推理 |
| Chat template（聊天模板） | 模型特定的消息格式化与序列化（角色、分隔符、序列起止 token） |
| Chunked prefill（分块预填充） | 把长输入拆块、与 decode 或其它工作重叠 prefill，防止单条长序列独占资源 |
| Classifier-free guidance（无分类器引导） | 图像生成每步平衡无条件与 prompt 条件去噪通过；更低引导增强创造性，更高引导强制 prompt 遵循 |
| CLIP（文本编码器） | 早期图像流水线（如 SDXL）用的文本/图像编码器；现代系统常换成完整 LLM 以获得更强 prompt 理解 |
| Closed model（闭源模型） | 权重不可用的专有模型，如 GPT-5、Claude Sonnet、Google Gemini |
| Cold start（冷启动） | 副本从零扩到首次成功响应的时间（步骤含 GPU 配给、容器启动、模型加载、推理引擎编译） |
| ComfyUI | 组装图像流水线（基础模型、refiner、LoRA、ControlNet）的工作流工具；鼓励模块化、可交换组件 |
| Compute-bound（算力受限） | 受可用 FLOPS 而非内存带宽限制的算法；LLM prefill 和图像/视频生成通常算力受限 |
| Context Parallelism, CP（上下文并行） | 跨 GPU 复权权重、切分注意力上下文；对注意力在超大潜在空间上工作的视频模型至关重要 |
| Context window（上下文窗口） | 模型单次请求能跨输入、推理、输出处理的最大 token 数 |
| Continuous batching（连续批处理，in-flight） | token 级交织请求，使 GPU 槽位始终被利用；最小化批处理带来的每用户延迟惩罚 |
| Control plane, multi-cloud（控制面） | 部署模型、分配资源的全局编排器 |
| Core, CUDA（CUDA 核心） | 执行广泛标量和逐元素运算的通用算术单元 |
| Core, Tensor（Tensor Core） | 为混合精度矩阵乘累加（MMA）优化的专用硬件单元；是推理最重要的算力类型 |
| Cross-attention（交叉注意力） | 让一个序列（Q）以另一个序列的 K/V 为条件（如文本条件图像）；常见于多模态和去噪流水线 |
| cuBLAS | CUDA 的 BLAS 实现，提供高质量 GEMM 及相关原语 |
| CUDA | NVIDIA 用于 GPU 内核、图、内存和执行的编程模型与平台 |
| CUDA driver（CUDA 驱动） | 应用与 GPU 硬件之间管理内存和执行的底层接口 |
| CUDA graph（CUDA 图） | 内核和其它 GPU 操作的有向无环图（DAG），用于优化重复工作流 |
| CUDA kernel（CUDA 内核） | 在 GPU 上执行并行化代码的用户自定义函数 |
| CUDA runtime（CUDA 运行时） | 面向开发者、用于启动内核和管理内存的 API |
| cuDNN | 在 CUDA 中构建深度神经网络的原语 |
| CuTe | 领域专用 C++ 模板库，抽象分块张量运算，帮助开发者组合精度感知、硬件优化的 GEMM 和融合内核 |
| CUTLASS | CUDA C++ 模板库，提供写高性能、架构调优 GEMM 及相关内核的构建块 |
| Data sovereignty（数据主权） | 关于模型输入输出在地理上何处处理、存储的法律约束 |
| Decode（解码） | LLM 推理的内存受限阶段，自回归生成循环每次前向传播产出一个 token |
| DeepGEMM | DeepSeek AI 团队创建的简洁高效 GEMM 内核库，FP8 性能强劲 |
| Denoising model（去噪模型） | 扩散流水线的核心，把潜在噪声迭代精炼成图像或视频 |
| Diarization（说话人分离） | 按说话人分割音频（「谁在何时说话」）；常与 ASR 流水线中的 VAD 配对 |
| Diffusers（库） | 图像和视频生成流水线的参考实现 |
| Disaggregation（分离式服务） | 把 prefill 和 decode 分离到独立扩缩、跑在不同硬件资源上的引擎 |
| Distillation（蒸馏） | 基于概率分布（而非仅输出）训练更小学生模仿更大教师，在更少参数上保留模型行为 |
| Docker | 为推理服务及其依赖构建标准化包的容器化技术 |
| Dockerfile | 人类可读、带明确机器可解释指令的镜像创建文件 |
| Dynamic batching（动态批处理） | 批满或短计时器到点（取先者）即开跑；在延迟稳定与利用率间平衡；对 LLM 已被连续批处理取代 |
| Dynamic range, quantization（动态范围） | 数值格式能表示的绝对值范围；浮点因指数-尾数结构，同字节下动态范围高于整数 |
| EAGLE（投机） | 小型、专为投机打造的草稿模型，消费隐藏状态、提出多 token，获得高接受率 |
| Elo（质量元指标） | 两两对战胜率式评分比较模型质量；智能基准之外的有用方向性信号 |
| Embedding model（嵌入模型） | 把文本或图像输入编码成定维向量用于语义相似度，用于 RAG 和 agent 记忆；现代变体常用 LLM 骨干和 Matryoshka 表示 |
| Encoder（编码器） | 把原始输入转成内部表示的网络（如 Whisper 的音频特征）；在编码器-解码器模型中与解码器配对 |
| Evals（评估） | 镜像模型真实用例的任务特定测试，用于产品特定模型智能测试 |
| Expert Parallelism, EP（专家并行） | 把 MoE 的专家分片到 GPU；每块 GPU 含多个完整专家；低 GPU 间通信开销下提高总吞吐 |
| Few-step image generation（少步图像生成） | 八步或更少步产出可用图像的模型；快 80–90% 但质量有明显权衡；很适合实时应用 |
| Feynman（架构） | Rubin 之后的 NVIDIA 未来世代；细节有限；预计持续强调低精度和内存带宽 |
| Fine-tuning（微调） | 把预训练基础模型适配到某领域，常让更小的模型满足质量需求 |
| FlashAttention | 一系列最小化内存流量的优化注意力内核；FlashAttention 3 为 Hopper 而写，4 面向 Blackwell |
| Floating-point data formats（浮点数据格式） | FP16、FP8、FP4 等推理精度，高动态范围、指数-尾数结构 |
| FLOPS | 每秒浮点运算次数，通常在 Tensor Core 上衡量 |
| Foundation model（基础模型） | 在广泛数据上训练、作为多个下游任务基础的模型；通常经微调或直接经提示使用 |
| Function calling（函数调用） | 又称工具调用；给模型一组可用函数加 prompt，返回含所选函数及其参数的结构化输出 |
| GB200 | NVIDIA 超级芯片，经高带宽 NVLink chip-to-chip 把 Grace CPU 与 B200 GPU 配对；用于 NVL72 等机架级系统，利于 KV Cache 卸载、LoRA 交换等 |
| GEMM（通用矩阵-矩阵乘） | BLAS 中的算法，推理的关键运算 |
| Generative AI（生成式 AI） | 与预测式 ML 相对的一类模型，通过学习训练数据底层模式创建新内容（文本、图像、音频、视频、代码） |
| GPT（生成式预训练 Transformer） | OpenAI 创建的文本生成大语言模型家族 |
| GH200 | NVIDIA 超级芯片，经高带宽 NVLink chip-to-chip 把 Grace CPU 与 H200 GPU 配对 |
| Goodhart's Law（古德哈特定律） | 「当一个度量变成目标，它就不再是一个好的度量。」 |
| GPU node（GPU 节点） | 8 块经 NVLink 和 NVSwitch 互连 GPU 的标准机箱 |
| Grace CPU | 基于 ARM 的 NVIDIA CPU，CPU 与 GPU 间有高带宽 chip-to-chip 互连；与 Hopper、Blackwell GPU 配合 |
| GPU（图形处理器） | 高度并行处理器，最初为图形渲染设计，现广泛用于生成式 AI 模型训练和推理 |
| gRPC | 结构化、schema 优先的双向流式协议 |
| Head, attention（注意力头） | 层内一个独立注意力计算 |
| HBM（高带宽内存） | 数据中心 GPU 上 VRAM 所用的内存；近期世代含 HBM3、HBM3e、HBM4 |
| Hopper（架构） | NVIDIA 2022 GPU 世代，支持 FP8 和异步编程特性 |
| Hyperscaler（超大规模云） | AWS、GCP 等通用云服务提供商 |
| Image generation pipeline（图像生成流水线） | 图像生成基础模型是多个模型的流水线：文本编码器、迭代去噪器、VAE |
| Inference（推理） | 在生成式 AI 模型的生产环境中服务 |
| Inference engine（推理引擎） | 高性能运行时（vLLM、SGLang、TensorRT-LLM），支持批处理、缓存、量化、投机等优化技术 |
| InfiniBand | 跨多节点扩展推理和训练的节点间互连；带宽高于以太网等替代，但远低于 NVLink |
| Input sequence（输入序列） | 请求中提供给模型的 token，在 prefill 阶段处理 |
| ISL（输入序列长度） | 给定请求输入序列中的 token 数 |
| Instance, cloud（云实例） | 配给的虚拟机，含 GPU、CPU/RAM、存储、网络和互连 |
| Integer data formats（整数数据格式） | INT8、INT4 等动态范围有限的数值格式 |
| ITL（token 间延迟） | decode 期间生成 token 之间的时间；可换算为感知 TPS（如 2 毫秒 ITL 等于 500 TPS） |
| In-flight batching | 见连续批处理；高利用率、稳定延迟的 token 级交织 |
| Iterative denoising（迭代去噪，扩散） | 从噪声出发，在潜在空间中逐步精炼成图像或视频 |
| Jitter traffic（抖动流量） | 给到达时间和序列形状加随机性，比均匀或突发合成负载更贴近真实流量 |
| Kernel fusion（内核融合） | 把两个或更多内核重写成一个处理所有运算的内核，避免不必要的内存往返 |
| KV cache（KV 缓存） | 存储每个 token 的 K/V 张量以避免重算注意力，把注意力方程从二次时间变成线性时间 |
| L0/L1/L2 caches（GPU 缓存） | 指令、共享内存、全局缓存的片上缓存层级 |
| LLM（大语言模型） | 以文本 prompt 为输入、返回新文本序列的生成式 AI 模型；GPT、Claude、Llama、DeepSeek 等家族都是 LLM |
| Latency percentiles（延迟百分位） | 按百分位（P50/P90/P95/P99）测量延迟，同时关注平均和最差用户体验 |
| Latent consistency（潜在一致性） | 直接预测目标潜在向量的少步策略，可重复以精炼；很快，但保真度低于完整扩散 |
| Latent space, images/videos（潜在空间） | 去噪发生的低维表示（如 128×128） |
| Load testing（负载测试） | 发持续高流量，探测吞吐极限、队列行为和自动扩缩 |
| Local (edge) inference（本地/边缘推理） | 在手机、电脑等终端用户设备上跑推理 |
| Logit biasing（logit 偏置） | 微调或约束 token 概率以引导结构化输出（如 JSON/工具调用）；在采样前、logits 之后应用 |
| Logits | 每次 decode 前向传播生成的、每个词表 token 一个的非归一化概率向量 |
| Lookahead decoding（前瞻解码） | 推理期间构建 n-gram 以支持无独立模型的草稿 token 预测 |
| LoRA（低秩适配） | 轻量微调方法，对模型产生小改动；推理服务常需为单个基础模型在数千 LoRA 间切换 |
| Machine learning, ML（机器学习） | 分类、趋势预测等任务的预测式建模，与创造新输出的生成式 AI 相对 |
| Matmul（矩阵乘） | 矩阵乘法 |
| Matryoshka representations（嵌套表示） | 允许可变维度的嵌套向量方案，向量前部编码更多语义；允许向量大小与嵌入质量之间权衡 |
| Medusa（投机） | 通过微调加额外解码头，每次通过生成多个草稿 token |
| Microscaling formats（微缩放格式） | MXFP8、MXFP4、NVFP4 等浮点格式，用小块缩放因子（如每 32 元素）做块级量化提升精度 |
| Mixture of Experts, MoE（混合专家） | 把权重线性层分成稀疏专家的模型架构；路由器每次前向传播激活专家子集 |
| Model parallelism（模型并行） | 经张量、专家或流水线并行把工作拆到 GPU；策略取决于模型大小、拓扑及延迟 vs 吞吐目标 |
| Multi-cloud capacity management（多云容量管理） | 跨提供商和区域放置负载的全局调度器 |
| Multi-Instance GPU, MIG（多实例 GPU） | 较大 Ampere、Hopper、Blackwell、Rubin GPU 的能力，最多切成八片内存、七片算力 |
| Multi-node inference（多节点推理） | 单节点八块 GPU 的 VRAM 放不下权重、激活和 KV Cache 时，用 InfiniBand 跨两个或更多节点扩展；需 PP 或 EP（TP 对 InfiniBand 来说全对全通信太多） |
| Neocloud（新云） | Coreweave、Nebius 等聚焦 GPU 的专业云服务提供商 |
| Neural audio codec（神经音频编解码器） | 把音频压缩成 token 的学习编码器，配把 token 转回音频的解码器 |
| NIM | NVIDIA 为特定模型创建的预打包容器化微服务 |
| Node（节点） | 8 块 GPU、带 NVLink/NVSwitch 的物理基本单元；多节点在节点间加 InfiniBand |
| NVFP4 | NVIDIA 的 4 位浮点微缩放数值格式，双缩放因子、块大小 16 的块级量化 |
| NVIDIA Dynamo | 开源分布式服务平台，用于 KV 复用、分离式服务和多 GPU/多节点编排 |
| NVL72 | 机架级 Blackwell 系统，互连 72 块 GPU 和 36 块 CPU；为超大模型极致吞吐服务而建 |
| NVLink | GPU 之间一对一的通信层，Blackwell 上最高 1800 GB/s、Hopper 上 900 GB/s |
| NVSwitch | NVLink 之上的全对全通信层，用于节点内所有 GPU 协调 |
| N-gram speculation（n-gram 投机） | 用 prefill 观察到的 n-gram 在 decode 期间提出长草稿序列；对代码补全极有效 |
| Offline inference（离线推理） | 大批量任务的异步批处理，为吞吐和成本而非每请求延迟优化 |
| Omni-modal（全模态） | 接受多种模态输入（文本、图像、视频、音频）、产生多种模态输出的模型 |
| Online inference（在线推理） | 实时服务请求，为紧张延迟预算优化 |
| ONNX | 模型的中间表示和运行时 |
| Open model（开源模型） | 权重自由可得的模型，如 Llama、DeepSeek、Whisper |
| Ops:byte ratio（ops:byte 比） | 给定精度下 GPU 每字节内存带宽对应的峰值运算数；与算术强度对比诊断瓶颈 |
| Output sequence（输出序列） | 模型在 decode 阶段生成的 token |
| OSL（输出序列长度） | 模型为给定请求生成的输出序列 token 数 |
| OOM（内存不足错误） | GPU 显存不足以加载权重或执行推理的常见故障 |
| PagedAttention（分页注意力） | 把 KV 块存在固定大小页中的注意力优化，提升性能，尤其长上下文 |
| PCIe（GPU 形态） | 数据中心 GPU 的一种形态，用标准 PCI express 插槽连接；常比同 GPU 的 SXM 变体基准规格低、互连选项少 |
| Perceived TPS（感知 TPS） | 流式输出中单用户观察到的每秒 token 数；是「TPS」通常所指的更精确术语 |
| Pipeline Parallelism, PP（流水线并行） | 把层分成阶段跨 GPU；对稠密模型多节点尚可，但会引入气泡（部分 GPU 等待其它步骤时空闲） |
| Prefill（预填充） | LLM 推理的算力受限阶段，处理输入序列、构建 KV Cache |
| Prefix caching（前缀缓存） | 跨请求复用共享前缀的 KV 以跳过 prefill；对代码补全、多轮聊天和 agent 大幅改善 TTFT |
| Pretraining（预训练） | 在广泛语料上大规模（通常自监督）训练以创建基础模型 |
| Prompt | 给模型的指令；对扩散还包括负向 prompt 和步数/引导参数 |
| PyTorch compile（torch.compile） | 针对特定 GPU 的图捕获与内核选择/融合；缓存编译引擎以缩短冷启动 |
| PyTorch Profiler | 测量每个运算 CPU/GPU 时间和内存的开发者工具 |
| Quantization, post-training（训练后量化） | 降低权重、激活、可能 KV Cache 的精度，以减少算力和内存带宽需求 |
| Quantization-aware training（量化感知训练） | 训练时一起计算量化缩放、优化权重，使最终模型已为低精度部署校准 |
| Queue, request（请求队列） | 自动扩缩启动副本期间持有多余流量 |
| RTF（实时因子） | ASR 模型转写音频速度的测量；六秒转写一小时音频是 RTF 600 |
| RAG（检索增强生成） | 在 prompt 之外为 LLM 取回额外上下文的常见应用模式 |
| Ring attention（环注意力） | 上下文并行机制，GPU 在环中传部分注意力结果；对超大上下文减少全对全压力 |
| Roofline model（roofline 模型） | 把算术强度与带宽、算力上限画在一起，提供「优化内存还是算力」的可视化指南 |
| RoPE（旋转位置嵌入） | 把位置编码为学习旋转的位置编码方案，改善长上下文外推，代价是推理中注意力内存需求更高 |
| Routing, inference（推理路由） | 基于负载、KV Cache、可用 LoRA、序列形状把请求放到副本上，提升速度和利用率 |
| Rubin（架构） | NVIDIA 下一代（2026），引入 HBM4 和面向算力受限负载的 CPX |
| Sampling, decode（采样） | 基于生成 logits 选择输出 token 的过程；常见策略含贪心（argmax）、温度采样、top-k、top-p（nucleus） |
| Scale factor, quantization（缩放因子） | 把低精度值映射回原数值格式的乘数 |
| Scale to zero（缩放到零） | 闲置时关掉所有副本，按需启动；需快速冷启动和稳健排队；最适合可预测或开发负载 |
| SDXL | 有启发意义的早期扩散图像流水线（base + refiner + CLIP）；现代系统保留结构但用更大更强组件 |
| SLA（服务等级协议） | 系统对延迟、吞吐、可用时间或其它性能因素的合同承诺 |
| SLO（服务等级目标） | 为满足或超过给定系统 SLA 而设的内部目标 |
| SGLang | 快速推理引擎，前端/后端灵活、MoE 支持强 |
| Shadow traffic（影子流量） | 把真实生产请求镜像到候选部署 |
| SNAC（音频解码器） | 常与 TTS token 流配对的高性能音频解码路径 |
| Softmax | 在注意力中把分数转成概率，在解码中把 logits 归一化成概率分布 |
| Sparsity, FLOPS（稀疏性） | 2:4 结构化稀疏张量中 50% 值为 0，Tensor Core 可跳过乘 0；大多数推理是稠密而非稀疏 |
| SFU（特殊函数单元） | 加速 sin、cos 等特定数学运算的专用硬件单元，让专门运算不占 CUDA Core |
| Speculative decoding（投机解码） | 生成并验证草稿 token、使 decode 每次前向传播生成多 token 的一族策略 |
| Streaming Multiprocessor, SM（流式多处理器） | 含核心和缓存的 GPU 计算单元 |
| Structured output（结构化输出） | 遵循特定 schema 的 LLM 输出；通过 logit 偏置把生成约束到给定 schema，而非靠提示 |
| SXM（GPU 形态） | 插座式 GPU 模块，支持更高带宽连接、比 PCIe 供电更多；常基准规格更高，是推理标准 |
| Temperature（温度） | 控制 token 选择随机性：更低（如 0.1）更确定，更高（如 1.5）更多样 |
| Tensor Parallelism, TP（张量并行） | 节点内跨 GPU 拆张量运算；每用户延迟最好；需频繁 all-reduce 同步 |
| TensorRT | NVIDIA 的高性能推理优化运行时，带融合内核、量化等优化 |
| TensorRT-LLM | NVIDIA 打造的推理引擎，提供 Python API、TensorRT-engine 和 PyTorch 后端两条执行路径，带融合内核、量化、投机解码 |
| Thread（线程） | GPU 上的最小执行单元；内核启动许多线程实现大规模并行 |
| Throughput（吞吐） | 单位时间总工作量（如每秒总 token 数） |
| TTFB（首字节时间） | 输出首字节返回前的时间，延迟指标 |
| TTFT（首 token 时间） | 输出首个 token 返回前的时间，延迟指标 |
| Token（词元） | LLM 文本处理的原子单位；一个整数表示一串字符；英文约 4:3 的 token:词 比 |
| Tokenizer（分词器） | 确定性地把字符串转成 token 序列、反之亦然；模型各有不同分词器，更高效分词器改善端到端延迟 |
| TPS（每秒 token 数） | 见感知 TPS；每秒流给终端用户 token 数的延迟指标 |
| Training（训练） | 用反向传播和优化从数据学习模型权重的过程；计算密集，通常在大 GPU 集群上跑，产出推理所用权重 |
| Transformer | 生成式 AI 模型背后的基础架构 |
| Transformers（库） | LLM 和其它基于 transformer 模型的参考实现 |
| Triton Inference Server | NVIDIA 的生产服务框架，支持多后端 |
| VAE（变分自编码器） | 推理中用于图像/视频生成模型从潜在空间解码到像素空间（训练时也用于从像素编码到潜在空间） |
| Vector database（向量数据库） | 存储和查询嵌入模型创建的语义向量的数据库 |
| Vector similarity（向量相似度） | 基于余弦相似度等方程检查两向量多接近；高相似度向量编码相似语义 |
| Vera CPU | 基于 ARM 的 NVIDIA CPU，CPU 与 GPU 间高带宽 chip-to-chip 互连；随 Rubin 架构世代取代 Grace |
| VLM（视觉语言模型） | 接受图像和视频加文本 prompt、输出文本 |
| vLLM | 广泛采用的推理引擎，模型和硬件支持广、默认配置强 |
| Vocabulary（词表） | LLM 表示数据所用的 token 总集，通常超过 100,000 |
| VAD（语音活动检测） | 把流/文件切成含语音块的轻量模型，供 ASR 使用 |
| VRAM（设备内存） | GPU 上用于权重、KV、激活的显存；总 VRAM 决定模型大小和 KV 余量；带宽决定 decode TPS |
| WebSocket | 轻量双向流式传输；适合非结构化音频块和实时 UX |
| Weights-only quantization（仅权重量化） | 只降低线性层权重精度，KV Cache 和注意力等其它组件保持高精度；最保守、质量保留最好但性能提升最低 |
| Workload plane, multi-cloud（工作面） | 跑推理、处理请求的单个计算资源集群 |

---

[← 上一章：Ch7 生产](08-生产.md) ｜ [下一章：附录 B 推荐阅读 →](附录B-推荐阅读.md)
