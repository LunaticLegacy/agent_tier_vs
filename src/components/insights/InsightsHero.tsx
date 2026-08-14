import { useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(SplitText)

const ASCII_SCATTER = `
激进度
 10 ·        ·                    ·
  9 ·   ·
  8 ·              ·        ·
  7 ·   ·     ·          ·
  6 ·          ·  ·   ·       ·   ·
  5 ·                    ·
  4 ·
    └──────────────────────────────→ 星数(log)
      1    10   100   1k    10k   100k
`

export default function InsightsHero() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const split = new SplitText('.insights-title', { type: 'chars' })
      gsap.from(split.chars, {
        y: 60,
        opacity: 0,
        stagger: 0.03,
        duration: 0.8,
        ease: 'power3.out',
      })
      gsap.from('.insights-intro', { y: 40, opacity: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' })
      gsap.from('.insights-ascii', { opacity: 0, duration: 1.2, delay: 0.6 })
      return () => split.revert()
    },
    { scope: root }
  )

  return (
    <section ref={root} className="container-site pt-20 pb-16 md:pt-28 md:pb-20">
      <div className="grid items-start gap-10 md:grid-cols-[1fr_360px]">
        <div>
          <p className="mono-label text-vs">PATTERNS ACROSS 17 CODEBASES</p>
          <h1 className="insights-title mt-4 text-5xl font-black tracking-tight md:text-6xl">
            横向洞察
          </h1>
          <p className="insights-intro mt-6 max-w-2xl text-base leading-8 text-ink-dim md:text-lg">
            排名是个体裁决，洞察是群体画像。以下 5 条规律，只在把 18 份代码全部读完后才会浮现。
          </p>
        </div>
        <pre className="insights-ascii hidden overflow-x-auto rounded border border-line bg-bg-inset p-4 font-mono text-[10px] leading-4 text-ink-faint md:block">
          {ASCII_SCATTER}
        </pre>
      </div>
    </section>
  )
}
