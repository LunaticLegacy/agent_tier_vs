import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { DimensionScores } from '@/data/projects'
import { DIMENSION_LABELS } from '@/data/projects'

const REASONS: Record<keyof DimensionScores, (v: number) => string> = {
  architecture: (v) =>
    v >= 9 ? '抽象层划分教科书级' : v >= 7 ? '抽象清晰、边界明确' : v >= 5 ? '结构可用但欠打磨' : '停留在概念验证阶段',
  code: (v) =>
    v >= 9 ? '类型纪律与实现质量顶尖' : v >= 7 ? '实现干净、可读性好' : v >= 5 ? '质量中等，有明显毛边' : '实现单薄，完成度低',
  testCI: (v) =>
    v >= 9 ? '覆盖率硬门禁 + 重型 CI' : v >= 7 ? '测试与 CI 体系健全' : v >= 5 ? '有基础测试，覆盖不足' : '测试与 CI 基本缺位',
  docs: (v) =>
    v >= 9 ? '文档与 DX 属一流水准' : v >= 7 ? '文档完整、上手顺滑' : v >= 5 ? '文档够用但不深入' : '文档稀薄，上手困难',
  ecosystem: (v) =>
    v >= 9 ? '生态与社区顶级繁荣' : v >= 6 ? '社区活跃、生态成型' : v >= 3 ? '生态尚在早期' : '生态接近为零',
  radical: (v) =>
    v >= 9 ? '范式级思想，行业罕见' : v >= 7 ? '理念锋利、独树一帜' : v >= 5 ? '有巧思但不颠覆' : '走稳妥保守路线',
}

/** S4 六维评分明细：10 格段式进度条，逐格点亮 */
export default function ScoreBars({
  dimensions,
  color,
}: {
  dimensions: DimensionScores
  color: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })

  return (
    <div ref={ref} className="space-y-5">
      {DIMENSION_LABELS.map(({ key, label }, row) => {
        const value = dimensions[key]
        return (
          <div key={key} className="grid gap-2 md:grid-cols-[110px_1fr_52px] md:items-center">
            <span className="font-mono text-sm text-ink">{label}</span>
            <div>
              <div className="flex gap-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <motion.span
                    key={i}
                    className="h-3 flex-1"
                    style={{ backgroundColor: i < value ? color : '#1E2530' }}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : undefined}
                    transition={{ delay: row * 0.1 + i * 0.04, duration: 0.15 }}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-sm text-ink-dim">{REASONS[key](value)}</p>
            </div>
            <span className="font-mono text-lg font-semibold" style={{ color }}>
              {value}
              <span className="text-xs text-ink-faint">/10</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}
