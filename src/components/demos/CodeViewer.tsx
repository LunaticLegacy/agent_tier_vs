import { useState, type ReactNode } from 'react'
import { Check, Copy, FileCode2 } from 'lucide-react'

/**
 * 深色 IDE 风格代码查看器：轻量语法高亮 + 行号 + 语言标签 + 复制按钮。
 * 高亮为内置正则 tokenizer（python / yaml / markdown / 其他纯文本），
 * 配色对齐 VSCode Dark+ 习惯并复用站点 Tier 色板。
 */

// IDE 配色（与全站暗色 token 协调）
const C = {
  keyword: 'text-[#C792EA]', // 关键字：紫
  string: 'text-[#98C379]', // 字符串：绿
  comment: 'text-[#5C6773] italic', // 注释：灰斜体
  number: 'text-[#FF9E64]', // 数字：橙
  func: 'text-[#61AFEF]', // 函数/方法：蓝
  decorator: 'text-[#38BDF8]', // 装饰器/yaml 键：青（tier-b）
  builtin: 'text-[#E5C07B]', // 内建/常量：金黄
  operator: 'text-[#F78C6C]', // 运算符：橙红
  plain: 'text-ink/90',
  heading: 'text-[#61AFEF] font-bold',
  punct: 'text-ink-dim',
} as const

type Rule = { re: RegExp; cls: string }

const PY_KEYWORDS =
  'import|from|as|def|class|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|with|try|except|finally|raise|yield|lambda|pass|break|continue|global|nonlocal|assert|del|async|await|match|case|print'

const RULES: Record<string, Rule[]> = {
  python: [
    { re: /#.*$/g, cls: C.comment },
    { re: /"""[\s\S]*?"""|'''[\s\S]*?'''/g, cls: C.string },
    { re: /f"(?:[^"\\]|\\.)*"|f'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, cls: C.string },
    { re: /@[\w.]+/g, cls: C.decorator },
    { re: new RegExp(`\\b(?:${PY_KEYWORDS})\\b`, 'g'), cls: C.keyword },
    { re: /\b\d+(?:\.\d+)?\b/g, cls: C.number },
    { re: /\b[A-Za-z_]\w*(?=\()/g, cls: C.func },
    { re: /\bself\b|\bcls\b/g, cls: C.builtin },
  ],
  yaml: [
    { re: /#.*$/g, cls: C.comment },
    { re: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, cls: C.string },
    { re: /^[\s-]*[\w.-]+(?=\s*:)/g, cls: C.decorator },
    { re: /\b(?:true|false|null|yes|no)\b/g, cls: C.keyword },
    { re: /\b\d+(?:\.\d+)?\b/g, cls: C.number },
    { re: /!!\w+/g, cls: C.operator },
  ],
  markdown: [
    { re: /^#{1,6}\s.*$/g, cls: C.heading },
    { re: /`[^`]+`/g, cls: C.string },
    { re: /\*\*[^*]+\*\*/g, cls: C.builtin },
    { re: /\[[^\]]*\]\([^)]*\)/g, cls: C.func },
  ],
  bash: [
    { re: /#.*$/g, cls: C.comment },
    { re: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, cls: C.string },
    { re: /\$[A-Z_][A-Z0-9_]*/g, cls: C.builtin },
    { re: /\b(?:npm|npx|pip|git|cd|export|python3?|node)\b/g, cls: C.keyword },
  ],
}

/** 对单行按规则集做不重叠加色：先匹配者赢得该区段。 */
function highlightLine(line: string, rules: Rule[], keyPrefix: number): ReactNode[] {
  type Tok = { start: number; end: number; cls: string; text: string }
  const toks: Tok[] = []
  for (const { re, cls } of rules) {
    re.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = re.exec(line)) !== null) {
      const start = m.index
      const end = start + m[0].length
      if (end === start) break
      // 已被更早的高优先级规则覆盖则跳过
      if (!toks.some((t) => start < t.end && end > t.start)) {
        toks.push({ start, end, cls, text: m[0] })
      }
      if (m[0].length === 0) re.lastIndex++
    }
  }
  toks.sort((a, b) => a.start - b.start)
  const out: ReactNode[] = []
  let pos = 0
  let k = 0
  for (const t of toks) {
    if (t.start > pos) out.push(<span key={`${keyPrefix}-${k++}`}>{line.slice(pos, t.start)}</span>)
    out.push(
      <span key={`${keyPrefix}-${k++}`} className={t.cls}>
        {t.text}
      </span>,
    )
    pos = t.end
  }
  if (pos < line.length) out.push(<span key={`${keyPrefix}-${k++}`}>{line.slice(pos)}</span>)
  if (out.length === 0) out.push(<span key={`${keyPrefix}-0`}> </span>)
  return out
}

function normalizeLanguage(lang: string): keyof typeof RULES | null {
  const l = lang.toLowerCase()
  if (l.includes('python') || l === 'py') return 'python'
  if (l.includes('yaml') || l === 'yml') return 'yaml'
  if (l.includes('markdown') || l === 'md') return 'markdown'
  if (l.includes('bash') || l.includes('shell') || l === 'sh') return 'bash'
  return null
}

export default function CodeViewer({
  code,
  language,
  fileLabel,
}: {
  code: string
  language: string
  fileLabel: string
}) {
  const [copied, setCopied] = useState(false)
  const lines = code.trimEnd().split('\n')
  const rules = normalizeLanguage(language) ? RULES[normalizeLanguage(language)!] : null

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // 剪贴板不可用时静默失败（如非安全上下文）
    }
  }

  return (
    <div className="overflow-hidden border border-line bg-bg-inset">
      {/* 标题栏：traffic lights + 文件名 + 语言标签 + 复制 */}
      <div className="flex items-center gap-3 border-b border-line bg-bg-raised px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <i className="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <i className="h-2.5 w-2.5 rounded-full bg-tier-s/70" />
          <i className="h-2.5 w-2.5 rounded-full bg-tier-c/70" />
        </span>
        <span className="flex items-center gap-1.5 font-mono text-xs text-ink-dim">
          <FileCode2 className="h-3.5 w-3.5" />
          {fileLabel}
        </span>
        <span className="mono-label ml-auto border border-line px-2 py-0.5 text-ink-faint">
          {language}
        </span>
        <button
          onClick={copy}
          className="mono-label flex items-center gap-1 border border-line px-2 py-0.5 text-ink-dim transition-colors hover:border-line-bright hover:text-ink"
          aria-label="复制代码"
        >
          {copied ? <Check className="h-3 w-3 text-tier-c" /> : <Copy className="h-3 w-3" />}
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      {/* 代码区：行号 + 语法高亮，横向滚动 */}
      <div className="max-h-[70vh] overflow-auto">
        <pre className="flex min-w-max px-0 py-3 font-mono text-[13px] leading-6">
          <span
            aria-hidden
            className="sticky left-0 select-none border-r border-line bg-bg-inset px-3 text-right text-ink-faint/60"
          >
            {lines.map((_, i) => (
              <span key={i} className="block">
                {i + 1}
              </span>
            ))}
          </span>
          <code className={`block px-4 ${C.plain}`}>
            {lines.map((line, i) => (
              <span key={i} className="block whitespace-pre">
                {rules ? highlightLine(line, rules, i) : line || ' '}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}
