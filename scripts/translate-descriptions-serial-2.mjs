import { readFileSync, writeFileSync } from 'fs'

const BASE = 'C:\\Users\\store one\\Pictures\\calculatora\\MpB2M28jkJJIYqVynKKb\\Fichiers multiples'
const API_KEY = 'sk-nry-UBghlDSlJGYA63LAAd0O6hqZnNCpkTohU0iAtVF0EUc'
const API_URL = 'https://router.bynara.id/v1/chat/completions'
const MODEL = 'mistral-medium-3-5'

const LOCALES = ['ar', 'hi', 'zh-CN']
const PREFIXES = { es:'Gratis', fr:'Gratuit', de:'Kostenlos', pt:'Grátis', ar:'مجاني', hi:'मुफ्त', ja:'無料', 'zh-CN':'免费' }
const LANG_NAMES = { es:'Spanish', fr:'French', de:'German', pt:'Portuguese', ar:'Arabic', hi:'Hindi', ja:'Japanese', 'zh-CN':'Chinese (Simplified)' }

const OVERRIDES_DIR = `${BASE}/src/i18n/calculator-overrides`
const LOG_FILE = `${BASE}/translation_serial_log2.txt`

function log(msg) {
  const s = `[${new Date().toISOString()}] ${msg}`
  writeFileSync(LOG_FILE, s + '\n', { flag: 'a' })
  console.log(s)
}

function readOverrides(locale) {
  return JSON.parse(readFileSync(`${OVERRIDES_DIR}/${locale}.json`, 'utf-8'))
}

function writeOverrides(locale, data) {
  writeFileSync(`${OVERRIDES_DIR}/${locale}.json`, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

async function translateBatch(batch, locale, attempt = 1) {
  const localeName = LANG_NAMES[locale]
  const prompt = `Translate these calculator descriptions to ${localeName}. Return a JSON object where keys are slugs and values are {description: "translated description"}.

Guidelines:
- Natural, fluent ${localeName}
- Keep numbers, units, and technical terms intact
- Adapt to ${localeName} conventions
- For Arabic: natural Arabic script (RTL)
- For Japanese/Chinese: natural phrasing
- For Hindi: standard Hindi

ONLY translate the description field, keep titles exactly as provided.

${JSON.stringify(batch, null, 2)}`

  try {
    const r = await fetch(API_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    })
    if (!r.ok) {
      const err = await r.text()
      if (r.status === 429 && attempt < 10) {
        const wait = Math.min(attempt * 10000, 60000)
        log(`  Rate limited (attempt ${attempt}), waiting ${wait/1000}s...`)
        await new Promise(r => setTimeout(r, wait))
        return translateBatch(batch, locale, attempt + 1)
      }
      throw new Error(`API ${r.status}: ${err.substring(0, 200)}`)
    }
    const d = await r.json()
    return JSON.parse(d.choices[0].message.content)
  } catch (e) {
    if (attempt < 5) {
      const wait = attempt * 5000
      log(`  Error (attempt ${attempt}): ${e.message.substring(0, 100)}, retry in ${wait/1000}s`)
      await new Promise(r => setTimeout(r, wait))
      return translateBatch(batch, locale, attempt + 1)
    }
    log(`  FAILED after ${attempt} attempts: ${e.message.substring(0, 100)}`)
    return null
  }
}

function findNeedTranslation(locale) {
  const data = readOverrides(locale)
  const prefix = PREFIXES[locale]
  const need = []
  for (const [slug, entry] of Object.entries(data)) {
    if (entry.description && entry.description.startsWith(prefix)) {
      need.push({ slug, title: entry.title, description: entry.description })
    }
  }
  return { data, need }
}

async function translateLocale(locale) {
  log(`\n=== Starting ${locale} (${LANG_NAMES[locale]}) ===`)
  const { data, need } = findNeedTranslation(locale)
  if (need.length === 0) {
    log(`  ${locale}: 0 need translation, skipping`)
    return
  }

  log(`  ${locale}: ${need.length} entries need description translation`)
  const BATCH_SIZE = 50
  let completed = 0

  for (let i = 0; i < need.length; i += BATCH_SIZE) {
    const batch = need.slice(i, i + BATCH_SIZE)
    const result = await translateBatch(
      batch.map(e => ({ slug: e.slug, title: e.title, description: e.description })),
      locale
    )

    if (result) {
      for (const [slug, trans] of Object.entries(result)) {
        if (data[slug]) data[slug].description = trans.description
      }
      completed += Object.keys(result).length
    }

    writeOverrides(locale, data)
    const pct = ((i + BATCH_SIZE) / need.length * 100).toFixed(1)
    log(`  ${locale}: ${completed}/${need.length} (${pct}%)`)
  }

  log(`\n  ✅ ${locale}: ${completed}/${need.length} descriptions translated`)
}

async function main() {
  log('=== Starting serial translations ===')
  for (const loc of LOCALES) {
    await translateLocale(loc)
  }
  log('\n=== ALL DONE ===')
}

main().catch(e => { log(`FATAL: ${e.message}`); process.exit(1) })
