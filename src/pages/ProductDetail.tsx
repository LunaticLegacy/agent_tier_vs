import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { EvidencePoint, HeadToHead } from '@/data/products'
import {
  CATEGORY_META,
  PRODUCT_DIMENSION_LABELS,
  TIER_META_PRODUCT,
  getProduct,
  products,
  sortedProducts,
} from '@/data/products'
import { ProductTierBadge } from '@/components/TierBadge'
import ProductRadarChart from '@/components/product/ProductRadarChart'
import EvidenceBadge from '@/components/product/EvidenceBadge'
import { cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-15% 0px' },
  transition: { delay, duration: 0.6, ease: EASE },
})

const CONFIDENCE: Record<string, string> = {
  T0: '高（多源 A/B 级证据交叉）',
  T1: '中高（能力证据充分，短板反证同样充分）',
  T2: '中（部分关键指标未确认或为厂商自报）',
  T3: '中（反证链多源独立）',
}

function EvidenceCard({ point, index, tone }: { point: EvidencePoint; index: number; tone: 'up' | 'down' }) {
  return (
    <motion.div
      {...fadeUp(index * 0.08)}
      className={cn(
        'border border-line bg-bg-raised p-5',
        tone === 'down' && 'border-l-2 border-l-danger'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-bold text-ink">{point.claim}</p>
        <EvidenceBadge level={point.level} />
      </div>
      {point.compare && (
        <p className="mt-2 font-mono text-xs text-vs">VS · {point.compare}</p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-ink-dim">
        <span className="mono-label mr-2 text-ink-faint">证据</span>
        {point.evidence}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink-faint">
        <span className="mono-label mr-2">为何重要</span>
        {point.impact}
      </p>
    </motion.div>
  )
}

function HeadToHeadCard({ h2h, selfName }: { h2h: HeadToHead; selfName: string }) {
  const opponent = getProduct(h2h.opponent)
  return (
    <motion.div {...fadeUp()} className="border border-line bg-bg-raised">
      <div className="flex items-center justify-center gap-4 border-b border-line px-5 py-4">
        <span className="font-display text-lg font-bold text-ink">{selfName}</span>
        <span className="font-display text-2xl font-black text-vs">VS</span>
        {opponent ? (
          <Link
            to={`/products/${opponent.slug}`}
            className="font-display text-lg font-bold text-ink transition-colors hover:text-vs"
          >
            {opponent.name}
          </Link>
        ) : (
          <span className="font-display text-lg font-bold text-ink">{h2h.opponent}</span>
        )}
      </div>
      <div className="grid md:grid-cols-2">
        <div className="border-b border-line p-5 md:border-b-0 md:border-r">
          <p className="mono-label text-tier-c">我方更强</p>
          <ul className="mt-3 space-y-2">
            {h2h.myEdge.map((e) => (
              <li key={e} className="text-sm leading-relaxed text-ink-dim">
                <span className="mr-2 text-tier-c">+</span>
                {e}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5">
          <p className="mono-label text-danger">对方更强</p>
          <ul className="mt-3 space-y-2">
            {h2h.theirEdge.map((e) => (
              <li key={e} className="text-sm leading-relaxed text-ink-dim">
                <span className="mr-2 text-danger">−</span>
                {e}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="border-t border-line px-5 py-4 text-sm leading-relaxed text-ink">
        <span className="mono-label mr-2 text-vs">结论</span>
        {h2h.verdict}
      </p>
    </motion.div>
  )
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const product = slug ? getProduct(slug) : undefined

  if (!product) {
    return (
      <section className="container-site py-24 text-center">
        <p className="font-mono text-sm text-ink-faint">$ cat /products/{slug} → No such entry</p>
        <Link
          to="/products"
          className="mono-label mt-6 inline-block border border-line px-4 py-2 text-ink-dim transition-colors hover:border-line-bright hover:text-ink"
        >
          ← 返回产品榜
        </Link>
      </section>
    )
  }

  const meta = TIER_META_PRODUCT[product.tier]
  const idx = sortedProducts.findIndex((p) => p.slug === product.slug)
  const prev = sortedProducts[(idx - 1 + sortedProducts.length) % sortedProducts.length]
  const next = sortedProducts[(idx + 1) % sortedProducts.length]
  const sameTier = products.filter((p) => p.tier === product.tier).sort((a, b) => a.rank - b.rank)

  return (
    <div className="pb-24">
      {/* S0 面包屑 + 头部 */}
      <header className="container-site pt-12 md:pt-16">
        <motion.nav
          className="mono-label text-ink-faint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          aria-label="面包屑"
        >
          <Link to="/products" className="transition-colors hover:text-ink">PRODUCTS</Link>
          <span className="mx-2">/</span>
          <span style={{ color: meta.color }}>{meta.label}</span>
          <span className="mx-2">/</span>
          <span>{product.slug}</span>
        </motion.nav>

        <div className="mt-10 grid gap-10 lg:grid-cols-[3fr_2fr]">
          <div>
            <div className="flex items-start gap-5">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <ProductTierBadge tier={product.tier} size="xl" />
              </motion.div>
              <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                {product.name}
              </h1>
            </div>
            <motion.p
              className="mt-6 max-w-xl text-xl leading-relaxed text-ink-dim"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
            >
              {product.tagline}
            </motion.p>
            <motion.div
              className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm text-ink-dim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span>{product.vendor}</span>
              <span className="text-ink-faint">·</span>
              <span className="mono-label border border-line px-1.5 py-0.5">
                {CATEGORY_META[product.category].name}
              </span>
              <span className="text-ink-faint">·</span>
              <span>评估于 {product.evaluatedAt}</span>
            </motion.div>
            <motion.dl
              className="mt-6 grid gap-3 border border-line bg-bg-raised p-5 font-mono text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div>
                <dt className="mono-label text-ink-faint">核心模型</dt>
                <dd className={cn('mt-1', product.model.includes('未确认') && 'text-tier-s')}>
                  {product.model}
                </dd>
              </div>
              <div>
                <dt className="mono-label text-ink-faint">定价</dt>
                <dd className="mt-1 text-ink-dim">{product.pricing}</dd>
              </div>
            </motion.dl>
          </div>

          {/* 右：最终结论块 */}
          <motion.aside
            className="relative border border-line bg-bg-raised p-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
          >
            <span className="mono-label absolute right-4 top-4 text-ink-faint">VERDICT</span>
            <p className="mono-label" style={{ color: meta.color }}>
              {meta.label} · {meta.name}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-dim">{product.verdict}</p>
            <p className="mt-4 border-t border-line pt-3 font-mono text-xs text-ink-faint">
              定级置信度：<span className="text-ink">{CONFIDENCE[product.tier]}</span>
            </p>
            <div className="mt-4">
              <ProductRadarChart scores={product.scores} color={meta.color} />
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-line pt-4">
              {PRODUCT_DIMENSION_LABELS.map(({ key, label }) => (
                <li key={key} className="flex justify-between font-mono text-xs text-ink-dim">
                  <span>{label}</span>
                  <span className="text-ink">{product.scores[key]}</span>
                </li>
              ))}
            </ul>
          </motion.aside>
        </div>
      </header>

      {/* S1 主要优势 / 主要短板 */}
      <section className="container-site mt-20 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="mono-label mb-5 text-tier-c">✓ 主要优势</h2>
          <div className="space-y-4">
            {product.strengths.map((s, i) => (
              <EvidenceCard key={i} point={s} index={i} tone="up" />
            ))}
          </div>
        </div>
        <div>
          <h2 className="mono-label mb-5 text-danger">✗ 主要短板</h2>
          <div className="space-y-4">
            {product.weaknesses.map((w, i) => (
              <EvidenceCard key={i} point={w} index={i} tone="down" />
            ))}
          </div>
        </div>
      </section>

      {/* S2 为什么不是更高 / 更低 Tier */}
      <section className="container-site mt-20 grid gap-10 md:grid-cols-2">
        <motion.div {...fadeUp()} className="border border-line bg-bg-raised p-6">
          <h2 className="mono-label text-tier-b">↑ 为什么不是更高 Tier</h2>
          <ul className="mt-4 space-y-3">
            {product.notHigher.map((r, i) => (
              <li key={i} className="text-sm leading-relaxed text-ink-dim">
                <span className="mr-2 font-mono text-ink-faint">{String(i + 1).padStart(2, '0')}</span>
                {r}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div {...fadeUp(0.08)} className="border border-line bg-bg-raised p-6">
          <h2 className="mono-label text-tier-c">↓ 为什么不是更低 Tier</h2>
          <ul className="mt-4 space-y-3">
            {product.notLower.map((r, i) => (
              <li key={i} className="text-sm leading-relaxed text-ink-dim">
                <span className="mr-2 font-mono text-ink-faint">{String(i + 1).padStart(2, '0')}</span>
                {r}
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* S3 Head-to-Head */}
      {product.headToHead.length > 0 && (
        <section className="container-site mt-20">
          <motion.h2 {...fadeUp()} className="mb-8 text-2xl font-bold">
            <span className="mono-label mr-3 text-ink-faint">01 /</span>Head-to-Head
          </motion.h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {product.headToHead.map((h) => (
              <HeadToHeadCard key={h.opponent} h2h={h} selfName={product.name} />
            ))}
          </div>
        </section>
      )}

      {/* S4 六维评分明细 */}
      <section className="container-site mt-20">
        <motion.h2 {...fadeUp()} className="mb-8 text-2xl font-bold">
          <span className="mono-label mr-3 text-ink-faint">02 /</span>六维评分明细
        </motion.h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_DIMENSION_LABELS.map(({ key, label }, i) => (
            <motion.div
              key={key}
              {...fadeUp(i * 0.06)}
              className="border border-line bg-bg-raised p-5"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-bold text-ink">{label}</span>
                <span className="font-mono text-2xl font-semibold" style={{ color: meta.color }}>
                  {product.scores[key]}
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-bg-inset">
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: meta.color }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${product.scores[key] * 10}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.06, ease: EASE }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* S5 关键指标表 */}
      <section className="container-site mt-20">
        <motion.h2 {...fadeUp()} className="mb-8 text-2xl font-bold">
          <span className="mono-label mr-3 text-ink-faint">03 /</span>关键指标
        </motion.h2>
        <motion.div {...fadeUp(0.06)} className="overflow-x-auto">
          <table className="w-full border border-line font-mono text-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink-faint">
                <th className="px-4 py-2 font-normal">指标</th>
                <th className="px-4 py-2 font-normal">数值</th>
                <th className="px-4 py-2 font-normal">证据等级</th>
              </tr>
            </thead>
            <tbody>
              {product.keyMetrics.map((m) => (
                <tr key={m.label} className="border-b border-line last:border-0">
                  <td className="px-4 py-2 text-ink-dim">{m.label}</td>
                  <td className="px-4 py-2 text-ink">{m.value}</td>
                  <td className="px-4 py-2">
                    <EvidenceBadge level={m.level} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* S6 同级对照 */}
      <section className="container-site mt-20">
        <motion.h2 {...fadeUp()} className="mb-8 text-2xl font-bold">
          <span className="mono-label mr-3 text-ink-faint">04 /</span>同级对照
        </motion.h2>
        <motion.div {...fadeUp(0.06)} className="overflow-x-auto">
          <table className="w-full border border-line font-mono text-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink-faint">
                <th className="px-4 py-2 font-normal">产品</th>
                <th className="px-4 py-2 font-normal">赛道</th>
                <th className="px-4 py-2 font-normal">厂商</th>
                <th className="px-4 py-2 font-normal">Tier</th>
              </tr>
            </thead>
            <tbody>
              {sameTier.map((p) => (
                <tr
                  key={p.slug}
                  className={cn(
                    'border-b border-line last:border-0',
                    p.slug === product.slug ? 'bg-bg-raised text-ink' : 'text-ink-dim'
                  )}
                >
                  <td className="px-4 py-2">
                    {p.slug === product.slug ? (
                      p.name
                    ) : (
                      <Link to={`/products/${p.slug}`} className="transition-colors hover:text-vs">
                        {p.name}
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-2">{CATEGORY_META[p.category].name}</td>
                  <td className="px-4 py-2">{p.vendor}</td>
                  <td className="px-4 py-2" style={{ color: TIER_META_PRODUCT[p.tier].color }}>
                    {p.tier}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* S7 资料来源 */}
      <section className="container-site mt-20">
        <motion.h2 {...fadeUp()} className="mb-8 text-2xl font-bold">
          <span className="mono-label mr-3 text-ink-faint">05 /</span>资料来源
        </motion.h2>
        <motion.ul {...fadeUp(0.06)} className="space-y-2">
          {product.sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 border border-line bg-bg-raised px-4 py-3 transition-colors hover:border-line-bright"
              >
                <span className="font-mono text-xs text-ink-faint group-hover:text-vs">→</span>
                <span className="text-sm text-ink-dim group-hover:text-ink">{s.name}</span>
                <span className="ml-auto hidden max-w-[40%] truncate font-mono text-xs text-ink-faint md:block">
                  {s.url}
                </span>
              </a>
            </li>
          ))}
        </motion.ul>
        <p className="mt-4 font-mono text-xs text-ink-faint">
          * 评估日期 {product.evaluatedAt}；数据为评审时点快照，厂商自报基准均未独立复现。
        </p>
      </section>

      {/* S8 相邻导航 */}
      <section className="container-site mt-24">
        <div className="grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
          <motion.div whileHover={{ x: -4 }} transition={{ duration: 0.2 }}>
            <Link
              to={`/products/${prev.slug}`}
              className="flex h-full items-center gap-4 border border-line bg-bg-raised p-5 transition-colors hover:border-line-bright"
            >
              <ArrowLeft className="h-5 w-5 shrink-0 text-ink-faint" />
              <div className="min-w-0 flex-1">
                <p className="mono-label text-ink-faint">上一条目</p>
                <p className="mt-1 truncate font-display text-lg font-bold">{prev.name}</p>
              </div>
              <ProductTierBadge tier={prev.tier} size="sm" />
            </Link>
          </motion.div>
          <Link
            to="/products"
            className="mono-label flex items-center justify-center border border-line px-6 py-4 text-ink-dim transition-colors hover:border-line-bright hover:text-ink"
          >
            返回产品榜
          </Link>
          <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
            <Link
              to={`/products/${next.slug}`}
              className="flex h-full items-center gap-4 border border-line bg-bg-raised p-5 transition-colors hover:border-line-bright"
            >
              <ProductTierBadge tier={next.tier} size="sm" />
              <div className="min-w-0 flex-1 text-right">
                <p className="mono-label text-ink-faint">下一条目</p>
                <p className="mt-1 truncate font-display text-lg font-bold">{next.name}</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-ink-faint" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
