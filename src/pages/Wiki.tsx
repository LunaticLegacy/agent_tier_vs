import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutGrid, List, Search } from 'lucide-react'
import { projects, TIER_META, TIER_ORDER } from '@/data/projects'
import type { Tier } from '@/data/projects'
import ProjectListRow from '@/components/wiki/ProjectListRow'
import ProjectGridCard from '@/components/wiki/ProjectGridCard'
import CountUp from '@/components/wiki/CountUp'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

type SortKey = 'tier' | 'stars' | 'name'
type ViewMode = 'list' | 'grid'

const LANG_OPTIONS = ['全部', 'TypeScript', 'Rust', 'Python', '其他'] as const
const MAINTAINER_OPTIONS = ['全部', '官方', '小团队', '个人'] as const

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

function TypewriterLine() {
  const text = '$ ls /wiki | wc -l → 17'
  return (
    <span className="font-mono text-sm text-ink-faint" aria-label={text}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.025 }}
        >
          {ch}
        </motion.span>
      ))}
      <span className="animate-cursor-blink text-vs">▌</span>
    </span>
  )
}

export default function Wiki() {
  const [query, setQuery] = useState('')
  const [tiers, setTiers] = useState<Tier[]>([])
  const [language, setLanguage] = useState<(typeof LANG_OPTIONS)[number]>('全部')
  const [maintainer, setMaintainer] = useState<(typeof MAINTAINER_OPTIONS)[number]>('全部')
  const [sort, setSort] = useState<SortKey>('tier')
  const [view, setView] = useState<ViewMode>('list')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const result = projects.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.slug.includes(q)) return false
      if (tiers.length > 0 && !tiers.includes(p.tier)) return false
      if (language !== '全部') {
        if (language === '其他') {
          if (['TypeScript', 'Rust', 'Python'].includes(p.language)) return false
        } else if (p.language !== language) return false
      }
      if (maintainer !== '全部' && p.maintainerType !== maintainer) return false
      return true
    })
    const sorted = [...result]
    if (sort === 'tier') sorted.sort((a, b) => a.rank - b.rank)
    else if (sort === 'stars') sorted.sort((a, b) => b.starValue - a.starValue)
    else sorted.sort((a, b) => a.name.localeCompare(b.name))
    return sorted
  }, [query, tiers, language, maintainer, sort])

  const toggleTier = (t: Tier) =>
    setTiers((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))

  return (
    <div className="pb-24">
      {/* S0 页头 */}
      <header className="container-site pt-16 md:pt-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-baseline gap-4">
              <h1 className="text-5xl font-black tracking-tight md:text-6xl" aria-label="Wiki 档案库">
                {'Wiki 档案库'.split('').map((ch, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.025, duration: 0.8, ease: EASE }}
                  >
                    {ch === ' ' ? ' ' : ch}
                  </motion.span>
                ))}
              </h1>
              <motion.span
                className="mono-label text-ink-faint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                [17 ENTRIES]
              </motion.span>
            </div>
            <motion.p
              className="mt-4 max-w-xl text-ink-dim"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
            >
              每个条目都基于实际 clone 的代码级评审，而非 README 推断。
            </motion.p>
          </div>
          <TypewriterLine />
        </div>
      </header>

      {/* S1 粘性筛选工具栏 */}
      <motion.div
        className="sticky top-16 z-40 mt-12 border-y border-line bg-bg/85 backdrop-blur-md"
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5, ease: EASE }}
      >
        <div className="container-site flex flex-wrap items-center gap-3 py-3">
          <label className="flex min-w-[180px] flex-1 items-center gap-2 border border-line bg-bg-inset px-3 py-2 focus-within:border-line-bright">
            <Search className="h-4 w-4 shrink-0 text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索项目名…"
              className="w-full bg-transparent font-mono text-sm text-ink outline-none placeholder:text-ink-faint"
            />
          </label>

          <div className="flex items-center gap-1.5" role="group" aria-label="Tier 筛选">
            {TIER_ORDER.map((t) => {
              const active = tiers.includes(t)
              const color = TIER_META[t].color
              return (
                <button
                  key={t}
                  onClick={() => toggleTier(t)}
                  aria-pressed={active}
                  className={cn(
                    'h-8 w-8 border font-display text-base font-bold transition-colors',
                    active ? 'text-[#0A0B0E]' : 'border-line text-ink-faint hover:text-ink'
                  )}
                  style={
                    active
                      ? { backgroundColor: color, borderColor: color }
                      : undefined
                  }
                >
                  {t}
                </button>
              )
            })}
          </div>

          <Select value={language} onValueChange={(v) => setLanguage(v as typeof language)}>
            <SelectTrigger className="w-[130px] border-line bg-bg-inset font-mono text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANG_OPTIONS.map((o) => (
                <SelectItem key={o} value={o} className="font-mono text-xs">
                  {o === '全部' ? '语言：全部' : o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={maintainer} onValueChange={(v) => setMaintainer(v as typeof maintainer)}>
            <SelectTrigger className="w-[130px] border-line bg-bg-inset font-mono text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MAINTAINER_OPTIONS.map((o) => (
                <SelectItem key={o} value={o} className="font-mono text-xs">
                  {o === '全部' ? '维护方：全部' : o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="w-[130px] border-line bg-bg-inset font-mono text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tier" className="font-mono text-xs">按 Tier</SelectItem>
              <SelectItem value="stars" className="font-mono text-xs">按星数 ↓</SelectItem>
              <SelectItem value="name" className="font-mono text-xs">按名称 A–Z</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1 border border-line p-0.5">
            {(
              [
                { mode: 'list' as ViewMode, icon: List, label: '列表视图' },
                { mode: 'grid' as ViewMode, icon: LayoutGrid, label: '网格视图' },
              ]
            ).map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setView(mode)}
                aria-label={label}
                aria-pressed={view === mode}
                className={cn(
                  'p-1.5 transition-colors',
                  view === mode ? 'bg-ink text-bg' : 'text-ink-faint hover:text-ink'
                )}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          <span className="ml-auto font-mono text-xs text-ink-faint">
            显示 {filtered.length} / 17
          </span>
        </div>
      </motion.div>

      {/* S2 档案卡片区 */}
      <section className="container-site mt-8">
        {filtered.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-dashed border-line py-20 text-center font-mono text-sm text-ink-faint"
          >
            $ grep &quot;{query || '…'}&quot; /wiki/* → 0 results
          </motion.p>
        ) : view === 'list' ? (
          <motion.div layout className="border-t border-line">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.slug}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.04, ease: EASE }}
                >
                  <ProjectListRow project={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.slug}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.03, ease: EASE }}
                >
                  <ProjectGridCard project={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* S3 底部统计条 */}
      <section className="container-site mt-20">
        <div className="grid grid-cols-2 border border-line md:grid-cols-4">
          {[
            { value: 9, label: 'Python 系' },
            { value: 11, label: '个人项目' },
            { value: 3, label: '已停更或封存' },
            { value: 4.4, label: '星数中位数', decimals: 1, suffix: 'k' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="border-line px-6 py-8 text-center [&:not(:last-child)]:border-r max-md:[&:nth-child(-n+2)]:border-b"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}
            >
              <CountUp
                value={s.value}
                decimals={s.decimals ?? 0}
                suffix={s.suffix ?? ''}
                className="font-mono text-3xl font-semibold text-ink"
              />
              <p className="mono-label mt-2 text-ink-faint">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
