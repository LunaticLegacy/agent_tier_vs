import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Project } from '@/data/projects'
import { TIER_META, DIMENSION_LABELS } from '@/data/projects'
import TierBadge from '@/components/TierBadge'
import { cn } from '@/lib/utils'

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const meta = TIER_META[project.tier]
  const isS = project.tier === 'S'
  const archived = project.status !== '活跃'

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/wiki/${project.slug}`} data-cursor-label="查看档案" className="group block">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className={cn(
            'relative flex flex-col gap-4 border border-line bg-bg-raised p-5 transition-colors duration-300 group-hover:border-line-bright group-hover:bg-[#141922] md:flex-row md:items-center md:gap-8',
            isS && 'scale-[1.02] border-[#F5C518]/60 shadow-[0_0_40px_rgba(245,197,24,0.08)] md:scale-[1.03]'
          )}
          style={
            isS
              ? {
                  backgroundImage:
                    'radial-gradient(ellipse at 20% 0%, rgba(245,197,24,0.06), transparent 60%)',
                }
              : undefined
          }
        >
          {/* tier color left bar */}
          <span
            className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 transition-transform duration-500 group-hover:scale-y-100"
            style={{ backgroundColor: meta.color }}
          />
          {archived && (
            <span className="mono-label absolute right-3 top-3 border border-line px-1.5 py-0.5 text-ink-faint">
              ARCHIVED
            </span>
          )}

          <div className="flex items-center gap-4">
            <TierBadge tier={project.tier} size="lg" />
            <span className="font-mono text-sm text-ink-faint">
              #{String(project.rank).padStart(2, '0')}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className={cn(
                'font-display text-2xl font-bold text-ink',
                archived && 'underline decoration-ink-faint decoration-1 underline-offset-4'
              )}
            >
              {project.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-base text-ink-dim">{project.tagline}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="mono-label border border-line px-1.5 py-0.5 text-ink-dim">
                {project.maintainerType}
              </span>
              <span className="mono-label border border-line px-1.5 py-0.5 text-ink-dim">
                {project.language}
              </span>
              <span className="font-mono text-xs text-ink-faint">{project.license}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 md:flex-col md:items-end md:gap-2">
            <span
              className={cn('font-mono text-2xl font-semibold', isS ? 'text-tier-s' : 'text-ink')}
            >
              {project.stars} <span className="text-sm">★</span>
            </span>
            {/* mini 6-dim bars */}
            <div className="flex w-28 flex-col gap-1">
              {DIMENSION_LABELS.map((d, i) => (
                <motion.span
                  key={d.key}
                  className="block h-1 origin-left"
                  style={{ backgroundColor: meta.color }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: project.dimensions[d.key] / 10 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                />
              ))}
            </div>
          </div>

          <span className="mono-label hidden -translate-x-2 text-vs opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block">
            查看档案 →
          </span>
        </motion.div>
      </Link>
    </motion.div>
  )
}
