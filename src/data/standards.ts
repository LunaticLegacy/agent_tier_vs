import type { DimensionScores, Tier } from './projects'
import type { ProductScores, ProductTier } from './products'

export type EvidenceStatus = 'verified' | 'provisional' | 'watch'

export interface AuditSource {
  label: string
  url: string
}

export interface RankingAudit {
  evidence: EvidenceStatus
  reviewedAt: string
  snapshot: string
  sources: AuditSource[]
  disclosure?: string
}

export const FRAMEWORK_WEIGHTS = {
  architecture: 0.25,
  code: 0.2,
  testCI: 0.15,
  docs: 0.15,
  ecosystem: 0.15,
  radical: 0.1,
} as const satisfies Record<keyof DimensionScores, number>

export const PRODUCT_WEIGHTS = {
  autonomy: 0.15,
  toolUse: 0.15,
  longTask: 0.2,
  context: 0.15,
  extensibility: 0.15,
  stability: 0.2,
} as const satisfies Record<keyof ProductScores, number>

const round = (value: number) => Math.round(value * 10) / 10

export function scoreFramework(scores: DimensionScores): number {
  return round(
    (Object.keys(FRAMEWORK_WEIGHTS) as (keyof DimensionScores)[]).reduce(
      (total, key) => total + scores[key] * FRAMEWORK_WEIGHTS[key],
      0
    )
  )
}

export function scoreProduct(scores: ProductScores): number {
  return round(
    (Object.keys(PRODUCT_WEIGHTS) as (keyof ProductScores)[]).reduce(
      (total, key) => total + scores[key] * PRODUCT_WEIGHTS[key],
      0
    )
  )
}

const capFrameworkTier = (tier: Tier, evidence: EvidenceStatus): Tier => {
  if (evidence !== 'watch') return tier
  return tier === 'S' || tier === 'A' || tier === 'B' ? 'C' : tier
}

export function classifyFramework(scores: DimensionScores, audit: RankingAudit): Tier {
  const score = scoreFramework(scores)
  let tier: Tier

  if (score >= 9 && scores.architecture >= 8 && scores.code >= 8 && scores.testCI >= 8 && audit.evidence === 'verified') {
    tier = 'S'
  } else if (score >= 7.5 && scores.code >= 7 && scores.testCI >= 6 && audit.evidence !== 'watch') {
    tier = 'A'
  } else if (score >= 6.5 && scores.testCI >= 5 && audit.evidence !== 'watch') {
    tier = 'B'
  } else if (score >= 5 && scores.testCI >= 4) {
    tier = 'C'
  } else {
    tier = 'D'
  }

  return capFrameworkTier(tier, audit.evidence)
}

const capProductTier = (tier: ProductTier, evidence: EvidenceStatus): ProductTier => {
  if (evidence !== 'watch') return tier
  return tier === 'T0' || tier === 'T1' || tier === 'T2' ? 'T3' : tier
}

export function classifyProduct(scores: ProductScores, audit: RankingAudit): ProductTier {
  const score = scoreProduct(scores)
  let tier: ProductTier

  if (score >= 8.2 && scores.stability >= 7 && audit.evidence === 'verified') {
    tier = 'T0'
  } else if (score >= 7 && scores.stability >= 6 && audit.evidence !== 'watch') {
    tier = 'T1'
  } else if (score >= 5.5) {
    tier = 'T2'
  } else {
    tier = 'T3'
  }

  return capProductTier(tier, audit.evidence)
}

const reviewDate = '2026-08-16'

const defaultFrameworkAudit = (slug: string): RankingAudit => ({
  evidence: 'provisional',
  reviewedAt: reviewDate,
  snapshot: '代码结构复核；公开 commit 快照待补档',
  sources: [],
  disclosure: `条目 ${slug} 尚未附公开证据包；不得进入 S 级。`,
})

const frameworkAudits: Record<string, RankingAudit> = {
  llmfetcher: {
    evidence: 'watch',
    reviewedAt: reviewDate,
    snapshot: 'GitHub main；README 标注 active development，未发布 release/package 快照',
    sources: [{ label: 'LunaticLegacy/llmfetcher', url: 'https://github.com/LunaticLegacy/llmfetcher' }],
    disclosure: '作者关联项目：仅采纳公开仓库事实；证据状态封顶为「观察」，不得进入 A/B/S。',
  },
}

export function auditForFramework(slug: string): RankingAudit {
  return frameworkAudits[slug] ?? defaultFrameworkAudit(slug)
}

const verifiedProducts = new Set([
  'claude-code',
  'openai-codex',
  'github-copilot',
  'devin',
  'chatgpt-deep-research',
  'gemini-deep-research',
  'perplexity-deep-research',
])

const productAudits: Record<string, RankingAudit> = {
  openclaw: {
    evidence: 'verified',
    reviewedAt: reviewDate,
    snapshot: '官方 docs + GitHub 仓库 + CSA 独立安全研究；功能已核验，任务成功率未统一复现',
    sources: [
      { label: 'OpenClaw Docs', url: 'https://docs.openclaw.ai/' },
      { label: 'OpenClaw GitHub', url: 'https://github.com/openclaw/openclaw' },
    ],
  },
  'hermes-agent': {
    evidence: 'verified',
    reviewedAt: reviewDate,
    snapshot: '官方仓库 + 官方产品资料 + CSA 独立安全研究；能力已核验，默认高权限部署需硬化',
    sources: [
      { label: 'NousResearch/hermes-agent', url: 'https://github.com/NousResearch/hermes-agent' },
      { label: 'Cloud Security Alliance 研究说明', url: 'https://labs.cloudsecurityalliance.org/wp-content/uploads/2026/05/CSA_research_note_hermes_agent_CVEs_20260504-csa-styled.pdf' },
    ],
  },
  angelus: {
    evidence: 'watch',
    reviewedAt: reviewDate,
    snapshot: 'GitHub main；124 commits；llmfetcher 子模块固定 e1fe5f6；无 release 或第三方任务评测',
    sources: [{ label: 'LunaticLegacy/angelus', url: 'https://github.com/LunaticLegacy/angelus' }],
    disclosure: '作者关联项目：仅采纳公开仓库事实；证据状态封顶为「观察」，不得进入 T0/T1/T2。',
  },
}

export function auditForProduct(slug: string): RankingAudit {
  if (productAudits[slug]) return productAudits[slug]
  return {
    evidence: verifiedProducts.has(slug) ? 'verified' : 'provisional',
    reviewedAt: reviewDate,
    snapshot: verifiedProducts.has(slug)
      ? '至少一项可直接核验的外部证据，仍按评审时点快照解释'
      : '公开资料交叉复核；缺少统一可复现实测或版本锁定',
    sources: [],
  }
}

export const EVIDENCE_STATUS_META: Record<EvidenceStatus, { label: string; color: string; description: string }> = {
  verified: {
    label: '已验证',
    color: '#4ADE80',
    description: '有直接、可公开复核的外部证据；仍仅代表评审时点。',
  },
  provisional: {
    label: '暂定',
    color: '#38BDF8',
    description: '公开资料足以形成初判，但没有完整的版本锁定或独立复现实测。',
  },
  watch: {
    label: '观察',
    color: '#F5C518',
    description: '证据、成熟度或利益关系需要额外审视；高 Tier 自动封顶。',
  },
}
