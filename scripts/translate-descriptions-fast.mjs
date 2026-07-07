import { readFileSync, writeFileSync } from 'fs'

const BASE = 'C:\\Users\\store one\\Pictures\\calculatora\\MpB2M28jkJJIYqVynKKb\\Fichiers multiples'
const API_KEY = 'sk-nry-fveChT1VIKf4M3luNg3nOAx1wnIC0FBJBeBN36XtdSM'
const API_URL = 'https://router.bynara.id/v1/chat/completions'
const MODEL = 'mistral-medium-3-5'

const LOCALES = ['es', 'fr', 'de', 'pt', 'ar', 'hi', 'ja', 'zh-CN']
const PREFIXES = { es:'Gratis', fr:'Gratuit', de:'Kostenlos', pt:'Grátis', ar:'مجاني', hi:'मुफ्त', ja:'無料', 'zh-CN':'免费' }
const LANG_NAMES = { es:'Spanish', fr:'French', de:'German', pt:'Portuguese', ar:'Arabic', hi:'Hindi', ja:'Japanese', 'zh-CN':'Chinese (Simplified)' }

const OVERRIDES_DIR = `${BASE}/src/i18n/calculator-overrides`

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
      if (r.status === 429 && attempt < 5) {
        const wait = attempt * 5000
        await new Promise(r => setTimeout(r, wait))
        return translateBatch(batch, locale, attempt + 1)
      }
      throw new Error(`API ${r.status}: ${err}`)
    }
    const d = await r.json()
    return JSON.parse(d.choices[0].message.content)
  } catch (e) {
    if (attempt < 3) {
      await new Promise(r => setTimeout(r, attempt * 3000))
      return translateBatch(batch, locale, attempt + 1)
    }
    throw e
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
  console.log(`\n=== Starting ${locale} (${LANG_NAMES[locale]}) ===`)
  const { data, need } = findNeedTranslation(locale)
  if (need.length === 0) {
    console.log(`  ${locale}: 0 need translation, skipping`)
    return
  }

  console.log(`  ${locale}: ${need.length} entries need description translation`)
  const BATCH_SIZE = 30
  const CONCURRENCY = 2
  let completed = 0

  for (let i = 0; i < need.length; i += BATCH_SIZE * CONCURRENCY) {
    const batchGroup = []
    for (let j = 0; j < CONCURRENCY && i + j * BATCH_SIZE < need.length; j++) {
      batchGroup.push(need.slice(i + j * BATCH_SIZE, i + (j + 1) * BATCH_SIZE))
    }

    const results = await Promise.allSettled(
      batchGroup.map(batch => translateBatch(
        batch.map(e => ({ slug: e.slug, title: e.title, description: e.description })),
        locale
      ).catch(err => {
        console.error(`\n  Batch error: ${err.message}`)
        return null
      }))
    )

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        for (const [slug, trans] of Object.entries(result.value)) {
          if (data[slug]) data[slug].description = trans.description
        }
        completed += Object.keys(result.value).length
      }
    }

    writeOverrides(locale, data)
    const pct = ((completed / need.length) * 100).toFixed(1)
    process.stdout.write(`\r  ${locale}: ${completed}/${need.length} (${pct}%)`)
  }

  console.log(`\n  ✅ ${locale}: ${completed}/${need.length} descriptions translated`)
}

// Run all locales in parallel groups
async function main() {
  const groups = [
    ['es', 'fr'],
    ['de', 'pt'],
    ['ar', 'hi'],
    ['ja', 'zh-CN'],
  ]

  for (const group of groups) {
    console.log(`\n--- Processing group: ${group.join(', ')} ---`)
    await Promise.all(group.map(locale => translateLocale(locale)))
  }

  console.log('\n=== FINAL SUMMARY ===')
  for (const loc of [...LOCALES, 'ru']) {
    const data = readOverrides(loc)
    const prefix = PREFIXES[loc] || 'N/A'
    const entries = Object.entries(data)
    const fallback = entries.filter(([k,v]) => v.description && v.description.startsWith(prefix))
    console.log(`  ${loc}: ${entries.length - fallback.length}/${entries.length} translated`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
