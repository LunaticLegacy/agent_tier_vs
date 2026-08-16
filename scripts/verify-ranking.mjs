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
assert.match(standards, /llmfetcher:[\s\S]*?evidence: 'watch'/)
assert.match(standards, /angelus:[\s\S]*?evidence: 'watch'/)
assert.match(frameworks, /score: scoreFramework\(project\.dimensions\)/)
assert.match(frameworks, /tier: classifyFramework\(project\.dimensions, audit\)/)
assert.match(products, /score: scoreProduct\(product\.scores\)/)
assert.match(products, /tier: classifyProduct\(product\.scores, audit\)/)
assert.match(products, /slug: 'openclaw'/)
assert.match(products, /slug: 'hermes-agent'/)

console.log('ranking verification passed: formula-derived tiers, author disclosures, and new products are present.')
