import { readFileSync } from 'fs'

const rf = f => readFileSync(f, 'utf-8')

// 1. twitter:image
const cp = rf('./src/components/hub-pages/calculator-page-content.tsx')
console.log('1. twitter:image in calc pages:', cp.includes('twitter:image') ? 'YES' : 'MISSING')
const hl = rf('./src/components/hub-pages/hub-landing.tsx')
console.log('   twitter:image in hub-landing:', hl.includes('twitter:image') ? 'YES' : 'MISSING')
const pt = rf('./src/app/page.tsx')
console.log('   twitter:image in homepage:', pt.includes('twitter:image') ? 'YES' : 'MISSING')

// 2. Hub page title brand suffix
const hubTitleMatch = hl.match(/title:\s*`\$\{hubTitle\}[\s\S]{0,50}JDCALC/)
console.log('2. Hub title has JDCALC suffix:', hubTitleMatch ? 'YES' : 'NO')

// 3. og:site_name
const siteNameCalc = cp.match(/site_name[^:]+:\s*['"]([^'"]+)['"]/)
const siteNameHome = pt.match(/site_name[^:]+:\s*['"]([^'"]+)['"]/)
console.log('3. og:site_name — calc:', siteNameCalc?.[1], '| homepage:', siteNameHome?.[1])

// 4. Root layout OG locale
const layout = rf('./src/app/layout.tsx')
console.log('4. Root layout OG locale:', layout.includes("'og:locale'") ? 'YES (hardcoded)' : 'NOT FOUND')
console.log('   Has locale in OG:', layout.includes('ogLocale') || layout.includes('locale') ? 'CHECK' : 'NO')

// 5. RU titles
const ru = JSON.parse(rf('./src/i18n/calculator-overrides/ru.json'))
const key = Object.keys(ru)[0]
console.log('5. RU first title:', ru[key].title.substring(0, 60))

// 6. Guide body translation
const gc = rf('./src/lib/seo/guide-content.ts')
console.log('6. generateWhatIs accepts t:', gc.includes('function generateWhatIs(calc: CalculatorEntry, t?: TranslateFn)') ? 'YES' : 'NO')
const esMsg = JSON.parse(rf('./src/i18n/messages/es.json'))
console.log('   es.json guide.body exists:', esMsg.guide?.body ? 'YES (' + Object.keys(esMsg.guide.body).length + ' keys)' : 'MISSING')
console.log('   es.json body.whatIs exists:', esMsg.guide?.body?.whatIs ? 'YES (' + Object.keys(esMsg.guide.body.whatIs).length + ' cats)' : 'MISSING')

// 7. Cluster OG
const clusters = rf('./src/lib/seo-clusters/index.ts')
console.log('7. Cluster OG:', clusters.includes('og-image.png') ? 'STATIC og-image.png' : 'OK (dynamic or none)')

// 8. x-default in sitemap
const st = rf('./src/app/sitemap.ts')
console.log('8. x-default in sitemap:', st.includes('x-default') ? 'YES' : 'MISSING')

// 9. Title >45 brand suffix
const titleLogic = cp.match(/calc\.title\.length\s*>\s*45/)
console.log('9. Title >45 chars brand logic:', titleLogic ? 'EXISTS (cut at 45)' : 'NOT FOUND')

// 10. 4 locales have English titles?
for (const loc of ['ru','ar','hi','ja','zh-CN']) {
  const d = JSON.parse(rf(`./src/i18n/calculator-overrides/${loc}.json`))
  const k = Object.keys(d)[0]
  const firstWord = d[k].title.split(/[\s(]/)[0]
  const isEnglish = /^[A-Za-z]/.test(firstWord)
  console.log(`10. ${loc} first title starts with Latin: ${isEnglish} — "${firstWord}"`)
}
