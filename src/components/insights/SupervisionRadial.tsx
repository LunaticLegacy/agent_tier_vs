import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import TierBadge from '@/components/TierBadge'
import type { Tier } from '@/data/projects'

gsap.registerPlugin(ScrollTrigger)

// SVG coordinate plan (viewBox 0 0 900 520), center at (450,260)
const CENTER = { x: 450, y: 260 }
const NODES: { name: string; tier: Tier; mech: string; x: number; y: number }[] = [
  { name: 'Turn', tier: 'D', mech: 'actor 隔离', x: 130, y: 110 },
  { name: 'MAAP', tier: 'C', mech: '有界 mailbox 背压 + 重启预算 + DeadLetter', x: 770, y: 110 },
  { name: 'Chidori', tier: 'A', mech: 'host call 监督', x: 450, y: 470 },
]

// anchor points on the radial lines near each node card
const ANCHORS = NODES.map((n) => {
  const dx = n.x - CENTER.x
  const dy = n.y - CENTER.y
  const len = Math.hypot(dx, dy)
  const t = (len - 90) / len
  return { x: CENTER.x + dx * t, y: CENTER.y + dy * t }
})

export default function SupervisionRadial() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const lines = gsap.utils.toArray<SVGLineElement>('.sup-line')
      lines.forEach((l) => {
        const len = Math.hypot(
          Number(l.getAttribute('x2')) - Number(l.getAttribute('x1')),
          Number(l.getAttribute('y2')) - Number(l.getAttribute('y1'))
        )
        gsap.set(l, { strokeDasharray: len, strokeDashoffset: len })
      })
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
      })
      tl.from('.sup-center', { scale: 0, transformOrigin: 'center', duration: 0.6, ease: 'back.out(1.8)' })
      tl.to(lines, { strokeDashoffset: 0, duration: 0.6, stagger: 0.3, ease: 'power2.inOut' }, 0.2)
      tl.from(
        '.sup-node',
        { scale: 0.8, opacity: 0, transformOrigin: 'center', duration: 0.5, stagger: 0.3, ease: 'back.out(1.6)' },
        0.7
      )
    },
    { scope: root }
  )

  return (
    <section ref={root} className="border-t border-line py-24 md:py-32">
      <div className="container-site">
        <p className="mono-label text-ink-faint">INSIGHT 02</p>
        <h2 className="mt-3 font-display text-4xl font-black tracking-tight md:text-5xl">
          <span className="text-vs">02 /</span> 监督树的三次独立重发现
        </h2>
        <p className="mt-6 max-w-3xl text-ink-dim">
          三个互不相识的项目，各自重新发明了 1986 年的答案。容错与监督，是 Agent 编排绕不开的终局问题。
        </p>

        <div className="mt-14 hidden md:block">
          <svg viewBox="0 0 900 520" className="w-full" role="img" aria-label="监督树辐射图">
            {NODES.map((n, i) => (
              <line
                key={n.name}
                className="sup-line"
                x1={CENTER.x}
                y1={CENTER.y}
                x2={ANCHORS[i].x}
                y2={ANCHORS[i].y}
                stroke="#FF5C38"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            ))}
            <g className="sup-center">
              <circle cx={CENTER.x} cy={CENTER.y} r="72" fill="#101318" stroke="#8A94A6" strokeDasharray="5 5" strokeWidth="1.5" />
              <text x={CENTER.x} y={CENTER.y - 6} textAnchor="middle" fill="#E8ECF1" fontSize="18" fontWeight="700">
                Erlang / OTP
              </text>
              <text x={CENTER.x} y={CENTER.y + 18} textAnchor="middle" fill="#4A5568" fontSize="12" fontFamily="monospace">
                语义 · 1986
              </text>
            </g>
            {NODES.map((n) => (
              <g key={n.name} className="sup-node">
                <circle cx={n.x} cy={n.y} r="5" fill="#FF5C38" />
                <circle cx={n.x} cy={n.y} r="10" fill="none" stroke="#FF5C38" strokeOpacity="0.4" />
              </g>
            ))}
          </svg>
          {/* node cards overlaid as grid for readable text */}
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {NODES.map((n) => (
              <div key={n.name} className="sup-node rounded border border-line bg-bg-raised p-5">
                <div className="flex items-center gap-3">
                  <TierBadge tier={n.tier} size="sm" />
                  <h3 className="font-display text-lg font-bold">{n.name}</h3>
                </div>
                <p className="mt-3 text-sm text-ink-dim">{n.mech}</p>
              </div>
            ))}
          </div>
        </div>

        {/* mobile fallback: simple stacked cards */}
        <div className="mt-10 space-y-4 md:hidden">
          <div className="rounded border border-dashed border-ink-dim bg-bg-raised p-4 text-center">
            <p className="font-display text-lg font-bold">Erlang / OTP 语义</p>
            <p className="font-mono text-xs text-ink-faint">1986</p>
          </div>
          {NODES.map((n) => (
            <div key={n.name} className="rounded border border-line bg-bg-raised p-4">
              <div className="flex items-center gap-3">
                <TierBadge tier={n.tier} size="sm" />
                <h3 className="font-display font-bold">{n.name}</h3>
              </div>
              <p className="mt-2 text-sm text-ink-dim">{n.mech}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
