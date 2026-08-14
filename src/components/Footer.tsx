import { Link } from 'react-router-dom'
import { DIMENSION_LABELS } from '@/data/projects'

const LINKS = [
  { label: 'Tier 总榜', to: '/' },
  { label: 'Wiki 档案', to: '/wiki' },
  { label: '横向洞察', to: '/insights' },
  { label: '评审方法论', to: '/about' },
]

export default function Footer() {
  return (
    <footer
      className="border-t border-line bg-bg-inset"
      style={{ backgroundImage: "url('/noise.svg')", backgroundSize: '256px 256px' }}
    >
      <div className="container-site grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Agent VS Wiki" className="h-7 w-7" />
            <span className="font-display text-lg font-bold">
              AGENT <span className="text-vs">VS</span> WIKI
            </span>
          </div>
          <p className="mt-4 text-sm text-ink-dim">用代码说话，不用 README 投票。</p>
        </div>
        <div>
          <p className="mono-label mb-4 text-ink-faint">站内链接</p>
          <ul className="space-y-2">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-ink-dim transition-colors hover:text-vs">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mono-label mb-4 text-ink-faint">评审维度</p>
          <div className="flex flex-wrap gap-2">
            {DIMENSION_LABELS.map((d) => (
              <span key={d.key} className="mono-label border border-line px-2 py-1 text-ink-dim">
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="container-site py-4 font-mono text-xs text-ink-faint">
          © 2026 Agent VS Wiki · 数据为评审时点快照 · 星数随时间漂移
        </p>
      </div>
    </footer>
  )
}
