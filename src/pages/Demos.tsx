import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, TerminalSquare } from 'lucide-react'
import { demos } from '@/data/demos'
import CodeViewer from '@/components/demos/CodeViewer'
import DemoSidebar from '@/components/demos/DemoSidebar'
import TierBadge from '@/components/TierBadge'

function HeaderTerminal() {
  const text = '$ ls demos/ | wc -l → 10'
  return (
    <span className="font-mono text-sm text-ink-faint" aria-label={text}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.03 }}
        >
          {ch}
        </motion.span>
      ))}
      <span className="animate-cursor-blink text-vs">▌</span>
    </span>
  )
}

export default function Demos() {
  const [active, setActive] = useState(demos[0].slug)
  const demo = useMemo(() => demos.find((d) => d.slug === active) ?? demos[0], [active])

  return (
    <div className="container-site py-12 md:py-16">
      {/* 页头：终端装饰 */}
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <TerminalSquare className="h-5 w-5 text-vs" />
          <HeaderTerminal />
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          最小 <span className="text-vs">Demo</span> 集
        </h1>
        <p className="mt-4 max-w-2xl text-ink-dim">
          为榜单上的代表性 Agent 框架 / harness 各写一个 ≤80 行的最小示例，直击其核心抽象。
          所有 API key 均从环境变量读取；示例仅通过语法验证，未连接真实 LLM 实机运行。
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        {/* 左侧：按 Tier 分组的选择列表 */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <DemoSidebar active={active} onSelect={setActive} />
        </aside>

        {/* 右侧：代码查看器 + 说明卡 */}
        <section key={demo.slug}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <h2 className="font-display text-2xl font-bold">{demo.name}</h2>
              {demo.tier && <TierBadge tier={demo.tier} size="sm" />}
              <span className="mono-label text-ink-faint">
                {demo.lineCount} 行 · {demo.fileLabel}
              </span>
            </div>

            <CodeViewer code={demo.code} language={demo.language} fileLabel={demo.fileLabel} />

            {/* 核心抽象说明卡 */}
            <div className="mt-4 flex flex-col gap-4 border border-line bg-bg-raised p-5 md:flex-row md:items-center">
              <div className="flex-1">
                <p className="mono-label mb-1.5 text-vs">核心抽象</p>
                <p className="text-sm leading-7 text-ink-dim">{demo.abstraction}</p>
              </div>
              {demo.projectSlug && (
                <Link
                  to={`/wiki/${demo.projectSlug}`}
                  data-cursor="link"
                  className="mono-label inline-flex shrink-0 items-center gap-1.5 border border-line px-4 py-2 text-ink-dim transition-colors hover:border-vs hover:text-vs"
                >
                  去档案
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
