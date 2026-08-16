import type { RankingAudit } from '@/data/standards'
import { EVIDENCE_STATUS_META } from '@/data/standards'
import { cn } from '@/lib/utils'

export default function AuditBadge({ audit, className }: { audit: RankingAudit; className?: string }) {
  const meta = EVIDENCE_STATUS_META[audit.evidence]
  return (
    <span
      className={cn('mono-label inline-flex items-center border px-2 py-1', className)}
      style={{ color: meta.color, borderColor: `${meta.color}66` }}
      title={meta.description}
    >
      证据 · {meta.label}
    </span>
  )
}
