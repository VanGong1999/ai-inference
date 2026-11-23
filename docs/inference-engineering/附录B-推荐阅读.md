# 附录 B · 推荐阅读（Recommended Reading）

> Inference Engineering — Philip Kiely · Appendix B

本书是推理工程领域的入门。在支撑规模化高性能推理的每一项技术背后，都有无尽的深度可以探索。

如果你想找另一本书继续学习，我有三个推荐：

- **《AI Engineering: Building Applications with Foundation Models》**，Chip Huyen 著（O'Reilly Media, 2025）：这本极受欢迎的书介绍了 AI 工程主题的全貌。
- **《Build a Large Language Model (From Scratch)》**，Sebastian Raschka 著（Manning, 2024）：这本动手书详细讲解了 LLM 架构。
- **《AI Systems Performance Engineering: Optimizing Model Training and Inference Workloads with GPUs, CUDA, and PyTorch》**，Chris Fregly 著（O'Reilly Media, 2025）：这本新书聚焦性能构建。

AI 行业发展很快，新模型、新研究、新实现不断发布。我和同事在 Baseten 博客发布我们的最新工作，可访问 https://www.baseten.com/blog。

本附录提供论文、文档、书籍和博客清单，支持你作为推理工程师的下一步。资源按主题组织，每节内按标题字母排序。

## 架构（Architecture）

- "Attention is All You Need," Ashish Vaswani et al. (NeurIPS, 2017) — https://arxiv.org/abs/1706.03762
- "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding," Jacob Devlin et al. (NAACL, 2019) — https://arxiv.org/abs/1810.04805
- "BLIP-2: Bootstrapping Language-Image Pre-training with Frozen Image Encoders and Large Language Models," Junnan Li et al. (ICML, 2023) — https://arxiv.org/abs/2301.12597
- *Deep Learning*, Ian Goodfellow, Yoshua Bengio, Aaron Courville (MIT Press, 2016) — https://www.deeplearningbook.org/
- *Deep Learning with Python (2nd Edition)*, François Chollet (Manning, 2021)
- "Denoising Diffusion Probabilistic Models," Jonathan Ho et al. (arXiv:2006.11239, 2020) — https://arxiv.org/abs/2006.11239
- "DiT: Scalable Diffusion Models with Transformers," William Peebles, Saining Xie (ICCV, 2022) — https://arxiv.org/abs/2212.09748
- "FlashAttention: Fast and Memory-Efficient Exact Attention with IO Awareness," Tri Dao et al. (arXiv:2205.14135, 2022) — https://arxiv.org/abs/2205.14135
- "FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning," Tri Dao (arXiv:2307.08691, 2023) — https://arxiv.org/abs/2307.08691
- "FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-precision," Jay Shah et al. (arXiv:2407.08608, 2024) — https://arxiv.org/abs/2407.08608
- Flash-Attention-4, Tri Dao (Dao AI Research Lab, 2025) — https://github.com/Dao-AILab/flash-attention
- "Imagen Video: High Definition Video Generation with Diffusion Models," Jonathan Ho et al. (arXiv:2210.02303, 2022) — https://arxiv.org/abs/2210.02303
- "Language Models Are Few-Shot Learners," Tom Brown et al. (arXiv:2005.14165)
- "Learning Transferable Visual Models from Natural Language Supervision," Alec Radford et al. (ICML, 2021) — https://arxiv.org/abs/2103.00020
- "Longformer: The Long-Document Transformer," Iz Beltagy et al. (arXiv:2004.05150, 2020) — https://arxiv.org/abs/2004.05150
- "Mamba: Linear-Time Sequence Modeling with Selective State Spaces," Albert Gu, Tri Dao (arXiv:2312.00752, 2023) — https://arxiv.org/abs/2312.00752
- "Matryoshka Representation Learning," Aditya Kusupati et al. (NeurIPS, 2022) — https://arxiv.org/abs/2205.13147
- "Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer," Noam Shazeer et al. (arXiv:1701.06538, 2017) — https://arxiv.org/abs/1701.06538
- "Reformer: The Efficient Transformer," Nikita Kitaev et al. (arXiv:2001.04451, 2020) — https://arxiv.org/abs/2001.04451
- "Robust Speech Recognition via Large-Scale Weak Supervision," Alec Radford et al. (ICML, 2022) — https://arxiv.org/abs/2212.04356
- "RoFormer: Enhanced Transformer with Rotary Position Embedding," Jianlin Su et al. (arXiv:2104.09864, 2021) — https://arxiv.org/abs/2104.09864
- "SDXL: Improving Latent Diffusion Models for High-Resolution Image Synthesis," Dustin Podell et al. (arXiv:2307.01952, 2023) — https://arxiv.org/abs/2307.01952
- "Segment Anything," Alexander Kirillov et al. (ICCV, 2023) — https://arxiv.org/abs/2304.02643
- "Sentence-BERT: Sentence Embeddings Using Siamese BERT-Networks," Nils Reimers, Iryna Gurevych (arXiv:1908.10084, 2019) — https://arxiv.org/abs/1908.10084
- "The Llama 3 Herd of Models," Aaron Grattafiori et al. (arXiv:2407.21783, 2024) — https://arxiv.org/abs/2407.21783
- "Video Diffusion Models," Jonathan Ho et al. (arXiv:2204.03458, 2022) — https://arxiv.org/abs/2204.03458
- "Visual Instruction Tuning," Haotian Liu et al. (arXiv:2304.08485, 2023) — https://arxiv.org/abs/2304.08485

