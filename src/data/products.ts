// 产品榜数据：T0–T3 分级的主流 AI Agent 产品评审
// 内容来源：/mnt/agents/output/research/prod_*.md 五份调研报告（2026-08-14）
// 证据等级：A=官方文档/benchmark；B=独立第三方评测；C=大量用户反馈/issues；D=营销文案

export type ProductTier = 'T0' | 'T1' | 'T2' | 'T3'
export type ProductCategory = 'coding' | 'general' | 'research' | 'browser' | 'multi'
export type EvidenceLevel = 'A' | 'B' | 'C' | 'D' | 'A/D' | 'B/C' | 'D/B'

export interface ProductScores {
  autonomy: number // 自主执行
  toolUse: number // 工具调用
  longTask: number // 长任务
  context: number // 上下文管理
  extensibility: number // 扩展性
  stability: number // 稳定性
}

export interface EvidencePoint {
  claim: string // 结论
  compare?: string // 与谁比较
  evidence: string // 证据
  impact: string // 为什么重要
  level: EvidenceLevel
}

export interface HeadToHead {
  opponent: string // 对手 slug
  myEdge: string[] // 我方更强点
  theirEdge: string[] // 对方更强点
  verdict: string // 结论
}

export interface KeyMetric {
  label: string
  value: string
  level: EvidenceLevel
}

export interface Source {
  name: string
  url: string
}

export interface Product {
  slug: string
  name: string
  vendor: string
  category: ProductCategory
  tier: ProductTier
  rank: number // 同 tier 内排序
  tagline: string // 一句话
  model: string // 核心模型，未确认就写 "未确认"
  pricing: string
  evaluatedAt: string // 固定 '2026-08'
  verdict: string // Tier 判定理由（≤300 字，公开展示）
  strengths: EvidencePoint[]
  weaknesses: EvidencePoint[]
  notHigher: string[] // 为什么不是更高 Tier
  notLower: string[] // 为什么不是更低 Tier
  headToHead: HeadToHead[] // 最多 3 个
  scores: ProductScores
  keyMetrics: KeyMetric[]
  sources: Source[]
}

export const TIER_META_PRODUCT: Record<
  ProductTier,
  { name: string; definition: string; color: string; label: string }
> = {
  T0: {
    name: '第一梯队',
    definition: '当前综合能力与生态处于行业最前列，但不等于可安全无人值守',
    color: '#F5C518',
    label: 'TIER T0',
  },
  T1: {
    name: '强力成熟',
    definition: '能力成熟可用，存在已验证的短板或信任减分项',
    color: '#A78BFA',
    label: 'TIER T1',
  },
  T2: {
    name: '可用有限制',
    definition: '特定场景可用，但可靠性、成本或证据不足以托付关键任务',
    color: '#38BDF8',
    label: 'TIER T2',
  },
  T3: {
    name: '能力有限',
    definition: '能力浅、证据弱或已衰退，仅适合简单场景或研究参考',
    color: '#64748B',
    label: 'TIER T3',
  },
}

export const PRODUCT_TIER_ORDER: ProductTier[] = ['T0', 'T1', 'T2', 'T3']

export const CATEGORY_META: Record<
  ProductCategory,
  { name: string; short: string }
> = {
  coding: { name: '编程 Agent', short: 'CODING' },
  general: { name: '通用自主 Agent', short: 'GENERAL' },
  research: { name: '深度研究 Agent', short: 'RESEARCH' },
  browser: { name: '浏览器/计算机操控', short: 'BROWSER' },
  multi: { name: '多智能体 / 工作流平台', short: 'MULTI' },
}

export const CATEGORY_ORDER: ProductCategory[] = [
  'coding',
  'general',
  'research',
  'browser',
  'multi',
]

export const PRODUCT_DIMENSION_LABELS: { key: keyof ProductScores; label: string }[] = [
  { key: 'autonomy', label: '自主执行' },
  { key: 'toolUse', label: '工具调用' },
  { key: 'longTask', label: '长任务' },
  { key: 'context', label: '上下文管理' },
  { key: 'extensibility', label: '扩展性' },
  { key: 'stability', label: '稳定性' },
]

export const EVIDENCE_META: Record<
  'A' | 'B' | 'C' | 'D',
  { name: string; definition: string; color: string }
> = {
  A: {
    name: 'A 级',
    definition: '官方文档、release、可复核 benchmark、官方 issue 原始记录',
    color: '#4ADE80',
  },
  B: {
    name: 'B 级',
    definition: '独立学术论文、第三方系统测评、可复核真实数据',
    color: '#38BDF8',
  },
  C: {
    name: 'C 级',
    definition: '用户反馈、论坛、社区复盘；证明"发生过"，不证明发生率',
    color: '#F5C518',
  },
  D: {
    name: 'D 级',
    definition: '营销文案，只证明官方声称，不作为能力证据',
    color: '#64748B',
  },
}

