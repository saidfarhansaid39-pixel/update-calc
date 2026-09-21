import { readFileSync } from 'fs'
import { join } from 'path'

const locales = ['es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi', 'ja', 'zh-CN']
const dir = join(process.cwd(), 'src', 'i18n', 'messages')

function flattenKeys(obj, prefix = '') {
  const keys = []
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      keys.push(...flattenKeys(val, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}

function getLeafValue(obj, path) {
  const parts = path.split('.')
  let current = obj
  for (const part of parts) {
    if (current === undefined || current === null) return undefined
    current = current[part]
  }
  return current
}

const files = {}
for (const locale of ['en', ...locales]) {
  files[locale] = JSON.parse(readFileSync(join(dir, `${locale}.json`), 'utf8'))
}

const enKeys = flattenKeys(files.en)

console.log('\n=== PLACEHOLDER MISMATCHES ===\n')

for (const locale of locales) {
  const mismatches = []
  for (const key of enKeys) {
    const enVal = getLeafValue(files.en, key)
    const locVal = getLeafValue(files[locale], key)
    if (typeof enVal === 'string' && typeof locVal === 'string') {
      const enPH = [...enVal.matchAll(/\{[^}]+\}/g)].map(m => m[0]).sort()
      const locPH = [...locVal.matchAll(/\{[^}]+\}/g)].map(m => m[0]).sort()
      if (JSON.stringify(enPH) !== JSON.stringify(locPH)) {
        mismatches.push({ key, en: enPH, loc: locPH, enVal: enVal.substring(0, 80), locVal: locVal.substring(0, 80) })
      }
    }
  }
  if (mismatches.length > 0) {
    console.log(`${locale.toUpperCase()} (${mismatches.length} mismatches):`)
    for (const m of mismatches) {
      console.log(`  ${m.key}`)
      console.log(`    EN: ${JSON.stringify(m.en)} — "${m.enVal}"`)
      console.log(`    ${locale.toUpperCase()}: ${JSON.stringify(m.loc)} — "${m.locVal}"`)
    }
    console.log('')
  }
}

console.log('\n=== UNTRANSLATED STRINGS (FR) ===\n')
let count = 0
for (const key of enKeys) {
  const enVal = getLeafValue(files.en, key)
  const frVal = getLeafValue(files.fr, key)
  if (typeof enVal === 'string' && typeof frVal === 'string' && enVal === frVal && enVal.length > 3) {
    // Skip known cognates/brand/technical terms
    if (['Calculat', '@', 'CFA', 'MD', 'PE', 'PhD', 'CSV', 'PDF', 'Markdown', 'IUPAC', 'S&P', 'FHA', 'AP', 'IB', 'GPA', 'DTI', 'BMR', 'TDEE', 'IQR', 'HVAC', 'BTU', 'Ohm'].some(term => enVal.includes(term))) continue
    if (enVal.startsWith('{') || enVal.startsWith('#') || enVal === 'Free') continue
    count++
    if (count <= 40) console.log(`  ${key}: "${enVal.substring(0, 80)}"`)
  }
}
console.log(`\n  Total untranslated in FR: ${count}`)

console.log('\n=== UNTRANSLATED STRINGS (DE) ===\n')
count = 0
for (const key of enKeys) {
  const enVal = getLeafValue(files.en, key)
  const deVal = getLeafValue(files.de, key)
  if (typeof enVal === 'string' && typeof deVal === 'string' && enVal === deVal && enVal.length > 3) {
    if (['Calculat', '@', 'CFA', 'MD', 'PE', 'PhD', 'CSV', 'PDF', 'Markdown', 'IUPAC', 'S&P', 'FHA', 'AP', 'IB', 'GPA', 'DTI', 'BMR', 'TDEE', 'IQR', 'HVAC', 'BTU', 'Ohm'].some(term => enVal.includes(term))) continue
    if (enVal.startsWith('{') || enVal.startsWith('#') || enVal === 'Free') continue
    count++
    if (count <= 40) console.log(`  ${key}: "${enVal.substring(0, 80)}"`)
  }
}
console.log(`\n  Total untranslated in DE: ${count}`)
