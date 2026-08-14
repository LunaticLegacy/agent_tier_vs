import { Suspense, lazy, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight } from 'lucide-react'
import TierBadge from '@/components/TierBadge'
import CountUp from '@/components/home/CountUp'
import ProjectCard from '@/components/home/ProjectCard'
import {
  REVIEW_QUOTES,
  TIER_META,
  TIER_ORDER,
  projects,
  tierGroups,
} from '@/data/projects'
import {
  PRODUCT_TIER_ORDER,
  TIER_META_PRODUCT,
  countByTier,
} from '@/data/products'

const HeroParticles = lazy(() => import('@/components/home/HeroParticles'))

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const TERMINAL_LINE = '$ review --depth=code --repos=18 --date=2026.08'

/* ------------------------------ Hero ------------------------------ */

function TypewriterLine() {
  const [len, setLen] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      setLen((v) => {
        if (v >= TERMINAL_LINE.length) {
          clearInterval(id)
          return v
        }
        return v + 1
      })
    }, 30)
    return () => clearInterval(id)
  }, [])
  return (
    <p className="font-mono text-sm text-ink-dim">
      {TERMINAL_LINE.slice(0, len)}
      <span className="animate-cursor-blink text-vs">▌</span>
    </p>
  )
}

function HeroTitle() {
  const chars = 'AGENT'.split('')
  const chars2 = 'WIKI'.split('')
  const charVariant = {
    hidden: { y: '110%', rotateX: -60, opacity: 0 },
    show: (i: number) => ({
      y: '0%',
      rotateX: 0,
      opacity: 1,
      transition: { delay: 0.25 + i * 0.03, duration: 1, ease: EASE },
    }),
  }
  return (
    <h1 className="mt-6 font-display font-bold leading-[1.05] tracking-[-0.03em]">
      <span
        className="block overflow-hidden"
        style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', perspective: 600 }}
      >
        {chars.map((c, i) => (
          <motion.span
            key={`a${i}`}
            className="inline-block text-ink"
            variants={charVariant}
            custom={i}
            initial="hidden"
            animate="show"
          >
            {c}
          </motion.span>
        ))}
        <motion.span
          className="relative mx-3 inline-block origin-bottom-left italic text-vs"
          style={{ transform: 'skewX(-8deg)', fontSize: '1.1em' }}
          initial={{ opacity: 0, y: '110%' }}
          animate={{ opacity: 1, y: '0%' }}
          transition={{ delay: 0.45, duration: 1, ease: EASE }}
        >
          VS
          <motion.span
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-tier-s/70 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ delay: 1.05, duration: 0.6, ease: 'easeInOut' }}
          />
        </motion.span>
        {chars2.map((c, i) => (
          <motion.span
            key={`w${i}`}
            className="inline-block text-ink"
            variants={charVariant}
            custom={i + 6}
            initial="hidden"
            animate="show"
          >
            {c}
          </motion.span>
        ))}
      </span>
      <motion.span
        className="mt-2 block font-sans font-black text-ink"
        style={{ fontSize: 'clamp(1.6rem, 4vw, 3.2rem)' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
      >
        给如今的 Agent 排个 T 级
      </motion.span>
    </h1>
  )
}

const HERO_STATS = [
  { value: 18, label: '已评审项目' },
  { value: 5, label: 'Tier' },
  { value: 6, label: '评审维度' },
  { value: 12, label: '个单人项目' },
]

