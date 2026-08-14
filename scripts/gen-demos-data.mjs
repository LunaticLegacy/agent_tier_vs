/**
 * 从 demos/ 目录生成 src/data/demos.ts，保证内嵌代码与磁盘文件一致。
 * 用法：node scripts/gen-demos-data.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const meta = [
  {
    slug: 'pocketflow', name: 'PocketFlow', projectSlug: 'pocketflow', tier: 'B',
    language: 'Python', file: 'demos/pocketflow/main.py', fileLabel: 'main.py',
    abstraction: '一切皆 Node(prep/exec/post) + Flow(边)：节点共享 dict store，post 返回 action 决定下一条边，整个框架约 100 行。',
  },
  {
    slug: 'llmfetcher', name: 'llmfetcher', projectSlug: 'llmfetcher', tier: 'B',
    language: 'Python', file: 'demos/llmfetcher/main.py', fileLabel: 'main.py',
    abstraction: 'agent = while 循环 + tool 表：模型返回 tool_calls 就执行回填，直到直接回答；无任何图框架。',
  },
  {
    slug: 'smolagents', name: 'smolagents', projectSlug: 'smolagents', tier: 'A',
    language: 'Python', file: 'demos/smolagents/main.py', fileLabel: 'main.py',
    abstraction: 'CodeAgent：模型的动作空间是直接生成并执行的 Python 代码，@tool 装饰器注册自定义工具。',
  },
  {
    slug: 'atomic-agents', name: 'atomic-agents', projectSlug: 'atomic-agents', tier: 'B',
    language: 'Python', file: 'demos/atomic-agents/main.py', fileLabel: 'main.py',
    abstraction: 'InputSchema → BaseAgent → OutputSchema 的强类型管道，Pydantic schema 即结构化 I/O 契约。',
  },
  {
    slug: 'crewai', name: 'crewAI', projectSlug: 'crewai', tier: 'A',
    language: 'Python', file: 'demos/crewai/main.py', fileLabel: 'main.py',
    abstraction: 'Agent(role/goal/backstory) + Task + Crew 的"剧组"编排，task 按 Process 依次接力。',
  },
  {
    slug: 'ag2', name: 'AG2', projectSlug: 'ag2', tier: 'A',
    language: 'Python', file: 'demos/ag2/main.py', fileLabel: 'main.py',
    abstraction: 'v1.0 新 API：Agent 是唯一构建块，ask() 发起对话返回 AgentReply，全程 async。',
  },
  {
    slug: 'langgraph', name: 'LangGraph', projectSlug: null, tier: null,
    language: 'Python', file: 'demos/langgraph/main.py', fileLabel: 'main.py',
    abstraction: 'StateGraph：状态机图，节点返回状态增量，条件边按 state 路由，compile() 后可 invoke。',
  },
  {
    slug: 'openai-agents-sdk', name: 'OpenAI Agents SDK', projectSlug: null, tier: null,
    language: 'Python', file: 'demos/openai-agents-sdk/main.py', fileLabel: 'main.py',
    abstraction: 'Agent + @function_tool + Runner 三件套，Runner 内置 agent 循环，输出取 final_output。',
  },
  {
    slug: 'deepseek-harness', name: 'deepseek-harness', projectSlug: null, tier: null,
    language: 'YAML', file: 'demos/deepseek-harness/cordis.patch.yml', fileLabel: 'cordis.patch.yml',
    abstraction: '一切皆插件（Cordis 内核）：模型/工具/沙箱/agent loop 全是插件，patch 按行 id 分层覆盖组合。（已移入产品榜 T1，故不在框架榜对照中）',
  },
  {
    slug: 'magentic', name: 'magentic', projectSlug: 'magentic', tier: 'C',
    language: 'Python', file: 'demos/magentic/main.py', fileLabel: 'main.py',
    abstraction: '@prompt 装饰器：函数签名即 LLM 结构化 I/O 契约，调用函数 = 一次类型化 LLM 请求。',
  },
]

const entries = meta.map((m) => {
  const code = readFileSync(m.file, 'utf8')
  const lines = code.trimEnd().split('\n').length
  return `  {
    slug: ${JSON.stringify(m.slug)},
    name: ${JSON.stringify(m.name)},
    projectSlug: ${m.projectSlug ? JSON.stringify(m.projectSlug) : 'null'},
    tier: ${m.tier ? JSON.stringify(m.tier) : 'null'},
    language: ${JSON.stringify(m.language)},
    fileLabel: ${JSON.stringify(m.fileLabel)},
    lineCount: ${lines},
    abstraction: ${JSON.stringify(m.abstraction)},
    code: ${JSON.stringify(code)},
  },`
})

const out = `/**
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
${entries.join('\n')}
]

export const DEMO_TIER_GROUPS: { tier: Tier | null; label: string; items: DemoEntry[] }[] = [
  { tier: 'S' as Tier, label: 'TIER S', items: demos.filter((d) => d.tier === 'S') },
  { tier: 'A' as Tier, label: 'TIER A', items: demos.filter((d) => d.tier === 'A') },
  { tier: 'B' as Tier, label: 'TIER B', items: demos.filter((d) => d.tier === 'B') },
  { tier: 'C' as Tier, label: 'TIER C', items: demos.filter((d) => d.tier === 'C') },
  { tier: null, label: '未上榜对照', items: demos.filter((d) => d.tier === null) },
].filter((g) => g.items.length > 0)
`

writeFileSync('src/data/demos.ts', out)
console.log('generated src/data/demos.ts')