## 开发者工具（Developer Tools）

- BitsAndBytes, bitsandbytes-foundation — https://github.com/TimDettmers/bitsandbytes
- ComfyUI, comfyanonymous — https://github.com/comfyanonymous/ComfyUI
- "CUDA by Example: An Introduction to General Purpose GPU Programming," Jason Sanders, Edward Kandrot (NVIDIA, 2025)
- "CUDA C++ Programming Guide Release 13.0," NVIDIA (2025) — https://docs.nvidia.com/cuda/cuda-c-programming-guide/
- "CUDA cuBLAS Release 13.0," NVIDIA (2025) — https://docs.nvidia.com/cuda/cublas/
- CUTLASS, NVIDIA — https://github.com/NVIDIA/cutlass
- DeepGEMM, DeepSeek-ai — https://github.com/deepseek-ai/DeepGEMM
- Hugging Face Diffusers — https://huggingface.co/docs/diffusers/index
- LMCache, LMCache Project — https://github.com/LMCache/LMCache
- "NVIDIA Dynamo Documentation," NVIDIA (2025) — https://docs.nvidia.com/dynamo/latest/index.html
- NVIDIA Nsight Systems — https://developer.nvidia.com/nsight-systems
- NVIDIA Triton Inference Server — https://github.com/triton-inference-server/server
- ONNX Runtime, Microsoft — https://onnxruntime.ai/
- "PyTorch Performance Tuning Guide," Szymon Migacz (PyTorch Foundation, 2020)
- "PyTorch Profiler," Shivam Raikundalia (PyTorch Foundation, 2021)
- SGLang Project, LMSYS Org — https://github.com/sgl-project/sglang
- "TensorRT Documentation," NVIDIA (2025) — https://docs.nvidia.com/deeplearning/tensorrt/
- TensorRT-LLM, NVIDIA — https://github.com/NVIDIA/TensorRT-LLM
- Transformers, Hugging Face — https://huggingface.co/docs/transformers/index
- vLLM Project, The Linux Foundation — https://github.com/vllm-project/vllm

## 前沿开源模型（Frontier Open Models）

- DeepSeek, DeepSeek AI — https://huggingface.co/deepseek-ai
- FLUX, Black Forest Labs — https://huggingface.co/black-forest-labs
- Gemma, Google — https://huggingface.co/google
- GLM, Z.ai — https://huggingface.co/zai-org
- GPT OSS, OpenAI — https://huggingface.co/openai
- Kimi, Moonshot AI — https://huggingface.co/moonshotai
- Llama, Meta Llama — https://huggingface.co/meta-llama
- MiniMax, MiniMax AI — https://huggingface.co/MiniMaxAI
- Mistral, Mistral AI — https://huggingface.co/mistralai
- Nemotron, NVIDIA — https://huggingface.co/nvidia
- Orpheus, Canopy Labs — https://huggingface.co/canopylabs
- Qwen, Alibaba Qwen — https://huggingface.co/Qwen
- Wan, Wan-AI — https://huggingface.co/Wan-AI
- Whisper, OpenAI — https://huggingface.co/openai

## GPU 基础设施（GPU Infrastructure）

