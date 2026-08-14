import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const LINES = [
  '天花板不在智力，而在带宽。',
  'llmfetcher 的 TaskBus 语义再严谨，也只有一个维护者。',
  'PocketFlow 99 行核心之外，压着 72 个 open issue。',
]

const ENDPOINTS = [
  { name: 'fsm-llm', note: '停更', pos: 0.18 },
  { name: 'micro-agent', note: '2024-11 最后提交', pos: 0.52 },
  { name: 'Atlas', note: '两周封存', pos: 0.85 },
]

export default function BusFactor() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // count-up 11/17
      const counter = { v: 0 }
      gsap.to(counter, {
        v: 11,
        duration: 1.5,
        ease: 'power2.out',
        snap: { v: 1 },
        scrollTrigger: { trigger: '.bus-number', start: 'top 80%', once: true },
        onUpdate: () => {
          const el = root.current?.querySelector('.bus-count')
          if (el) el.textContent = String(counter.v)
        },
      })
      gsap.from('.bus-line', {
        y: 24,
        opacity: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.bus-lines', start: 'top 80%', once: true },
      })
      // timeline scrub
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.bus-timeline',
          start: 'top 85%',
          end: 'top 35%',
          scrub: 0.5,
        },
      })
      tl.fromTo('.bus-track-fill', { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1 })
      ENDPOINTS.forEach((_, i) => {
        tl.fromTo(
          `.bus-node-${i}`,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.2, ease: 'back.out(2)' },
          ENDPOINTS[i].pos
        ).to(`.bus-node-${i}`, { x: 2, duration: 0.05, yoyo: true, repeat: 3 }, ENDPOINTS[i].pos + 0.22)
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} className="border-t border-line py-24 md:py-32">
      <div className="container-site">
        <p className="mono-label text-ink-faint">INSIGHT 04</p>
        <h2 className="mt-3 font-display text-4xl font-black tracking-tight md:text-5xl">
          <span className="text-vs">04 /</span> Bus Factor = 1 的宿命
        </h2>

        <div className="mt-12 rounded border border-line bg-bg-raised p-8 md:p-14">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="bus-number font-mono text-7xl font-semibold tracking-tight md:text-8xl">
                <span className="bus-count text-vs">0</span>
                <span className="text-ink-faint">/17</span>
              </p>
              <p className="mono-label mt-4 text-ink-dim">个人项目占比</p>
            </div>
            <div className="bus-lines space-y-5">
              {LINES.map((l) => (
                <p key={l} className="bus-line border-l border-line pl-4 text-base leading-7 text-ink-dim">
                  {l}
                </p>
              ))}
            </div>
          </div>

          {/* lifeline timeline */}
          <div className="bus-timeline relative mt-16 pt-12">
            <div className="relative h-px bg-line">
              <div className="bus-track-fill absolute inset-0 origin-left bg-ink-dim" />
              {ENDPOINTS.map((e, i) => (
                <div
                  key={e.name}
                  className={`bus-node-${i} absolute -top-1.5`}
                  style={{ left: `${e.pos * 100}%` }}
                >
                  <span className="block h-3 w-3 rounded-full bg-danger shadow-[0_0_12px_rgba(244,63,94,0.5)]" />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                    <p className="font-mono text-xs font-semibold text-ink">{e.name}</p>
                    <p className="font-mono text-[10px] text-danger">{e.note} ✕</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mono-label mt-6 text-ink-faint">单人项目终止点 · TERMINATION LOG</p>
          </div>
        </div>
      </div>
    </section>
  )
}
