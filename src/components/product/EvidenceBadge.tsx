import type { EvidenceLevel } from '@/data/products'
import { EVIDENCE_META } from '@/data/products'
import { cn } from '@/lib/utils'

/** 证据等级徽章：A/B/C/D 及组合（如 A/D、B/C） */
export default function EvidenceBadge({
  level,
  className,
}: {
  level: EvidenceLevel
  className?: string
}) {
  const parts = level.split('/') as ('A' | 'B' | 'C' | 'D')[]
  const primary = parts[0]
  const meta = EVIDENCE_META[primary]
  const title = parts.map((p) => `${EVIDENCE_META[p].name}：${EVIDENCE_META[p].definition}`).join(' / ')
  return (
    <span
      className={cn(
        'mono-label inline-flex shrink-0 items-center border px-1.5 py-0.5',
        className
      )}
      style={{ borderColor: `${meta.color}66`, color: meta.color }}
      title={title}
      aria-label={`证据等级 ${level}`}
    >
      {level}
    </span>
  )
}
