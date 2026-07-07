import { readFileSync, writeFileSync } from 'fs'

const BASE = 'C:\\Users\\store one\\Pictures\\calculatora\\MpB2M28jkJJIYqVynKKb\\Fichiers multiples'
const API_KEY = 'sk-nry-fveChT1VIKf4M3luNg3nOAx1wnIC0FBJBeBN36XtdSM'
const API_URL = 'https://router.bynara.id/v1/chat/completions'
const MODEL = 'mistral-medium-3-5'

const locale = process.argv[2]
if (!locale) { console.error('Usage: node translate-locale.mjs <locale>'); process.exit(1) }

const PREFIXES = { ar:'مجاني', hi:'मुफ्त', 'zh-CN':'免费' }
const LANG_NAMES = { ar:'Arabic', hi:'Hindi', 'zh-CN':'Chinese (Simplified)' }
const prefix = PREFIXES[locale]
const localeName = LANG_NAMES[locale]
if (!prefix || !localeName) { console.error(`Unknown locale: ${locale}`); process.exit(1) }

const OVERRIDES_DIR = `${BASE}/src/i18n/calculator-overrides`
const LOG_FILE = `${BASE}/translation_${locale}.log`

function log(msg) {
  const s = `[${new Date().toISOString()}] ${msg}`
  writeFileSync(LOG_FILE, s + '\n', { flag: 'a' })
  console.log(s)
}

function readOverrides() {
  return JSON.parse(readFileSync(`${OVERRIDES_DIR}/${locale}.json`, 'utf-8'))
}

function writeOverrides(data) {
  writeFileSync(`${OVERRIDES_DIR}/${locale}.json`, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

async function translateBatch(batch, attempt = 1) {
  const prompt = `Translate these calculator descriptions to ${localeName}. Return a JSON object where keys are slugs and values are {description: "translated description"}.

Guidelines:
- Natural, fluent ${localeName}
- Keep numbers, units, and technical terms intact
- For Arabic: natural Arabic script (RTL)
- For Japanese/Chinese: natural phrasing
- For Hindi: standard Hindi

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
      if (r.status === 429 && attempt < 30) {
        const wait = attempt * 3000
        log(`  429 #${attempt}, wait ${Math.round(wait/1000)}s`)
        await new Promise(r => setTimeout(r, wait))
        return translateBatch(batch, attempt + 1)
      }
      throw new Error(`API ${r.status}: ${err.substring(0, 80)}`)
    }
    const d = await r.json()
    return JSON.parse(d.choices[0].message.content)
  } catch (e) {
    if (attempt < 10) {
      log(`  Error #${attempt}: ${e.message.substring(0, 50)}`)
      await new Promise(r => setTimeout(r, attempt * 3000))
      return translateBatch(batch, attempt + 1)
    }
    log(`  FAILED: ${e.message.substring(0, 50)}`)
    return null
  }
}

async function main() {
  log(`=== Starting ${locale} (${localeName}) ===`)
  const data = readOverrides()
  const entries = Object.entries(data)
  const need = entries.filter(([k,v]) => v.description && v.description.startsWith(prefix))
    .map(([slug, v]) => ({ slug, description: v.description }))

  if (need.length === 0) { log('0 need translation, done'); return }

  log(`${need.length} entries need translation`)
  const BATCH_SIZE = 20
  let completed = 0

  for (let i = 0; i < need.length; i += BATCH_SIZE) {
    const batch = need.slice(i, i + BATCH_SIZE)
    const result = await translateBatch(batch)
    if (result) {
      for (const [slug, trans] of Object.entries(result)) {
        if (data[slug]) data[slug].description = trans.description
      }
      completed += Object.keys(result).length
    }
    writeOverrides(data)
    log(`${completed}/${need.length} (${(completed/need.length*100).toFixed(1)}%)`)
  }
  log(`✅ ${locale}: ${completed}/${need.length} done`)
}

main().catch(e => { log(`FATAL: ${e.message}`); process.exit(1) })