- *Designing Data-Intensive Applications*, Martin Kleppmann (O'Reilly Media, 2017) — https://dataintensive.net/
- Grace Hopper / Grace Blackwell Systems, NVIDIA — https://www.nvidia.com/en-us/data-center/grace-cpu/
- GPU Glossary, Frye et al. (Modal, 2025) — https://modal.com/gpu-glossary
- InfiniBand, NVIDIA — https://www.nvidia.com/en-us/networking/products/infiniband/
- Kubernetes Documentation, The Kubernetes Authors (Linux Foundation, 2025) — https://kubernetes.io/docs/home/
- "NVIDIA Blackwell Architecture Technical Brief: Built for the Age of AI Reasoning," NVIDIA (2025)
- "NVIDIA H100 Tensor Core GPU Architecture," NVIDIA (2023)
- "NVIDIA Tesla: A Unified Graphics and Computing Architecture," E. Lindholm et al. (IEEE Micro, 2008)
- NVLink / NVSwitch, NVIDIA — https://www.nvidia.com/en-us/data-center/nvlink/
- *Programming Massively Parallel Processors: A Hands-on Approach*, Wen-mei Hwu, David Kirk, Izzat El Hajj (Morgan Kaufmann, 2022)
- SemiAnalysis, Dylan Patel — https://semianalysis.com/
- *Site Reliability Engineering: How Google Runs Production Services*, Betsy Beyer et al. (O'Reilly Media, 2017) — https://sre.google/books/

## 推理优化研究（Inference Optimization Research）

- "Adversarial Diffusion Distillation," Axel Sauer et al. (ECCV, 2023) — https://arxiv.org/abs/2311.17042
- "Train Short, Test Long: Attention with Linear Biases Enables Input Length Extrapolation," Ofir Press et al. (arXiv:2108.12409, 2021) — https://arxiv.org/abs/2108.12409
- "AWQ: Activation-aware Weight Quantization for LLM Compression and Acceleration," Song Han (MIT, 2024) — https://github.com/mit-han-lab/llm-awq
- Cache-DIT, Vipshop — https://github.com/vipshop/cache-dit
- "CacheBlend: Fast Large Language Model Serving for RAG with Cached Knowledge Fusion," Jiayi Yao et al. (EuroSys, 2024) — https://arxiv.org/abs/2405.16444
- "Adding Conditional Control to Text-to-Image Diffusion Models," Lymin Zhang et al. (ICCV, 2023) — https://arxiv.org/abs/2302.05543
- "Beyond the Buzz: A Pragmatic Take on Inference Disaggregation," Tiyasa Mitra et al. (arXiv:2506.05508, 2025) — https://arxiv.org/abs/2506.05508
- "Break the Sequential Dependency of LLM Inference Using Lookahead Decoding," Yichao Fu et al. (arXiv:2402.02057, 2024) — https://arxiv.org/abs/2402.02057
- "EAGLE: Speculative Sampling Requires Rethinking Feature Uncertainty," Yuhui Li et al. (arXiv:2401.15077, 2024) — https://arxiv.org/abs/2401.15077
- "EAGLE-2: Faster Inference of Language Models with Dynamic Draft Trees," Yuhui Li et al. (EMNLP, 2024) — https://arxiv.org/abs/2406.16858
- "EAGLE-3: Scaling up Inference Acceleration of Large Language Models via Training-Time Test," Yuhui Li et al. (arXiv:2503.01840, 2025) — https://arxiv.org/abs/2503.01840
- "FlashInfer: Efficient and Customizable Attention Engine for LLM Inference Serving," Ye et al. (arXiv:2501.01005, 2025) — https://arxiv.org/abs/2501.01005
- "GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers," Elias Frantar (arXiv:2210.17323, 2022) — https://arxiv.org/abs/2210.17323
- "High-Resolution Image Synthesis with Latent Diffusion Models," Robin Rombach et al. (CVPR, 2021) — https://arxiv.org/abs/2112.10752
- "Latent Consistency Models: Synthesizing High-Resolution Images with Few-Step Inference," Simian Luo (arXiv:2310.04378, 2023) — https://arxiv.org/abs/2310.04378
- "LLM.int8(): 8-bit Matrix Multiplication for Transformers at Scale," Tim Dettmers et al. (arXiv:2208.07339, 2022) — https://arxiv.org/abs/2208.07339
- "Medusa: Simple LLM Inference Acceleration Framework with Multiple Decoding Heads," Tianle Cai et al. (arXiv:2401.10774, 2024) — https://arxiv.org/abs/2401.10774
- "Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism," Mohammad Shoeybi et al. (arXiv:1909.08053, 2019) — https://arxiv.org/abs/1909.08053
- "Efficient Memory Management for Large Language Model Serving with PagedAttention," Woosuk Kwon et al. (SOSP, 2023) — https://arxiv.org/abs/2309.06180
- "Fast Inference from Transformers via Speculative Decoding," Yaniv Leviathan et al. (ICML, 2022) — https://arxiv.org/abs/2211.17192
- "Ring Attention with Blockwise Transformers for Near-Infinite Context," Hao Lin et al. (arXiv:2310.01889, 2023) — https://arxiv.org/abs/2310.01889
- "SageAttention: Accurate 8-Bit Attention for Plug-and-play Inference Acceleration," Jintao Zhang et al. (arXiv:2410.02367, 2024) — https://arxiv.org/abs/2410.02367
- Sequence/Context Parallelism, Megatron-LM, NVIDIA — https://github.com/NVIDIA/Megatron-LM
- SmoothQuant, Song Han (MIT) — https://github.com/mit-han-lab/smoothquant
- "SparseGPT: Massive Language Models Can Be Accurately Pruned in One-Shot," Elias Frantar, Dan Alistarh (arXiv:2301.00774, 2023) — https://arxiv.org/abs/2301.00774
- "SpecVLM: Fast Speculative Decoding in Vision-Language Models," Haiduo Huang et al. (arXiv:2509.11815, 2025) — https://arxiv.org/abs/2509.11815
- "TeaCache: Efficient KV Cache Compression via Tensor Decomposition," Feng Lu et al. (Alibaba TongYi Vision Intelligence Lab, 2025) — https://github.com/ali-vilab/TeaCache

## 智能评估（Intelligence Evaluation）

- ARC AGI Prize, Greg Kamradt (2025) — https://arcprize.org/
- *Evals for AI Engineers: Systematically Measuring and Improving AI Applications*, Shreya Shankar, Hamel Husain (O'Reilly Media, 2026)
- "Grade School Math: Training Verifiers to Solve Math Word Problems," Karl Cobbe, Vineet Kosaraju (arXiv:2110.14168, 2021) — https://github.com/openai/grade-school-math
- "How to Fine-Tune Qwen3 to GPT-4o Level Performance," Greg Schoeninger (Oxen AI, 2025)
- "Humanity's Last Exam," Long Phan et al. (arXiv:2501.14249, 2025) — https://www.lastexam.ai/
- "HumanEval: Evaluating Large Language Models Trained on Code," OpenAI (2021) — https://github.com/openai/human-eval
- "MMLU: Measuring Massive Multitask Language Understanding," Dan Hendrycks et al. (ICLR, 2021) — https://github.com/hendrycks/test
- "MTEB: Massive Text Embedding Benchmark," Niklas Muenninghoff et al. (EACL, 2022) — https://arxiv.org/abs/2210.07316
- "SWE-Bench: Can Language Models Resolve Real-World Github Issues?" Carlos Jimenez et al. (ICLR, 2024) — https://www.swebench.com/

---

## 致谢（Acknowledgements）

这本书之所以能成书，是因为有人在我还没有成功把握时就早早投资了我。感谢 Mike Bilodeau 和 Dannie Herzberg，他们在我本该忙于其它十几个优先事项时批准了这个项目。还要感谢 Tuhin Srivastava、Amir Haghighat、Phil Howes、Pankaj Gupta 和 Emmiliese von Avis，四年前他们雇了我，尽管我在这个职位上没有任何正式经验。感谢 Megha，为了一切。感谢我的家人，他们一辈子都在我身上下注。

感谢许多审稿人帮我让这本书尽可能准确、精确：Raymond Cano、Tianshu Cheng、Tri Dao、Michael Feil、William Gao、Pankaj Gupta、Amir Haghighat、Mahmoud Hassan、Nidhi Hiremath、Phil Howes、Tyron Jung、Kaz Kato、Madison Kanna、Alex Ker、Harry Kim、Colin McGrath、Deepak Nagaraj、Eskil Olsen、Ed Shrager、Aaryam Sharma 和 Joey Zwicker。任何遗留错误都是我一个人的责任。

感谢 Robin Bourjaily 为本书编辑，也为我写过的几乎所有东西编辑。

感谢 Luke de Hass 负责封面和内页插图，Aaron Relph 提供设计指导，Javier Crocco 负责内页插图，Raúl López 提供额外设计协助。

感谢本书提到的开源模型背后的众多研究者、开源库的贡献者，以及论文的作者。你们是我们所站立的巨人肩膀。

最后，感谢你，读者。没有你，我只不过是在创造非常精细的训练数据。

---

[← 上一章：附录 A 术语表](附录A-术语表.md) ｜ [← 返回目录](README.md)
