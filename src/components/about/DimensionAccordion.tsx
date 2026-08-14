import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const DIMS = [
  {
    name: '架构设计',
    weight: 25,
    def: '抽象是否少而准、边界是否清晰、副作用是否受控。',
    anchors: { high: '10 分 = 范式级', mid: '5 分 = 工整常规', low: '1 分 = 缠绕泄漏' },
  },
  {
    name: '代码质量',
    weight: 20,
    def: '类型纪律、一致性、可维护性、技术债。',
    anchors: { high: '10 分 = 教科书级纪律', mid: '5 分 = 可读但有债', low: '1 分 = 面条式实现' },
  },
  {
    name: '测试与CI',
    weight: 15,
    def: '覆盖率是否成门禁、CI 深度、可复现性。',
    anchors: { high: '10 分 = 覆盖率硬门禁', mid: '5 分 = 有测试但非门禁', low: '1 分 = 裸奔' },
  },
  {
    name: '文档DX',
    weight: 15,
    def: '文档纪律、示例质量、上手成本。',
    anchors: { high: '10 分 = 5 分钟跑通示例', mid: '5 分 = 文档全但陈旧', low: '1 分 = 只有 README' },
  },
  {
    name: '生态热度',
    weight: 15,
    def: '星数、社区、商业可持续性（注意：仅 15%，避免人气绑架排名）。',
    anchors: { high: '10 分 = 生态闭环', mid: '5 分 = 小而稳', low: '1 分 = 无人问津' },
  },
  {
    name: '思想激进度',
    weight: 10,
    def: '是否提出可验证的新范式。',
    anchors: { high: '10 分 = 开宗立派', mid: '5 分 = 局部创新', low: '1 分 = 复读机' },
  },
]

export default function DimensionAccordion() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="container-site border-t border-line py-20 md:py-28">
      <p className="mono-label text-ink-faint">SECTION 02</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
        <span className="font-mono text-vs">02 /</span> 六维评分定义
      </h2>

      <div className="mt-12 divide-y divide-line border-y border-line">
        {DIMS.map((d, i) => {
          const isOpen = open === i
          return (
            <div key={d.name}>
              <button
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-ink-faint">{String(i + 1).padStart(2, '0')}</span>
                  <span className={cn('text-lg font-bold', isOpen && 'text-vs')}>{d.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="mono-label border border-line px-2 py-1 text-ink-dim">
                    权重 {d.weight}%
                  </span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown className="h-4 w-4 text-ink-dim" />
                  </motion.span>
                </div>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      initial={{ y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.05 }}
                      className="pb-6 pl-10 pr-4"
                    >
                      <p className="max-w-2xl text-sm leading-7 text-ink-dim">{d.def}</p>
                      <div className="mt-4 grid gap-2 font-mono text-xs sm:grid-cols-3">
                        <span className="border border-line bg-bg-inset px-3 py-2 text-tier-c">{d.anchors.high}</span>
                        <span className="border border-line bg-bg-inset px-3 py-2 text-ink-dim">{d.anchors.mid}</span>
                        <span className="border border-line bg-bg-inset px-3 py-2 text-danger">{d.anchors.low}</span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
