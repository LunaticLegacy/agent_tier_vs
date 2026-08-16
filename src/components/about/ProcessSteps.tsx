import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const STEPS = [
  {
    cmd: 'CLONE',
    desc: '记录公开仓库、评审日期与可获得的版本快照；缺失项会降为暂定或观察。',
    term: '$ audit snapshot --record',
  },
  {
    cmd: 'READ',
    desc: '逐模块审阅入口、编排、工具、错误处理与测试，并把可核验来源附到条目。',
    term: '$ audit evidence --attach',
  },
  {
    cmd: 'SCORE',
    desc: '六维打分（各 0–10）按公开权重计算；评语不能人工覆盖总分。',
    term: '$ score --formula=public',
  },
  {
    cmd: 'RANK',
    desc: '按总分与硬门槛分类；证据状态和利益披露公开展示但不改变 Tier。产品仅在同赛道内排序。',
    term: '$ classify --gates --evidence',
  },
]

export default function ProcessSteps() {
  return (
    <section className="container-site border-t border-line py-20 md:py-28">
      <p className="mono-label text-ink-faint">SECTION 01</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
        <span className="font-mono text-vs">01 /</span> 评审流程
      </h2>

      <motion.ol
        className="mt-12 grid gap-6 md:grid-cols-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.12 }}
      >
        {STEPS.map((s, i) => (
          <motion.li
            key={s.cmd}
            className="relative"
            variants={{
              hidden: { y: 40, opacity: 0 },
              show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: EASE } },
            }}
          >
            {/* dashed connector (desktop) */}
            {i < STEPS.length - 1 && (
              <motion.svg
                className="absolute left-full top-9 hidden h-4 w-6 md:block"
                viewBox="0 0 24 8"
                initial={{ strokeDashoffset: 24 }}
                whileInView={{ strokeDashoffset: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.2, duration: 0.5 }}
              >
                <line x1="0" y1="4" x2="20" y2="4" stroke="#4A5568" strokeDasharray="3 3" strokeDashoffset="0" />
                <path d="M18 1 L23 4 L18 7" fill="none" stroke="#4A5568" />
              </motion.svg>
            )}
            <motion.div
              className="group h-full rounded border border-line bg-bg-raised p-6 transition-colors hover:border-line-bright"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-mono text-4xl font-semibold text-ink-faint transition-colors group-hover:text-vs">
                {String(i + 1).padStart(2, '0')}
              </p>
              <p className="mt-4 font-mono text-lg font-bold tracking-wider text-ink">{s.cmd}</p>
              <p className="mt-3 text-sm leading-7 text-ink-dim">{s.desc}</p>
              <p className="mt-4 border-t border-line pt-3 font-mono text-[11px] text-ink-faint">{s.term}</p>
            </motion.div>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  )
}
