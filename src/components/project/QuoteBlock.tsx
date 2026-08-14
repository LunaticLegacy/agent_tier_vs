import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/** 评审语录块：4px Tier 色竖条 + 超大引号装饰 + clip-path 揭开 */
export default function QuoteBlock({ quote, color }: { quote: string; color: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20% 0px' })

  return (
    <div ref={ref} className="relative overflow-hidden bg-bg-raised py-10 pl-8 pr-6 md:pl-12">
      <motion.div
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: color, transformOrigin: 'center' }}
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : undefined}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
      <img
        src="/quote-mark.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -left-2 -top-4 h-24 w-auto opacity-10"
      />
      <motion.blockquote
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={inView ? { clipPath: 'inset(0 0% 0 0)' } : undefined}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-2xl font-medium leading-relaxed text-ink md:text-[28px]">
          “{quote}”
        </p>
        <footer className="mono-label mt-4 text-ink-faint">— 代码级评审 · 2026.08</footer>
      </motion.blockquote>
    </div>
  )
}
