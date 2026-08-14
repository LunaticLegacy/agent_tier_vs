import { motion } from 'framer-motion'

const TITLE = '评审方法论'
const STATUS = ['STATUS: PUBLISHED', 'SCOPE: 17 repos', 'METHOD: full-code-read']

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

export default function AboutHero() {
  return (
    <section className="container-site pt-20 pb-16 md:pt-28 md:pb-20">
      <div className="grid items-start gap-10 md:grid-cols-[1fr_320px]">
        <div>
          <p className="mono-label text-vs">METHODOLOGY v2026.08</p>
          <h1 className="mt-4 text-5xl font-black tracking-tight md:text-6xl" aria-label={TITLE}>
            {TITLE.split('').map((ch, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.03 * i, duration: 0.8, ease: EASE }}
              >
                {ch}
              </motion.span>
            ))}
          </h1>
          <motion.p
            className="mt-6 max-w-2xl text-base leading-8 text-ink-dim md:text-lg"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: EASE }}
          >
            任何排名都是主观的。让排名可信的唯一方式，是公开评审过程。
          </motion.p>
        </div>
        <div className="rounded border border-line bg-bg-inset p-5 font-mono text-xs leading-7">
          {STATUS.map((s, i) => (
            <motion.p
              key={s}
              className={i === 0 ? 'text-tier-c' : 'text-ink-dim'}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.35, duration: 0.3 }}
            >
              {s}
              {i === 0 && <span className="animate-cursor-blink">▌</span>}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  )
}
