// Generates per-locale URL slug maps: localized path segments -> canonical registry slugs.
// Input:  packages/calculator-registry/dist/index.mjs + src/i18n/calculator-overrides/{locale}.json
// Output: src/i18n/slug-maps/{locale}.json  { hubs: {local: canonical}, calcs: {hub: {canonical: local}} }
//
// Rules:
//  - calculator slugs are derived from the localized calculator title (slugify)
//  - identity slugs (translation == canonical) are skipped: the English form stays canonical
//  - within a hub, a localized slug may never equal ANY other canonical slug (avoids
//    ambiguity between "English form of X" and "localized form of Y"); collisions get -2, -3…
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const LOCALES = ['es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi', 'ja', 'zh-CN']

// Hand-authored hub slug translations (16 hubs x 9 locales)
const HUB_SLUGS = {
  'financial-calculators': {
    es: 'calculadoras-financieras', fr: 'calculateurs-financiers', de: 'finanzrechner',
    pt: 'calculadoras-financeiras', ru: 'финансовые-калькуляторы', ar: 'حاسبات-مالية',
    hi: 'वित्तीय-कैलकुलेटर', ja: '金融計算ツール', 'zh-CN': '金融计算器',
  },
  'health-calculators': {
    es: 'calculadoras-de-salud', fr: 'calculateurs-de-sante', de: 'gesundheitsrechner',
    pt: 'calculadoras-de-saude', ru: 'калькуляторы-здоровья', ar: 'حاسبات-الصحة',
    hi: 'स्वास्थ्य-कैलकुलेटर', ja: '健康計算ツール', 'zh-CN': '健康计算器',
  },
  'math-calculators': {
    es: 'calculadoras-matematicas', fr: 'calculateurs-mathematiques', de: 'mathematikrechner',
    pt: 'calculadoras-matematicas', ru: 'математические-калькуляторы', ar: 'حاسبات-رياضية',
    hi: 'गणित-कैलकुलेटर', ja: '数学計算ツール', 'zh-CN': '数学计算器',
  },
  'conversion-calculators': {
    es: 'calculadoras-de-conversion', fr: 'calculateurs-de-conversion', de: 'umrechner',
    pt: 'calculadoras-de-conversao', ru: 'конвертеры-единиц', ar: 'حاسبات-التحويل',
    hi: 'यूनिट-कन्वर्टर', ja: '単位換算', 'zh-CN': '单位换算',
  },
  'date-time-calculators': {
    es: 'calculadoras-de-fecha-y-hora', fr: 'calculateurs-de-date-et-heure', de: 'datum-und-zeitrechner',
    pt: 'calculadoras-de-data-e-hora', ru: 'калькуляторы-даты-и-времени', ar: 'حاسبات-التاريخ-والوقت',
    hi: 'तिथि-समय-कैलकुलेटर', ja: '日付時刻計算ツール', 'zh-CN': '日期时间计算器',
  },
  'construction-calculators': {
    es: 'calculadoras-de-construccion', fr: 'calculateurs-de-construction', de: 'baurechner',
    pt: 'calculadoras-de-construcao', ru: 'строительные-калькуляторы', ar: 'حاسبات-البناء',
    hi: 'निर्माण-कैलकुलेटर', ja: '建築計算ツール', 'zh-CN': '建筑计算器',
  },
  'statistics-calculators': {
    es: 'calculadoras-estadisticas', fr: 'calculateurs-statistiques', de: 'statistikrechner',
    pt: 'calculadoras-estatisticas', ru: 'статистические-калькуляторы', ar: 'حاسبات-إحصائية',
    hi: 'सांख्यिकी-कैलकुलेटर', ja: '統計計算ツール', 'zh-CN': '统计计算器',
  },
  'education-calculators': {
    es: 'calculadoras-educativas', fr: 'calculateurs-educatifs', de: 'bildungsrechner',
    pt: 'calculadoras-educacionais', ru: 'учебные-калькуляторы', ar: 'حاسبات-التعليم',
    hi: 'शैक्षिक-कैलकुलेटर', ja: '教育計算ツール', 'zh-CN': '教育计算器',
  },
  'physics-calculators': {
    es: 'calculadoras-de-fisica', fr: 'calculateurs-de-physique', de: 'physikrechner',
    pt: 'calculadoras-de-fisica', ru: 'калькуляторы-физики', ar: 'حاسبات-الفيزياء',
    hi: 'भौतिकी-कैलकुलेटर', ja: '物理計算ツール', 'zh-CN': '物理计算器',
  },
  'chemistry-calculators': {
    es: 'calculadoras-de-quimica', fr: 'calculateurs-de-chimie', de: 'chemierechner',
    pt: 'calculadoras-de-quimica', ru: 'химические-калькуляторы', ar: 'حاسبات-الكيمياء',
    hi: 'रसायन-कैलकुलेटर', ja: '化学計算ツール', 'zh-CN': '化学计算器',
  },
  'engineering-calculators': {
    es: 'calculadoras-de-ingenieria', fr: 'calculateurs-d-ingenierie', de: 'ingenieurrechner',
    pt: 'calculadoras-de-engenharia', ru: 'инженерные-калькуляторы', ar: 'حاسبات-الهندسة',
    hi: 'इंजीनियरिंग-कैलकुलेटर', ja: '工学計算ツール', 'zh-CN': '工程计算器',
  },
  'everyday-calculators': {
    es: 'calculadoras-del-dia-a-dia', fr: 'calculateurs-du-quotidien', de: 'alltagsrechner',
    pt: 'calculadoras-do-dia-a-dia', ru: 'бытовые-калькуляторы', ar: 'حاسبات-اليومية',
    hi: 'रोज़मर्रा-कैलकुलेटर', ja: '日常計算ツール', 'zh-CN': '日常计算器',
  },
  'food-calculators': {
    es: 'calculadoras-de-alimentos', fr: 'calculateurs-alimentaires', de: 'kochrechner',
    pt: 'calculadoras-alimentares', ru: 'кулинарные-калькуляторы', ar: 'حاسبات-الطعام',
    hi: 'खाद्य-कैलकुलेटर', ja: '食品計算ツール', 'zh-CN': '食品计算器',
  },
  'biology-calculators': {
    es: 'calculadoras-de-biologia', fr: 'calculateurs-de-biologie', de: 'biologierechner',
    pt: 'calculadoras-de-biologia', ru: 'биологические-калькуляторы', ar: 'حاسبات-الأحياء',
    hi: 'जीव-विज्ञान-कैलकुलेटर', ja: '生物計算ツール', 'zh-CN': '生物计算器',
  },
  'ecology-calculators': {
    es: 'calculadoras-de-ecologia', fr: 'calculateurs-d-ecologie', de: 'okologie-rechner',
    pt: 'calculadoras-de-ecologia', ru: 'экологические-калькуляторы', ar: 'حاسبات-البيئة',
    hi: 'पर्यावरण-कैलकुलेटर', ja: '環境計算ツール', 'zh-CN': '环境计算器',
  },
  'sports-calculators': {
    es: 'calculadoras-deportivas', fr: 'calculateurs-de-sport', de: 'sportrechner',
    pt: 'calculadoras-esportivas', ru: 'спортивные-калькуляторы', ar: 'حاسبات-الرياضة',
    hi: 'खेल-कैलकुलेटर', ja: 'スポーツ計算ツール', 'zh-CN': '体育计算器',
  },
}

