/**
 * 数据校验：防止不完整/非法的项目数据进入仓库。
 * 校验 src/data/projects.ts 与（若存在）src/data/products.ts 的字段完整性与 Tier 合法性。
 * 用法：node scripts/validate-data.mjs
 */
import { readFileSync, existsSync } from 'node:fs'

const errors = []

function checkSource(file, tierPattern, requiredFields) {
  if (!existsSync(file)) {
    errors.push(`缺少数据文件: ${file}`)
    return
  }
  const src = readFileSync(file, 'utf8')

  // slug 列表
  const slugs = [...src.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
  if (slugs.length === 0) errors.push(`${file}: 未找到任何 slug`)
  const dup = slugs.filter((s, i) => slugs.indexOf(s) !== i)
  if (dup.length) errors.push(`${file}: slug 重复: ${[...new Set(dup)].join(', ')}`)

  // Tier 合法性
  const tiers = [...src.matchAll(/tier:\s*'([^']+)'/g)].map((m) => m[1])
  for (const t of tiers) {
    if (!tierPattern.test(t)) errors.push(`${file}: 非法 Tier '${t}'（期望 ${tierPattern}）`)
  }
  if (tiers.length !== slugs.length)
    errors.push(`${file}: tier 数量(${tiers.length}) 与 slug 数量(${slugs.length}) 不一致`)

  // 必填字段计数（每个条目至少出现次数 ≥ slug 数）
  for (const field of requiredFields) {
    const count = (src.match(new RegExp(`${field}:`, 'g')) || []).length
    if (count < slugs.length)
      errors.push(`${file}: 字段 '${field}' 出现 ${count} 次，少于条目数 ${slugs.length}`)
  }
}

checkSource('src/data/projects.ts', /^[SABCD]$/, [
  'name', 'tier', 'tagline', 'stars', 'license', 'highlights', 'weaknesses', 'quote',
])

if (existsSync('src/data/products.ts')) {
  checkSource('src/data/products.ts', /^T[0-3]$/, [
    'name', 'tier', 'tagline', 'vendor', 'verdict', 'strengths', 'weaknesses',
  ])
}

if (errors.length) {
  console.error('数据校验失败：')
  for (const e of errors) console.error('  ✗ ' + e)
  process.exit(1)
}
console.log('✓ 数据校验通过')
