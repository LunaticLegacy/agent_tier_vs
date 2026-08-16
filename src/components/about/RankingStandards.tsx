import { FRAMEWORK_WEIGHTS, PRODUCT_WEIGHTS } from '@/data/standards'

const frameworkFormula = Object.entries(FRAMEWORK_WEIGHTS)
  .map(([key, value]) => `${key} ${value * 100}%`)
  .join(' · ')

const productFormula = Object.entries(PRODUCT_WEIGHTS)
  .map(([key, value]) => `${key} ${value * 100}%`)
  .join(' · ')

const rules = [
  ['01', '公式优先', '展示分数只能由公开权重计算；评语不允许人工补分。'],
  ['02', '硬门槛', '框架的代码/测试门槛与产品的稳定性门槛不满足时，不能因总分高而越级。'],
  ['03', '证据封顶', '已验证、暂定、观察三种状态公开展示；观察条目自动封顶。'],
  ['04', '关系披露', '评审者关联项目必须标注，且只采纳公开可复核事实。'],
]

export default function RankingStandards() {
  return (
    <section className="container-site border-t border-line py-20 md:py-28">
      <p className="mono-label text-ink-faint">SECTION 02B</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
        <span className="font-mono text-vs">02b /</span> 可审计排名标准
      </h2>
      <p className="mt-4 max-w-3xl leading-8 text-ink-dim">
        这里的 Tier 是可重算分类，不是评审者对项目的“最终判词”。分数、门槛、证据状态和利益披露共同决定公开结果。
      </p>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <div className="border border-line bg-bg-inset p-5">
          <p className="mono-label text-vs">FRAMEWORK SCORE / 10</p>
          <p className="mt-4 font-mono text-xs leading-7 text-ink-dim">{frameworkFormula}</p>
          <p className="mt-4 text-sm leading-7 text-ink-faint">
            S：≥9 且架构/代码/测试均 ≥8、证据已验证；A：≥7.5 且代码 ≥7、测试 ≥6；B：≥6.5 且测试 ≥5；其余按 C/D。
          </p>
        </div>
        <div className="border border-line bg-bg-inset p-5">
          <p className="mono-label text-vs">PRODUCT SCORE / 10</p>
          <p className="mt-4 font-mono text-xs leading-7 text-ink-dim">{productFormula}</p>
          <p className="mt-4 text-sm leading-7 text-ink-faint">
            T0：≥8.2、稳定性 ≥7、证据已验证；T1：≥7 且稳定性 ≥6；T2：≥5.5；其余 T3。产品排名只在同赛道、同 Tier 内成立。
          </p>
        </div>
      </div>

      <div className="mt-4 grid divide-y divide-line border border-line md:grid-cols-2 md:divide-x md:divide-y-0">
        {rules.map(([number, title, body]) => (
          <div key={number} className="p-5">
            <p className="font-mono text-xs text-vs">{number}</p>
            <h3 className="mt-2 font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-7 text-ink-dim">{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
