import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import type { Project } from '@/data/projects'
import { TIER_META, DIMENSION_LABELS } from '@/data/projects'
import TierBadge from '@/components/TierBadge'

/** 索引页·列表视图行（96px，行间 1px 分隔，无卡片框） */
export default function ProjectListRow({ project }: { project: Project }) {
  const tierColor = TIER_META[project.tier].color
  return (
    <motion.div layout="position" transition={{ type: 'spring', stiffness: 300, damping: 32 }}>
      <Link
        to={`/wiki/${project.slug}`}
        data-cursor="link"
        className="group grid min-h-24 grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-line py-4 transition-colors hover:bg-bg-raised md:grid-cols-[auto_minmax(140px,220px)_1fr_auto_auto_auto] md:gap-6"
      >
        <TierBadge tier={project.tier} size="md" />
        <span className="font-display text-xl font-bold tracking-tight text-ink">
          {project.name}
        </span>
        <span className="hidden truncate text-sm text-ink-dim md:block">
          {project.tagline.length > 60 ? `${project.tagline.slice(0, 60)}…` : project.tagline}
        </span>
        <span className="hidden gap-2 lg:flex">
          {[project.language, project.license, project.maintainerType].map((t) => (
            <span key={t} className="mono-label border border-line px-2 py-0.5 text-ink-faint">
              {t}
            </span>
          ))}
        </span>
        <span className="hidden font-mono text-sm text-ink-dim md:block">{project.stars}★</span>
        <span className="flex items-center gap-3">
          <span
            className="font-mono text-2xl font-semibold transition-transform duration-200 group-hover:scale-110"
            style={{ color: tierColor }}
          >
            {project.score.toFixed(1)}
          </span>
          <ChevronRight className="h-4 w-4 text-ink-faint transition-transform duration-200 group-hover:translate-x-1 group-hover:text-ink" />
        </span>
      </Link>
    </motion.div>
  )
}

/** 网格视图卡片底部：迷你六维条形图 */
export function MiniDimBars({ project }: { project: Project }) {
  const tierColor = TIER_META[project.tier].color
  return (
    <div className="space-y-1">
      {DIMENSION_LABELS.map(({ key, label }) => (
        <div key={key} className="flex items-center gap-2">
          <span className="w-14 shrink-0 font-mono text-[10px] text-ink-faint">{label}</span>
          <div className="h-1 flex-1 bg-line">
            <div
              className="h-full"
              style={{ width: `${project.dimensions[key] * 10}%`, backgroundColor: tierColor }}
            />
          </div>
          <span className="w-4 text-right font-mono text-[10px] text-ink-dim">
            {project.dimensions[key]}
          </span>
        </div>
      ))}
    </div>
  )
}
