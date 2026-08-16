import { motion } from 'framer-motion'
import TierBadge from '@/components/TierBadge'
import type { Tier } from '@/data/projects'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const ROWS: { tier: Tier; name: string; range: string; def: string }[] = [
  { tier: 'S', name: '顶级工程', range: '≥ 9.0 + 已验证', def: '架构、代码、测试均 ≥8，且有公开可复核证据。' },
  { tier: 'A', name: '一流', range: '≥ 7.5 + 硬门槛', def: '代码 ≥7、测试 ≥6；由工程能力与公式分数共同决定。' },
  { tier: 'B', name: '扎实有特色', range: '≥ 6.5 + 测试 ≥5', def: '工程能力已形成闭环，但证据或某些维度未达 A。' },
  { tier: 'C', name: '有想法但单薄', range: '≥ 5.0', def: '能力有价值但测试、工程完成度或成熟度不足。' },
  { tier: 'D', name: '概念验证', range: '< 5.0 / 硬失败', def: '低分或测试不足，作为研究路标而非生产推荐。' },
]

export default function TierTable() {
  return (
    <section className="container-site border-t border-line py-20 md:py-28">
      <p className="mono-label text-ink-faint">SECTION 03</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
        <span className="font-mono text-vs">03 /</span> Tier 分级标准
      </h2>

      <motion.div
        className="mt-12 divide-y divide-line border-y border-line"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.08 }}
      >
        {ROWS.map((r) => (
          <motion.div
            key={r.tier}
            className="grid items-center gap-3 py-5 transition-colors hover:bg-bg-raised md:grid-cols-[64px_160px_140px_1fr] md:gap-6"
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
              <TierBadge tier={r.tier} size="lg" />
            </motion.div>
            <p className="text-lg font-bold">{r.name}</p>
            <p className="font-mono text-sm text-vs">{r.range}</p>
            <p className="text-sm leading-7 text-ink-dim">{r.def}</p>
          </motion.div>
        ))}
      </motion.div>
      <p className="mt-4 font-mono text-xs text-ink-faint">
        * 分数由公开公式计算；Tier 受工程门槛影响，S 级另需已验证证据。S 级目前空缺：没有条目同时满足
        ≥9 分、架构/代码/测试门槛及已验证证据。
      </p>
    </section>
  )
}
