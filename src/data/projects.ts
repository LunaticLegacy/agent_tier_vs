import { auditForFramework, classifyFramework, scoreFramework } from './standards'
import type { RankingAudit } from './standards'

export type Tier = 'S' | 'A' | 'B' | 'C' | 'D'

export interface DimensionScores {
  architecture: number // 架构设计
  code: number // 代码质量
  testCI: number // 测试与CI
  docs: number // 文档DX
  ecosystem: number // 生态热度
  radical: number // 思想激进度
}

export interface Project {
  slug: string
  name: string
  tier: Tier
  rank: number // 总榜排名 1-17
  maintainer: string
  maintainerType: '官方' | '小团队' | '个人' | '学生项目' | '社区'
  language: string
  license: string
  stars: string // 展示用，如 "65.7k"
  starValue: number // 排序/count-up 用
  status: '活跃' | '已停更' | '已封存'
  tagline: string // 一句话简介
  score: number // 综合评分 /10
  dimensions: DimensionScores
  quote: string
  highlights: string[]
  weaknesses: string[]
  repoUrl?: string // 仓库地址（如有）
  audit: RankingAudit
}

type RawProject = Omit<Project, 'audit'>

export const TIER_META: Record<
  Tier,
  { name: string; definition: string; color: string; label: string }
> = {
  S: { name: '顶级工程', definition: '开源工程的天花板', color: '#F5C518', label: 'TIER S' },
  A: { name: '一流', definition: '可托付生产的狠角色', color: '#A78BFA', label: 'TIER A' },
  B: { name: '扎实有特色', definition: '一招鲜，吃透了一件事', color: '#38BDF8', label: 'TIER B' },
  C: { name: '有想法但单薄', definition: '点子锋利，身板单薄', color: '#4ADE80', label: 'TIER C' },
  D: { name: '概念验证 / 实验品', definition: '思想先行，代码未满', color: '#64748B', label: 'TIER D' },
}

export const TIER_ORDER: Tier[] = ['S', 'A', 'B', 'C', 'D']

export const DIMENSION_LABELS: { key: keyof DimensionScores; label: string }[] = [
  { key: 'architecture', label: '架构设计' },
  { key: 'code', label: '代码质量' },
  { key: 'testCI', label: '测试与CI' },
  { key: 'docs', label: '文档DX' },
  { key: 'ecosystem', label: '生态热度' },
  { key: 'radical', label: '思想激进度' },
]