function Hero() {
  return (
    <section className="relative flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden">
      {/* particle field */}
      <div className="absolute inset-0">
        <Suspense
          fallback={
            <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,#101318_0%,#0A0B0E_70%)]" />
          }
        >
          <HeroParticles />
        </Suspense>
      </div>
      {/* vignette + noise */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0A0B0E_85%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: "url('/noise.svg')", backgroundSize: '256px 256px' }}
      />

      <div className="container-site relative z-10 py-24">
        <TypewriterLine />
        <HeroTitle />
        <motion.p
          className="mt-6 max-w-xl text-base text-ink-dim"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: EASE }}
        >
          Clone 下来，读代码，再排名。18 个 Agent 框架，五个 Tier，不看 README 投票。
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap gap-x-8 gap-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8, ease: EASE }}
        >
          {HERO_STATS.map((s) => (
            <div key={s.label} className="flex items-baseline gap-2 font-mono">
              <CountUp to={s.value} className="text-2xl font-semibold text-ink" />
              <span className="text-xs text-ink-faint">{s.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="mt-10 flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.45, duration: 0.8, ease: EASE }}
        >
          <motion.a
            href="#tier-board"
            whileHover={{ scale: 1.03 }}
            className="inline-flex items-center gap-2 bg-vs px-6 py-3 font-bold text-[#0A0B0E] transition-colors hover:bg-[#ff7a5c]"
          >
            查看总榜 <ArrowDown className="h-4 w-4" />
          </motion.a>
          <motion.div whileHover={{ scale: 1.03 }}>
            <Link
              to="/about"
              className="group relative inline-flex items-center gap-2 overflow-hidden border border-line-bright px-6 py-3 font-bold text-ink"
            >
              <span className="absolute inset-0 -translate-x-full bg-vs transition-transform duration-300 group-hover:translate-x-0" />
              <span className="relative transition-colors group-hover:text-[#0A0B0E]">
                评审方法论
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 right-8 z-10 hidden flex-col items-center gap-2 md:flex">
        <span
          className="font-mono text-xs text-ink-faint"
          style={{ writingMode: 'vertical-rl' }}
        >
          SCROLL
        </span>
        <span className="h-10 w-px overflow-hidden bg-line">
          <span className="animate-scroll-line block h-4 w-px bg-vs" />
        </span>
      </div>
    </section>
  )
}

/* --------------------------- Tier legend --------------------------- */

function TierLegend() {
  return (
    <section className="border-y border-line bg-bg-raised/50">
      <div className="container-site grid grid-cols-2 md:grid-cols-5">
        {TIER_ORDER.map((tier, i) => {
          const meta = TIER_META[tier]
          const count = projects.filter((p) => p.tier === tier).length
          return (
            <motion.a
              key={tier}
              href={`#tier-${tier}`}
              className="group flex flex-col gap-2 border-l-[3px] px-4 py-6 transition-colors hover:bg-bg-raised"
              style={{ borderColor: meta.color }}
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
              viewport={{ once: true, margin: '-25% 0px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.65, 0, 0.35, 1] }}
            >
              <div className="flex items-center gap-3">
                <TierBadge tier={tier} size="sm" />
                <span className="font-bold text-ink">{meta.name}</span>
              </div>
              <span className="font-mono text-xs text-ink-dim">{meta.definition}</span>
              <span className="font-mono text-xs text-ink-faint">
                {String(count).padStart(2, '0')} PROJECTS
              </span>
            </motion.a>
          )
        })}
      </div>
    </section>
  )
}

/* ------------------------- Products teaser ------------------------- */

function ProductsTeaser() {
  return (
    <section className="container-site py-20 md:py-24">
      <motion.div
        className="relative overflow-hidden border border-line bg-bg-raised p-8 md:p-12"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <span
          className="absolute left-0 top-0 h-full w-[3px]"
          style={{ backgroundColor: '#F5C518' }}
        />
        <p className="mono-label text-ink-faint">NEW · 产品榜</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
          不止框架——<span className="text-vs">20 个主流 AI Agent 产品</span>的 T0–T3 评审
        </h2>
        <p className="mt-4 max-w-2xl text-ink-dim">
          评估对象是 Model + Harness + 工具 + Runtime 的完整系统，不是模型本身。覆盖编程、通用、
          深度研究、浏览器操控、多智能体平台五条赛道，每条结论附证据等级。
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {PRODUCT_TIER_ORDER.map((tier, i) => {
            const meta = TIER_META_PRODUCT[tier]
            return (
              <motion.div
                key={tier}
                className="border border-line bg-bg-inset p-4"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: EASE }}
              >
                <p className="font-display text-2xl font-bold" style={{ color: meta.color }}>
                  {tier}
                </p>
                <p className="mt-1 text-sm font-bold text-ink">{meta.name}</p>
                <p className="mt-1 font-mono text-xs text-ink-faint">
                  {String(countByTier(tier)).padStart(2, '0')} PRODUCTS
                </p>
              </motion.div>
            )
          })}
        </div>
        <div className="mt-8">
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 bg-vs px-8 py-4 font-bold text-[#0A0B0E] transition-transform hover:scale-[1.03]"
            data-cursor="link"
          >
            进入产品榜
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

/* ---------------------------- Tier board --------------------------- */

function TierBoard() {
  return (
    <section id="tier-board" className="container-site py-24 md:py-32">
      <p className="mono-label text-ink-faint">02 / TIER BOARD</p>
      <h2 className="mt-2 text-3xl font-bold md:text-4xl">S → D 完整总榜</h2>
      <p className="mt-3 font-mono text-sm text-ink-faint">
        $ git clone --depth 1 × 18 … ✓ 18/18 reviewed
      </p>

      <div className="mt-16 space-y-24">
        {tierGroups.map(({ tier, items }) => {
          const meta = TIER_META[tier]
          return (
            <div key={tier} id={`tier-${tier}`} className="scroll-mt-24">
              <div className="mb-8 flex flex-wrap items-end gap-x-6 gap-y-2">
                <motion.span
                  className={
                    tier === 'S'
                      ? 'font-display font-bold leading-none text-tier-s drop-shadow-[0_0_24px_rgba(245,197,24,0.35)]'
                      : 'text-stroke font-display font-bold leading-none'
                  }
                  style={{ fontSize: '120px', color: meta.color }}
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
                <span className="ml-auto pb-2 font-mono text-sm text-ink-faint">
                  {String(items.length).padStart(2, '0')} PROJECTS
                </span>
              </div>
              <div className="space-y-4">
                {items.length === 0 ? (
                  <p className="border border-dashed border-line bg-bg-inset px-6 py-5 font-mono text-sm text-ink-faint">
                    $ ls tier/{tier} → 0 entries
                    <span className="mt-1 block text-ink-dim">
                      // 本档空缺：受评框架无一同时达到顶级工程与顶级生态（原 S 级
                      deepseek-harness 重新定级为 Agent 运行时产品，移入产品榜 T1）
                    </span>
                  </p>
                ) : (
                  items.map((p, i) => (
                    <ProjectCard key={p.slug} project={p} index={i} />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* --------------------------- Quote marquee -------------------------- */

function QuoteItem({ text, source }: { text: string; source: string }) {
  return (
    <div className="flex shrink-0 items-center gap-4 px-10">
      <span className="font-display text-5xl font-bold leading-none text-vs">”</span>
      <p className="whitespace-nowrap text-lg text-ink">{text}</p>
      <span className="whitespace-nowrap font-mono text-xs text-ink-faint">— {source}</span>
    </div>
  )
}

function QuoteMarquee() {
  const doubled = [...REVIEW_QUOTES, ...REVIEW_QUOTES, ...REVIEW_QUOTES, ...REVIEW_QUOTES]
  return (
    <motion.section
      className="marquee-paused overflow-hidden border-y border-line bg-bg-raised/40 py-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="animate-marquee flex w-max items-center">
        {doubled.map((q, i) => (
          <QuoteItem key={i} {...q} />
        ))}
      </div>
      <div className="animate-marquee-reverse mt-6 flex w-max items-center opacity-70">
        {[...doubled].reverse().map((q, i) => (
          <QuoteItem key={i} {...q} />
        ))}
      </div>
    </motion.section>
  )
}

/* --------------------------- Insights teaser ------------------------ */

const INSIGHTS = [
  {
    icon: '⟲',
    title: '确定性竞赛',
    body: '小作坊集体猛攻可回放：Chidori 运行时记录 / CompileAgent 编译期 IR / Turn 语言层。',
  },
  {
    icon: '☆',
    title: '星数悖论',
    body: 'Turn 10★ 比 swarms 7k★ 激进一个数量级。星数与思想密度不相关。',
  },
  {
    icon: 'Ⅱ',
    title: '监督树的三次独立重发现',
    body: 'Erlang/OTP 语义在 Turn、MAAP、Chidori 中各自重现。',
  },
]

function InsightsTeaser() {
  return (
    <section className="container-site grid gap-12 py-24 md:grid-cols-2 md:py-32">
      <div className="md:sticky md:top-32 md:self-start">
        <p className="mono-label text-ink-faint">03 / INSIGHTS</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">横向洞察</h2>
        <p className="mt-3 text-ink-dim">读 17 份代码后浮现的规律。</p>
        <Link
          to="/insights"
          className="mono-label mt-6 inline-flex items-center gap-2 text-vs hover:underline"
        >
          查看全部 5 条洞察 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="space-y-6">
        {INSIGHTS.map((it, i) => (
          <motion.div
            key={it.title}
            className="flex gap-5 border border-line bg-bg-raised p-6"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
          >
            <motion.span
              className="font-mono text-4xl text-vs"
              initial={{ rotate: -90, opacity: 0 }}
              whileInView={{ rotate: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 + 0.2 }}
            >
              {it.icon}
            </motion.span>
            <div>
              <h3 className="text-xl font-bold text-ink">{it.title}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-dim">{it.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* -------------------------- Methodology teaser ---------------------- */

const TERMINAL_LINES = [
  { text: '$ methodology --show', ok: false },
  { text: 'clone 全部 18 个仓库（非浅尝 README）', ok: true },
  { text: '逐模块读代码 + 测试/CI/文档核查', ok: true },
  { text: '六维评分：架构 / 代码 / 测试CI / 文档DX / 生态 / 激进度', ok: true },
  { text: '分级裁决 → S A B C D', ok: true },
]

function MethodologyTeaser() {
  return (
    <section className="container-site pb-24 md:pb-32">
      <motion.div
        className="rounded-lg border border-line bg-bg-inset p-6 md:p-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20% 0px' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="space-y-3 font-mono text-sm md:text-base">
          {TERMINAL_LINES.map((l, i) => (
            <motion.p
              key={l.text}
              className={l.ok ? 'text-ink-dim' : 'text-ink'}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.4 }}
            >
              {l.ok && (
                <motion.span
                  className="mr-2 inline-block text-tier-c"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15, delay: i * 0.4 + 0.2 }}
                >
                  ✓
                </motion.span>
              )}
              {l.text}
            </motion.p>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: TERMINAL_LINES.length * 0.4 + 0.2 }}
        >
          <Link
            to="/about"
            className="mono-label mt-8 inline-flex items-center gap-2 text-vs hover:underline"
          >
            评审方法论全文 <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ------------------------------- Page ------------------------------- */

export default function Home() {
  return (
    <>
      <Hero />
      <TierLegend />
      <ProductsTeaser />
      <TierBoard />
      <QuoteMarquee />
      <InsightsTeaser />
      <MethodologyTeaser />
    </>
  )
}
