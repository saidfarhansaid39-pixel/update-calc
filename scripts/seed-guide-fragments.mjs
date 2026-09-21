import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const MESSAGES_DIR = join(ROOT, 'src', 'i18n', 'messages')
const FRAGMENTS_DIR = join(ROOT, 'src', 'i18n', 'fragments')
const LOCALES = ['es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi', 'ja', 'zh-CN']

const en = JSON.parse(readFileSync(join(MESSAGES_DIR, 'en.json'), 'utf8'))
const g = en.guide

const META_KEYS = ['completeGuide', 'onThisPage', 'minRead', 'wasHelpful', 'yes', 'no',
  'section_whatIs', 'section_howToUse', 'section_formula', 'section_example', 'section_useCases',
  'section_tips', 'section_related', 'section_faq',
  'toc_overview', 'toc_howToUse', 'toc_formula', 'toc_example', 'toc_useCases', 'toc_tips', 'toc_related', 'toc_faq',
  'sections', 'labels']

// concern dir -> (locale key -> partial payload builder)
const CONCERNS = {
  'guide-meta': (g) => Object.fromEntries(META_KEYS.map(k => [k, g[k]])),
  'guide-whatis': (g) => ({ body: { whatIs: g.body.whatIs } }),
  'guide-howtouse': (g) => ({ body: { howToUse: g.body.howToUse } }),
  'guide-formula': (g) => ({ body: { formula: g.body.formula } }),
  'guide-example': (g) => ({ body: { example: g.body.example } }),
  'guide-faq': (g) => ({ body: { faq: g.body.faq } }),
  'guide-usecases': (g) => ({ body: { useCases: g.body.useCases } }),
  'guide-tips': (g) => ({ body: { tips: g.body.tips } }),
}

// clean old granular dirs
for (const c of Object.keys(CONCERNS)) {
  const d = join(FRAGMENTS_DIR, c)
  if (existsSync(d)) rmSync(d, { recursive: true, force: true })
  mkdirSync(d, { recursive: true })
}
// also clean old seeds
for (const c of ['guide-body1', 'guide-body2']) {
  const d = join(FRAGMENTS_DIR, c)
  if (existsSync(d)) rmSync(d, { recursive: true, force: true })
}

for (const locale of LOCALES) {
  for (const [concern, build] of Object.entries(CONCERNS)) {
    const payload = build(g)
    const path = join(FRAGMENTS_DIR, concern, `${locale}.json`)
    const full = { guide: payload }
    writeFileSync(path, JSON.stringify(full, null, 2) + '\n', 'utf8')
  }
  const metaPath = join(FRAGMENTS_DIR, 'guide-meta', `${locale}.json`)
  console.log(locale, 'meta=', readFileSync(metaPath, 'utf8').length,
    'faq=', readFileSync(join(FRAGMENTS_DIR, 'guide-faq', `${locale}.json`), 'utf8').length,
    'useCases=', readFileSync(join(FRAGMENTS_DIR, 'guide-usecases', `${locale}.json`), 'utf8').length,
    'tips=', readFileSync(join(FRAGMENTS_DIR, 'guide-tips', `${locale}.json`), 'utf8').length)
}
console.log('\nGranular seeds ready.')