const rawProjects: RawProject[] = [
  {
    slug: 'chidori',
    name: 'Chidori',
    tier: 'A',
    rank: 1,
    maintainer: 'ThousandBirdsInc',
    maintainerType: '小团队',
    language: 'Rust',
    license: 'Apache-2.0',
    stars: '1.4k',
    starValue: 1400,
    status: '活跃',
    tagline: '副作用全过 host call，字节级回放 + 崩溃续跑。',
    score: 8.8,
    dimensions: { architecture: 10, code: 9, testCI: 8, docs: 7, ecosystem: 5, radical: 10 },
    quote: '小作坊下料猛的最强证据。',
    highlights: [
      '一切副作用必须作为 host call 过运行时——换来零 token 字节级回放',
      '崩溃断点续跑',
      'checkpoint 可提交进 git 当测试',
    ],
    weaknesses: ['生态小', '社区与文档规模有限'],
  },
  {
    slug: 'smolagents',
    name: 'smolagents',
    tier: 'A',
    rank: 2,
    maintainer: 'HuggingFace',
    maintainerType: '小团队',
    language: 'Python',
    license: 'Apache-2.0',
    stars: '28.8k',
    starValue: 28800,
    status: '活跃',
    tagline: 'CodeAgent：LLM 直接写代码作为 action。',
    score: 8.5,
    dimensions: { architecture: 8, code: 9, testCI: 8, docs: 9, ecosystem: 9, radical: 8 },
    quote: '工程质量最高的小团队库。',
    highlights: [
      'CodeAgent 理念：LLM 直接写 Python 代码作为 action，动作空间表达力拉满',
      '代码组织与类型纪律在小团队库中最佳',
      'HF 生态加持',
    ],
    weaknesses: ['执行生成代码有安全风险（CVE-2025-9959）', '功能膨胀，已不再 "smol"'],
  },
  {
    slug: 'crewai',
    name: 'crewAI',
    tier: 'A',
    rank: 3,
    maintainer: 'João Moura',
    maintainerType: '个人',
    language: 'Python',
    license: 'MIT',
    stars: '57k',
    starValue: 57000,
    status: '活跃',
    tagline: 'Crews + Flows，生态与商业化最成功的 Agent 框架。',
    score: 8.3,
    dimensions: { architecture: 7, code: 7, testCI: 8, docs: 9, ecosystem: 10, radical: 6 },
    quote: '生态与商业化最成功的 Agent 框架。',
    highlights: [
      'Crews（角色委派）+ Flows（事件驱动工作流）双模型覆盖广',
      '生态、课程、商业化闭环最完整',
      '上手曲线友好',
    ],
    weaknesses: ['抽象泄漏', '委派行为不可控是老槽点'],
  },
  {
    slug: 'ag2',
    name: 'AG2',
    tier: 'A',
    rank: 4,
    maintainer: 'AutoGen 原作者社区 fork',
    maintainerType: '社区',
    language: 'Python',
    license: 'Apache-2.0',
    stars: '4.9k',
    starValue: 4900,
    status: '活跃',
    tagline: 'Hub + WAL + 类型化 channel，通信正式化程度最高。',
    score: 8.1,
    dimensions: { architecture: 9, code: 8, testCI: 8, docs: 7, ecosystem: 6, radical: 8 },
    quote: '子代理通信正式化程度最高。',
    highlights: [
      'v1 重写：Hub + write-ahead log + 类型化 channel',
      '多代理通信语义最严谨',
      'AutoGen 血统的正统延续',
    ],
    weaknesses: ['与 Classic 断代', '生态分流（AutoGen/AG2 并存稀释）'],
  },
  {
    slug: 'pocketflow',
    name: 'PocketFlow',
    tier: 'B',
    rank: 5,
    maintainer: 'Zachary Huang',
    maintainerType: '个人',
    language: 'Python',
    license: 'MIT',
    stars: '11.1k',
    starValue: 11100,
    status: '活跃',
    tagline: '99 行核心零依赖，两个抽象承载一切。',
    score: 7.6,
    dimensions: { architecture: 8, code: 8, testCI: 6, docs: 7, ecosystem: 7, radical: 7 },
    quote: '99 行，两个抽象，承载一切。',
    highlights: [
      '核心恰好 99 行、零依赖',
      'Node + Flow 两个抽象表达全部编排',
      '已移植 7 种语言',
    ],
    weaknesses: ['无电池——生产特性全在 cookbook 示例里', '72 个 open issue 单人维护'],
  },
  {
    slug: 'llmfetcher',
    name: 'llmfetcher',
    tier: 'B',
    rank: 6,
    maintainer: 'LunaNeko',
    maintainerType: '个人',
    language: 'Python',
    license: 'AGPL-3.0',
    stars: '1',
    starValue: 1,
    status: '活跃',
    tagline: '活跃的同步 Agent 框架：TaskBus 让 worker 原始输出不进入协调者上下文。',
    score: 7.4,
    dimensions: { architecture: 9, code: 7, testCI: 4, docs: 8, ecosystem: 1, radical: 9 },
    quote: '16 个项目中唯一把隔离做到如此决绝的。',
    highlights: [
      'TaskBus 设计：worker 原始输出永不进入协调者上下文',
      'DAG 动态变更 + 协作式停止协议，语义严谨',
      '文档纪律罕见地好',
    ],
    weaknesses: ['无 MCP / 多模态 / 运行中恢复', '任务路由与中间件仍需业务侧实现', '社区采用与独立验证尚不足'],
    repoUrl: 'https://github.com/LunaticLegacy/llmfetcher',
  },
  {
    slug: 'atomic-agents',
    name: 'atomic-agents',
    tier: 'B',
    rank: 7,
    maintainer: 'Kenny Vaneetvelde',
    maintainerType: '个人',
    language: 'Python',
    license: 'MIT',
    stars: '6.2k',
    starValue: 6200,
    status: '活跃',
    tagline: '原子化组件 + Pydantic 全链路类型安全。',
    score: 7.3,
    dimensions: { architecture: 8, code: 8, testCI: 7, docs: 7, ecosystem: 6, radical: 6 },
    quote: '极简派中最适合生产的。',
    highlights: ['不减行数减抽象：原子化组件', 'Pydantic 全链路类型安全', '组合自由度高'],
    weaknesses: ['编排范式较保守', '个人维护带宽有限'],
  },
  {
    slug: 'agency-swarm',
    name: 'agency-swarm',
    tier: 'B',
    rank: 8,
    maintainer: 'VRSEN',
    maintainerType: '个人',
    language: 'Python',
    license: 'MIT',
    stars: '4.5k',
    starValue: 4500,
    status: '活跃',
    tagline: '声明式通信拓扑（ceo > dev），一眼看清谁指挥谁。',
    score: 7.0,
    dimensions: { architecture: 7, code: 7, testCI: 6, docs: 7, ecosystem: 6, radical: 6 },
    quote: '声明式拓扑，一眼看清谁指挥谁。',
    highlights: ['声明式通信拓扑（ceo > dev）', '角色定义直观'],
    weaknesses: ['缺 DAG 并行/汇聚语义', '复杂流程表达力受限'],
  },
  {
    slug: 'swarms',
    name: 'swarms',
    tier: 'B',
    rank: 9,
    maintainer: 'Kye Gomez',
    maintainerType: '个人',
    language: 'Python',
    license: 'Apache-2.0',
    stars: '7.0k',
    starValue: 7000,
    status: '活跃',
    tagline: '60+ 编排结构大超市，覆盖面无人能及。',
    score: 6.6,
    dimensions: { architecture: 6, code: 6, testCI: 6, docs: 7, ecosystem: 7, radical: 7 },
    quote: '下料猛，火候差。',
    highlights: ['60+ 种编排结构大超市，覆盖面无人能及', '迭代速度快'],
    weaknesses: ['工程口碑一般', '营销味重，质量参差'],
  },
  {
    slug: 'magentic',
    name: 'magentic',
    tier: 'C',
    rank: 10,
    maintainer: 'Jack Collins',
    maintainerType: '个人',
    language: 'Python',
    license: 'MIT',
    stars: '2.4k',
    starValue: 2400,
    status: '活跃',
    tagline: '装饰器把 LLM 变成类型化 Python 函数。',
    score: 6.0,
    dimensions: { architecture: 7, code: 7, testCI: 6, docs: 6, ecosystem: 5, radical: 6 },
    quote: '把 LLM 调用变成一个类型化函数。',
    highlights: ['装饰器把 LLM 变成类型化 Python 函数，DX 优雅'],
    weaknesses: ['编排能力弱', '止步于"调用层"创新'],
  },
  {
    slug: 'maap',
    name: 'MAAP',
    tier: 'C',
    rank: 11,
    maintainer: '个人',
    maintainerType: '个人',
    language: 'Python',
    license: 'MIT',
    stars: '15',
    starValue: 15,
    status: '活跃',
    tagline: 'Erlang 监督树移植：背压 + 重启预算。',
    score: 5.9,
    dimensions: { architecture: 8, code: 7, testCI: 5, docs: 5, ecosystem: 1, radical: 8 },
    quote: '工程意外扎实，但无人知晓。',
    highlights: ['Erlang 监督树移植 agent 编排：有界 mailbox 背压、重启预算、DeadLetter'],
    weaknesses: ['生态为零', '文档与示例稀薄'],
  },
  {
    slug: 'fsm-llm',
    name: 'fsm-llm',
    tier: 'C',
    rank: 12,
    maintainer: '大学生项目',
    maintainerType: '学生项目',
    language: 'Python',
    license: 'Apache-2.0',
    stars: '69',
    starValue: 69,
    status: '已停更',
    tagline: 'FSM 拥有控制流，LLM 只在状态内应答。',
    score: 5.6,
    dimensions: { architecture: 7, code: 6, testCI: 4, docs: 5, ecosystem: 2, radical: 7 },
    quote: '合规场景的对症解。',
    highlights: ['FSM 拥有控制流、LLM 只在状态内应答——可控性极强'],
    weaknesses: ['已停更', '通用性有限'],
  },
  {
    slug: 'agentsilex',
    name: 'agentsilex',
    tier: 'C',
    rank: 13,
    maintainer: '中文个人开发者',
    maintainerType: '个人',
    language: 'Python',
    license: 'MIT',
    stars: '453',
    starValue: 453,
    status: '活跃',
    tagline: '~300 行核心，透明可 hack。',
    score: 5.5,
    dimensions: { architecture: 6, code: 6, testCI: 4, docs: 6, ecosystem: 3, radical: 5 },
    quote: '300 行，透明可 hack。',
    highlights: ['~300 行核心，完全透明可改'],
    weaknesses: ['社区比同档小一个数量级'],
  },
  {
    slug: 'turn',
    name: 'Turn',
    tier: 'D',
    rank: 14,
    maintainer: '个人 + arXiv 论文',
    maintainerType: '个人',
    language: 'TypeScript',
    license: 'MIT',
    stars: '10',
    starValue: 10,
    status: '活跃',
    tagline: 'agent 语义下沉语言/VM 层，字节码级抗注入。',
    score: 5.2,
    dimensions: { architecture: 8, code: 5, testCI: 3, docs: 4, ecosystem: 1, radical: 10 },
    quote: '范式级尝试，生态为零。',
    highlights: [
      'agent 语义做成语言/VM 层保证：actor 隔离、不可变 epoch 状态',
      'OAuth token 永不进 agent 内存（字节码级抗 prompt 注入）',
    ],
    weaknesses: ['生态为零', '工程完成度低'],
  },
  {
    slug: 'compileagent',
    name: 'CompileAgent',
    tier: 'D',
    rank: 15,
    maintainer: '个人',
    maintainerType: '个人',
    language: 'TypeScript',
    license: '—',
    stars: '2',
    starValue: 2,
    status: '活跃',
    tagline: '给 agent 栈补"编译层"：Plan → IR → 确定性执行。',
    score: 4.8,
    dimensions: { architecture: 7, code: 4, testCI: 2, docs: 4, ecosystem: 1, radical: 9 },
    quote: '思想 > 代码。',
    highlights: ['主张 agent 栈缺"编译层"：Route Plan → IR → 确定性执行器', '语义哈希签名'],
    weaknesses: ['实现单薄', '仅概念验证'],
  },
  {
    slug: 'atlas',
    name: 'Atlas',
    tier: 'D',
    rank: 16,
    maintainer: '个人',
    maintainerType: '个人',
    language: 'Python',
    license: '—',
    stars: '5',
    starValue: 5,
    status: '已封存',
    tagline: '内稳态驱力 + "做梦"蒸馏记忆。',
    score: 4.6,
    dimensions: { architecture: 6, code: 4, testCI: 2, docs: 3, ecosystem: 1, radical: 10 },
    quote: '原创性极高，两周封盘。',
    highlights: ['疲劳/好奇心内稳态驱力', '"做梦"机制：蒸馏情景记忆为语义规则'],
    weaknesses: ['两周即封存', '无后续维护'],
  },
  {
    slug: 'micro-agent',
    name: 'micro-agent',
    tier: 'D',
    rank: 17,
    maintainer: 'BuilderIO',
    maintainerType: '小团队',
    language: 'TypeScript',
    license: '—',
    stars: '4.3k',
    starValue: 4300,
    status: '已停更',
    tagline: '测试驱动代码生成 CLI，思路超前于 coding agent 热潮。',
    score: 4.2,
    dimensions: { architecture: 5, code: 5, testCI: 4, docs: 5, ecosystem: 4, radical: 5 },
    quote: '被时代甩下的先驱。',
    highlights: ['测试驱动代码生成 CLI，思路超前于 coding agent 热潮'],
    weaknesses: ['2024-11 后无提交', '能力被新一代 coding agent 全面覆盖'],
  },
]

/**
 * 展示层只读取这一份派生结果：手填的旧分数/层级不会覆盖公开公式。
 * 同分时保留 slug 稳定排序，避免展示顺序因运行环境而漂移。
 */
export const projects: Project[] = rawProjects
  .map((project) => {
    const audit = auditForFramework(project.slug)
    return {
      ...project,
      score: scoreFramework(project.dimensions),
      tier: classifyFramework(project.dimensions, audit),
      audit,
    }
  })
  .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug))
  .map((project, index) => ({ ...project, rank: index + 1 }))

export const tierGroups: { tier: Tier; items: Project[] }[] = TIER_ORDER.map((tier) => ({
  tier,
  items: projects.filter((p) => p.tier === tier),
}))

export const REVIEW_QUOTES: { text: string; source: string }[] = [
  { text: '小作坊下料猛的最强证据。', source: '评 Chidori' },
  { text: '下料猛，火候差。', source: '评 swarms' },
  { text: '星数与思想密度不相关。', source: '评审注' },
  { text: 'Turn(10★) 比 swarms(7k★) 激进一个数量级。', source: '评审注' },
]