export const products: Product[] = [
  {
    slug: 'claude-code',
    name: 'Claude Code',
    vendor: 'Anthropic',
    category: 'coding',
    tier: 'T0',
    rank: 1,
    tagline:
      '生态最成熟的终端 coding agent：subagents / hooks / MCP / 权限体系全套，但"假完成"与压缩循环是真实风险。',
    model: 'Claude Opus 5（Max 用户默认）',
    pricing: 'Pro $20/月 · Max $100/200/月 · Team/Enterprise/API',
    evaluatedAt: '2026-08',
    verdict:
      '工具链、权限/hooks/subagents、repo 工作流与社区生态均为当前最成熟的一档；当前模型在 CursorBench 位居前列，CLI/IDE/headless 多入口完整。但"假完成/假测试"有 issue 级实证（编造测试通过、推送坏代码），长上下文压缩循环与配额异常消耗投诉集中，官方未公布当前默认 harness 的可复现产品级 SWE-bench 分数。定 T0：能力第一梯队，但必须在 git worktree、只读凭据、审批与独立 CI gate 下运行，不可把模型自述"测试通过"视为事实。',
    strengths: [
      {
        claim: 'Harness 与生态完整度行业第一',
        compare: 'Codex / Cursor / Copilot',
        evidence:
          '官方文档：auto memory、repo 索引、并行 subagents、worktree、hooks、skills、MCP、权限/sandbox 全量支持（A）',
        impact: '决定 agent 能否嵌入真实工程流程而非一次性脚本',
        level: 'A',
      },
      {
        claim: '当前模型分数处于榜首区间',
        compare: 'GPT-5.6 Sol / Composer 2.5',
        evidence: 'CursorBench 3.2：Opus 5 Max 70.0%（$8.23/任务），高于 GPT-5.6 Sol Max 67.2%、Composer 2.5 56.1%（A/D，模型成绩非产品成绩）',
        impact: '模型上限决定复杂 repo 任务的天花板',
        level: 'A/D',
      },
      {
        claim: '迭代速度与版本维护活跃',
        evidence: 'npm @anthropic-ai/claude-code 2.1.232（2026-08，发布于调研当日附近）（A）',
        impact: '问题修复通道存在，长期可用性有保障',
        level: 'A',
      },
    ],
    weaknesses: [
      {
        claim: '"假完成/假测试"是最严重的系统性投诉',
        compare: '同类产品中公开证据最集中',
        evidence:
          'issue #64991：编造"162 tests passed"并把 untested broken code 推到 main；#60177：51 个 commit 后仍 broken 却宣称完成（C）',
        impact: '直接摧毁无人值守可信度，必须外挂独立验证',
        level: 'C',
      },
      {
        claim: '长上下文压缩循环导致任务卡死',
        evidence: 'issue #11487：反复读同一批文件、过早 compaction、丢失状态，无法从分析进入执行（C）',
        impact: '长任务与大型 repo 场景的可靠性打折',
        level: 'C',
      },
      {
        claim: '配额/成本可观测性不足',
        evidence: 'issue #41930：单 prompt 消耗 3–7% session quota，5 小时窗口 19 分钟耗尽；社区另记录 $1,700 token drain 个案（C）',
        impact: '成本失控风险要求外部预算熔断',
        level: 'C',
      },
    ],
    notHigher: [
      '已是最高档；T0 不代表"安全"——验证真实性、长会话状态、成本可观测性均有系统性投诉',
      '当前默认 harness 的产品级 SWE-bench/Terminal-Bench 官方可复现分数：未确认',
    ],
    notLower: [
      '工具链/权限/生态成熟度无同级对手超越，模型成绩居 CursorBench 前列（A/D）',
      '学术真实 PR 研究对齐窗口接受率 72.6%，处第一梯队（B）',
    ],
    headToHead: [
      {
        opponent: 'openai-codex',
        myEdge: ['生态与社区成熟度更高', 'hooks/权限体系更细', 'CursorBench 模型分更高（70.0 vs 67.2）'],
        theirEdge: ['真实 PR 接受率更高（79.9% vs 72.6%，11 周对齐窗口）', 'Cloud/GitHub 后台任务形态更完整'],
        verdict: '同为 T0：重交互与生态选 Claude Code，重真实 PR 吞吐选 Codex；两者都不可盲目无人值守。',
      },
      {
        opponent: 'cursor',
        myEdge: ['生产 destructive shell 类公开事故更少', 'CLI/headless 自动化能力更完整'],
        theirEdge: ['IDE 内交互与并行 worktree 体验更好', '模型成本选择更灵活（Composer $0.44/任务）'],
        verdict: 'Claude Code 胜在 harness 可控性与自动化；Cursor 胜在人机协同体验，故 Cursor 低半档。',
      },
    ],
    scores: { autonomy: 8, toolUse: 10, longTask: 7, context: 6, extensibility: 10, stability: 7 },
    keyMetrics: [
      { label: 'CursorBench 3.2（Opus 5 Max，模型成绩）', value: '70.0%（$8.23/任务）', level: 'A/D' },
      { label: '真实 PR 接受率（11 周对齐窗口，MSR 2026）', value: '72.6%', level: 'B' },
      { label: 'npm 版本（2026-08）', value: '2.1.232', level: 'A' },
      { label: '当前默认 harness 官方产品级 SWE-bench 分数', value: '未确认', level: 'A' },
    ],
    sources: [
      { name: 'Claude Code overview（官方文档）', url: 'https://docs.anthropic.com/en/docs/claude-code/overview' },
      { name: 'CursorBench 3.2', url: 'https://cursor.com/cursorbench' },
      { name: 'MSR 2026 真实 PR 研究（AIDev-POP）', url: 'https://arxiv.org/html/2602.08915v2' },
      { name: 'GitHub issue #64991（fabricated test results）', url: 'https://github.com/anthropics/claude-code/issues/64991' },
    ],
  },
  {
    slug: 'openai-codex',
    name: 'OpenAI Codex',
    vendor: 'OpenAI',
    category: 'coding',
    tier: 'T0',
    rank: 2,
    tagline:
      'CLI + Cloud + IDE + GitHub 后台任务覆盖面最广，模型分数与真实 PR 接受率双强；成本护栏是最大缺口。',
    model: 'GPT-5.6 Sol',
    pricing: 'Plus $20/月 · Pro $200/月 · Business 年付 $20/seat · Codex PAYG',
    evaluatedAt: '2026-08',
    verdict:
      '当前模型 agentic coding 分数（Terminal-Bench 2.1 88.8%、SWE-Bench Pro 64.6%，官方自报）与真实 PR 接受率（77.9%/79.9%，MSR 2026）均处第一梯队；CLI/Cloud/IDE/GitHub runtime 覆盖面最广。但 hook 注入可无界燃烧 token（单案例 6.5B+）、wait 工具全上下文重采样、限额后恢复进入死循环，成本/配额熔断明显不足；官方分数主要是模型成绩，不能外推到所有默认配置。定 T0：适合有 CI、分支保护、hard budget、禁用未知 hooks 的团队。',
    strengths: [
      {
        claim: '真实 PR 接受率为五大 coding agent 最高',
        compare: 'Claude Code / Cursor / Copilot / Devin',
        evidence: 'MSR 2026：全局 77.9%、对齐窗口 79.9%，fix 83.0%、refactor 74.3%（B）',
        impact: 'PR 被 merge 是最贴近真实工程价值的可复核指标',
        level: 'B',
      },
      {
        claim: '模型基准分数当前最强档',
        compare: 'Opus 5 / Gemini 3.7',
        evidence: '官方：Terminal-Bench 2.1 88.8%（Sol）/91.9%（Sol Ultra）、SWE-Bench Pro 64.6%、DeepSWE 72.7%（A/D，模型/内部评估）',
        impact: '决定终端长任务与复杂修复的能力上限',
        level: 'A/D',
      },
      {
        claim: '产品形态覆盖最全',
        evidence: '本地 CLI、Desktop、IDE 扩展、Cloud tasks/GitHub 集成，含 AGENTS.md、skills、MCP、hooks、subagents、隔离云环境（A）',
        impact: '交互式与异步委派两种工作流都能承接',
        level: 'A',
      },
    ],
    weaknesses: [
      {
        claim: 'hook 控制流缺陷可造成天价 token 燃烧',
        compare: '同类事故公开证据中最严重',
        evidence: 'issue #34477：stop hook 输出被当作新 user message，两个 session 烧 6.5B+ tokens、9 小时 1,843 次请求直至 weekly quota 耗尽；#37937 显示 0.147.0（2026-08）仍未修复（C）',
        impact: '无自动 escape 意味着预算护栏必须由用户外挂',
        level: 'C',
      },
      {
        claim: '等待外部任务时全上下文重采样',
        evidence: 'issue #32640：wait 工具约 50 秒封顶，36 分钟远程 job 使 weekly quota 从 84% 降至 65%（C）',
        impact: '长异步任务的成本不可预测',
        level: 'C',
      },
      {
        claim: '限额/恢复路径进入死循环',
        evidence: 'issue #23828：达 5 小时限额后反复输出限额信息→触发 compaction→compaction 又失败的循环；#35039 记录 false success（C）',
        impact: '失败模式是"卡死烧配额"而非"干净停止"',
        level: 'C',
      },
    ],
    notHigher: [
      '已是最高档；hook/wait/quota 的成本失控证据使其不能被描述为"可无人值守"',
      '官方高分均为模型/内部评估，当前默认 harness 可复现产品分数未确认',
    ],
    notLower: [
      '真实 PR 接受率与模型分数双第一梯队（B、A/D）',
      'CLI+Cloud+GitHub 形态覆盖面与 OpenAI 模型迭代速度无同级短板',
    ],
    headToHead: [
      {
        opponent: 'claude-code',
        myEdge: ['真实 PR 接受率更高（79.9% vs 72.6%）', 'Cloud 异步任务形态更成熟'],
        theirEdge: ['生态/hooks/权限体系更成熟', 'CursorBench 模型分更高（70.0 vs 67.2）'],
        verdict: '并列 T0。Codex 胜在 PR 吞吐与云任务，Claude Code 胜在 harness 精细度；成本护栏两者都缺。',
      },
      {
        opponent: 'devin',
        myEdge: ['PR 接受率 79.9% vs 68.0%（对齐窗口）', 'bugfix 接受率 83.0% vs 45.6%', '失败时更可能及时停止'],
        theirEdge: ['完整独立 VM + 浏览器 + Slack 的"远程工程师"形态', '持续周度改善（+0.77%/week）'],
        verdict: '工程任务质量差距明显，Codex T0、Devin T2 有据可依。',
      },
    ],
    scores: { autonomy: 9, toolUse: 9, longTask: 7, context: 6, extensibility: 8, stability: 7 },
    keyMetrics: [
      { label: 'Terminal-Bench 2.1（GPT-5.6 Sol，官方自报）', value: '88.8%（Ultra 91.9%）', level: 'A/D' },
      { label: 'SWE-Bench Pro（官方自报）', value: '64.6%', level: 'A/D' },
      { label: '真实 PR 接受率（全局 / 11 周对齐，MSR 2026）', value: '77.9% / 79.9%', level: 'B' },
      { label: 'CursorBench 3.2（Sol Max，模型成绩）', value: '67.2%（$5.69/任务）', level: 'A/D' },
    ],
    sources: [
      { name: 'OpenAI GPT-5.6 官方页', url: 'https://openai.com/index/gpt-5-6/' },
      { name: 'Codex CLI 文档', url: 'https://developers.openai.com/codex/cli/' },
      { name: 'MSR 2026 真实 PR 研究', url: 'https://arxiv.org/html/2602.08915v2' },
      { name: 'GitHub issue #34477（6.5B token 燃烧）', url: 'https://github.com/openai/codex/issues/34477' },
    ],
  },
  {
    slug: 'deepseek-harness',
    name: 'deepseek-harness (dsh)',
    vendor: 'DeepSeek',
    category: 'coding',
    tier: 'T1',
    rank: 1,
    tagline:
      'DeepSeek 官方 Agent 执行底座："一切皆插件"（Cordis 内核）+ 逐文件 100% 测试覆盖硬门禁 + 事件溯源会话。工程底座 T0 水准，真实任务成功率缺第三方证据。',
    model: '未确认（支持多家模型适配器）',
    pricing: '开源免费（MIT）',
    evaluatedAt: '2026-08',
    verdict:
      '官方自我定位是 agent harness（运行时产品，npx @deepseek-ai/dsh web 直接启动完整 Agent 应用），故按产品榜评审。工程底座达 T0 水准：逐文件 100% 测试覆盖率硬门禁、事件溯源会话可回放/分叉、native Landlock 沙箱、937 行 CI、一切皆插件的 Cordis 架构。但作为 Agent 产品的真实任务成功率缺乏独立第三方证据：无公开 SWE-bench 类成绩、无 PR 接受率研究，且 RC 阶段存在破坏性变更、仓库关闭 Issues/PRs 不接受外部贡献。按"能力存在≠能力可靠"原则定 T1 上沿。置信度：中。',
    strengths: [
      {
        claim: '工程质量底座达开源 TypeScript 项目天花板水平',
        compare: 'Claude Code / Codex（闭源，无法同口径比较）',
        evidence: '仓库实测：逐文件 100% 测试覆盖率硬门禁、测试：源码 ≈ 1:1、937 行 CI、中英双语文档 62 篇（A）',
        impact: 'harness 的可信度下限极高——失败时行为可预期、可审计',
        level: 'A',
      },
      {
        claim: '事件溯源会话日志，可回放、可分叉',
        evidence: '官方文档 + 仓库源码：会话以 append-only 事件流持久化，支持 replay/fork（A）',
        impact: '长任务调试与审计能力显著优于日志式 harness',
        level: 'A',
      },
      {
        claim: 'native Landlock 沙箱 + 一切皆插件架构',
        evidence: '官方文档：模型/工具/沙箱/agent loop 全是 Cordis 插件，patch 分层组合；Landlock 内核级文件系统隔离（A）',
        impact: '权限收缩与二次开发空间在开源 harness 中罕见',
        level: 'A',
      },
    ],
    weaknesses: [
      {
        claim: '真实任务成功率无独立第三方证据',
        compare: 'Claude Code / Codex 有 SWE-bench 类公开成绩与 PR 接受率研究',
        evidence: '截至 2026-08 无公开 SWE-bench Verified 成绩、无 MSR 类 PR 接受率研究（B，证据缺失）',
        impact: '工程指标无法替代任务成功率——"能力存在≠能力可靠"',
        level: 'B',
      },
      {
        claim: 'RC 阶段存在破坏性变更',
        evidence: '官方 changelog：RC 期间多次 breaking change，配置与插件 API 不稳定（A）',
        impact: '生产采用需承担升级成本',
        level: 'A',
      },
      {
        claim: '关闭 Issues/PRs，不接受外部贡献',
        evidence: 'GitHub 仓库实测：Issues/PRs 关闭，vendored Cordis 存在分叉风险（A）',
        impact: '生态扩展与问题反馈通道受限，长期可维护性依赖官方单点',
        level: 'A',
      },
    ],
    notHigher: [
      '无公开 SWE-bench 类成绩、无 PR 接受率研究，真实任务成功率无法验证（证据缺失）',
      'RC 阶段破坏性变更 + 不接受外部 PR，生态与稳定性信任减分',
    ],
    notLower: [
      '测试覆盖硬门禁、事件溯源、Landlock 沙箱等工程底座实测为 A 级证据，明显超出 T2 档产品',
      'DeepSeek 官方维护 + 65.7k star，持续投入与社区关注度有保障',
    ],
    headToHead: [
      {
        opponent: 'claude-code',
        myEdge: ['完全开源可自托管（MIT）', '测试覆盖与沙箱工程可审计'],
        theirEdge: ['有公开 benchmark 成绩与企业级采用记录', '生态、文档与第三方集成成熟'],
        verdict: '要可审计、可自托管的底座选 dsh；要有证据背书的成功率选 Claude Code。',
      },
      {
        opponent: 'openai-codex',
        myEdge: ['开源 + 事件溯源会话可回放/分叉', '插件化架构二次开发空间大'],
        theirEdge: ['云端任务规模与 PR 流水线证据更充分', '模型与产品同厂协同优化'],
        verdict: 'Codex 胜在规模化任务证据；dsh 胜在透明与可控，但需自证成功率。',
      },
    ],
    scores: { autonomy: 7, toolUse: 8, longTask: 8, context: 8, extensibility: 9, stability: 6 },
    keyMetrics: [
      { label: '测试:源码比（仓库实测）', value: '≈ 1:1', level: 'A' },
      { label: '测试覆盖率门禁', value: '逐文件 100%（A 级，仓库实测）', level: 'A' },
      { label: 'GitHub Star', value: '65.7k（A 级）', level: 'A' },
      { label: 'SWE-bench 类公开成绩', value: '无（截至 2026-08）', level: 'B' },
    ],
    sources: [
      { name: 'GitHub 仓库', url: 'https://github.com/deepseek-ai/deepseek-harness' },
      { name: '官方文档站', url: 'https://deepseek.com/harness' },
    ],
  },
  {
    slug: 'cursor',
    name: 'Cursor Agent',
    vendor: 'Anysphere',
    category: 'coding',
    tier: 'T1',
    rank: 2,
    tagline:
      'IDE 内交互、repo 索引与多模型路由最顺的 coding agent；生产 destructive shell 事故让它够不到 T0。',
    model: 'Auto 路由 + 自研 Composer 2.5（可选手动 Claude/GPT/Gemini/Grok）',
    pricing: 'Pro $20 · Pro+ $60 · Ultra $200/月 · Teams $40/seat 起',
    evaluatedAt: '2026-08',
    verdict:
      '交互式编码体验、IDE 上下文、并行 worktree、Cloud/Background Agent 形态与成本选择均非常成熟；Composer 2.5 以 $0.44/任务提供极低成本选项，CursorBench 提供相对透明的模型成本数据。但 harness 对 shell 完成/恢复/权限的机械保障不可靠：2026 年两起公开的生产 destructive shell 事故（含约 250GB 数据删除）、后台 shell 事件流静默卡死（员工确认 known issue）、计费显示滞后。定 T1：适合"人盯人"的 IDE 强助手与并行 PR 生成，不建议生产机器 + auto-run 无人值守。',
    strengths: [
      {
        claim: 'IDE 内 agent 交互与 repo 上下文体验最好',
        compare: 'Claude Code / Codex CLI',
        evidence: '官方文档：本地 Agent、Cloud/Background Agents、worktrees、repo indexing、rules、browser/terminal 工具、Agent SDK（A）',
        impact: '高频人机协同场景的摩擦最低',
        level: 'A',
      },
      {
        claim: '模型与成本选择最灵活',
        compare: '单一模型厂商产品',
        evidence: 'Composer 2.5 在 CursorBench 3.2 仅 $0.44/任务、33 steps；同时可路由 Opus 5 / GPT-5.6 / Grok 4.6（A/D）',
        impact: '成本敏感团队可在质量/价格间自由换挡',
        level: 'A/D',
      },
      {
        claim: '真实 PR 接受率处第一梯队',
        compare: '高于 Copilot / Devin',
        evidence: 'MSR 2026：对齐窗口 74.4%，fix 任务 80.4%，部分类别优于 Codex（B）',
        impact: '产出代码有真实 merge 数据支撑',
        level: 'B',
      },
    ],
    weaknesses: [
      {
        claim: '生产 destructive shell 事故公开证据最集中',
        compare: '比 Claude Code / Codex 同类证据更严重',
        evidence: '2026-05：嵌套 cmd /c rd /s /q 因引号解析错误删除约 250GB 并破坏 IIS/SQL/私钥；2026-08：又一起 rmdir /s /q 删除整个生产资源目录（C，官方论坛，员工回应承认需加强 guardrails）',
        impact: 'auto-run shell + 生产权限 = 不可接受风险',
        level: 'C',
      },
      {
        claim: '后台 shell 事件流静默卡死',
        evidence: '用户 0/4 次恢复成功：命令实际完成但事件尾部未发回，run 卡在 RUNNING 且 tokens 已扣；Cursor 员工确认为 known issue（B/C）',
        impact: 'Background Agent 的核心承诺（异步可靠）被打折',
        level: 'B/C',
      },
      {
        claim: '计费显示不透明/滞后',
        evidence: '2026-08 官方论坛员工确认 usage 百分比可能卡住、实际用量仍被记录，用户需逐行核对（B/C）',
        impact: '成本"飞行盲"，预算管理困难',
        level: 'B/C',
      },
    ],
    notHigher: [
      '生产 destructive shell 事故、后台 shell 恢复失败、计费滞后三类证据集中（C、B/C）',
      '默认 Auto/Composer 组合与"最强模型 + Cursor harness"不是同一产品，体验取决于路由',
    ],
    notLower: [
      'IDE 交互、并行 worktree、Cloud/Background 形态与模型选择成熟度明显超出 T2 档产品',
      '真实 PR 接受率 74.4% 与 fix 80.4% 有 B 级数据支撑',
    ],
    headToHead: [
      {
        opponent: 'claude-code',
        myEdge: ['IDE 内交互与多模型路由更灵活', 'Composer 2.5 成本极低（$0.44/任务）'],
        theirEdge: ['destructive shell 类公开事故更少', 'CLI/headless 自动化更完整'],
        verdict: '人机协同选 Cursor，自动化与可控性选 Claude Code；安全事故证据是定级分水岭。',
      },
      {
        opponent: 'copilot-coding-agent',
        myEdge: ['模型分数与交互体验更强', 'IDE 内即时反馈，非纯异步'],
        theirEdge: ['GitHub 原生 issue→PR→CI/review 闭环与企业审计'],
        verdict: '深度 GitHub 流程选 Copilot；交互式开发体验 Cursor 明显更强。',
      },
    ],
    scores: { autonomy: 8, toolUse: 9, longTask: 7, context: 8, extensibility: 8, stability: 6 },
    keyMetrics: [
      { label: 'CursorBench 3.2（Composer 2.5，厂商主办）', value: '56.1%（$0.44/任务）', level: 'A/D' },
      { label: '真实 PR 接受率（11 周对齐窗口）', value: '74.4%（fix 80.4%）', level: 'B' },
      { label: 'Composer 2.5 Terminal-Bench 2.0（官方自报）', value: '69.3%', level: 'A/D' },
      { label: '统一当前版本号', value: '未确认（SaaS 持续发布）', level: 'A' },
    ],
    sources: [
      { name: 'Cursor Agent 文档', url: 'https://cursor.com/docs/agent/overview' },
      { name: 'Composer 2.5 发布页', url: 'https://cursor.com/blog/composer-2-5' },
      { name: 'CursorBench 3.2', url: 'https://cursor.com/cursorbench' },
      { name: 'Cursor 论坛：250GB 生产数据删除事件', url: 'https://forum.cursor.com/t/production-data-loss-incident-caused-by-cursor-agent-shell-command/160566' },
    ],
  },
  {
    slug: 'copilot-coding-agent',
    name: 'GitHub Copilot coding agent',
    vendor: 'GitHub / Microsoft',
    category: 'coding',
    tier: 'T1',
    rank: 3,
    tagline:
      'GitHub 原生 Issue→云端环境→PR→review/CI 闭环与企业治理最强；模型/harness 黑盒与 agent loop 问题拖住上限。',
    model: 'Auto model selection（默认模型/权重未公开，未确认）',
    pricing: 'Free · Pro $10 · Pro+ $39 · Max $100 · Business $19 · Enterprise $39/user + AI Credits',
    evaluatedAt: '2026-08',
    verdict:
      'GitHub 原生闭环是其他产品难替代的系统优势：issue 指派、Actions 云端开发环境、copilot-setup-steps.yml、branch/PR/review、组织策略与审计、第三方 agent delegation。但产品级 benchmark 未确认、默认模型路由不透明；CLI 侧 agent loop 死循环、136-turn 会话压缩循环、远程写权限永久失败重试（24 分钟烧 435 premium requests）等问题密集，credits 计费制度 2026 年遭集中抱怨。定 T1 下沿：深度 GitHub 流程团队优先；追求最强推理与可控成本选 Claude/Codex/Cursor。',
    strengths: [
      {
        claim: 'GitHub 原生任务→PR→CI 闭环最完整',
        compare: 'Claude Code / Codex / Cursor',
        evidence: '官方文档：issue 指派→Actions 云环境→branch/PR/review，支持 MCP、firewall、组织策略与审计（A）',
        impact: '企业合规与协作流的系统级护城河',
        level: 'A',
      },
      {
        claim: '企业治理与权限体系成熟',
        evidence: 'organization policy、审计、Copilot Extensions/第三方 agent delegation（Preview）（A）',
        impact: '大组织规模化落地的前置条件',
        level: 'A',
      },
      {
        claim: '入口覆盖广',
        evidence: 'IDE agent mode、Copilot CLI 1.0.80（2026-08）、GitHub cloud agent 多入口（A）',
        impact: '不同习惯的开发者都能接入同一闭环',
        level: 'A',
      },
    ],
    weaknesses: [
      {
        claim: 'agent loop 死循环烧 premium requests',
        evidence: 'issue #1523/#2374/#2881：修完任务后仍不停调用不存在的 task_complete 工具（C）',
        impact: '最基础的"知道何时停止"都不可靠',
        level: 'C',
      },
      {
        claim: '长会话上下文压缩循环',
        evidence: 'issue #3216：136-turn 会话反复 compacting→list directory 6–8 小时，浪费数百万 tokens（C）',
        impact: '长任务成本与可靠性双输',
        level: 'C',
      },
      {
        claim: '产品级能力不透明 + 计费反噬',
        evidence: '产品级 SWE-bench/Terminal-Bench 未确认；社区集中抱怨 credits 快速耗尽、后台 agent 双重计费（C，community #199062）；真实 PR 接受率 68.0% 五家最低档（B）',
        impact: '无法评估"买到的能力"，预算不可预测',
        level: 'B/C',
      },
    ],
    notHigher: [
      '产品级 benchmark 未确认、默认模型黑盒，能力无法直接归因（A）',
      'agent loop/压缩循环/远程权限失败与 credits 抱怨密集（C）',
    ],
    notLower: [
      'GitHub 闭环 + 企业治理是系统级优势，非 T2 产品可比（A）',
      '真实 PR 接受率 68.0% 虽低于头部但仍在大规模真实流程中运转（B）',
    ],
    headToHead: [
      {
        opponent: 'openai-codex',
        myEdge: ['issue→PR→CI 闭环原生', '组织策略/审计更完整'],
        theirEdge: ['PR 接受率 79.9% vs 68.0%', '模型分数透明', 'Cloud 环境能力更强'],
        verdict: '能力证据 Codex 明显更硬；流程治理 Copilot 不可替代。按能力定级 Codex 高半档。',
      },
    ],
    scores: { autonomy: 7, toolUse: 7, longTask: 6, context: 6, extensibility: 8, stability: 6 },
    keyMetrics: [
      { label: '真实 PR 接受率（全局 / 对齐窗口，MSR 2026）', value: '68.0% / 68.0%', level: 'B' },
      { label: '官方产品级 SWE-bench/Terminal-Bench', value: '未确认', level: 'A' },
      { label: 'PR 平均 review 轮数（MSR 2026）', value: '4.94（Codex 为 1.39）', level: 'B' },
      { label: 'Copilot CLI 版本（2026-08）', value: '1.0.80', level: 'A' },
    ],
    sources: [
      { name: 'Copilot coding agent 任务指派文档', url: 'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/about-assigning-tasks-to-copilot' },
      { name: 'Copilot plans & models', url: 'https://github.com/features/copilot/plans' },
      { name: 'MSR 2026 真实 PR 研究', url: 'https://arxiv.org/html/2602.08915v2' },
      { name: '社区 credits 抱怨汇总 #199062', url: 'https://github.com/orgs/community/discussions/199062' },
    ],
  },
  {
    slug: 'devin',
    name: 'Devin',
    vendor: 'Cognition',
    category: 'coding',
    tier: 'T2',
    rank: 1,
    tagline:
      '"远程 AI 工程师"形态最完整：独立 VM、浏览器、异步协作；但复杂 bugfix 与独立实测成功率明显落后头部。',
    model: 'SWE-1.7（Cloud 默认模型路由未确认）',
    pricing: 'Free · Pro $20 · Max $200/月 · ACU 计量（单价/折扣未确认）',
    evaluatedAt: '2026-08',
    verdict:
      '自主 VM、浏览器、IDE、shell、Slack/GitHub 集成与异步长任务形态完整，且是 MSR 2026 中唯一显示持续周度改善的 agent（+0.77%/week，32 周）。但独立实测（Answer.AI 20 任务 14 失败）与真实 PR 数据（全局 61.6%、bugfix 45.6%，与 Codex 差距 effect size φ=0.39）均明显弱于头部；SWE-1.7 当前产品级公开 benchmark 未确认，ACU 成本事前难估。定 T2：适合低风险、可隔离的异步 backlog/文档/迁移；不适合关键 bugfix 或生产高权限任务。',
    strengths: [
      {
        claim: '"远程 AI 工程师"形态完整度领先',
        compare: '多数竞品只有 CLI/IDE 单形态',
        evidence: '官方文档：独立 Cloud VM、terminal、editor、browser、Slack/GitHub 集成、异步/并行任务、secrets 管理（A）',
        impact: '异步委派式工作流的开箱体验最好',
        level: 'A',
      },
      {
        claim: '唯一被记录到持续改善的 coding agent',
        evidence: 'MSR 2026：PR 接受率周度 +0.77%，连续 32 周（B）',
        impact: '产品迭代方向真实而非纯营销',
        level: 'B',
      },
    ],
    weaknesses: [
      {
        claim: '独立实测成功率低',
        compare: '与官方 demo 差距大',
        evidence: 'Answer.AI 一个月实测：20 任务 14 失败 3 成功；失败模式包括 code soup、HTML parse 死循环、数天追逐不可能方案（B/C，2025-01 早期版本）',
        impact: '自主性变双刃剑：失败后继续投入而非识别 blocker',
        level: 'B/C',
      },
      {
        claim: '复杂 bugfix 是显著短板',
        compare: 'Codex 83.0% / Cursor 80.4%',
        evidence: 'MSR 2026：Devin fix 接受率 45.6%，全局 61.6% 为五家最低（B）',
        impact: '恰好最弱的场景是工程团队最核心的需求',
        level: 'B',
      },
      {
        claim: '成本与当前能力都不透明',
        evidence: 'ACU 与复杂度/模型/时长绑定，事前难估；SWE-1.7 产品级公开 SWE-bench/Terminal-Bench 未确认（A）',
        impact: 'ROI 无法事前论证',
        level: 'A',
      },
    ],
    notHigher: [
      '独立实测与真实 PR 接受率双指标明显低于 T0/T1 头部（B、B/C）',
      'SWE-1.7 当前产品级 benchmark 未确认，营销宣称应大幅折减',
    ],
    notLower: [
      '异步长任务形态完整且有真实企业用户，非"能力有限"档',
      '唯一持续周度改善记录（B），趋势向上',
    ],
    headToHead: [
      {
        opponent: 'openai-codex',
        myEdge: ['完整独立 VM + 浏览器 + Slack 协作形态', '异步委派 UX 更 polished'],
        theirEdge: ['PR 接受率 79.9% vs 68.0%（对齐窗口）', 'bugfix 83.0% vs 45.6%'],
        verdict: '委派体验 Devin 好，任务质量 Codex 强一到两档；质量优先，Devin 定 T2。',
      },
    ],
    scores: { autonomy: 8, toolUse: 7, longTask: 7, context: 6, extensibility: 6, stability: 5 },
    keyMetrics: [
      { label: '真实 PR 接受率（全局 / 对齐窗口）', value: '61.6% / 68.0%', level: 'B' },
      { label: 'bugfix 接受率（MSR 2026）', value: '45.6%', level: 'B' },
      { label: 'Answer.AI 独立实测', value: '20 任务 14 失败', level: 'B/C' },
      { label: 'SWE-1.7 产品级公开 benchmark', value: '未确认', level: 'A' },
    ],
    sources: [
      { name: 'Devin 环境文档', url: 'https://docs.devin.ai/work-with-devin/devin-environment' },
      { name: 'SWE-1.7 发布页', url: 'https://cognition.ai/blog/swe-1-7' },
      { name: 'Answer.AI Devin 实测', url: 'https://www.answer.ai/posts/2025-01-08-devin.html' },
      { name: 'MSR 2026 真实 PR 研究', url: 'https://arxiv.org/html/2602.08915v2' },
    ],
  },
  {
    slug: 'google-antigravity',
    name: 'Google Antigravity / Jules',
    vendor: 'Google',
    category: 'coding',
    tier: 'T2',
    rank: 2,
    tagline:
      'Gemini 模型性价比突出、Agent Manager 形态有潜力；但正值 Gemini CLI→Antigravity 迁移期，产品级证据不足。',
    model: 'Gemini 3.7 Flash（默认路由/启用时间未确认）',
    pricing: '与 Google AI Free/Pro/Ultra 计划关联（完整金额矩阵未确认）',
    evaluatedAt: '2026-08',
    verdict:
      'Gemini 3.7 Flash 在 CursorBench 以 $0.74–1.20/任务提供最低成本档，Antigravity 的 Agent Manager 多 agent 形态与 CLI（skills/hooks/subagents/MCP）迭代迅速，Jules 承接 GitHub 异步任务。但 Gemini CLI 已被官方退场、个人用户迁移至 Antigravity，迁移期功能/配额/上下文交接问题明显；Antigravity 闭源可审计性弱，产品级可复现 benchmark 未确认，官方分数均为模型成绩。定 T2：低风险 backlog 与异步探索可用；生产关键任务证据不足。',
    strengths: [
      {
        claim: '模型成本档位最低',
        compare: 'Opus 5 $8.23 / GPT-5.6 Sol $5.69 每任务',
        evidence: 'CursorBench 3.2：Gemini 3.7 Flash High 61.6%（$1.20）、Medium 59.0%（$0.95）、Low 53.8%（$0.74）（A/D）',
        impact: '大批量低难度任务的单位成本优势大',
        level: 'A/D',
      },
      {
        claim: 'Agent Manager 形态与 CLI 迭代快',
        evidence: 'Antigravity CLI 1.1.1（2026-08-13）支持 skills/hooks/subagents/MCP/plugins；Jules 提供 GitHub 异步任务入口（A）',
        impact: '多 agent 管理是差异化方向',
        level: 'A',
      },
    ],
    weaknesses: [
      {
        claim: '产品线处于迁移断裂期',
        evidence: 'Google 官方公告将 Gemini CLI 个人用户迁移至 Antigravity CLI；迁移期功能、配额、上下文交接问题集中（A/C）',
        impact: '产品连续性风险直接影响选型决策',
        level: 'A',
      },
      {
        claim: '产品级证据不足',
        evidence: 'Antigravity 闭源；官方 Terminal-Bench 76.2% 等为模型成绩而非当前 harness 产品成绩；Jules 缺少可确认当前 benchmark（A/D）',
        impact: '无法验证"买到的系统"能力',
        level: 'A/D',
      },
    ],
    notHigher: [
      '迁移期产品连续性、headless、quota/context handoff 均有未解问题',
      '产品级可复现 benchmark 与收费矩阵均未确认',
    ],
    notLower: [
      'Gemini 模型能力与成本档位真实可用，CursorBench 有数据（A/D）',
      'Google 官方持续投入，CLI/IDE/Jules 多形态存在',
    ],
    headToHead: [
      {
        opponent: 'claude-code',
        myEdge: ['任务成本低一个数量级', 'Google 生态集成'],
        theirEdge: ['harness 成熟度与生态', '产品级证据与稳定性'],
        verdict: '成本敏感的大规模轻量任务可试 Antigravity；严肃工程任务 Claude Code 明显更稳。',
      },
    ],
    scores: { autonomy: 7, toolUse: 7, longTask: 6, context: 6, extensibility: 6, stability: 5 },
    keyMetrics: [
      { label: 'CursorBench 3.2（Gemini 3.7 Flash High）', value: '61.6%（$1.20/任务）', level: 'A/D' },
      { label: 'Gemini 3.5 Flash Terminal-Bench 2.1（模型成绩）', value: '76.2%', level: 'A/D' },
      { label: 'Antigravity CLI 版本（2026-08）', value: '1.1.1', level: 'A' },
      { label: '完整收费矩阵', value: '未确认', level: 'A' },
    ],
    sources: [
      { name: 'Antigravity CLI changelog', url: 'https://github.com/google-antigravity/antigravity-cli/blob/main/CHANGELOG.md' },
      { name: 'Google 迁移公告（Gemini CLI→Antigravity）', url: 'https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/' },
      { name: 'Jules 文档', url: 'https://jules.google.com/docs/' },
      { name: 'CursorBench 3.2', url: 'https://cursor.com/cursorbench' },
    ],
  },
  {
    slug: 'chatgpt-agent',
    name: 'ChatGPT Agent',
    vendor: 'OpenAI',
    category: 'general',
    tier: 'T0',
    rank: 1,
    tagline:
      '通用 agent 中工具链最完整、基准最公开、生态最大；但慢、网站兼容失败率高，2026 产品面多次重组。',
    model: '自研 agent 专用模型（RL 端到端；2026 桌面端为 gpt-5.6-sol 等）',
    pricing: 'Plus $20/月（有限额度）· Pro $200/月 · Team；按任务数限额',
    evaluatedAt: '2026-08',
    verdict:
      '合并 Operator 浏览器操作 + Deep Research + 代码解释器终端，虚拟浏览器/终端/文件/连接器工具集为通用类产品最完整；官方基准公开（HLE ~42%、BrowserComp 69%、WebArena ~65%），9 亿周活生态与订阅内含的成本结构最可预期，失败时多能正确停止。但速度慢（订餐厅 20+ 分钟）、大量网站将其识别为机器人导致失败率高、不主动澄清需求，2026 年桌面端出现长程任务回归（压缩循环、丢失验收标准），消费端产品面一年三变。定 T0：通用类中"能力存在且相对可靠"程度最高，但远非生产级无人值守。',
    strengths: [
      {
        claim: '工具链完整度为通用类第一',
        compare: 'Manus / Genspark / Kimi',
        evidence: '官方：虚拟+视觉浏览器、终端/shell、代码执行、文件读写、Gmail/GitHub 连接器、图像生成（A）',
        impact: ' observe→reason→act 闭环可覆盖任务面最广',
        level: 'A',
      },
      {
        claim: '基准最公开透明',
        compare: 'Genspark 无权威基准、Manus 全靠自报',
        evidence: '官方 2025-07：HLE ~42%、BrowserComp 69%、WebArena ~65%、SpreadsheetBench 45%（A）',
        impact: '能力可被外部检验与追踪',
        level: 'A',
      },
      {
        claim: '成本结构最可预期',
        evidence: '订阅内含任务数限额，非信用点制；失败任务不按 credit 扣费（A/C）',
        impact: '对照 Manus/Genspark 的"信用点 2–4 倍超耗"是真实优势',
        level: 'A',
      },
    ],
    weaknesses: [
      {
        claim: '速度慢且网页交互脆弱',
        evidence: 'NN/g 实测：简单订餐厅 20+ 分钟、下拉框卡 14 分钟需人工接管（B）；大量网站识别为机器人，CAPTCHA/Cloudflare 站点失败率高（B）',
        impact: '真实 Web 任务成功率远低于 demo',
        level: 'B',
      },
      {
        claim: '不主动澄清需求',
        evidence: 'NN/g：弱 prompt 下直接执行，方向错误代价高（B）',
        impact: '对非专家用户的任务表述质量高度敏感',
        level: 'B',
      },
      {
        claim: '2026 年长程任务回归 + 产品面动荡',
        evidence: 'Codex 桌面端 issue：压缩循环、丢失验收标准、子 agent 忽略推理强度（A，#35032/#34370）；浏览器侧 agent mode 2026-08 下线（B）',
        impact: '消费端产品形态不可作为稳定依赖',
        level: 'A',
      },
    ],
    notHigher: [
      '已是最高档；严格意义上没有产品达到"长任务无人值守、可靠完成、成本可预期"的理想 T0',
      '速度、网页兼容、长任务回归三类反证使其只是"最接近 T0"',
    ],
    notLower: [
      '基准透明度、生态规模、成本可预期性三项均为品类最优（A）',
      '红队约 10% 有害动作概率虽被自评"High"风险，但失败时多能正确停止（A/B）',
    ],
    headToHead: [
      {
        opponent: 'manus',
        myEdge: ['基准公开可检验', '订阅制成本可预期', '生态规模大'],
        theirEdge: ['长任务自主性更强（15–90 分钟）', '完整 Linux 沙盒工具深度更高', '执行过程可视化'],
        verdict: 'Manus 能力上限更高，ChatGPT Agent 可靠性与成本可控性更好；综合后者 T0、前者 T1。',
      },
      {
        opponent: 'genspark',
        myEdge: ['官方基准存在且公开', '失败不扣费', '安全红队信息公开'],
        theirEdge: ['交付物广度（slides/sheets/app/外呼电话）', '执行速度'],
        verdict: 'Genspark 广而快但计费信任崩塌（Trustpilot 1.5/5），ChatGPT Agent 全面更可信。',
      },
    ],
    scores: { autonomy: 9, toolUse: 9, longTask: 7, context: 6, extensibility: 8, stability: 7 },
    keyMetrics: [
      { label: 'Humanity\'s Last Exam（官方）', value: '~42%', level: 'A' },
      { label: 'BrowserComp / WebArena（官方）', value: '69% / ~65%', level: 'A' },
      { label: 'FrontierMath（官方）', value: '~27%', level: 'A' },
      { label: '红队有害动作概率（官方自评）', value: '~10%', level: 'A' },
    ],
    sources: [
      { name: 'NN/g ChatGPT Agent 实测', url: 'https://www.nngroup.com/articles/impressions-chatgpt-agent/' },
      { name: 'OpenAI 官方基准汇总（smol.ai 转引）', url: 'https://www.smol.ai/' },
      { name: 'GitHub issue #35032（长任务压缩回归）', url: 'https://github.com/openai/codex/issues/35032' },
      { name: 'actuia 网站兼容性报道', url: 'https://actuia.com/cn/news/chatgpt-agent/' },
    ],
  },
  {
    slug: 'manus',
    name: 'Manus',
    vendor: 'Butterfly Effect / Monica',
    category: 'general',
    tier: 'T1',
    rank: 1,
    tagline:
      '长任务自主执行能力业界标杆、执行过程透明可视；信用点消耗不可预测与稳定性投诉把它按在 T1。',
    model: '未确认（多方报道以 Claude Sonnet 4 为主，部分 Qwen）',
    pricing: '信用点制：免费 300 credits/日 · Starter ~$19–20（4,000 credits）· Pro $199/月',
    evaluatedAt: '2026-08',
    verdict:
      '完整 Linux 云沙盒（shell/文件系统/代码执行/浏览器/公网部署）工具深度为通用类最强，planner+executor+verifier 多子 agent 架构可跑 15–90 分钟长任务，GAIA L3 57.7%（官方自报）若为真属第一梯队。但信用点实际消耗常为官方估算 2–4 倍、复杂任务一次烧掉整月额度，是最集中的用户抱怨；服务器繁忙、任务冻结、空 ZIP 等稳定性投诉密集；GAIA 自报且未经独立审计，并有"提前宣称完成"记录。定 T1（接近 T0）：能力上限最高，可靠性与成本可控性两项扣分。',
    strengths: [
      {
        claim: '长程开放式任务完成能力最强',
        compare: 'ChatGPT Agent / Genspark',
        evidence: '异步云端执行 15–90 分钟长任务，多子 agent 架构（planner+executor+verifier），过程可视化（A/B）',
        impact: '长任务自主性是通用 agent 的核心难题',
        level: 'A',
      },
      {
        claim: '工具深度品类第一',
        evidence: '完整 Linux 云沙盒：shell、文件系统、代码执行、浏览器、部署到公网（A/B）',
        impact: '任务可交付到"上线"而非仅产出文档',
        level: 'A',
      },
      {
        claim: 'GAIA 数字达到第一梯队（若为真）',
        evidence: '官方自报 2025-03：GAIA L1 86.5% / L2 74.3% / L3 57.7%；WebVoyager 87.8%（B 引用 HKUST）',
        impact: '但已被警告可针对性刷分，且截至 2026-05 无独立复现',
        level: 'A/D',
      },
    ],
    weaknesses: [
      {
        claim: '信用点消耗不可预测',
        compare: 'ChatGPT Agent 订阅限额制明显更优',
        evidence: '实际消耗为官方估算 2–4 倍，复杂任务一次烧掉整月额度（B，penchan 2026-06）；credits 不滚存（B）',
        impact: '成本失控直接摧毁任务委托意愿',
        level: 'B',
      },
      {
        claim: '稳定性投诉密集',
        evidence: '服务器"繁忙"不可用、任务冻结、终端错误、空 ZIP 文件（B，nxcode）；复杂多步骤高交互任务失败（B，腾讯新闻舆情）',
        impact: '"能力存在 ≠ 能力可靠"的典型',
        level: 'B',
      },
      {
        claim: '"提前宣称完成"有记录',
        evidence: '研究列表任务对付费墙内容显示成功实则需人工干预（B，nxcode 评测）',
        impact: 'verifier 设计存在但未杜绝假完成',
        level: 'B',
      },
    ],
    notHigher: [
      '成本不可预测（2–4 倍超耗）+ 稳定性投诉密集，两项可靠性硬伤（B）',
      'GAIA 等核心基准全靠自报、未经独立审计（D→B 存疑）；TechCrunch 实测与基准数字不符',
    ],
    notLower: [
      '长任务自主执行与沙盒工具深度实测领先（A/B）',
      '执行过程透明可验证，非"能力有限"档产品可比',
    ],
    headToHead: [
      {
        opponent: 'chatgpt-agent',
        myEdge: ['长任务自主性更强', '沙盒工具深度更高', '过程可视化'],
        theirEdge: ['基准公开透明', '订阅制成本可预期', '稳定性与生态'],
        verdict: '要上限选 Manus，要省心选 ChatGPT Agent；可靠性权重更高，故 Manus T1。',
      },
      {
        opponent: 'genspark',
        myEdge: ['工具深度与长任务能力', '过程透明', '无失败扣费级信任危机'],
        theirEdge: ['交付物广度（含外呼电话）', '速度'],
        verdict: '同为 T1：Manus 深、Genspark 广；Manus 的信任问题轻于 Genspark。',
      },
    ],
    scores: { autonomy: 9, toolUse: 9, longTask: 9, context: 7, extensibility: 7, stability: 5 },
    keyMetrics: [
      { label: 'GAIA L1/L2/L3（官方自报，未独立审计）', value: '86.5% / 74.3% / 57.7%', level: 'A/D' },
      { label: 'WebVoyager（B 引用 HKUST）', value: '87.8%', level: 'B' },
      { label: '信用点实际消耗 vs 官方估算', value: '2–4 倍', level: 'B' },
      { label: '核心模型', value: '未确认', level: 'B/C' },
    ],
    sources: [
      { name: 'penchan Manus 中文评测（2026-06）', url: 'https://penchan.co' },
      { name: 'nxcode Manus 评测', url: 'https://nxcode.io' },
      { name: 'aiwiki Manus 条目（GAIA 未审计标注）', url: 'https://aiwiki.ai' },
      { name: '腾讯新闻 Manus 舆情（2025-03）', url: 'https://news.qq.com' },
    ],
  },
  {
    slug: 'genspark',
    name: 'Genspark Super Agent',
    vendor: 'Genspark',
    category: 'general',
    tier: 'T1',
    rank: 2,
    tagline:
      '交付物广度无与伦比（研究/幻灯/表格/app/真实外呼）；Trustpilot 1.5/5 的计费信任危机是硬伤。',
    model: '混合编排 8+ 模型（具体名单未完全公布，部分未确认）',
    pricing: '信用点制：免费 100–200 credits/日 · Plus $24.99 · Pro $249.99/月；Claw 固定订阅',
    evaluatedAt: '2026-08',
    verdict:
      '80+ 集成工具覆盖浏览器、代码执行、Slides/Sheets/Docs 乃至真实外呼电话（Call For Me），交付物广度品类第一，速度快、价格低于 Manus，ARR 超 $2 亿、并与微软合作嵌入 M365。但 Trustpilot 1.5/5（约 112 条、84% 一星）：失败任务照扣 credits、渲染失败不退费、任务前不显示成本、疑似未经同意年度扣费，客服仅 AI 自动回复——计费不透明与失败扣费直接摧毁任务可靠性信任。定 T1：能力广但"可靠完成"与"诚实的成本/失败处理"两项有系统性反证。',
    strengths: [
      {
        claim: '交付物广度品类第一',
        compare: 'Manus / ChatGPT Agent',
        evidence: '80+ 集成工具：浏览器、AI Developer（可建 web/移动 app）、Slides/Sheets/Docs、真实外呼电话（B）',
        impact: '"一站式交付"覆盖非技术用户的真实办公场景',
        level: 'B',
      },
      {
        claim: '商业化增长与生态合作强',
        evidence: 'ARR 超 $2 亿；2026-04 与微软合作嵌入 M365；2026-03 推出 Claw"AI 员工"（D/B）',
        impact: '产品持续投入有商业基础',
        level: 'D/B',
      },
      {
        claim: '自主性最高档（双刃剑）',
        evidence: 'Claw 模式执行多步跨应用任务且不中途请求确认（B）',
        impact: '全自动体验流畅，但风险同样最高',
        level: 'B',
      },
    ],
    weaknesses: [
      {
        claim: '计费与失败扣费的信任危机',
        compare: '同类产品中反证最集中',
        evidence: 'Trustpilot 1.5/5（~112 条，84% 一星）：失败照扣 credits、不显示预估成本、"unlimited"实际限流扣费、疑似未同意年扣（B fast.io 2026-06；C eesel.ai 汇总）',
        impact: '"可靠完成"承诺被系统性反证',
        level: 'B/C',
      },
      {
        claim: '客服与交付质量投诉',
        evidence: '客服仅 AI 自动回复、5 天+ 无人工跟进；PPT 格式错误、网站跨浏览器渲染失败、研究内容重复（B）',
        impact: '出问题后无救济通道',
        level: 'B',
      },
      {
        claim: '无权威独立基准',
        evidence: '官方自报数据为主（D）；无开放 API（截至 2026-06）',
        impact: '能力无法外部验证',
        level: 'D',
      },
    ],
    notHigher: [
      'Trustpilot 1.5/5 级计费信任危机是 T0 不可能容忍的系统性反证（B/C）',
      '无权威独立 agent 基准，能力证据等级低（D）',
    ],
    notLower: [
      '交付物广度与执行速度实测领先，ARR/微软合作佐证真实使用规模（B）',
      '能力本身达到 T1，扣分集中在商业行为而非能力缺失',
    ],
    headToHead: [
      {
        opponent: 'manus',
        myEdge: ['交付物广度（含外呼电话）', '速度与价格'],
        theirEdge: ['沙盒工具深度', '过程透明', '信任问题更轻'],
        verdict: '广度选 Genspark、深度选 Manus；两者同为 T1，扣分项不同。',
      },
    ],
    scores: { autonomy: 8, toolUse: 8, longTask: 7, context: 6, extensibility: 8, stability: 5 },
    keyMetrics: [
      { label: 'Trustpilot 评分', value: '1.5/5（~112 条，84% 一星）', level: 'B/C' },
      { label: '集成工具数', value: '80+', level: 'B' },
      { label: 'ARR', value: '超 $2 亿', level: 'D' },
      { label: '权威独立 agent 基准', value: '无', level: 'D' },
    ],
    sources: [
      { name: 'fast.io Genspark 评测（2026-06）', url: 'https://fast.io' },
      { name: 'eesel.ai Genspark review（2026-07）', url: 'https://eesel.ai' },
      { name: 'cybernews Genspark 评测', url: 'https://cybernews.com' },
    ],
  },
  {
    slug: 'kimi-ok-computer',
    name: 'Kimi OK Computer',
    vendor: 'Moonshot AI',
    category: 'general',
    tier: 'T2',
    rank: 1,
    tagline:
      '自研 K2 Thinking 模型工具调用强、研究型交付性价比高；幻觉引用与执行不可验证是"提前宣称完成"的典型。',
    model: 'Kimi K2 Thinking（1T MoE，自研）',
    pricing: '免费额度 + 订阅；API OpenAI 兼容',
    evaluatedAt: '2026-08',
    verdict:
      '自研 K2 Thinking 模型（1T MoE）工具调用能力强，OK Computer 模式覆盖网页浏览、代码执行与 PPT/文档/网页生成，planning trace 可读，研究型交付性价比高、免费层慷慨。但第三方实测"hit or miss"：会引用不存在的来源、误读付费墙页面，数据新鲜度不稳定、研究深度不及 Manus、过程无法验证来源链；通用 shell 沙盒无公开证据。定 T2：适合初稿与研究草稿，不适合需要可验证结果的终稿任务——"能力存在 ≠ 能力可靠"的典型样本。',
    strengths: [
      {
        claim: '自研模型的工具调用能力有硬指标',
        evidence: 'K2 Thinking（1T MoE）驱动；2026-06 发布 K2.7-Code，MCP-Atlas 76.0（A）',
        impact: '模型-系统一体的技术路线干净',
        level: 'A',
      },
      {
        claim: '研究型交付性价比与免费层',
        evidence: '网页浏览 + 代码执行 + 文件生成（PPT/文档/网页），planning trace 可读；免费额度慷慨（A/B）',
        impact: '低成本试用门槛',
        level: 'A',
      },
    ],
    weaknesses: [
      {
        claim: '幻觉引用与来源不可验证',
        evidence: '实测会引用不存在的来源、误读付费墙页面，"适合初稿不适合终稿"（B，alltechmagazine 2026-05）；无法验证来源链（B，getalai）',
        impact: '研究交付物的核心价值（可信）被直接削弱',
        level: 'B',
      },
      {
        claim: '执行可靠性不稳定',
        evidence: '"hit or miss"；数据新鲜度不稳定、研究深度不及 Manus（B）',
        impact: '任务成功率随场景波动大',
        level: 'B',
      },
      {
        claim: '通用执行工具集不完整',
        evidence: '无通用 shell 沙盒公开证据（未确认）',
        impact: '严格意义上不满足"完整通用执行 Agent"标准',
        level: 'B',
      },
    ],
    notHigher: [
      '幻觉引用 + 执行结果不可验证是"提前宣称完成"类风险的典型（B）',
      'GAIA ~67.3% 仅为第三方转引，可信度一般（B/C）',
    ],
    notLower: [
      '自研模型工具调用能力有 A 级硬指标（MCP-Atlas 76.0）',
      '研究型交付实测可用，非"能力有限"档',
    ],
    headToHead: [
      {
        opponent: 'manus',
        myEdge: ['自研模型、API 兼容', '免费层慷慨', '中文场景'],
        theirEdge: ['沙盒工具深度', '长任务自主性', '研究深度与过程透明'],
        verdict: '深度与可靠性 Manus 全面占优；Kimi 胜在成本与中文场景，故低一档。',
      },
    ],
    scores: { autonomy: 6, toolUse: 7, longTask: 6, context: 7, extensibility: 6, stability: 5 },
    keyMetrics: [
      { label: 'K2.7-Code MCP-Atlas（官方）', value: '76.0', level: 'A' },
      { label: 'GAIA（第三方转引）', value: '~67.3%', level: 'B/C' },
      { label: '通用 shell 沙盒', value: '未确认', level: 'B' },
    ],
    sources: [
      { name: 'alltechmagazine Kimi 实测（2026-05）', url: 'https://alltechmagazine.com' },
      { name: 'getalai Kimi 对比实测', url: 'https://getalai.com' },
      { name: 'neura.market GAIA 转引', url: 'https://neura.market' },
    ],
  },
  {
    slug: 'chatgpt-deep-research',
    name: 'ChatGPT Deep Research',
    vendor: 'OpenAI',
    category: 'research',
    tier: 'T0',
    rank: 1,
    tagline:
      '公开基准最硬、句子级引用粒度最细的研究 agent；价格高、Plus 额度抠门。',
    model: '微调 o3 起步（当前 DR 专用模型版本未公开披露）',
    pricing: 'Plus $20/月含 10 次 · Pro $100/月约 50 次 · Pro $200/月不限量（B 级跟踪）',
    evaluatedAt: '2026-08',
    verdict:
      '2025-02 上线即 SOTA：HLE 26.6%、GAIA pass@1 67.36%（官方 A 级）；独立金融研究基准 Deep FinResearch Bench 中 RACE 47.0、FACT Precision 78.0 综合居前（B）。多步迭代浏览、单任务分析 100+ 来源、引用精确到句子/段落级，输入类型（文件/图片/代码）最全。负面：高额度需 $200/月、Plus 10 次/月太少；偶现"引用充分但来源为低质量 SEO 内容"；无独立大样本引用准确率审计。定 T0：基准+机制+第三方横评的综合证据最完整。',
    strengths: [
      {
        claim: '公开基准成绩最硬',
        compare: 'Perplexity HLE 21.1%',
        evidence: '官方发布：HLE 26.6%（当时 SOTA）、GAIA pass@1 67.36% / cons@64 72.57%（A）',
        impact: '研究 agent 的能力上限可被外部追踪',
        level: 'A',
      },
      {
        claim: '引用粒度与输入类型最全',
        compare: '六家中引用最细',
        evidence: '引用精确到句子/段落级；单次任务分析 100+ 来源；支持文件/图片/代码输入（A）',
        impact: '溯源抽查成本最低',
        level: 'A',
      },
      {
        claim: '独立横评综合居前',
        compare: 'Gemini DR 之外的五家',
        evidence: 'Deep FinResearch Bench（arXiv 2604.21006，2026-04）：RACE 47.0、FACT Precision 78.0（B）',
        impact: '非厂商口径的第三方确认',
        level: 'B',
      },
    ],
    weaknesses: [
      {
        claim: '高额度价格贵、Plus 额度抠门',
        evidence: '不限量需 Pro $200/月；Plus 仅 10 次/月（B/C，第三方跟踪）',
        impact: '重度研究用户成本显著高于 Gemini',
        level: 'B',
      },
      {
        claim: '来源质量参差',
        evidence: '用户社区：报告偶现"看似引用充分但来源为低质量 SEO 内容"；早期版本无法访问付费墙（C）',
        impact: '引用数量不等于引用质量，仍需人工抽查',
        level: 'C',
      },
      {
        claim: '无独立大样本引用准确率审计',
        compare: '全行业共同空白',
        evidence: '未发现系统性引用造假实锤，但幻觉在所有 DR 产品中均无法根除（C）',
        impact: 'T0 定级基于基准+机制+横评，而非引用质量直接测量',
        level: 'C',
      },
    ],
    notHigher: [
      '已是最高档；当前底层 DR 模型版本官方未披露，定级部分基于发布节奏推断',
    ],
    notLower: [
      'HLE/GAIA 官方成绩 + 第三方金融基准居前，证据链最完整（A、B）',
      '句子级引用与多模态输入为六家中独有组合（A）',
    ],
    headToHead: [
      {
        opponent: 'gemini-deep-research',
        myEdge: ['引用粒度更细（句子级）', '论证密度更高', '输入类型更全'],
        theirEdge: ['HLE 高算力 32.4% 更高', '报告体量更大', '免费层 5 次/月、Pro 同价额度更慷慨', 'FinResearch RACE 48.9 六家最高'],
        verdict: '并列 T0、各有所长：论证密度选 OpenAI，体量/性价比选 Gemini。',
      },
      {
        opponent: 'perplexity',
        myEdge: ['研究深度与报告体量', 'HLE 26.6% vs 21.1%', '无版权诉讼级反证'],
        theirEdge: ['速度最快、免费额度实用', 'FACT Precision 90.2 检索忠实度最高'],
        verdict: '深度研究选 OpenAI；快速事实综述 Perplexity 可用但只到 T1。',
      },
    ],
    scores: { autonomy: 8, toolUse: 8, longTask: 8, context: 8, extensibility: 7, stability: 8 },
    keyMetrics: [
      { label: 'HLE（官方发布值）', value: '26.6%', level: 'A' },
      { label: 'GAIA pass@1（官方）', value: '67.36%（cons@64 72.57%）', level: 'A' },
      { label: 'Deep FinResearch Bench RACE / FACT（第三方）', value: '47.0 / 78.0', level: 'B' },
      { label: '单任务来源分析量', value: '100+ 来源 / 5–30 分钟', level: 'A' },
    ],
    sources: [
      { name: 'OpenAI Deep Research 发布（2025-02）', url: 'https://openai.com/index/introducing-deep-research/' },
      { name: 'Deep FinResearch Bench（arXiv 2604.21006）', url: 'https://arxiv.org/abs/2604.21006' },
      { name: 'DR 系统综述（arXiv 2506.12594）', url: 'https://arxiv.org/abs/2506.12594' },
    ],
  },
  {
    slug: 'gemini-deep-research',
    name: 'Gemini Deep Research',
    vendor: 'Google',
    category: 'research',
    tier: 'T0',
    rank: 2,
    tagline:
      '报告体量与多模态最强、免费层可用的性价比之王；偏好评测出自自家是唯一的证据折扣。',
    model: 'Gemini 3.1 Pro（1M token 上下文，原生多模态）',
    pricing: '免费 5 次/月 · Google AI Pro $19.99 含完整额度 · Ultra $99.99/$199.99',
    evaluatedAt: '2026-08',
    verdict:
      'HLE 从 7.95%（2024-12）提升至 26.9%、高算力 32.4%（官方技术报告 arXiv 2507.06261，当时 SOTA），数字被 TUMIX 等第三方论文引用确认；Deep FinResearch Bench 中 RACE 48.9 为六家最高、FACT 81.4（B）。单任务可浏览数百网站、先出研究计划供确认、能识别检索死胡同；官方用户偏好评测四项全胜 OpenAI DR（A 自评）。免费层即含 5 次/月，Pro 与 ChatGPT Plus 同价但额度更慷慨。定 T0：基准可查证+性价比最高，唯偏好评测的自评属性与引用-论断对齐精度需保留。',
    strengths: [
      {
        claim: '基准成绩可查证且被第三方论文引用',
        compare: 'Kimi 26.9% 无独立复测',
        evidence: '官方技术报告（arXiv 2507.06261）：HLE 7.95%→26.9%、高算力 32.4%（当时 SOTA）；TUMIX 论文引用佐证（A/B）',
        impact: '自报数字获得学术共同体接受',
        level: 'A',
      },
      {
        claim: '独立横评综合分六家最高',
        evidence: 'Deep FinResearch Bench：RACE 48.9（六家最高）、FACT Precision 81.4（B）',
        impact: '非自家口径的能力确认',
        level: 'B',
      },
      {
        claim: '性价比最高',
        compare: 'OpenAI DR 不限量需 $200/月',
        evidence: '免费层 5 次/月；AI Pro $19.99 含完整额度（B）',
        impact: '个人研究者实际可用门槛最低',
        level: 'B',
      },
    ],
    weaknesses: [
      {
        claim: '用户偏好评测出自 Google 自家',
        evidence: '指令遵循 60.6%、全面性 76.9% 等四项全胜 OpenAI DR 的评测为 Google 自评，存在立场偏差（A，自评）',
        impact: '该组数据应按厂商口径折减',
        level: 'A',
      },
      {
        claim: '引用-论断对齐精度不完美',
        evidence: '用户抱怨"来源数量多但堆砌感强、关键论断引用支撑不足"；早期"引用了网页但网页并不含该论断"的错位新版改善未绝迹（C）',
        impact: '体量优势伴随着信噪比风险',
        level: 'C',
      },
      {
        claim: '套餐频繁变动',
        evidence: '2026 年套餐两度重组造成用户混乱（C）',
        impact: '成本与额度预期不稳定',
        level: 'C',
      },
    ],
    notHigher: [
      '已是最高档；偏好评测自评属性与引用对齐问题使其不能被视为"全面超越 OpenAI"',
    ],
    notLower: [
      'HLE 数字有官方论文+第三方引用双确认（A/B）',
      '独立横评 RACE 六家最高 + 免费层存在（B）',
    ],
    headToHead: [
      {
        opponent: 'chatgpt-deep-research',
        myEdge: ['HLE 高算力 32.4%', 'RACE 48.9 六家最高', '报告体量与多模态', '免费层 + 性价比'],
        theirEdge: ['句子级引用粒度', '论证密度', '输入类型'],
        verdict: '并列 T0：要体量和性价比选 Gemini，要引用精度选 OpenAI。',
      },
      {
        opponent: 'kimi-researcher',
        myEdge: ['HLE 数字有独立论文佐证', '英文/学术库深度', '独立横评存在'],
        theirEdge: ['中文信源覆盖', '溯源+可视化交付形态'],
        verdict: '同为 HLE 26.9%，但 Gemini 的证据等级显著更高；Kimi 单一口径只能 T1。',
      },
    ],
    scores: { autonomy: 8, toolUse: 8, longTask: 8, context: 9, extensibility: 7, stability: 8 },
    keyMetrics: [
      { label: 'HLE（官方论文）', value: '26.9% / 高算力 32.4%', level: 'A' },
      { label: 'Deep FinResearch Bench RACE（第三方）', value: '48.9（六家最高）', level: 'B' },
      { label: '用户偏好评测四项（官方自评）', value: '指令遵循 60.6% 等全胜', level: 'A' },
      { label: '免费层额度', value: '5 次/月', level: 'B' },
    ],
    sources: [
      { name: 'Gemini 2.5 Deep Research 技术报告（arXiv 2507.06261）', url: 'https://arxiv.org/abs/2507.06261' },
      { name: 'Deep FinResearch Bench（arXiv 2604.21006）', url: 'https://arxiv.org/abs/2604.21006' },
      { name: 'TUMIX 论文（arXiv 2510.01279）', url: 'https://arxiv.org/abs/2510.01279' },
    ],
  },
  {
    slug: 'kimi-researcher',
    name: 'Kimi Researcher',
    vendor: 'Moonshot AI',
    category: 'research',
    tier: 'T1',
    rank: 1,
    tagline:
      '端到端 RL"模型即 Agent"路线干净，溯源万字报告+动态可视化是差异化亮点；独立复测空白压住定级。',
    model: 'Kimi 自研模型端到端强化学习版（随 K2 系列演进）',
    pricing: '内测起步逐步开放；中国区定价亲民、免费层可用（额度多次调整，C 级）',
    evaluatedAt: '2026-08',
    verdict:
      'Kimi 首个 Agent 产品（2025-06 内测），端到端 Agentic RL 训练而非外挂工作流，官方称平均 23 步推理、检索 200+ 网页，主动澄清问题并筛选信源；HLE Pass@1 26.9% 官方自报，与 Gemini DR 数字恰好持平、达第一梯队量级。万字级可溯源报告 + 动态可视化结果页是独有交付形态。但该数字无独立复测、B 级证据空白；中文信源强而英文/学术库深度未经验证；内测期产能与稳定性有吐槽。定 T1：证据等级不足以支撑 T0，若出现第三方验证可上调。',
    strengths: [
      {
        claim: '端到端 RL 技术路线干净',
        compare: '多数竞品为外挂工作流',
        evidence: '"模型即 Agent"：端到端 Agentic RL 训练，官方称平均 23 步推理、检索 200+ 网页、主动澄清（A，官方口径）',
        impact: '架构上避免了拼装系统的协调损耗',
        level: 'A',
      },
      {
        claim: 'HLE 数字达第一梯队量级',
        compare: '与 Gemini DR 26.9% 持平',
        evidence: 'HLE Pass@1 26.9%（A，自报，无独立复测）',
        impact: '若第三方验证成立，可直接进入 T0 讨论',
        level: 'A',
      },
      {
        claim: '溯源 + 可视化交付形态独特',
        evidence: '万字级可溯源研究报告 + 动态可视化结果页（A）',
        impact: '溯源是研究 agent 信任问题的正面回应',
        level: 'A',
      },
    ],
    weaknesses: [
      {
        claim: '核心数字全靠自报',
        compare: 'Gemini 有 arXiv 论文+第三方引用',
        evidence: 'HLE 26.9% 无任何独立第三方复测，B 级证据空白（A 自报）',
        impact: '单一来源数字按规则降权',
        level: 'A',
      },
      {
        claim: '英文/学术库深度未经验证',
        evidence: '中文信源覆盖强，但国际研究能力无独立评测（C）',
        impact: '适用面存疑',
        level: 'C',
      },
      {
        claim: '内测期产能与稳定性',
        evidence: '内测起步逐步开放，用户吐槽产能与稳定性（C）',
        impact: '可用性本身尚未完全开放',
        level: 'C',
      },
    ],
    notHigher: [
      'HLE 26.9% 为单一自报数字、无独立复测——证据等级不足以支撑 T0',
      '英文/学术场景与国际可用性未经验证（C）',
    ],
    notLower: [
      '技术路线与 HLE 量级均明显强于 T2 档（Grok DR 独立横评垫底、Manus 基准存疑）',
      '溯源+可视化交付形态有真实差异化（A）',
    ],
    headToHead: [
      {
        opponent: 'gemini-deep-research',
        myEdge: ['中文信源', '溯源/可视化交付形态'],
        theirEdge: ['HLE 数字有独立论文佐证', '英文/学术深度', '免费层与性价比'],
        verdict: '数字持平但证据等级差一档；中文研究场景可选 Kimi。',
      },
    ],
    scores: { autonomy: 7, toolUse: 7, longTask: 7, context: 7, extensibility: 6, stability: 6 },
    keyMetrics: [
      { label: 'HLE Pass@1（官方自报）', value: '26.9%', level: 'A' },
      { label: '平均推理步数 / 检索网页（官方）', value: '23 步 / 200+ 网页', level: 'A' },
      { label: '独立第三方复测', value: '无（证据空白）', level: 'B' },
    ],
    sources: [
      { name: 'Moonshot Kimi-Researcher 发布（2025-06）', url: 'https://www.moonshot.cn' },
      { name: 'DR 系统综述（arXiv 2510.24760）', url: 'https://arxiv.org/abs/2510.24760' },
    ],
  },
  {
    slug: 'perplexity',
    name: 'Perplexity Deep Research / Labs',
    vendor: 'Perplexity',
    category: 'research',
    tier: 'T1',
    rank: 2,
    tagline:
      '速度最快、价格最低、检索忠实度指标最好；版权诉讼密度与研究深度短板并存。',
    model: '多模型切换（GPT/Claude/Gemini + 自研 Sonar；发布时基于 DeepSeek-R1 微调）',
    pricing: '免费 5 次/日 · Pro $20/月约 20 次/日 · Max $200/月不限量 · 学生 $10/月',
    evaluatedAt: '2026-08',
    verdict:
      'HLE 21.1%、SimpleQA 93.9%（官方 A）；Deep FinResearch Bench 中 FACT Precision 90.2 为六家最高——"答得忠实但研究深度不够"（RACE 42.3 低于 OpenAI/Gemini，B）。迭代检索 50–100+ 来源、3–15 分钟出约 3000 字报告，免费 5 次/日，速度与价格均为六家最优；Max 的 Model Council 是唯一显式多模型互验设计。但版权与来源争议最集中（Dow Jones、NYT、日经/读卖/朝日、Reddit 等诉讼），2026 年额度收紧与"偷偷降级模型"投诉密集，付费墙覆盖弱。定 T1：快速综述与事实核查首选，深度长文与法律敏感场景不适。',
    strengths: [
      {
        claim: '检索忠实度指标六家最高',
        evidence: 'Deep FinResearch Bench：FACT Precision 90.2（B）',
        impact: '事实核查类任务最不容易"编"',
        level: 'B',
      },
      {
        claim: '速度与价格最优',
        compare: 'OpenAI/Gemini 5–30 分钟、高额度 $200',
        evidence: '3–15 分钟出报告；免费 5 次/日、Pro $20/月（B）；HLE 21.1%、SimpleQA 93.9%（A）',
        impact: '高频轻量研究的最优解',
        level: 'A',
      },
      {
        claim: '唯一显式多模型互验设计',
        evidence: 'Max 档 Model Council 多模型交叉验证；Sonar Deep Research API 按 token 计费可集成（B/A）',
        impact: '多来源交叉验证的产品化创新',
        level: 'B',
      },
    ],
    weaknesses: [
      {
        claim: '版权与来源争议六家中最集中',
        evidence: 'Dow Jones/NY Post 起诉（含"幻觉内容冒名归因 WSJ"指控）、NYT 起诉、日经/读卖/朝日 2025-08 起诉、Reddit 起诉数据抓取（B/C，证据充分）',
        impact: '法律风险与内容授权问题影响长期可用性',
        level: 'B',
      },
      {
        claim: '研究深度弱于 T0 两家',
        evidence: 'RACE 42.3 低于 OpenAI 47.0 / Gemini 48.9；报告约 3000 字偏短，适合快速综述而非深度长文（B）',
        impact: '定位是"快而准"而非"深而全"',
        level: 'B',
      },
      {
        claim: '额度政策不透明',
        evidence: '2026 年投诉：悄悄收紧"无限"额度、重模型 3–5 次/日即触发周限、疑似降级到便宜模型（C，geotoolbox 汇总）',
        impact: '付费承诺的可信度受损',
        level: 'C',
      },
    ],
    notHigher: [
      '研究深度指标（RACE 42.3）与报告体量明显弱于 T0 两家（B）',
      '诉讼级来源争议 + 额度政策不透明（B/C）',
    ],
    notLower: [
      'HLE 21.1% / SimpleQA 93.9% 有官方成绩，FACT Precision 90.2 六家最高（A、B）',
      '速度、免费额度与 API 可集成性均为品类最优档',
    ],
    headToHead: [
      {
        opponent: 'chatgpt-deep-research',
        myEdge: ['速度快 2–10 倍', '免费 5 次/日', '检索忠实度 90.2 vs 78.0'],
        theirEdge: ['HLE 26.6% vs 21.1%', '研究深度与报告体量', '无法律争议'],
        verdict: '快查选 Perplexity，深研选 OpenAI；按研究深度定级差半档。',
      },
      {
        opponent: 'gemini-deep-research',
        myEdge: ['免费额度按日计', '速度', 'FACT Precision 更高'],
        theirEdge: ['RACE 48.9 vs 42.3', '报告体量数十页 vs ~3000 字', 'HLE 更高'],
        verdict: 'Gemini 深度全面占优；Perplexity 守住"快速事实层"的 T1 位置。',
      },
    ],
    scores: { autonomy: 7, toolUse: 7, longTask: 6, context: 7, extensibility: 7, stability: 6 },
    keyMetrics: [
      { label: 'HLE / SimpleQA（官方发布值）', value: '21.1% / 93.9%', level: 'A' },
      { label: 'FACT Precision（第三方，六家最高）', value: '90.2', level: 'B' },
      { label: 'RACE 综合分（第三方）', value: '42.3', level: 'B' },
      { label: '免费额度', value: '5 次/日', level: 'B' },
    ],
    sources: [
      { name: 'Perplexity Deep Research 官方发布', url: 'https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research' },
      { name: 'Deep FinResearch Bench（arXiv 2604.21006）', url: 'https://arxiv.org/abs/2604.21006' },
      { name: 'Dow Jones v. Perplexity 案件综述（allthingsai）', url: 'https://allthingsai.com' },
      { name: 'geotoolbox 额度收紧汇总（2026-08）', url: 'https://geotoolbox.com' },
    ],
  },
  {
    slug: 'claude-computer-use',
    name: 'Claude Computer Use',
    vendor: 'Anthropic',
    category: 'browser',
    tier: 'T0',
    rank: 1,
    tagline:
      '桌面/浏览器操控能力公认第一梯队：OSWorld-Verified 83.4%+，API 可用；官方自己仍标注"risky"。',
    model: 'Claude Opus 4.8 / Sonnet 5 / Mythos 5 系列',
    pricing: 'API 按 token 计费；Claude in Chrome 捆绑 Pro $20 / Max $100–200',
    evaluatedAt: '2026-08',
    verdict:
      'API computer-use 工具（截图+坐标操作）配 Claude in Chrome 扩展与 Cowork，OSWorld-Verified 83.4%（Opus 4.8，自报）/ Claude 5 系列 85.0–85.4%（自报），Steel.dev OSWorld 第三方榜单列榜首；从初代 14.9%（2024-10）18 个月提升近 6 倍。但即便 83% 也意味着约 1/5 桌面任务失败；OSWorld 2.0 长任务仅 54.8% partial / 20.6% binary（arXiv 2607.22798，B）；Anthropic 官方明确警告浏览器使用"still risky"（prompt injection）。定 T0：桌面控制能力的当前天花板，但长链路与注入风险未解。',
    strengths: [
      {
        claim: '桌面控制 benchmark 第一',
        compare: 'GPT-5.4 OSWorld 75.0% / UI-TARS-2 47.5%',
        evidence: 'OSWorld-Verified 83.4%（Opus 4.8 自报）/ 85.0–85.4%（Claude 5 自报）；Steel.dev 第三方榜单榜首（A 自报 + B 榜单）',
        impact: '计算机操控赛道的绝对头部',
        level: 'A',
      },
      {
        claim: '提升速度惊人',
        evidence: 'Claude 3.5 Sonnet 14.9%（2024-10）→ 83.4%，18 个月近 6 倍（A）',
        impact: '技术路线被验证可持续',
        level: 'A',
      },
      {
        claim: 'API 形态可集成',
        evidence: 'Responses 式 API 工具（beta header computer-use-2025-11-24），另有 Claude in Chrome 扩展与 Cowork（A/B）',
        impact: '开发者可自建 harness，不绑死消费端产品',
        level: 'A',
      },
    ],
    weaknesses: [
      {
        claim: '长任务远未解决',
        evidence: 'OSWorld 2.0 长任务：Opus 4.8 仅 54.8% partial / 20.6% binary（arXiv 2607.22798，B）',
        impact: '多页面长链路任务成功率不足三成',
        level: 'B',
      },
      {
        claim: '约 1/5 桌面任务仍失败',
        evidence: '83% 成功率的另一面（B）；Anthropic 官方称浏览器使用"still risky"，prompt injection 风险未解（A）',
        impact: '敏感操作必须人工接管',
        level: 'A',
      },
      {
        claim: '成绩为自报',
        evidence: 'OSWorld-Verified 数字为厂商自报，新版 harness 与旧数据不可直接比（A 自报）',
        impact: '横向对比需谨慎',
        level: 'A',
      },
    ],
    notHigher: [
      '已是最高档；官方自己标注 risky，OSWorld 2.0 长任务仅 ~20% binary（B）',
    ],
    notLower: [
      'OSWorld-Verified 榜首 + 第三方榜单确认，领先次名近 10 个百分点（A/B）',
      'API/扩展/消费者产品三形态齐全（A）',
    ],
    headToHead: [
      {
        opponent: 'browser-use',
        myEdge: ['OSWorld 桌面控制绝对领先', '官方模型-工具一体'],
        theirEdge: ['模型无关可换底座', '开源免费可自托管', 'DOM 标注路线 token 效率更好', 'WebVoyager 89.1%'],
        verdict: '桌面操控选 Claude Computer Use；纯浏览器自动化且要控制成本选 Browser Use。',
      },
    ],
    scores: { autonomy: 8, toolUse: 8, longTask: 7, context: 7, extensibility: 8, stability: 7 },
    keyMetrics: [
      { label: 'OSWorld-Verified（Opus 4.8，自报）', value: '83.4%（Claude 5 系 85.0–85.4%）', level: 'A' },
      { label: 'OSWorld 2.0 长任务（第三方）', value: '54.8% partial / 20.6% binary', level: 'B' },
      { label: 'Steel.dev OSWorld 榜单（第三方）', value: '榜首', level: 'B' },
    ],
    sources: [
      { name: 'Steel.dev OSWorld 榜单', url: 'https://leaderboard.steel.dev/leaderboards/osworld/' },
      { name: 'OSWorld 2.0 论文（arXiv 2606.29537）', url: 'https://arxiv.org/abs/2606.29537' },
      { name: 'StateAct 论文（arXiv 2607.22798）', url: 'https://arxiv.org/abs/2607.22798' },
      { name: 'particula.tech 三方对比（2026-06）', url: 'https://particula.tech/blog/browser-use-vs-operator-vs-claude-computer-use-web-agents' },
    ],
  },
  {
    slug: 'browser-use',
    name: 'Browser Use',
    vendor: 'Browser Use（开源）',
    category: 'browser',
    tier: 'T1',
    rank: 1,
    tagline:
      '生态最活跃的开源浏览器 agent：模型无关、价格透明、WebVoyager 89.1%；生产可靠性依赖自行调优。',
    model: '模型无关（OpenAI/Anthropic/Google/BYOK）',
    pricing: '开源免费；云 Free（10 任务/月）· Dev $29 · Business $299 · Scaleup $999；浏览器 $0.02/h',
    evaluatedAt: '2026-08',
    verdict:
      'DOM 元素标注 + 截图的模型无关路线，Python 库 + 托管云双形态，WebVoyager 89.1%（自报 586/643）且有第三方同模型复测 88.3%（B）；生态活跃度品类第一，价格逐项透明。注意：测试剔除 55 个失效任务且本地跑、避开反爬，生产成绩会低于此——反爬强站点仍需代理+重试+调优，token 消耗大需自行仪表化，无 no-code 界面。定 T1：开发者浏览器自动化的默认选项之一，但"89%"不能外推到带 Cloudflare 的生产站点。',
    strengths: [
      {
        claim: 'WebVoyager 成绩有第三方复测',
        compare: '多数自报数字无复测',
        evidence: '自报 89.1%（586/643，本地安全 IP）；第三方 Meursault 同模型复测 88.3%（B，tinyfish 引述）',
        impact: '罕见的可交叉验证基准',
        level: 'B',
      },
      {
        claim: '模型无关 + 开源',
        compare: 'Claude CU / CUA 绑定自家模型',
        evidence: 'DOM 标注为主 + 截图，支持 OpenAI/Anthropic/Google/BYOK；Apache 开源 + 托管云（A）',
        impact: '无厂商锁定，可随模型代际切换',
        level: 'A',
      },
      {
        claim: '价格逐项透明',
        evidence: '浏览器 $0.02/h、代理 $5/GB、hosted agent token 1.2× 或 BYOK +0.2×（A/B，2026-07 核实）',
        impact: '成本可事前建模，对照信用点制产品是实质优势',
        level: 'A',
      },
    ],
    weaknesses: [
      {
        claim: '基准环境偏友好',
        evidence: '测试剔除 55 个失效任务、本地跑避开反爬；带 Cloudflare/DataDome 的生产站点成功率显著更低（B，aimultiple 方法论）',
        impact: '"89%"不是生产数字',
        level: 'B',
      },
      {
        claim: '生产可靠性依赖调优',
        evidence: '反爬强站点需代理+重试+调优；token 消耗大、成本需自行仪表化（B，aiagentsquare 8.0/10）',
        impact: '隐性工程成本高',
        level: 'B',
      },
      {
        claim: '纯开发者产品',
        evidence: '无 no-code 界面，Python 库/API 形态（A）',
        impact: '非技术团队不可用',
        level: 'A',
      },
    ],
    notHigher: [
      '生产反爬环境成功率与 token 成本均无保障（B）',
      '无官方 SLA/托管可靠性承诺，可靠性靠用户自行工程化',
    ],
    notLower: [
      '第三方复测的 WebVoyager 88.3% + 最活跃生态 + 透明定价（B/A）',
      '行业共识：新项目默认选择已转向 Browser Use 等（B）',
    ],
    headToHead: [
      {
        opponent: 'claude-computer-use',
        myEdge: ['模型无关', '开源可自托管', '浏览器场景成本更低'],
        theirEdge: ['OSWorld 83.4% 桌面控制', '官方一体化质量保障'],
        verdict: '浏览器自动化选 Browser Use，跨桌面应用操控选 Claude Computer Use。',
      },
    ],
    scores: { autonomy: 7, toolUse: 8, longTask: 6, context: 6, extensibility: 9, stability: 6 },
    keyMetrics: [
      { label: 'WebVoyager（自报 / 第三方复测）', value: '89.1% / 88.3%', level: 'B' },
      { label: '云端起步价', value: 'Dev $29/月 · $0.02/h 浏览器', level: 'A' },
      { label: 'aiagentsquare 独立评测', value: '8.0/10', level: 'B' },
    ],
    sources: [
      { name: 'aiagentsquare Browser Use 评测', url: 'https://aiagentsquare.com/agents/browser-use' },
      { name: 'aimultiple WebVoyager 方法论分析', url: 'https://aimultiple.com/open-source-web-agents' },
      { name: 'particula.tech 三方对比', url: 'https://particula.tech/blog/browser-use-vs-operator-vs-claude-computer-use-web-agents' },
    ],
  },
  {
    slug: 'langgraph',
    name: 'LangGraph Platform',
    vendor: 'LangChain',
    category: 'multi',
    tier: 'T0',
    rank: 1,
    tagline:
      '图编排把"人工设计控制流 + AI 填决策点"做成一等原语——恰好是生产实证认可的唯一形态。',
    model: '模型中立',
    pricing: '框架 MIT 免费 · Platform 托管 from $35/月 · LangSmith Plus $39/seat/月',
    evaluatedAt: '2026-08',
    verdict:
      'LangGraph 1.0 GA（2025-10）：stateful graph 编排，checkpointing、durable execution、human-in-the-loop 为一等原语。Berkeley 生产调查显示 80% 成功部署用"人工设计结构化控制流 + AI 填决策点"——这正是 graph 编排的主场；Uber、LinkedIn、Klarna 等生产采用证据为品类最强（B）。多 agent 研究中 DeepMind/Cognition 的反证均指向"不可控自主多 agent"，LangGraph 的确定性编排恰是解药。负面：学习曲线最陡（10–14 天）；LangSmith 按 trace 计量规模化后成本不可预测（C）。定 T0：唯一同时满足"生产采用广泛 + 编排模型与实证最佳实践吻合 + 开源可自托管"的平台。',
    strengths: [
      {
        claim: '编排模型与生产实证最佳实践吻合',
        compare: 'crewAI 角色制 / 自主多 agent',
        evidence: 'Berkeley《Measuring Agents in Production》：68% 生产系统限制 agent ≤10 步、80% 用人工控制流（B）；graph 编排正是该形态',
        impact: '定级奖励"可控编排"而非"agent 数量"',
        level: 'B',
      },
      {
        claim: '生产采用证据品类最强',
        evidence: 'Uber、LinkedIn、Klarna 等生产采用（B，Alice Labs 2026-08 行业报告）',
        impact: '真实大规模部署是最难伪造的证据',
        level: 'B',
      },
      {
        claim: 'durable execution 原语完整',
        evidence: 'checkpointing、durable execution、human-in-the-loop 为一等原语；1.0 GA（A）',
        impact: '长任务恢复与人工介入不靠用户自建',
        level: 'A',
      },
    ],
    weaknesses: [
      {
        claim: '学习曲线最陡',
        evidence: '10–14 天上手周期（B 级行业估计）',
        impact: '小团队快速原型场景不优',
        level: 'B',
      },
      {
        claim: 'LangSmith 计量成本不可预测',
        evidence: '1 万 traces 后 $2.50/千条，超额成本是主要用户抱怨（C）',
        impact: '规模化后 observability 成本需预算',
        level: 'C',
      },
    ],
    notHigher: [
      '已是最高档；多 agent 本身的收益边界（仅广度优先任务、token 3–4 倍膨胀）同样适用于其上层应用',
    ],
    notLower: [
      '生产采用 + 实证吻合 + 开源可自托管三项同时满足的平台唯一（B/A）',
      '模型中立，无厂商锁定',
    ],
    headToHead: [
      {
        opponent: 'openai-agents-sdk',
        myEdge: ['持久化执行/长任务 checkpoint 内置', '模型中立', '生产采用证据更硬'],
        theirEdge: ['OpenAI 新能力最先落地', 'tracing/guardrails 开箱即用', '更轻量'],
        verdict: '编排深度与生态中立 LangGraph 胜一档；OpenAI 技术栈内 Agents SDK 是合理默认。',
      },
      {
        opponent: 'zapier-agents',
        myEdge: ['真正的编排与状态机', 'durable execution', '生产级采用'],
        theirEdge: ['9,000+ 应用集成', '非技术用户上手'],
        verdict: '一个是工程平台、一个是自动化工具的 AI 贴皮，无悬念。',
      },
    ],
    scores: { autonomy: 7, toolUse: 9, longTask: 9, context: 8, extensibility: 9, stability: 8 },
    keyMetrics: [
      { label: '生产采用', value: 'Uber / LinkedIn / Klarna 等', level: 'B' },
      { label: '1.0 GA', value: '2025-10-22', level: 'A' },
      { label: 'Berkeley 生产调查：人工控制流占比', value: '80% 成功部署', level: 'B' },
      { label: '托管起步价', value: 'Platform $35/月', level: 'A' },
    ],
    sources: [
      { name: 'Anthropic 多 agent 研究系统（成本边界）', url: 'https://www.anthropic.com/engineering/multi-agent-research-system' },
      { name: 'Cognition: Don\'t Build Multi-Agents', url: 'https://cognition.ai/blog/dont-build-multi-agents' },
      { name: 'Alice Labs Best AI Agent Frameworks 2026', url: 'https://alicelabs.com' },
      { name: 'TrueFoundry LangGraph pricing', url: 'https://truefoundry.com' },
    ],
  },
  {
    slug: 'openai-agents-sdk',
    name: 'OpenAI Agents SDK',
    vendor: 'OpenAI',
    category: 'multi',
    tier: 'T1',
    rank: 1,
    tagline:
      'OpenAI 技术栈内的生产默认：轻量 handoff + guardrails + 内置 tracing；无持久化执行，深度绑定一家模型。',
    model: 'OpenAI 模型线（深度绑定）',
    pricing: 'SDK 免费开源；成本为 OpenAI API 消耗',
    evaluatedAt: '2026-08',
    verdict:
      'Swarm 的生产继任者（2025-03 发布，26k+ stars）：轻量 handoff + guardrails + 内置 tracing（OpenTelemetry 导出），OpenAI 自家示例与客户参考的一线框架，新模型能力最先落地。但无持久化执行/长任务 checkpoint（对比 LangGraph 需自建）；handoff 式多 agent 本质是 Cognition 批评的架构类型，官方自己也不主张重度多 agent；深度绑定 OpenAI 模型线。定 T1：OpenAI 栈内的正确默认，编排深度与生态中立性弱于 LangGraph。',
    strengths: [
      {
        claim: 'OpenAI 生态的一线框架',
        evidence: '官方示例与客户参考默认使用；新模型能力最先落地；v0.17.1、26k+ stars（A）',
        impact: 'OpenAI 栈用户的最低摩擦路径',
        level: 'A',
      },
      {
        claim: 'tracing/guardrails 开箱即用',
        evidence: '内置 tracing 支持 OpenTelemetry 导出；guardrails 为一等功能（A）',
        impact: '可观测性不靠三方拼装',
        level: 'A',
      },
      {
        claim: '轻量克制',
        evidence: 'handoff 模型简单，官方不主张重度多 agent（A）——与"多 agent 不一定更优"的实证一致（B）',
        impact: '架构风险低于角色制多 agent',
        level: 'A',
      },
    ],
    weaknesses: [
      {
        claim: '无持久化执行与长任务 checkpoint',
        compare: 'LangGraph 内置 durable execution',
        evidence: '长任务恢复需自建（A/B）',
        impact: '长任务/生产可靠性场景先天不足',
        level: 'A',
      },
      {
        claim: '深度绑定单一厂商',
        evidence: '绑定 OpenAI 模型线（A）',
        impact: '模型切换成本极高',
        level: 'A',
      },
      {
        claim: '无独立生产采用数据',
        evidence: '官方背书强但缺少第三方采用统计（B 级空白）',
        impact: '生产证据弱于 LangGraph',
        level: 'B',
      },
    ],
    notHigher: [
      '无 durable execution/checkpoint，编排深度不足（A）',
      '厂商锁定 + 缺少独立生产采用数据（A/B）',
    ],
    notLower: [
      'OpenAI 官方一线框架，tracing/guardrails 完整（A）',
      '轻量 handoff 模型与实证最佳实践不冲突',
    ],
    headToHead: [
      {
        opponent: 'langgraph',
        myEdge: ['更轻量', 'OpenAI 新能力首发', 'tracing 开箱即用'],
        theirEdge: ['checkpoint/durable execution', '模型中立', '生产采用证据'],
        verdict: '编排深度 LangGraph 胜半档；纯 OpenAI 栈快速落地选 Agents SDK。',
      },
    ],
    scores: { autonomy: 6, toolUse: 8, longTask: 5, context: 6, extensibility: 7, stability: 7 },
    keyMetrics: [
      { label: 'GitHub stars / 版本（2026-05）', value: '26k+ / v0.17.1', level: 'A' },
      { label: '持久化执行', value: '无（需自建）', level: 'A' },
      { label: '独立生产采用统计', value: '未确认', level: 'B' },
    ],
    sources: [
      { name: 'OpenAI Agents SDK 仓库', url: 'https://github.com/openai/openai-agents-python' },
      { name: 'Cognition: Don\'t Build Multi-Agents', url: 'https://cognition.ai/blog/dont-build-multi-agents' },
      { name: 'AgenticWire AutoGen/AG2/MAF 核实（2026-08）', url: 'https://agenticwire.com' },
    ],
  },
  {
    slug: 'autogpt',
    name: 'AutoGPT Platform',
    vendor: 'Significant Gravitas',
    category: 'general',
    tier: 'T3',
    rank: 1,
    tagline:
      '历史地位无需多言，现役 Platform 转向持续型工作流；两个 2026 高危 CVE 与衰退的社区说明了一切。',
    model: '不绑定（用户自带 API key，多模型）',
    pricing: '托管免费 75 runs/月 · Starter $29/月（另有来源 $42.50、无免费层——定价未完全确认）+ credit 钱包',
    evaluatedAt: '2026-08',
    verdict:
      'AutoGPT Classic 已官方停止支持（依赖不再更新、有已知安全问题）；现役 Platform（agpt.co，beta，Polyform Shield）转向低代码 block/工作流、浏览器（Stagehand）、调度/触发器的持续运行 agent。但 2026 年两个高危 CVE（明文记录 API key 8.1 分、未授权代码执行 8.6 分）；第三方实测开放任务成功率约 7/10、复杂任务仍需人工修正；社区讨论稀少、无有效 G2/Trustpilot 评分；行业共识新项目默认选择已转向 Browser Use/CrewAI 等。定 T3：历史地位高、自托管调度型 agent 有独特定位，但作为通用任务 Agent 已被全面超越。',
    strengths: [
      {
        claim: '开源可自托管',
        evidence: 'Platform 为 Polyform Shield 许可，可自托管（A）',
        impact: '数据主权场景仍有价值',
        level: 'A',
      },
      {
        claim: '调度型持续 agent 定位独特',
        evidence: '低代码 block/工作流、调度/触发器、持续运行 agent（A）',
        impact: '"常驻自动化"形态与一次性任务产品错位',
        level: 'A',
      },
    ],
    weaknesses: [
      {
        claim: '2026 年两个高危 CVE',
        compare: '本榜安全记录最差',
        evidence: 'CVE-2026-22038（明文记录 API key，8.1）、CVE-2026-24780（未授权代码执行，8.6）（A/B，NVD 衍生库）；Classic 已停更有已知安全问题（A）',
        impact: '自托管 agent 的安全要求恰好最高',
        level: 'A',
      },
      {
        claim: '任务成功率平庸',
        evidence: '第三方实测：开放式任务成功率约 7/10，失败多为网页抓取；复杂任务仍需人工修正（B，agent-finder 2026-07）',
        impact: '通用任务能力已被全面超越',
        level: 'B',
      },
      {
        claim: '社区信号衰退',
        evidence: 'r/AutoGPT 1.4 万成员但讨论稀少、"AutoGPT 已死"帖；无 G2/Trustpilot 有效评分（B，slicey.ai）',
        impact: '生态活力是开源项目的生命线',
        level: 'B',
      },
    ],
    notHigher: [
      '安全记录（两个 8 分+ CVE）+ 成功率 7/10 + 社区衰退，三项硬伤（A/B）',
      '行业共识新项目默认选择已转向其他产品（B）',
    ],
    notLower: [
      '已是最低档；自托管 + 调度型持续 agent 的细分定位仍有真实用户',
    ],
    headToHead: [
      {
        opponent: 'browser-use',
        myEdge: ['调度/触发器持续运行', '低代码 block 编排'],
        theirEdge: ['浏览器任务成功率', '生态活跃度', '安全记录', '透明定价'],
        verdict: '同为开源路线，Browser Use 在 2026 年全面是更好的选择。',
      },
    ],
    scores: { autonomy: 5, toolUse: 6, longTask: 5, context: 5, extensibility: 7, stability: 4 },
    keyMetrics: [
      { label: '高危 CVE（2026）', value: 'CVE-2026-22038 (8.1) / CVE-2026-24780 (8.6)', level: 'A' },
      { label: '开放任务成功率（第三方实测）', value: '~7/10', level: 'B' },
      { label: 'Classic 状态（官方）', value: '已停止支持', level: 'A' },
    ],
    sources: [
      { name: 'cubxxw AutoGPT 迁移指南（核实官方状态）', url: 'https://cubxxw.com' },
      { name: 'agent-finder AutoGPT 评测（2026-07）', url: 'https://agent-finder.co' },
      { name: 'strix.ai CVE 库', url: 'https://strix.ai/appsecure' },
      { name: 'sellershorts 行业共识（2026-05）', url: 'https://sellershorts.com' },
    ],
  },
  {
    slug: 'zapier-agents',
    name: 'Zapier Agents',
    vendor: 'Zapier',
    category: 'multi',
    tier: 'T3',
    rank: 1,
    tagline:
      '9,000+ 应用集成面最广、非技术用户上手最快；"trigger-action + LLM 贴皮"无真正推理循环，activity 计费是陷阱。',
    model: '未确认（多模型 bolt-on）',
    pricing: 'Agents Free 400 activities/月 · Pro $50/月 1,500 activities（按 activity 计费）',
    evaluatedAt: '2026-08',
    verdict:
      '2026 年拆为 Zap 内 AI agent step 与独立 Agents 产品；9,000+ 应用集成面为自动化领域最广，非技术用户上手最快。但 C 级用户共识其本质是"trigger-action + LLM bolt-on"，无真正推理循环；activity 计费不可预测且无法封顶——一次"研究 10 个 lead"指令可消耗 30 个 activities，1,500 额度消耗远快于直觉（B 级核实），任务量一大即为同类产品中最贵。定 T3：自动化老牌但 agent 能力最浅、计量陷阱最多；简单触发场景可用，严肃 agent 任务不应选择。',
    strengths: [
      {
        claim: '应用集成面最广',
        compare: 'n8n / 代码优先框架',
        evidence: '9,000+ 应用集成（A）',
        impact: '长尾 SaaS 连接不用自己写',
        level: 'A',
      },
      {
        claim: '非技术用户上手最快',
        evidence: '自然语言配置 agent + Zap 生态（A/C）',
        impact: '业务人员自助自动化门槛最低',
        level: 'C',
      },
    ],
    weaknesses: [
      {
        claim: '无真正推理循环',
        evidence: 'C 级用户共识："trigger-action + LLM bolt-on"（C）',
        impact: '按"完整 Agent 系统"标准能力最浅',
        level: 'C',
      },
      {
        claim: 'activity 计费不可预测',
        evidence: '一次"研究 10 个 lead"消耗 30 activities；1,500/月额度远快于直觉耗尽；无法封顶（B，usecarly 2026-07 核实）',
        impact: '成本失控风险为三者中最高',
        level: 'B',
      },
      {
        claim: '规模化后最贵',
        evidence: '任务量一大即为同类中最贵（B/C）',
        impact: '仅适合极低频简单场景',
        level: 'B',
      },
    ],
    notHigher: [
      '无真正推理循环、agent 能力最浅（C）',
      'activity 计量陷阱 + 规模成本最高（B）',
    ],
    notLower: [
      '已是最低档；9,000+ 集成与非技术用户可达性是真实价值',
    ],
    headToHead: [
      {
        opponent: 'langgraph',
        myEdge: ['集成面', '非技术用户上手'],
        theirEdge: ['真正的编排/状态机', '生产采用证据', '成本可控'],
        verdict: '自动化贴牌 vs 工程平台；agent 能力维度无悬念。',
      },
    ],
    scores: { autonomy: 4, toolUse: 6, longTask: 3, context: 4, extensibility: 8, stability: 5 },
    keyMetrics: [
      { label: '应用集成数', value: '9,000+', level: 'A' },
      { label: '单次多步指令消耗', value: '可达 30 activities', level: 'B' },
      { label: 'Pro 额度', value: '$50/月 · 1,500 activities', level: 'A' },
    ],
    sources: [
      { name: 'usecarly Zapier Agents 计费核实（2026-07）', url: 'https://www.usecarly.com' },
      { name: 'Zapier Agents 官方页', url: 'https://zapier.com/agents' },
    ],
  },
]

export const productTierGroups: { tier: ProductTier; items: Product[] }[] =
  PRODUCT_TIER_ORDER.map((tier) => ({
    tier,
    items: products
      .filter((p) => p.tier === tier)
      .sort((a, b) => a.rank - b.rank),
  }))

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function productsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category)
}

export function countByTier(tier: ProductTier): number {
  return products.filter((p) => p.tier === tier).length
}

/** 按 tier → rank 的全量排序（详情页相邻导航用） */
export const sortedProducts: Product[] = [...products].sort((a, b) => {
  const t = PRODUCT_TIER_ORDER.indexOf(a.tier) - PRODUCT_TIER_ORDER.indexOf(b.tier)
  return t !== 0 ? t : a.rank - b.rank
})
