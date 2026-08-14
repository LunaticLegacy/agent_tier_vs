import { motion } from 'framer-motion'
import TierBadge from '@/components/TierBadge'
import type { Tier } from '@/data/projects'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const ROWS: { tier: Tier; name: string; range: string; def: string }[] = [
  { tier: 'S', name: '顶级工程', range: '≥ 9.0', def: '架构、质量、测试三线全优，可作行业基准。' },
  { tier: 'A', name: '一流', range: '8.0 – 8.9', def: '可托付生产，各有绝活，短板不致命。' },
  { tier: 'B', name: '扎实有特色', range: '6.5 – 7.9', def: '一招鲜吃透一件事，其余平庸但诚实。' },
  { tier: 'C', name: '有想法但单薄', range: '5.0 – 6.4', def: '点子锋利，身板单薄，生态/维护堪忧。' },
  { tier: 'D', name: '概念验证', range: '< 5.0', def: '思想先行或已停更，仅作路标价值。' },
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
        * 分数为门槛，裁决为评审合议；同 Tier 内排名按编号序。S 级目前空缺：受评 18
        个框架无一同时达到顶级工程与顶级生态（原 S 级 deepseek-harness
        经重新定级为 Agent 运行时产品，移入产品榜 T1）。
      </p>
    </section>
  )
}
