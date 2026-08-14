import { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const TERMINAL = [
  '$ git clone <repo>        # × 17',
  '$ wc -l **/*.ts | sort    # 量化之前先定性',
  '$ make tier VERDICT=final',
]

export default function MethodologyConclusion() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
      })
      tl.from('.mc-block', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12 })
      tl.from('.mc-term-line', { opacity: 0, x: -12, duration: 0.3, stagger: 0.4 }, 0.4)
      tl.from('.mc-btn', { scale: 0.85, opacity: 0, duration: 0.5, ease: 'back.out(1.8)', stagger: 0.1 }, '+=0.2')
    },
    { scope: root }
  )

  return (
    <section ref={root} className="border-t border-line py-24 md:py-32">
      <div className="container-site">
        <div className="mx-auto max-w-[720px]">
          <p className="mc-block mono-label text-ink-faint">INSIGHT 05</p>
          <h2 className="mc-block mt-3 font-display text-4xl font-black tracking-tight md:text-5xl">
            <span className="text-vs">05 /</span> 评审方法本身是一条洞察
          </h2>
          <p className="mc-block mt-8 text-base leading-8 text-ink-dim">
            README 是营销稿，代码才是候选人陈述。本次评审实际 clone 全部 17 个仓库逐模块阅读——多个项目的外界口碑与代码实相差距巨大：星数 7k 的超市火候欠佳，星数 2 的小库隔离决绝。排名会过时，「读代码再投票」不会。
          </p>
          <div className="mc-block mt-10 rounded border border-line bg-bg-inset p-6 font-mono text-sm leading-8">
            {TERMINAL.map((l) => (
              <p key={l} className="mc-term-line text-ink-dim">
                <span className="text-ink-faint">{l.slice(0, 1)}</span>
                {l.slice(1)}
              </p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/about"
              className="mc-btn inline-block bg-vs px-6 py-3 font-bold text-[#0A0B0E] transition-transform hover:scale-[1.03]"
              data-cursor="link"
            >
              查看方法论 →
            </Link>
            <Link
              to="/"
              className="mc-btn inline-block border border-line-bright px-6 py-3 font-bold text-ink transition-colors hover:border-vs hover:text-vs"
              data-cursor="link"
            >
              回到总榜 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
