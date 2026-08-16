import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search } from 'lucide-react'
import type { Product, ProductCategory } from '@/data/products'
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  PRODUCT_TIER_ORDER,
  TIER_META_PRODUCT,
  products,
} from '@/data/products'
import { ProductTierBadge } from '@/components/TierBadge'
import { cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

function TypewriterLine({ count }: { count: number }) {
  const text = `$ review --target=products --tracks=5 --date=2026.08 → ${count} ENTRIES`
  return (
    <span className="font-mono text-sm text-ink-faint" aria-label={text}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.02 }}
        >
          {ch}
        </motion.span>
      ))}
      <span className="animate-cursor-blink text-vs">▌</span>
    </span>
  )
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const meta = TIER_META_PRODUCT[product.tier]
  const isT0 = product.tier === 'T0'
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: EASE }}
    >
      <Link to={`/products/${product.slug}`} data-cursor-label="查看评审" className="group block">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className={cn(
            'relative flex flex-col gap-4 border border-line bg-bg-raised p-5 transition-colors duration-300 group-hover:border-line-bright group-hover:bg-[#141922] md:flex-row md:items-center md:gap-8',
            isT0 && 'scale-[1.01] border-[#F5C518]/60 shadow-[0_0_40px_rgba(245,197,24,0.08)]'
          )}
          style={
            isT0
              ? {
                  backgroundImage:
                    'radial-gradient(ellipse at 20% 0%, rgba(245,197,24,0.06), transparent 60%)',
                }
              : undefined
          }
        >
          <span
            className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 transition-transform duration-500 group-hover:scale-y-100"
            style={{ backgroundColor: meta.color }}
          />
          <div className="flex items-center gap-4">
            <ProductTierBadge tier={product.tier} size="lg" />
            <span className="font-mono text-sm text-ink-faint">
              #{String(product.rank).padStart(2, '0')}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="font-display text-2xl font-bold text-ink">{product.name}</h3>
              <span className="font-mono text-xs text-ink-faint">{product.vendor}</span>
              <span className="mono-label border border-line px-1.5 py-0.5 text-ink-dim">
                {CATEGORY_META[product.category].name}
              </span>
            </div>
            <p className="mt-1 line-clamp-2 text-base text-ink-dim">{product.tagline}</p>
            <p className="mt-2 line-clamp-2 border-l-2 border-line pl-3 text-sm leading-relaxed text-ink-faint">
              {product.verdict}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-1.5 md:w-64">
            {product.keyMetrics.slice(0, 2).map((m) => (
              <div key={m.label} className="border border-line bg-bg-inset px-3 py-2">
                <p className="font-mono text-sm text-ink">{m.value}</p>
                <p className="mt-0.5 truncate font-mono text-[10px] text-ink-faint">
                  [{m.level}] {m.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default function Products() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ProductCategory | 'all'>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.slug.includes(q) && !p.vendor.toLowerCase().includes(q))
        return false
      if (category !== 'all' && p.category !== category) return false
      return true
    })
  }, [query, category])

  const groups = PRODUCT_TIER_ORDER.map((tier) => ({
    tier,
    items: filtered
      .filter((p) => p.tier === tier)
      .sort((a, b) => a.rank - b.rank),
  }))

  return (
    <div className="pb-24">
      {/* S0 页头 */}
      <header className="container-site pt-16 md:pt-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-baseline gap-4">
              <h1 className="text-5xl font-black tracking-tight md:text-6xl" aria-label="产品榜">
                {'产品榜'.split('').map((ch, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.8, ease: EASE }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </h1>
              <motion.span
                className="mono-label text-ink-faint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
              [{products.length} PRODUCTS / 5 TRACKS]
              </motion.span>
            </div>
            <motion.p
              className="mt-4 max-w-2xl text-ink-dim"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
            >
              评估对象是 <span className="text-ink">Model + Harness + 工具 + Runtime 的完整系统</span>
              ，不是底层模型本身。模型分数不等于产品分数；所有结论附证据等级（A 官方 / B 独立第三方 /
              C 用户反馈 / D 营销文案），未确认的信息如实标注「未确认」。
            </motion.p>
          </div>
          <TypewriterLine count={products.length} />
        </div>
      </header>

      {/* S1 筛选栏 */}
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
              placeholder="搜索产品 / 厂商…"
              className="w-full bg-transparent font-mono text-sm text-ink outline-none placeholder:text-ink-faint"
            />
          </label>
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="赛道筛选">
            {(['all', ...CATEGORY_ORDER] as const).map((c) => {
              const active = category === c
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  aria-pressed={active}
                  className={cn(
                    'mono-label border px-2.5 py-1.5 transition-colors',
                    active
                      ? 'border-vs bg-vs text-[#0A0B0E]'
                      : 'border-line text-ink-faint hover:text-ink'
                  )}
                >
                  {c === 'all' ? '全部赛道' : CATEGORY_META[c].name}
                </button>
              )
            })}
          </div>
          <span className="ml-auto font-mono text-xs text-ink-faint">
            显示 {filtered.length} / {products.length}
          </span>
        </div>
      </motion.div>

      {/* S2 Tier 榜 */}
      <section className="container-site mt-16">
        {filtered.length === 0 ? (
          <p className="border border-dashed border-line py-20 text-center font-mono text-sm text-ink-faint">
            $ grep &quot;{query || '…'}&quot; /products/* → 0 results
          </p>
        ) : (
          <div className="space-y-24">
            {groups.map(({ tier, items }) => {
              if (items.length === 0) return null
              const meta = TIER_META_PRODUCT[tier]
              return (
                <div key={tier} id={`tier-${tier}`} className="scroll-mt-32">
                  <div className="mb-8 flex flex-wrap items-end gap-x-6 gap-y-2">
                    <motion.span
                      className={cn(
                        'font-display font-bold leading-none',
                        tier === 'T0'
                          ? 'text-tier-s drop-shadow-[0_0_24px_rgba(245,197,24,0.35)]'
                          : 'text-stroke'
                      )}
                      style={{ fontSize: '96px', color: meta.color }}
                      initial={{ scale: 1.4, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: '-30% 0px' }}
                      transition={{ duration: 0.9, ease: EASE }}
                    >
                      {tier}
                    </motion.span>
                    <div className="pb-2">
                      <p className="text-xl font-bold text-ink">{meta.name}</p>
                      <p className="text-sm text-ink-dim">“{meta.definition}”</p>
                    </div>
                    {/* 赛道分布小标签 */}
                    <div className="flex flex-wrap gap-1.5 pb-2">
                      {CATEGORY_ORDER.map((c) => {
                        const n = items.filter((p) => p.category === c).length
                        if (n === 0) return null
                        return (
                          <span
                            key={c}
                            className="mono-label border border-line px-1.5 py-0.5 text-ink-faint"
                          >
                            {CATEGORY_META[c].short} ×{n}
                          </span>
                        )
                      })}
                    </div>
                    <span className="ml-auto pb-2 font-mono text-sm text-ink-faint">
                      {String(items.length).padStart(2, '0')} PRODUCTS
                    </span>
                  </div>
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {items.map((p, i) => (
                        <ProductCard key={p.slug} product={p} index={i} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* S3 底部说明 */}
      <section className="container-site mt-20">
        <div className="border border-line bg-bg-inset p-5">
          <p className="font-mono text-xs leading-relaxed text-ink-faint">
            $ cat /products/README ─ 证据等级：A=官方文档/benchmark · B=独立第三方评测 ·
            C=大量用户反馈 · D=营销文案（仅证明官方声称）。厂商自报基准均未独立复现；模型成绩不等于当前默认
            harness 的产品成绩。所有定级为 2026-08 评审时点快照。
          </p>
        </div>
      </section>
    </div>
  )
}
