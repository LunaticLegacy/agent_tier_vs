import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const standards = read('src/data/standards.ts')
const frameworks = read('src/data/projects.ts')
const products = read('src/data/products.ts')

assert.match(standards, /export function scoreFramework/)
assert.match(standards, /export function classifyFramework/)
assert.match(standards, /export function scoreProduct/)
assert.match(standards, /export function classifyProduct/)
assert.match(standards, /llmfetcher:[\s\S]*?evidence: 'provisional'/)
assert.match(standards, /angelus:[\s\S]*?evidence: 'provisional'/)
assert.match(standards, /维护者关联项目：[\s\S]*?不因该关系改变/)
assert.doesNotMatch(standards, /capFrameworkTier|capProductTier|evidence !== 'watch'/)
assert.match(frameworks, /score: scoreFramework\(project\.dimensions\)/)
assert.match(frameworks, /tier: classifyFramework\(project\.dimensions, audit\)/)
assert.match(products, /score: scoreProduct\(product\.scores\)/)
assert.match(products, /tier: classifyProduct\(product\.scores, audit\)/)
assert.match(products, /slug: 'openclaw'/)
assert.match(products, /slug: 'hermes-agent'/)
assert.match(frameworks, /slug: 'llmfetcher',[\s\S]*?dimensions: \{ architecture: 9, code: 8, testCI: 7, docs: 9, ecosystem: 2, radical: 9 \}/)
assert.match(products, /slug: 'angelus',[\s\S]*?scores: \{ autonomy: 6, toolUse: 6, longTask: 7, context: 7, extensibility: 6, stability: 6 \}/)

console.log('ranking verification passed: formula-derived tiers, disclosure-only affiliations, and updated entries are present.')
