import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { Project } from '@/data/projects'
import { TIER_META } from '@/data/projects'
import TierBadge from '@/components/TierBadge'
import { MiniDimBars } from './ProjectListRow'

/** 索引页·网格视图卡片 */
export default function ProjectGridCard({ project }: { project: Project }) {
  const tierColor = TIER_META[project.tier].color
  return (
    <motion.div
      layout="position"
      transition={{ type: 'spring', stiffness: 300, damping: 32 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col border border-line bg-bg-raised transition-[box-shadow,border-color] duration-200"
      style={{ borderTop: `3px solid ${tierColor}` }}
    >
      <Link
        to={`/wiki/${project.slug}`}
        data-cursor="link"
        className="flex h-full flex-col p-5"
        style={{ textDecoration: 'none' }}
      >
        <div className="flex items-start justify-between">
          <TierBadge tier={project.tier} size="md" />
          <span className="font-mono text-sm text-ink-dim">{project.stars}★</span>
        </div>
        <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-ink">
          {project.name}
        </h3>
        <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm text-ink-dim">{project.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[project.language, project.license, project.maintainerType].map((t) => (
            <span key={t} className="mono-label border border-line px-2 py-0.5 text-ink-faint">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-5 border-t border-line pt-4">
          <MiniDimBars project={project} />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-lg font-semibold" style={{ color: tierColor }}>
            {project.score.toFixed(1)}
          </span>
          <span className="flex items-center gap-1 font-mono text-xs uppercase tracking-[0.12em] text-ink-dim transition-colors group-hover:text-ink">
            查看档案
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