// Literal (untranslatable) route segments that localized slugs must never collide with
const RESERVED = new Set([
  'about', 'contact', 'privacy', 'terms', 'calculator-builder', 'suggest-calculator',
  'not-found', 'author', 'blog', 'login', 'register', 'my-calculations', 'press',
  'accessibility', 'editorial-policy', 'a-z-index', 'sitemap', 'api', 'llms.txt',
])

function slugify(title) {
  if (!title) return ''
  // NFD → strip only Latin combining marks (0300–036F) → NFC recompose.
  // NFC recomposition restores Arabic/Hebrew letters decomposed by NFD (e.g. ؤ).
  let s = String(title).normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC')
  s = s.toLowerCase()
  s = s.replace(/['\u2019\u02bc]/g, '-')          // apostrophes are word separators
  // keep letters, marks (Devanagari matras, Arabic harakat) and numbers
  s = s.replace(/[^\p{L}\p{M}\p{N}]+/gu, '-')     // everything else becomes a hyphen
  s = s.replace(/^[-\p{M}]+|[-\p{M}]+$/gu, '')
  if (s.length > 80) s = s.slice(0, 80).replace(/[-\p{M}]+$/gu, '')
  return s
}

const registryMod = await import('file:///' + join(ROOT, 'packages/calculator-registry/dist/index.mjs').replace(/\\/g, '/'))
const registry = registryMod.calculatorRegistry
if (!Array.isArray(registry) || registry.length === 0) {
  console.error('registry not loaded'); process.exit(1)
}

const hubs = [...new Set(registry.map((c) => c.hubSlug))]
for (const h of hubs) {
  if (!HUB_SLUGS[h]) { console.error('MISSING hub translation table for ' + h); process.exit(1) }
}

mkdirSync(join(ROOT, 'src/i18n/slug-maps'), { recursive: true })

for (const locale of LOCALES) {
  const overrides = JSON.parse(readFileSync(join(ROOT, `src/i18n/calculator-overrides/${locale}.json`), 'utf8'))

  const hubsOut = {}
  for (const h of hubs) {
    const local = slugify(HUB_SLUGS[h][locale])
    if (!local || RESERVED.has(local)) { console.error(`bad hub slug ${locale}/${h} -> ${local}`); process.exit(1) }
    hubsOut[local] = h
  }

  const calcsOut = {}
  let translated = 0, identity = 0, disambiguated = 0
  for (const h of hubs) {
    const inHub = registry.filter((c) => c.hubSlug === h)
    // reserved: every canonical slug in this hub + the localized hub itself is off-limits
    const used = new Set(inHub.map((c) => c.slug))
    const map = {}
    for (const c of inHub) {
      const o = overrides[c.slug]
      if (!o || !o.title) continue
      let local = slugify(o.title)
      if (!local) continue
      if (local === c.slug) { identity++; continue }
      if (used.has(local)) {
        let i = 2, cand
        do { cand = `${local}-${i++}` } while (used.has(cand))
        local = cand
        disambiguated++
      }
      used.add(local)
      map[c.slug] = local
      translated++
    }
    if (Object.keys(map).length > 0) calcsOut[h] = map
  }

  const out = { hubs: hubsOut, calcs: calcsOut }
  const file = join(ROOT, `src/i18n/slug-maps/${locale}.json`)
  writeFileSync(file, JSON.stringify(out))
  const bytes = existsSync(file) ? readFileSync(file).length : 0
  console.log(`${locale}: hubs=${Object.keys(hubsOut).length} calcs=${translated} identity=${identity} disambig=${disambiguated} (${(bytes / 1024).toFixed(0)} KB)`)
}
console.log('done')
