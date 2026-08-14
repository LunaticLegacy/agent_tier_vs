import { motion } from 'framer-motion'
import { ProductTierBadge } from '@/components/TierBadge'
import EvidenceBadge from '@/components/product/EvidenceBadge'
import type { ProductTier } from '@/data/products'
import { EVIDENCE_META } from '@/data/products'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const PRODUCT_ROWS: { tier: ProductTier; name: string; def: string }[] = [
  { tier: 'T0', name: '第一梯队', def: '综合能力与生态处于行业最前列；不等于可安全无人值守。' },
  { tier: 'T1', name: '强力成熟', def: '能力成熟可用，存在已验证的短板或信任减分项。' },
  { tier: 'T2', name: '可用有限制', def: '特定场景可用，可靠性、成本或证据不足以托付关键任务。' },
  { tier: 'T3', name: '能力有限', def: '能力浅、证据弱或已衰退，仅适合简单场景或研究参考。' },
]

const EVIDENCE_ORDER = ['A', 'B', 'C', 'D'] as const

/** 产品榜分级定义（T0–T3）+ 证据等级说明 */
export default function ProductTierTable() {
  return (
    <section className="container-site border-t border-line py-20 md:py-28">
      <p className="mono-label text-ink-faint">SECTION 03B</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
        <span className="font-mono text-vs">03b /</span> 产品榜分级（T0–T3）
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-dim">
        产品榜评估的是 Model + Harness + 工具 + Runtime 的完整系统。<span className="text-ink">允许分赛道定级</span>：
        同一厂商的产品在不同赛道（编程 / 通用 / 研究 / 浏览器 / 多智能体）可获不同 Tier，跨赛道比较仅供参考。
        分类原则：import 进来造自己 agent 的库进框架榜；开箱即用的 Agent 运行时（harness，如
        deepseek-harness）进产品榜。
      </p>

      <motion.div
        className="mt-12 divide-y divide-line border-y border-line"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.08 }}
      >
        {PRODUCT_ROWS.map((r) => (
          <motion.div
            key={r.tier}
            className="grid items-center gap-3 py-5 transition-colors hover:bg-bg-raised md:grid-cols-[64px_160px_1fr] md:gap-6"
            variants={{
              hidden: { x: -30, opacity: 0 },
              show: { x: 0, opacity: 1, transition: { duration: 0.6, ease: EASE } },
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              <ProductTierBadge tier={r.tier} size="lg" />
            </motion.div>
            <p className="text-lg font-bold">{r.name}</p>
            <p className="text-sm leading-7 text-ink-dim">{r.def}</p>
          </motion.div>
        ))}
      </motion.div>

      <h3 className="mt-16 text-xl font-bold">
        <span className="mono-label mr-3 text-ink-faint">证据等级</span>A – D
      </h3>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-dim">
        产品榜的每条优势、短板与关键指标都标注证据等级。厂商自报基准（含官方 benchmark）一律标注
        「自报」并降权；未确认的信息如实标注「未确认」，不做猜测性补全。
      </p>
      <motion.div
        className="mt-8 divide-y divide-line border-y border-line"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.08 }}
      >
        {EVIDENCE_ORDER.map((lv) => (
          <motion.div
            key={lv}
            className="grid items-center gap-3 py-4 transition-colors hover:bg-bg-raised md:grid-cols-[80px_1fr] md:gap-6"
            variants={{
              hidden: { x: -30, opacity: 0 },
              show: { x: 0, opacity: 1, transition: { duration: 0.6, ease: EASE } },
            }}
          >
            <EvidenceBadge level={lv} className="justify-center" />
            <p className="text-sm leading-7 text-ink-dim">{EVIDENCE_META[lv].definition}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
