import { readFileSync } from 'fs'
import { join } from 'path'

const locales = ['en', 'es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi', 'ja', 'zh-CN']
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

// Load all locale files
const files = {}
for (const locale of locales) {
  try {
    const raw = readFileSync(join(dir, `${locale}.json`), 'utf8')
    files[locale] = JSON.parse(raw)
  } catch (e) {
    console.error(`ERROR: Could not load ${locale}.json: ${e.message}`)
    process.exit(1)
  }
}

const enKeys = flattenKeys(files.en)
console.log(`\n${'='.repeat(70)}`)
console.log(`TRANSLATION AUDIT REPORT`)
console.log(`${'='.repeat(70)}`)
console.log(`English source: ${enKeys.length} leaf keys\n`)

// Top-level namespaces
const namespaces = [...new Set(enKeys.map(k => k.split('.')[0]))]
console.log(`Namespaces: ${namespaces.join(', ')}\n`)

for (const locale of locales) {
  if (locale === 'en') continue
  const localeKeys = flattenKeys(files[locale])
  const localeKeySet = new Set(localeKeys)
  const enKeySet = new Set(enKeys)

  const missing = enKeys.filter(k => !localeKeySet.has(k))
  const extra = localeKeys.filter(k => !enKeySet.has(k))

  // Check for untranslated (still English)
  let untranslated = 0
  let untranslatedExamples = []
  for (const key of enKeys) {
    const enVal = getLeafValue(files.en, key)
    const locVal = getLeafValue(files[locale], key)
    if (typeof enVal === 'string' && typeof locVal === 'string') {
      if (enVal === locVal && enVal.length > 3 && !enVal.match(/^[A-Z][a-z]+\s[A-Z]/) && !enVal.includes('Calculat') && !enVal.includes('@') && !enVal.includes('CFA') && !enVal.includes('MD') && !enVal.includes('PE') && !enVal.includes('PhD')) {
        untranslated++
        if (untranslatedExamples.length < 5) {
          untranslatedExamples.push(`  ${key}: "${enVal.substring(0, 60)}"`)
        }
      }
    }
  }

  // Check for missing placeholders
  let placeholderIssues = 0
  for (const key of enKeys) {
    const enVal = getLeafValue(files.en, key)
    const locVal = getLeafValue(files[locale], key)
    if (typeof enVal === 'string' && typeof locVal === 'string') {
      const enPlaceholders = [...enVal.matchAll(/\{[^}]+\}/g)].map(m => m[0]).sort()
      const locPlaceholders = [...locVal.matchAll(/\{[^}]+\}/g)].map(m => m[0]).sort()
      if (JSON.stringify(enPlaceholders) !== JSON.stringify(locPlaceholders)) {
        placeholderIssues++
      }
    }
  }

  // Check for missing bold tags
  let boldIssues = 0
  for (const key of enKeys) {
    const enVal = getLeafValue(files.en, key)
    const locVal = getLeafValue(files[locale], key)
    if (typeof enVal === 'string' && typeof locVal === 'string') {
      const enBolds = (enVal.match(/\{bold\}/g) || []).length
      const locBolds = (locVal.match(/\{bold\}/g) || []).length
      const enBoldEnds = (enVal.match(/\{\/bold\}/g) || []).length
      const locBoldEnds = (locVal.match(/\{\/bold\}/g) || []).length
      if (enBolds !== locBolds || enBoldEnds !== locBoldEnds) {
        boldIssues++
      }
    }
  }

  console.log(`${'─'.repeat(50)}`)
  console.log(`📍 ${locale.toUpperCase()}`)
  console.log(`${'─'.repeat(50)}`)
  console.log(`  Keys: ${localeKeys.length} / ${enKeys.length} (${((localeKeys.length / enKeys.length) * 100).toFixed(1)}%)`)
  console.log(`  Missing keys: ${missing.length}`)
  console.log(`  Extra keys: ${extra.length}`)
  console.log(`  Untranslated (still English): ${untranslated}`)
  console.log(`  Placeholder mismatches: ${placeholderIssues}`)
  console.log(`  Bold tag mismatches: ${boldIssues}`)

  if (missing.length > 0) {
    console.log(`\n  ❌ MISSING KEYS (${missing.length}):`)
    // Group by namespace
    const byNs = {}
    for (const k of missing) {
      const ns = k.split('.')[0]
      if (!byNs[ns]) byNs[ns] = []
      byNs[ns].push(k)
    }
    for (const [ns, keys] of Object.entries(byNs)) {
      console.log(`    [${ns}] (${keys.length} missing):`)
      for (const k of keys.slice(0, 10)) {
        console.log(`      - ${k}`)
      }
      if (keys.length > 10) console.log(`      ... and ${keys.length - 10} more`)
    }
  }

  if (untranslatedExamples.length > 0) {
    console.log(`\n  ⚠️  SAMPLE UNTRANSLATED (${untranslated} total):`)
    for (const ex of untranslatedExamples) {
      console.log(ex)
    }
  }

  console.log('')
}

// Summary
console.log(`${'='.repeat(70)}`)
console.log(`SUMMARY`)
console.log(`${'='.repeat(70)}`)
for (const locale of locales) {
  if (locale === 'en') continue
  const localeKeys = flattenKeys(files[locale])
  const missing = enKeys.filter(k => !new Set(localeKeys).has(k))
  let untranslated = 0
  for (const key of enKeys) {
    const enVal = getLeafValue(files.en, key)
    const locVal = getLeafValue(files[locale], key)
    if (typeof enVal === 'string' && typeof locVal === 'string') {
      if (enVal === locVal && enVal.length > 3 && !enVal.includes('Calculat') && !enVal.includes('@') && !enVal.includes('CFA') && !enVal.includes('MD') && !enVal.includes('PE') && !enVal.includes('PhD')) {
        untranslated++
      }
    }
  }
  const pct = ((localeKeys.length / enKeys.length) * 100).toFixed(1)
  const status = missing.length === 0 && untranslated < 10 ? '✅' : missing.length > 20 ? '❌' : '⚠️'
  console.log(`${status} ${locale.toUpperCase()}: ${localeKeys.length}/${enKeys.length} keys (${pct}%) | ${missing.length} missing | ${untranslated} untranslated`)
}
