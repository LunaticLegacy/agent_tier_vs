import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import TierBadge from '@/components/TierBadge'
import type { Tier } from '@/data/projects'

gsap.registerPlugin(ScrollTrigger)

const CARDS: { name: string; tier: Tier; title: string; desc: string }[] = [
  {
    name: 'Chidori',
    tier: 'A',
    title: '运行时记录',
    desc: '一切副作用过 host call → 字节级回放。',
  },
  {
    name: 'CompileAgent',
    tier: 'D',
    title: '编译期 IR',
    desc: 'Route Plan → IR → 确定性执行器。',
  },
  {
    name: 'Turn',
    tier: 'D',
    title: '语言层保证',
    desc: 'actor 隔离 + 不可变 epoch 状态。',
  },
]

export default function DeterminismRace() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.5,
        },
      })
      tl.fromTo('.det-line', { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: 3 }, 0)
      CARDS.forEach((_, i) => {
        tl.fromTo(
          `.det-card-${i}`,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          i * 0.75
        )
      })
      tl.fromTo(
        '.det-conclusion',
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power2.out' },
        2.4
      )
    },
    { scope: root }
  )

  return (
    <section ref={root} className="border-t border-line bg-bg py-16 md:py-20">
      <div className="container-site grid gap-12 md:grid-cols-[1fr_1.2fr]">
        <div className="self-start md:sticky md:top-24">
          <p className="mono-label text-ink-faint">INSIGHT 01</p>
          <h2 className="mt-3 font-display text-4xl font-black tracking-tight md:text-5xl">
            <span className="text-vs">01 /</span> 确定性竞赛
          </h2>
          <p className="mt-6 max-w-md text-ink-dim">
            三个互不相同的层级——运行时、编译期、语言层——指向同一件事。
          </p>
          <div className="mt-8 rounded border border-line bg-bg-inset p-4 font-mono text-xs leading-6 text-ink-faint">
            <p>$ replay --from checkpoint_0417</p>
            <p className="text-tier-c">✓ 0 tokens spent</p>
          </div>
        </div>

        <div className="relative pl-10">
          <span
            className="det-line absolute left-2 top-0 h-full w-px origin-top bg-vs"
            aria-hidden
          />
          <div className="space-y-10">
            {CARDS.map((c, i) => (
              <div
                key={c.name}
                className={`det-card-${i} relative rounded border border-line bg-bg-raised p-6`}
              >
                <span className="absolute -left-[35px] top-7 h-2.5 w-2.5 rounded-full border-2 border-vs bg-bg" />
                <div className="flex items-center gap-3">
                  <TierBadge tier={c.tier} size="sm" />
                  <h3 className="font-display text-xl font-bold">{c.name}</h3>
                </div>
                <p className="mono-label mt-4 text-vs">{c.title}</p>
                <p className="mt-2 text-sm text-ink-dim">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="det-conclusion mt-12 border-l-2 border-vs bg-bg-raised p-6">
            <p className="text-lg font-bold leading-8">
              小作坊在集体猛攻同一个方向：让 Agent 的执行
              <span className="text-vs">可回放、可分叉、可测试</span>。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
