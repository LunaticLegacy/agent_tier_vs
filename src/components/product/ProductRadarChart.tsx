import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { ProductScores } from '@/data/products'
import { PRODUCT_DIMENSION_LABELS } from '@/data/products'

const SIZE = 280
const CENTER = SIZE / 2
const RADIUS = 96

function point(axis: number, value: number): [number, number] {
  const angle = (Math.PI * 2 * axis) / 6 - Math.PI / 2
  const r = (value / 10) * RADIUS
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)]
}

function polygonPoints(values: number[]): string {
  return values.map((v, i) => point(i, v).join(',')).join(' ')
}

/** 产品榜六维雷达图：Tier 色描边 + 10% 填充（与框架榜同款视觉） */
export default function ProductRadarChart({
  scores,
  color,
}: {
  scores: ProductScores
  color: string
}) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const values = PRODUCT_DIMENSION_LABELS.map(({ key }) => scores[key])
  const dataPoints = polygonPoints(values)

  return (
    <motion.svg
      ref={ref}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="mx-auto w-full max-w-[280px]"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : undefined}
      transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: 'center' }}
      role="img"
      aria-label="产品六维评分雷达图"
    >
      {[3.3, 6.6, 10].map((v) => (
        <polygon
          key={v}
          points={polygonPoints([v, v, v, v, v, v])}
          fill="none"
          stroke="#1E2530"
          strokeWidth="1"
        />
      ))}
      {PRODUCT_DIMENSION_LABELS.map((_, i) => {
        const [x, y] = point(i, 10)
        return (
          <line key={i} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="#1E2530" strokeWidth="1" />
        )
      })}
      <motion.polygon
        points={dataPoints}
        fill={color}
        fillOpacity={0.1}
        stroke={color}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : undefined}
        transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
      />
      {values.map((v, i) => {
        const [x, y] = point(i, v)
        return <circle key={i} cx={x} cy={y} r="2.5" fill={color} />
      })}
      {PRODUCT_DIMENSION_LABELS.map(({ label }, i) => {
        const [x, y] = point(i, 12.6)
        return (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-ink-faint font-mono"
            fontSize="10"
          >
            {label}
          </text>
        )
      })}
    </motion.svg>
  )
}
