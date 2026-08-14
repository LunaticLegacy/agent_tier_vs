import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { projects, TIER_META, DIMENSION_LABELS } from '@/data/projects'
import TierBadge from '@/components/TierBadge'
import RadarChart from '@/components/project/RadarChart'
import QuoteBlock from '@/components/project/QuoteBlock'
import ScoreBars from '@/components/project/ScoreBars'
import CountUp from '@/components/wiki/CountUp'
import { cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-15% 0px' },
  transition: { delay, duration: 0.6, ease: EASE },
})

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return (
      <section className="container-site py-24 text-center">
        <p className="font-mono text-sm text-ink-faint">$ cat /wiki/{slug} → No such entry</p>
        <Link
          to="/wiki"
          className="mono-label mt-6 inline-block border border-line px-4 py-2 text-ink-dim transition-colors hover:border-line-bright hover:text-ink"
        >
          ← 返回 Wiki 档案库
        </Link>
      </section>
    )
  }

  const meta = TIER_META[project.tier]
  const idx = projects.findIndex((p) => p.slug === project.slug)
  const prev = projects[(idx - 1 + projects.length) % projects.length]
  const next = projects[(idx + 1) % projects.length]
  const entryNo = String(project.rank).padStart(2, '0')

  return (
    <div className="pb-24">
      {/* S0 面包屑 + 条目头 */}
      <header className="container-site pt-12 md:pt-16">
        <motion.nav
          className="mono-label text-ink-faint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          aria-label="面包屑"
        >
          <Link to="/wiki" className="transition-colors hover:text-ink">WIKI</Link>
          <span className="mx-2">/</span>
          <span style={{ color: meta.color }}>TIER {project.tier}</span>
          <span className="mx-2">/</span>
          <span>{project.slug}</span>
        </motion.nav>

        <div className="mt-10 grid gap-10 lg:grid-cols-[3fr_2fr]">
          {/* 左：名称与元信息 */}
          <div>
            <div className="flex items-start gap-5">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <TierBadge tier={project.tier} size="xl" />
              </motion.div>
              <h1
                className="font-display text-5xl font-bold tracking-tight md:text-6xl"
                aria-label={project.name}
              >
                {project.name.split('').map((ch, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.03, duration: 0.7, ease: EASE }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </h1>
            </div>
            <motion.p
              className="mt-6 max-w-xl text-xl leading-relaxed text-ink-dim"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
            >
              {project.tagline}
            </motion.p>
            <motion.div
              className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm text-ink-dim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span>{project.maintainer}</span>
              <span className="text-ink-faint">·</span>
              <span>{project.language}</span>
              <span className="text-ink-faint">·</span>
              <span>{project.license}</span>
              <span className="text-ink-faint">·</span>
              <span>{project.stars}★</span>
              <span
                className={cn(
                  'mono-label ml-2 border px-2 py-0.5',
                  project.status === '活跃'
                    ? 'border-tier-c/40 text-tier-c'
                    : 'border-danger/40 text-danger'
                )}
              >
                {project.status}
              </span>
            </motion.div>
          </div>

          {/* 右：数据面板 */}
          <motion.aside
            className="relative border border-line bg-bg-raised p-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
          >
            <span className="mono-label absolute right-4 top-4 text-ink-faint">
              ENTRY #{entryNo}/18
            </span>
            <div className="flex items-baseline gap-2" style={{ color: meta.color }}>
              <CountUp
                value={project.score}
                decimals={1}
                duration={1.2}
                className="font-mono text-6xl font-semibold"
              />
              <span className="font-mono text-lg text-ink-faint">/10</span>
            </div>
            <p className="mono-label mt-1" style={{ color: meta.color }}>
              {meta.label} · {meta.name}
            </p>
            <div className="mt-4">
              <RadarChart dimensions={project.dimensions} color={meta.color} />
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-line pt-4">
              {DIMENSION_LABELS.map(({ key, label }) => (
                <li key={key} className="flex justify-between font-mono text-xs text-ink-dim">
                  <span>{label}</span>
                  <span className="text-ink">{project.dimensions[key]}</span>
                </li>
              ))}
            </ul>
          </motion.aside>
        </div>
      </header>

      {/* S1 评审语录 */}
      <section className="container-site mt-16">
        <QuoteBlock quote={project.quote} color={meta.color} />
      </section>

      {/* S2 亮点 / 短板 */}
      <section className="container-site mt-16 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="mono-label mb-5 text-tier-c">✓ 亮点</h2>
          <div className="space-y-4">
            {project.highlights.map((h, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.1)}
                className="group border border-line bg-bg-raised p-5 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span className="font-mono text-xs text-ink-faint transition-colors group-hover:text-vs">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-2 text-sm leading-relaxed text-ink-dim">{h}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mono-label mb-5 text-danger">✗ 短板</h2>
          <div className="space-y-4">
            {project.weaknesses.map((w, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.1)}
                className="group border border-l-2 border-line border-l-danger bg-bg-raised p-5 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span className="font-mono text-xs text-ink-faint transition-colors group-hover:text-danger">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-2 text-sm leading-relaxed text-ink-dim">{w}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* S3 深评正文 */}
      <section className="container-site mt-20">
        <div className="max-w-[720px]">
          <motion.h2 {...fadeUp()} className="text-2xl font-bold">
            <span className="mono-label mr-3 text-ink-faint">01 /</span>评审笔记
          </motion.h2>
          <motion.p {...fadeUp(0.06)} className="mt-5 leading-relaxed text-ink-dim">
            {project.name} 由{project.maintainer}维护，技术栈为 {project.language}，采用{' '}
            {project.license} 许可证，评审时点星数 {project.stars}★，当前状态为「{project.status}
            」。{project.tagline}
          </motion.p>
          <motion.p {...fadeUp(0.12)} className="mt-4 leading-relaxed text-ink-dim">
            综合六维评分 {project.score.toFixed(1)}/10，列入 {meta.label}
            （{meta.name}——{meta.definition}）。其中「
            {
              DIMENSION_LABELS.reduce((a, b) =>
                project.dimensions[a.key] >= project.dimensions[b.key] ? a : b
              ).label
            }
            」一项拿到{' '}
            {
              Math.max(...DIMENSION_LABELS.map(({ key }) => project.dimensions[key]))
            }
            /10，是它最锋利的一维；「
            {
              DIMENSION_LABELS.reduce((a, b) =>
                project.dimensions[a.key] <= project.dimensions[b.key] ? a : b
              ).label
            }
            」仅{' '}
            {Math.min(...DIMENSION_LABELS.map(({ key }) => project.dimensions[key]))}
            /10，是主要失分项。
          </motion.p>

          <motion.div
            {...fadeUp(0.18)}
            className="mt-8 overflow-hidden border border-line bg-bg-inset"
          >
            <p className="border-b border-line px-4 py-2 font-mono text-xs text-ink-faint">
              $ git clone --depth 1 github.com/{project.slug} && wc -l src/** | sort -n
            </p>
            <div className="space-y-1 px-4 py-4 font-mono text-sm text-ink-dim">
              <p><span className="mr-4 inline-block w-6 text-right text-ink-faint">1</span>tier      = &quot;{project.tier}&quot;  <span className="text-ink-faint"># {meta.name}</span></p>
              <p><span className="mr-4 inline-block w-6 text-right text-ink-faint">2</span>score     = {project.score.toFixed(1)}     <span className="text-ink-faint"># 六维加权综合</span></p>
              <p><span className="mr-4 inline-block w-6 text-right text-ink-faint">3</span>stars     = {project.stars}    <span className="text-ink-faint"># 评审时点快照</span></p>
              <p><span className="mr-4 inline-block w-6 text-right text-ink-faint">4</span>status    = &quot;{project.status}&quot;</p>
            </div>
          </motion.div>

          <motion.h2 {...fadeUp()} className="mt-14 text-2xl font-bold">
            <span className="mono-label mr-3 text-ink-faint">02 /</span>同级对照
          </motion.h2>
          <motion.div {...fadeUp(0.06)} className="mt-5 overflow-x-auto">
            <table className="w-full border border-line font-mono text-sm">
              <thead>
                <tr className="border-b border-line text-left text-ink-faint">
                  <th className="px-4 py-2 font-normal">项目</th>
                  <th className="px-4 py-2 font-normal">Tier</th>
                  <th className="px-4 py-2 font-normal">综合评分</th>
                  <th className="px-4 py-2 font-normal">星数</th>
                </tr>
              </thead>
              <tbody>
                {projects
                  .filter((p) => p.tier === project.tier)
                  .map((p) => (
                    <tr
                      key={p.slug}
                      className={cn(
                        'border-b border-line last:border-0',
                        p.slug === project.slug ? 'bg-bg-raised text-ink' : 'text-ink-dim'
                      )}
                    >
                      <td className="px-4 py-2">
                        {p.slug === project.slug ? (
                          p.name
                        ) : (
                          <Link to={`/wiki/${p.slug}`} className="transition-colors hover:text-vs">
                            {p.name}
                          </Link>
                        )}
                      </td>
                      <td className="px-4 py-2" style={{ color: TIER_META[p.tier].color }}>
                        {p.tier}
                      </td>
                      <td className="px-4 py-2">{p.score.toFixed(1)}</td>
                      <td className="px-4 py-2">{p.stars}★</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* S4 六维评分明细 */}
      <section className="container-site mt-20">
        <motion.h2 {...fadeUp()} className="mb-8 text-2xl font-bold">
          <span className="mono-label mr-3 text-ink-faint">03 /</span>六维评分明细
        </motion.h2>
        <ScoreBars dimensions={project.dimensions} color={meta.color} />
      </section>

      {/* S5 相邻条目导航 */}
      <section className="container-site mt-24">
        <div className="grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
          <motion.div whileHover={{ x: -4 }} transition={{ duration: 0.2 }}>
            <Link
              to={`/wiki/${prev.slug}`}
              className="flex h-full items-center gap-4 border border-line bg-bg-raised p-5 transition-colors hover:border-line-bright"
            >
              <ArrowLeft className="h-5 w-5 shrink-0 text-ink-faint" />
              <div className="min-w-0 flex-1">
                <p className="mono-label text-ink-faint">上一条目</p>
                <p className="mt-1 truncate font-display text-lg font-bold">{prev.name}</p>
              </div>
              <TierBadge tier={prev.tier} size="sm" />
            </Link>
          </motion.div>
          <Link
            to="/wiki"
            className="mono-label flex items-center justify-center border border-line px-6 py-4 text-ink-dim transition-colors hover:border-line-bright hover:text-ink"
          >
            返回 Wiki 档案库
          </Link>
          <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
            <Link
              to={`/wiki/${next.slug}`}
              className="flex h-full items-center gap-4 border border-line bg-bg-raised p-5 transition-colors hover:border-line-bright"
            >
              <TierBadge tier={next.tier} size="sm" />
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
