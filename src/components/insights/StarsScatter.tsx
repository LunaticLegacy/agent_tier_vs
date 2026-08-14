import { useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { projects, TIER_META } from '@/data/projects'

gsap.registerPlugin(ScrollTrigger)

const W = 1080
const H = 480
const PAD = { left: 70, right: 40, top: 30, bottom: 56 }

function xPos(stars: number) {
  const t = Math.log10(Math.max(1, stars)) / 5 // 1 → 100k
  return PAD.left + t * (W - PAD.left - PAD.right)
}
function yPos(radical: number) {
  return PAD.top + (1 - radical / 10) * (H - PAD.top - PAD.bottom)
}

const X_TICKS = [
  { v: 1, label: '1' },
  { v: 10, label: '10' },
  { v: 100, label: '100' },
  { v: 1000, label: '1k' },
  { v: 10000, label: '10k' },
  { v: 100000, label: '100k' },
]

const HIGHLIGHTS = [
  { name: 'Turn', label: '10★', dx: -14, dy: -34 },
  { name: 'swarms', label: '7k★', dx: 16, dy: -30 },
]

interface Pt {
  name: string
  stars: number
  radical: number
  color: string
  x: number
  y: number
  highlight: boolean
  label?: string
}

export default function StarsScatter() {
  const root = useRef<HTMLElement>(null)
  const [tip, setTip] = useState<Pt | null>(null)

  const points = useMemo<Pt[]>(() => {
    return [...projects]
      .sort((a, b) => a.starValue - b.starValue)
      .map((p) => {
        const hl = HIGHLIGHTS.find((h) => h.name === p.name)
        return {
          name: p.name,
          stars: p.starValue,
          radical: p.dimensions.radical,
          color: TIER_META[p.tier].color,
          x: xPos(p.starValue),
          y: yPos(p.dimensions.radical),
          highlight: !!hl,
          label: hl?.label,
        }
      })
  }, [])

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.scatter-svg', start: 'top 75%', once: true },
      })
      tl.from('.scatter-axis', {
        strokeDashoffset: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
      })
      tl.from(
        '.scatter-dot',
        { scale: 0, transformOrigin: 'center', duration: 0.5, stagger: 0.04, ease: 'back.out(2)' },
        0.4
      )
      tl.fromTo(
        '.scatter-hl',
        { opacity: 0.5 },
        { opacity: 1, duration: 0.5, repeat: 3, yoyo: true, ease: 'power1.inOut' },
        1.4
      )
      tl.from('.scatter-note', { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' }, 1.8)
    },
    { scope: root }
  )

  return (
    <section ref={root} className="border-t border-line bg-bg-inset/40 py-24 md:py-32">
      <div className="container-site">
        <p className="mono-label text-ink-faint">INSIGHT 03</p>
        <h2 className="mt-3 font-display text-4xl font-black tracking-tight md:text-5xl">
          <span className="text-vs">03 /</span> 星数与思想密度不相关
        </h2>

        <div className="relative mt-12 overflow-x-auto">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="scatter-svg w-full min-w-[720px]"
            role="img"
            aria-label="星数与思想激进度散点图"
          >
            {/* axes */}
            <line
              className="scatter-axis"
              x1={PAD.left}
              y1={H - PAD.bottom}
              x2={W - PAD.right}
              y2={H - PAD.bottom}
              stroke="#2E3A4A"
              strokeWidth="1.5"
              pathLength={1}
              strokeDasharray={1}
            />
            <line
              className="scatter-axis"
              x1={PAD.left}
              y1={H - PAD.bottom}
              x2={PAD.left}
              y2={PAD.top}
              stroke="#2E3A4A"
              strokeWidth="1.5"
              pathLength={1}
              strokeDasharray={1}
            />
            {/* x ticks */}
            {X_TICKS.map((t) => (
              <g key={t.label}>
                <line x1={xPos(t.v)} y1={H - PAD.bottom} x2={xPos(t.v)} y2={H - PAD.bottom + 6} stroke="#4A5568" />
                <text x={xPos(t.v)} y={H - PAD.bottom + 24} textAnchor="middle" fill="#4A5568" fontSize="12" fontFamily="monospace">
                  {t.label}
                </text>
              </g>
            ))}
            {/* y ticks */}
            {[0, 2, 4, 6, 8, 10].map((v) => (
              <g key={v}>
                <line x1={PAD.left - 6} y1={yPos(v)} x2={PAD.left} y2={yPos(v)} stroke="#4A5568" />
                <text x={PAD.left - 12} y={yPos(v) + 4} textAnchor="end" fill="#4A5568" fontSize="12" fontFamily="monospace">
                  {v}
                </text>
              </g>
            ))}
            <text x={W - PAD.right} y={H - 10} textAnchor="end" fill="#4A5568" fontSize="12" fontFamily="monospace">
              GitHub 星数（log）
            </text>
            <text x={16} y={PAD.top} fill="#4A5568" fontSize="12" fontFamily="monospace" transform={`rotate(-90 16 ${PAD.top})`}>
              思想激进度
            </text>

            {/* dots */}
            {points.map((p) => (
              <g key={p.name}>
                {p.highlight && (
                  <g className="scatter-hl" pointerEvents="none">
                    <circle cx={p.x} cy={p.y} r="16" fill="none" stroke="#FF5C38" strokeWidth="2" />
                    <line
                      x1={p.x}
                      y1={p.y - 16}
                      x2={p.x + (p.name === 'Turn' ? -14 : 16)}
                      y2={p.y - 28}
                      stroke="#FF5C38"
                    />
                    <text
                      x={p.x + (p.name === 'Turn' ? -18 : 20)}
                      y={p.y - 32}
                      textAnchor={p.name === 'Turn' ? 'end' : 'start'}
                      fill="#FF5C38"
                      fontSize="13"
                      fontWeight="700"
                      fontFamily="monospace"
                    >
                      {p.name} {p.label}
                    </text>
                  </g>
                )}
                <circle
                  className="scatter-dot"
                  cx={p.x}
                  cy={p.y}
                  r={p.highlight ? 7 : 5.5}
                  fill={p.color}
                  fillOpacity={p.highlight ? 1 : 0.85}
                  stroke="#0A0B0E"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setTip(p)}
                  onMouseLeave={() => setTip(null)}
                />
              </g>
            ))}
          </svg>

          {tip && (
            <div
              className="pointer-events-none absolute z-10 rounded border border-line-bright bg-bg-raised px-3 py-2 font-mono text-xs shadow-lg"
              style={{
                left: `${(tip.x / W) * 100}%`,
                top: `${(tip.y / H) * 100}%`,
                transform: 'translate(-50%, -130%)',
              }}
            >
              <p className="font-bold text-ink">{tip.name}</p>
              <p className="text-ink-dim">
                {tip.stars >= 1000 ? `${(tip.stars / 1000).toFixed(1)}k` : tip.stars}★ · 激进 {tip.radical}/10
              </p>
            </div>
          )}
        </div>

        <p className="scatter-note mt-8 max-w-3xl border-l-2 border-vs pl-5 text-lg font-bold leading-8">
          Turn（10★）比 swarms（7k★）激进一个数量级。
          <span className="text-vs">星数度量的是传播，不是思想。</span>
        </p>
      </div>
    </section>
  )
}
