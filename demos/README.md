# Agent Harness 最小 Demo 集

为 Agent VS Wiki 榜单上的代表性 Agent 框架 / harness 编写的最小可运行示例。
每个子目录 = 一个框架，包含一个 ≤80 行的单文件示例 + 安装/运行/预期输出说明。

> **诚实声明**：除明确标注"零依赖可直接运行"的 demo（pocketflow、langgraph
> 使用 mock / 确定性函数）外，所有 demo **仅通过 `python3 -m py_compile` 语法
> 验证，未连接真实 LLM 实机运行**。API 用法已对照各项目官方 README/文档核对；
> 所有 API key 一律从环境变量读取，示例中不含任何硬编码凭据。

## 索引

| Demo | 榜单条目 | 语言 | 核心抽象一句话 | 可直接运行 |
|------|----------|------|----------------|-----------|
| [pocketflow](./pocketflow/) | PocketFlow (Tier B) | Python | Node(prep/exec/post) + Flow(边)，~100 行框架 | ✅（mock LLM） |
| [llmfetcher](./llmfetcher/) | llmfetcher (Tier B) | Python | LLMFetcher（provider-neutral）+ Agent 拥有模型循环 + Tool=callable+schema | 需 key |
| [smolagents](./smolagents/) | smolagents (Tier A) | Python | CodeAgent：模型直接写 Python 代码作为动作 | 需 key |
| [atomic-agents](./atomic-agents/) | atomic-agents (Tier B) | Python | InputSchema → BaseAgent → OutputSchema 强类型管道 | 需 key |
| [crewai](./crewai/) | crewAI (Tier A) | Python | Agent(role) + Task + Crew 的"剧组"编排 | 需 key |
| [ag2](./ag2/) | AG2 (Tier A) | Python | v1.0 新 API：`Agent.ask()` 全 async 对话接力 | 需 key |
| [langgraph](./langgraph/) | — (未上榜) | Python | StateGraph：状态 + 节点 + 条件边的状态机图 | ✅（确定性节点） |
| [openai-agents-sdk](./openai-agents-sdk/) | — (未上榜) | Python | Agent + @function_tool + Runner 三件套 | 需 key |
| [deepseek-harness](./deepseek-harness/) | deepseek-harness（产品榜 T1，Agent 运行时产品） | YAML/TS | 一切皆插件（Cordis 内核）+ patch 分层组合 | `npx @deepseek-ai/dsh web` |
| [magentic](./magentic/) | magentic (Tier C) | Python | @prompt：函数签名即 LLM 结构化 I/O 契约 | 需 key |

## 统一约定

- 每个 Python demo ≤80 行、单文件，文件顶部注释写明"该 harness 的核心抽象是什么"。
- API key 只从环境变量读取（`OPENAI_API_KEY` / `HF_TOKEN` / `LLM_API_KEY` 等），
  需要兼容 endpoint 时 base_url 同样走环境变量。
- langgraph 与 openai-agents-sdk 不在本站框架榜单上，作为对照性 harness 收录。
