import type { Tier } from '@/data/projects'
import { TIER_META } from '@/data/projects'
import type { ProductTier } from '@/data/products'
import { TIER_META_PRODUCT } from '@/data/products'
import { cn } from '@/lib/utils'

const SIZE_MAP = {
  sm: 'h-8 w-8 text-base',
  md: 'h-10 w-10 text-xl',
  lg: 'h-12 w-12 text-2xl',
  xl: 'h-16 w-16 text-4xl',
} as const

function metaFor(tier: Tier | ProductTier): { color: string } {
  if (tier in TIER_META) return TIER_META[tier as Tier]
  return TIER_META_PRODUCT[tier as ProductTier]
}

/** 产品榜 T0–T3 徽章（框架榜请继续使用默认 TierBadge） */
export function ProductTierBadge({
  tier,
  size = 'md',
  className,
}: {
  tier: ProductTier
  size?: keyof typeof SIZE_MAP
  className?: string
}) {
  const meta = TIER_META_PRODUCT[tier]
  const fontAdjust =
    size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-2xl'
  return (
    <span
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center font-display font-bold tracking-tight text-[#0A0B0E]',
        SIZE_MAP[size],
        fontAdjust,
        tier === 'T0' && 'shadow-tier-s',
        className
      )}
      style={{ backgroundColor: meta.color }}
      aria-label={`Tier ${tier}`}
    >
      {tier}
    </span>
  )
}

export default function TierBadge({
  tier,
  size = 'md',
  className,
}: {
  tier: Tier
  size?: keyof typeof SIZE_MAP
  className?: string
}) {
  const meta = metaFor(tier)
  return (
    <span
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center font-display font-bold text-[#0A0B0E]',
        SIZE_MAP[size],
        tier === 'S' && 'shadow-tier-s',
        className
      )}
      style={{ backgroundColor: meta.color }}
      aria-label={`Tier ${tier}`}
    >
      {tier}
    </span>
  )
}
