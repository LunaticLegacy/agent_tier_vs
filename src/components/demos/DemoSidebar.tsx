import { DEMO_TIER_GROUPS } from '@/data/demos'
import { TIER_META } from '@/data/projects'
import { cn } from '@/lib/utils'

/** 按 Tier 分组的 harness 选择列表。 */
export default function DemoSidebar({
  active,
  onSelect,
}: {
  active: string
  onSelect: (slug: string) => void
}) {
  return (
    <nav className="flex flex-col gap-6" aria-label="Demo 列表">
      {DEMO_TIER_GROUPS.map((group) => (
        <div key={group.label}>
          <p
            className="mono-label mb-2 px-3"
            style={{ color: group.tier ? TIER_META[group.tier].color : 'var(--ink-faint)' }}
          >
            {group.label}
          </p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((d) => (
              <li key={d.slug}>
                <button
                  onClick={() => onSelect(d.slug)}
                  data-cursor="link"
                  className={cn(
                    'flex w-full items-center justify-between border-l-2 px-3 py-2 text-left font-mono text-sm transition-colors',
                    active === d.slug
                      ? 'border-vs bg-bg-raised text-ink'
                      : 'border-transparent text-ink-dim hover:border-line-bright hover:text-ink'
                  )}
                >
                  <span>{d.name}</span>
                  <span className="text-[10px] uppercase text-ink-faint">{d.language}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
