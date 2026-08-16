import { motion } from 'framer-motion'
import { Github } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const PRINCIPLES = [
  '代码 > README',
  '星数仅是六维之一',
  '停更不等于无价值（标 ARCHIVED 而非除名）',
  '关联项目必须披露，但关联关系不影响分数或 Tier',
]

const DISCLAIMER = [
  '数据为 2026-08 评审时点快照，星数随时间漂移。',
  '评分由公式和硬门槛决定；证据状态说明置信度，S/T0 需要已验证证据。',
  '若项目有重大更新，可提交带版本与证据链接的复核请求。',
]

export default function Principles() {
  return (
    <section className="container-site border-t border-line py-20 md:py-28">
      <div className="grid gap-12 md:grid-cols-2">
        {[
          { title: '原则', items: PRINCIPLES },
          { title: '免责声明', items: DISCLAIMER },
        ].map((col, ci) => (
          <motion.div
            key={col.title}
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: ci * 0.1, duration: 0.7, ease: EASE }}
          >
            <h3 className="text-2xl font-bold">
              <span className="font-mono text-vs">{String(ci + 4).padStart(2, '0')} /</span> {col.title}
            </h3>
            <ul className="mt-6 space-y-4">
              {col.items.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm leading-7 text-ink-dim">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-vs" />
                  {item}
                </li>
              ))}
            </ul>
            {ci === 1 && (
              <a
                href="https://github.com/LunaticLegacy/agent_tier_vs/issues/new"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 border border-line-bright px-4 py-2 text-sm font-bold text-ink transition-colors hover:border-vs hover:text-vs"
                data-cursor="link"
              >
                <Github className="h-4 w-4" /> 提交复核请求
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
