/**
 * 10 个代表性 Agent harness 的最小 demo 数据。
 * 本文件由 scripts/gen-demos-data.mjs 从 demos/ 目录生成，代码与磁盘文件保持一致。
 * 诚实声明：所有 demo 仅通过 py_compile 语法验证，未连接真实 LLM 实机运行。
 */
import type { Tier } from './projects'

export interface DemoEntry {
  slug: string
  name: string
  projectSlug: string | null // 对应榜单条目 slug；未上榜的对照 harness 为 null
  tier: Tier | null
  language: string
  fileLabel: string
  lineCount: number
  abstraction: string // 核心抽象一句话
  code: string
}

export const demos: DemoEntry[] = [
  {
    slug: "pocketflow",
    name: "PocketFlow",
    projectSlug: "pocketflow",
    tier: "B",
    language: "Python",
    fileLabel: "main.py",
    lineCount: 56,
    abstraction: "一切皆 Node(prep/exec/post) + Flow(边)：节点共享 dict store，post 返回 action 决定下一条边，整个框架约 100 行。",
    code: "\"\"\"PocketFlow 最小 demo —— 不依赖 LLM key，用 mock 函数演示三段式节点。\n\n核心抽象：一切皆 Node(prep/exec/post) + Flow(边)。节点共享一个 dict 作为\nstore，prep 读、exec 算（可重试）、post 写并返回 action 字符串决定下一条边。\n本例用 mock_llm 代替真实 LLM 调用，因此可直接运行、零外部服务依赖。\n\n安装:  pip install pocketflow\n运行:  python3 main.py\n预期输出: store 从 {\"question\": ...} 流经两个节点，最终打印出 answer。\n\"\"\"\nfrom pocketflow import Node, Flow\n\n\ndef mock_llm(prompt: str) -> str:\n    \"\"\"假的 LLM：真实场景在这里调用 OpenAI/Anthropic，key 从环境变量读取。\"\"\"\n    return f\"[mock answer to] {prompt}\"\n\n\nclass AskNode(Node):\n    \"\"\"prep 读问题 -> exec 调 LLM -> post 写答案。\"\"\"\n\n    def prep(self, shared):\n        return shared[\"question\"]\n\n    def exec(self, question):\n        return mock_llm(question)\n\n    def post(self, shared, prep_res, exec_res):\n        shared[\"answer\"] = exec_res\n        return \"summarize\"  # action -> 下一条边\n\n\nclass SummarizeNode(Node):\n    \"\"\"把答案压缩成一句话。\"\"\"\n\n    def prep(self, shared):\n        return shared[\"answer\"]\n\n    def exec(self, answer):\n        return mock_llm(f\"TL;DR: {answer}\")\n\n    def post(self, shared, prep_res, exec_res):\n        shared[\"summary\"] = exec_res\n        return \"default\"\n\n\nif __name__ == \"__main__\":\n    ask = AskNode()\n    summarize = SummarizeNode()\n    ask - \"summarize\" >> summarize  # PocketFlow 用运算符重载声明边\n\n    flow = Flow(start=ask)\n    shared = {\"question\": \"What is an agent harness?\"}\n    flow.run(shared)\n    print(\"answer :\", shared[\"answer\"])\n    print(\"summary:\", shared[\"summary\"])\n",
  },
  {
    slug: "llmfetcher",
    name: "llmfetcher",
    projectSlug: "llmfetcher",
    tier: "B",
    language: "Python",
    fileLabel: "main.py",
    lineCount: 68,
    abstraction: "agent = while 循环 + tool 表：模型返回 tool_calls 就执行回填，直到直接回答；无任何图框架。",
    code: "\"\"\"llmfetcher 最小 demo —— 用真实 llmfetcher API 造一个带自定义工具的 agent。\n\n核心抽象（三层，刚好对应下面三段代码）:\n- LLMFetcher: provider-neutral 的后端 fetcher。一张 LLMBackendConfig 表描述\n  provider/model/key/url/超时/重试，屏蔽各家 SDK 差异，可挂多后端做容错。\n- Agent: 拥有模型循环（model loop）——发消息、解析 tool_calls、执行 handler、\n  回填结果，直到模型直接回答。调用方只看到一个同步的 run()。\n- Tool = 普通 callable + ToolSchema（参数描述）。add_tool 注册即用，无需继承。\n\n配置（全部走环境变量，指向任意 OpenAI 兼容 endpoint）:\n    export LLM_API_KEY=sk-...                       # 必填\n    export LLM_BASE_URL=https://api.deepseek.com    # 可选\n    export LLM_MODEL=deepseek-chat                  # 可选\n\n安装（未发 PyPI，需 Python>=3.12，从源码安装）:\n    git clone https://github.com/LunaticLegacy/llmfetcher.git\n    cd llmfetcher && pip install -e .\n运行: python3 main.py\n预期输出: 模型先调用 convert_size 工具，再用结果回答，最后打印 token 用量。\n\"\"\"\nimport os\n\nfrom llmfetcher import Agent, LLMBackendConfig, LLMFetcher, Tool\nfrom llmfetcher.llm_types import ToolParameter, ToolSchema\n\n# 1) provider-neutral fetcher：key 只从环境变量读取，绝不硬编码\nfetcher = LLMFetcher([\n    LLMBackendConfig(\n        name=\"primary\",\n        provider=\"openai\",  # OpenAI 兼容协议，api_url 可指向任意兼容 endpoint\n        model=os.environ.get(\"LLM_MODEL\", \"deepseek-chat\"),\n        api_key=os.environ[\"LLM_API_KEY\"],\n        api_url=os.environ.get(\"LLM_BASE_URL\", \"https://api.deepseek.com\"),\n        timeout=90,\n        max_retries=1,\n    )\n])\n\n# 2) Agent 拥有模型循环：rounds/tokens 上限在这里收口\nagent = Agent(\n    llm_fetcher=fetcher,\n    system_prompt=\"你是助手，需要换算存储尺寸时调用 convert_size 工具。\",\n    default_max_rounds=6,\n    default_max_tokens=2048,\n)\n\n\ndef convert_size(size: str) -> str:\n    \"\"\"自定义 tool：普通同步函数。真实场景可换成任意 HTTP fetch / DB 查询。\"\"\"\n    units = {\"KB\": 1024, \"MB\": 1024**2, \"GB\": 1024**3}\n    num, unit = float(size[:-2]), size[-2:].upper()\n    return f\"{size} = {int(num * units[unit]):,} bytes\"\n\n\n# 3) Tool = callable + schema，add_tool 注册\nagent.add_tool(Tool(\n    name=\"convert_size\",\n    description=\"把带单位的存储尺寸（如 750MB）换算成字节数\",\n    schemas=ToolSchema(properties=[\n        ToolParameter(name=\"size\", type=\"string\", description=\"带 KB/MB/GB 单位的尺寸，如 '750MB'\"),\n    ]),\n    handler=convert_size,\n))\n\nif __name__ == \"__main__\":\n    result = agent.run(\"我的视频是 750MB，等于多少字节？\")  # 同步，返回 LLMOutput\n    print(result.content)\n    print(f\"total tokens: {agent.usage.total_tokens}\")\n",
  },
  {
    slug: "smolagents",
    name: "smolagents",
    projectSlug: "smolagents",
    tier: "A",
    language: "Python",
    fileLabel: "main.py",
    lineCount: 47,
    abstraction: "CodeAgent：模型的动作空间是直接生成并执行的 Python 代码，@tool 装饰器注册自定义工具。",
    code: "\"\"\"smolagents 最小 demo —— CodeAgent + 一个自定义 @tool。\n\n核心抽象：CodeAgent 不让模型输出 JSON 形式的 tool call，而是让它**直接写\nPython 代码**，在受限解释器里执行；@tool 装饰器把普通函数（带 docstring 和\n类型标注）注册为模型可调用的工具。模型即代码，代码即动作。\n\n配置（Hugging Face 免费推理 endpoint，key 从环境变量读取）:\n    export HF_TOKEN=hf_...    # https://huggingface.co/settings/tokens\n\n安装:  pip install smolagents\n运行:  python3 main.py\n预期输出: agent 写并执行调用 celsius_to_fahrenheit 的代码，打印转换结果。\n\"\"\"\nimport os\n\nfrom smolagents import CodeAgent, InferenceClientModel, tool\n\n\n@tool\ndef celsius_to_fahrenheit(celsius: float) -> float:\n    \"\"\"把摄氏温度转换为华氏温度。\n\n    Args:\n        celsius: 摄氏温度值。\n    \"\"\"\n    return celsius * 9 / 5 + 32\n\n\ndef main() -> None:\n    # key 只从环境变量读取；InferenceClientModel 走 HF 免费推理 endpoint，\n    # 也可换成 OpenAIServerModel(api_base=..., api_key=os.environ[...]) 接兼容端点。\n    model = InferenceClientModel(\n        model_id=\"Qwen/Qwen2.5-Coder-32B-Instruct\",\n        token=os.environ[\"HF_TOKEN\"],\n    )\n    agent = CodeAgent(\n        tools=[celsius_to_fahrenheit],\n        model=model,\n        max_steps=4,\n        add_base_tools=False,  # 最小化：只保留我们自己的工具\n    )\n    result = agent.run(\"把 37.5 摄氏度转换成华氏度，并告诉我结果。\")\n    print(result)\n\n\nif __name__ == \"__main__\":\n    main()\n",
  },
  {
    slug: "atomic-agents",
    name: "atomic-agents",
    projectSlug: "atomic-agents",
    tier: "B",
    language: "Python",
    fileLabel: "main.py",
    lineCount: 64,
    abstraction: "InputSchema → BaseAgent → OutputSchema 的强类型管道，Pydantic schema 即结构化 I/O 契约。",
    code: "\"\"\"atomic-agents 最小 demo —— Pydantic schema 驱动的结构化输入输出。\n\n核心抽象：每个 agent 都是\"InputSchema -> BaseAgent -> OutputSchema\"的强类型\n管道。输入输出都是 Pydantic BaseIOSchema，框架用 schema 自动生成 system\nprompt 和结构化响应格式，保证输出可被程序直接消费。\n\n配置（key 只从环境变量读取，指向任意 OpenAI 兼容 endpoint）:\n    export OPENAI_API_KEY=sk-...\n    export OPENAI_BASE_URL=https://api.deepseek.com   # 可选\n\n安装:  pip install atomic-agents openai instructor\n运行:  python3 main.py\n预期输出: 打印一个 RecipeOutput Pydantic 对象（菜名 + 步骤列表）。\n\"\"\"\nimport os\n\nimport instructor\nimport openai\nfrom pydantic import Field\nfrom atomic_agents.agents.base_agent import BaseAgent, BaseAgentConfig, BaseIOSchema\nfrom atomic_agents.lib.components.system_prompt_generator import SystemPromptGenerator\n\n\nclass RecipeInput(BaseIOSchema):\n    \"\"\"想做一道菜时给出的约束条件。\"\"\"\n\n    ingredient: str = Field(..., description=\"手头的主要食材\")\n    minutes: int = Field(..., description=\"可用的烹饪时间（分钟）\")\n\n\nclass RecipeOutput(BaseIOSchema):\n    \"\"\"一份可直接执行的最简菜谱。\"\"\"\n\n    dish: str = Field(..., description=\"菜名\")\n    steps: list[str] = Field(..., description=\"按顺序排列的烹饪步骤\")\n\n\ndef build_agent() -> BaseAgent:\n    client = instructor.from_openai(\n        openai.OpenAI(\n            api_key=os.environ[\"OPENAI_API_KEY\"],  # 绝不硬编码 key\n            base_url=os.environ.get(\"OPENAI_BASE_URL\"),\n        )\n    )\n    return BaseAgent(\n        config=BaseAgentConfig(\n            client=client,\n            model=os.environ.get(\"MODEL\", \"gpt-4o-mini\"),\n            input_schema=RecipeInput,\n            output_schema=RecipeOutput,\n            system_prompt_generator=SystemPromptGenerator(\n                background=[\"你是一位追求极简的家庭厨师。\"],\n                output_instructions=[\"只给能在给定时间内完成的菜谱，步骤不超过 5 条。\"],\n            ),\n        )\n    )\n\n\nif __name__ == \"__main__\":\n    agent = build_agent()\n    result = agent.run(RecipeInput(ingredient=\"鸡蛋和番茄\", minutes=15))\n    print(f\"菜名: {result.dish}\")\n    for i, step in enumerate(result.steps, 1):\n        print(f\"  {i}. {step}\")\n",
  },
  {
    slug: "crewai",
    name: "crewAI",
    projectSlug: "crewai",
    tier: "A",
    language: "Python",
    fileLabel: "main.py",
    lineCount: 57,
    abstraction: "Agent(role/goal/backstory) + Task + Crew 的\"剧组\"编排，task 按 Process 依次接力。",
    code: "\"\"\"crewAI 最小 demo —— 两个 role agent 组成的最小 Crew。\n\n核心抽象：crewAI 用\"剧组\"隐喻组织 agent——Agent 有 role/goal/backstory，\nTask 描述要交付什么，Crew 按 process 把 task 依次分派给 agent（顺序执行时\n后一个 task 能看到前一个的产出）。\n\n配置（key 只从环境变量读取，指向任意 OpenAI 兼容 endpoint）:\n    export OPENAI_API_KEY=sk-...\n    export OPENAI_API_BASE=https://api.deepseek.com   # 可选，crewAI 读这个变量\n    export MODEL=deepseek-chat                        # 可选\n\n安装:  pip install crewai\n运行:  python3 main.py\n预期输出: 研究员先产出要点列表，写作者据此输出一段短文。\n\"\"\"\nimport os\n\nfrom crewai import Agent, Crew, Process, Task\n\n# crewAI 经 litellm 调模型；OPENAI_API_KEY / OPENAI_API_BASE 从环境变量读取，\n# 绝不硬编码。MODEL 需带 provider 前缀，如 \"openai/gpt-4o-mini\"。\nMODEL = os.environ.get(\"MODEL\", \"openai/gpt-4o-mini\")\n\nresearcher = Agent(\n    role=\"技术研究员\",\n    goal=\"把复杂主题提炼成 3 个准确要点\",\n    backstory=\"你擅长快速阅读资料并抓住本质，讨厌废话。\",\n    llm=MODEL,\n    verbose=False,\n)\nwriter = Agent(\n    role=\"科普写作者\",\n    goal=\"把要点改写成 100 字以内的通俗短文\",\n    backstory=\"你能把任何技术话题讲给外行听懂。\",\n    llm=MODEL,\n    verbose=False,\n)\n\nresearch_task = Task(\n    description=\"提炼「什么是 agent harness」的 3 个核心要点。\",\n    expected_output=\"3 条要点，每条一句话。\",\n    agent=researcher,\n)\nwrite_task = Task(\n    description=\"根据研究员的要点写一段不超过 100 字的科普短文。\",\n    expected_output=\"一段通俗短文，无术语堆砌。\",\n    agent=writer,\n)\n\ncrew = Crew(\n    agents=[researcher, writer],\n    tasks=[research_task, write_task],\n    process=Process.sequential,  # 最小流程：按顺序接力\n)\n\nif __name__ == \"__main__\":\n    print(crew.kickoff())\n",
  },
  {
    slug: "ag2",
    name: "AG2",
    projectSlug: "ag2",
    tier: "A",
    language: "Python",
    fileLabel: "main.py",
    lineCount: 45,
    abstraction: "v1.0 新 API：Agent 是唯一构建块，ask() 发起对话返回 AgentReply，全程 async。",
    code: "\"\"\"AG2 最小 demo —— 两个 agent 接力对话（AG2 v1.0 新 API，以官方 README 为准）。\n\n核心抽象：AG2 v1.0（`import ag2`，不再是 `import autogen`）以 `Agent` 为唯一\n构建块——`agent.ask(...)` 发起一轮对话并返回 `AgentReply`，对 reply 再调用\n`.ask(...)` 会在**同一对话历史**上继续。两个 agent 的对话就是把一方的回复\n喂给另一方。AG2 全程 async。\n\n配置（key 只从环境变量读取，provider config 自动读取标准环境变量）:\n    export OPENAI_API_KEY=sk-...\n\n安装:  pip install 'ag2[openai]'   # 需要 Python >= 3.10\n运行:  python3 main.py\n预期输出: planner 给出 3 步计划，critic 针对计划给出一条改进意见。\n\"\"\"\nimport asyncio\n\nfrom ag2 import Agent\nfrom ag2.config import OpenAIConfig  # 默认读取环境变量 OPENAI_API_KEY\n\nconfig = OpenAIConfig(model=\"gpt-4o-mini\")\n\nplanner = Agent(\n    \"planner\",\n    prompt=\"你是计划者：把任务拆成 3 步以内的最小行动计划，只输出计划。\",\n    config=config,\n)\ncritic = Agent(\n    \"critic\",\n    prompt=\"你是评审：指出计划中最薄弱的一步并给出一条具体改进建议，一句话以内。\",\n    config=config,\n)\n\n\nasync def main() -> None:\n    # 第 1 棒：planner 产出计划\n    plan = await planner.ask(\"任务：为一个开源库写一篇发布公告。\")\n    print(\"[planner]\", plan.body)\n\n    # 第 2 棒：把 planner 的输出作为 critic 的输入，完成一轮接力对话\n    review = await critic.ask(f\"请评审这份计划：\\n{plan.body}\")\n    print(\"[critic ]\", review.body)\n\n\nif __name__ == \"__main__\":\n    asyncio.run(main())\n",
  },
  {
    slug: "langgraph",
    name: "LangGraph",
    projectSlug: null,
    tier: null,
    language: "Python",
    fileLabel: "main.py",
    lineCount: 48,
    abstraction: "StateGraph：状态机图，节点返回状态增量，条件边按 state 路由，compile() 后可 invoke。",
    code: "\"\"\"LangGraph 最小 demo —— 最小 StateGraph（状态 + 节点 + 边），不依赖 LLM key。\n\n核心抽象：把 agent 流程建模为一张状态机图。State 是一个 TypedDict，节点是\n读 state 返回\"增量更新\"的普通函数，add_edge 决定流转方向，compile() 之后\n得到可 invoke 的图。本例用确定性函数代替 LLM 节点，零外部依赖可直接运行。\n\n安装:  pip install langgraph\n运行:  python3 main.py\n预期输出: 数字流经 double -> decide（条件边），大数走 finalize，打印最终 state。\n\"\"\"\nfrom typing import TypedDict\n\nfrom langgraph.graph import END, START, StateGraph\n\n\nclass State(TypedDict):\n    \"\"\"图里流动的共享状态，每个节点返回要合并进去的增量。\"\"\"\n\n    value: int\n    log: list[str]\n\n\ndef double(state: State) -> dict:\n    return {\"value\": state[\"value\"] * 2, \"log\": [f\"doubled to {state['value'] * 2}\"]}\n\n\ndef finalize(state: State) -> dict:\n    return {\"log\": [f\"final value {state['value']} is big enough\"]}\n\n\ndef route(state: State) -> str:\n    \"\"\"条件边：根据当前 state 决定下一个节点名。\"\"\"\n    return \"finalize\" if state[\"value\"] >= 10 else \"double\"\n\n\n# 组装图：声明 state 类型 -> 加节点 -> 加边（含条件边）-> 编译\nbuilder = StateGraph(State)\nbuilder.add_node(\"double\", double)\nbuilder.add_node(\"finalize\", finalize)\nbuilder.add_edge(START, \"double\")\nbuilder.add_conditional_edges(\"double\", route, {\"double\": \"double\", \"finalize\": \"finalize\"})\nbuilder.add_edge(\"finalize\", END)\ngraph = builder.compile()\n\n# 让 list 字段可累加需要 Annotated reducers；这里保持最小，直接覆盖即可。\nif __name__ == \"__main__\":\n    result = graph.invoke({\"value\": 3, \"log\": []})\n    print(\"final state:\", result)\n",
  },
  {
    slug: "openai-agents-sdk",
    name: "OpenAI Agents SDK",
    projectSlug: null,
    tier: null,
    language: "Python",
    fileLabel: "main.py",
    lineCount: 38,
    abstraction: "Agent + @function_tool + Runner 三件套，Runner 内置 agent 循环，输出取 final_output。",
    code: "\"\"\"OpenAI Agents SDK 最小 demo —— Runner + 一个 function tool。\n\n核心抽象：官方 SDK 的三件套——`Agent`（instructions + tools）、\n`@function_tool`（从类型标注和 docstring 自动生成 tool schema）、\n`Runner.run_sync`（内置 agent 循环：调模型 -> 执行 tool -> 回填直到出结果）。\n\n配置（key 只从环境变量读取；接兼容 endpoint 需另设 OPENAI_BASE_URL）:\n    export OPENAI_API_KEY=sk-...\n    export OPENAI_BASE_URL=https://api.deepseek.com   # 可选\n\n安装:  pip install openai-agents\n运行:  python3 main.py\n预期输出: 模型调用 add 工具计算 19+23，然后回答 \"19 加 23 等于 42\"。\n\"\"\"\nimport os\n\nfrom agents import Agent, Runner, function_tool\n\n# SDK 自动读取环境变量 OPENAI_API_KEY / OPENAI_BASE_URL，无需也不应硬编码 key。\nassert os.environ.get(\"OPENAI_API_KEY\"), \"请先 export OPENAI_API_KEY=sk-...\"\n\n\n@function_tool\ndef add(a: int, b: int) -> int:\n    \"\"\"计算两个整数的和。\"\"\"\n    return a + b\n\n\nagent = Agent(\n    name=\"calculator\",\n    instructions=\"你是计算器助手。涉及加法时必须先调用 add 工具，不许心算。\",\n    tools=[add],\n    model=os.environ.get(\"MODEL\", \"gpt-4o-mini\"),\n)\n\nif __name__ == \"__main__\":\n    result = Runner.run_sync(agent, \"19 加 23 等于多少？\")\n    print(result.final_output)\n",
  },
  {
    slug: "deepseek-harness",
    name: "deepseek-harness",
    projectSlug: null,
    tier: null,
    language: "YAML",
    fileLabel: "cordis.patch.yml",
    lineCount: 25,
    abstraction: "一切皆插件（Cordis 内核）：模型/工具/沙箱/agent loop 全是插件，patch 按行 id 分层覆盖组合。（已移入产品榜 T1，故不在框架榜对照中）",
    code: "# cordis.patch.yml —— deepseek-harness (dsh) 最小 patch 示例\n#\n# 核心抽象：dsh 的运行实例是一棵 Cordis 插件树，patch 是\"按行 id 整行替换\n# 或插入\"的配置覆盖层。层级顺序：bundle patch -> profile cordis.patch.yml ->\n# $DSH_HOME/cordis.patch.yml -> --patch 覆盖，后层赢。\n#\n# 用法（在 dsh 源码 checkout 中，插件路径须为绝对路径）:\n#   pnpm dsh web --patch /absolute/path/to/cordis.patch.yml\n#\n# 最小插件本体（另存为 hello-plugin.ts，路径填入下方 name 字段）:\n#   import type { Context } from '@deepseek-ai/cordis'\n#   export const name = 'hello-plugin'\n#   export function apply(ctx: Context) { console.log('[hello-plugin] loaded') }\n\n- insert:\n    # 向插件树插入一行：id 唯一，name 指向插件入口文件（绝对路径）\n    - id: hello\n      name: '/absolute/path/to/deepseek-harness/scratch-plugin/src/hello-plugin.ts'\n\n# 凭据引用写法（示例，注释掉避免误用）：patch 中可用 !!js 读环境变量，\n# 保证 key 只从环境变量读取、不进入版本库。\n# - replace:\n#     - id: model-deepseek\n#       config:\n#         apiKey: !!js process.env.DEEPSEEK_API_KEY\n",
  },
  {
    slug: "magentic",
    name: "magentic",
    projectSlug: "magentic",
    tier: "C",
    language: "Python",
    fileLabel: "main.py",
    lineCount: 40,
    abstraction: "@prompt 装饰器：函数签名即 LLM 结构化 I/O 契约，调用函数 = 一次类型化 LLM 请求。",
    code: "\"\"\"magentic 最小 demo —— @prompt 装饰器把 LLM 调用变成类型化函数。\n\n核心抽象：不写 agent 循环、不拼消息列表——给一个**没有函数体**的 Python\n函数加上 @prompt 模板，签名（参数 + 返回类型标注）即结构化输出的契约，\n调用函数就是调用 LLM，返回值直接是声明的 Python 类型。\n\n配置（key 只从环境变量读取，magentic 使用 openai SDK 的标准变量）:\n    export OPENAI_API_KEY=sk-...\n    export OPENAI_BASE_URL=https://api.deepseek.com   # 可选，兼容 endpoint\n\n安装:  pip install magentic\n运行:  python3 main.py\n预期输出: 打印一个 CountryFacts pydantic 对象（国家、首都、人口量级）。\n\"\"\"\nfrom pydantic import BaseModel, Field\n\nfrom magentic import prompt\n\n\nclass CountryFacts(BaseModel):\n    \"\"\"一个国家的基本事实卡片。\"\"\"\n\n    capital: str = Field(..., description=\"首都\")\n    population_millions: float = Field(..., description=\"人口，单位百万\")\n    fun_fact: str = Field(..., description=\"一条有趣的冷知识\")\n\n\n@prompt(\n    \"给我一张关于 {country} 的事实卡片。\",\n    model=None,  # None -> 默认 openai 模型；也可传 OpenaiChatModel(\"gpt-4o-mini\")\n)\ndef make_facts(country: str) -> CountryFacts: ...\n\n\nif __name__ == \"__main__\":\n    # 调用这个\"空\"函数 = 一次带结构化输出约束的 LLM 请求\n    facts = make_facts(\"日本\")\n    print(f\"首都: {facts.capital}\")\n    print(f\"人口: {facts.population_millions} 百万\")\n    print(f\"冷知识: {facts.fun_fact}\")\n",
  },
]

export const DEMO_TIER_GROUPS: { tier: Tier | null; label: string; items: DemoEntry[] }[] = [
  { tier: 'S' as Tier, label: 'TIER S', items: demos.filter((d) => d.tier === 'S') },
  { tier: 'A' as Tier, label: 'TIER A', items: demos.filter((d) => d.tier === 'A') },
  { tier: 'B' as Tier, label: 'TIER B', items: demos.filter((d) => d.tier === 'B') },
  { tier: 'C' as Tier, label: 'TIER C', items: demos.filter((d) => d.tier === 'C') },
  { tier: null, label: '未上榜对照', items: demos.filter((d) => d.tier === null) },
].filter((g) => g.items.length > 0)
