import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const LOCALES = ['es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi', 'ja', 'zh-CN']
const LATIN_LOCALES = ['es', 'fr', 'de', 'pt']
const OVERRIDES_DIR = join(__dirname, '..', 'src', 'i18n', 'calculator-overrides')

const GROQ_API_KEYS = (process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || '')
  .split(',')
  .map(k => k.trim())
  .filter(Boolean)

let groqKeyIndex = 0
function getNextGroqKey() {
  if (GROQ_API_KEYS.length === 0) return null
  const key = GROQ_API_KEYS[groqKeyIndex % GROQ_API_KEYS.length]
  groqKeyIndex = (groqKeyIndex + 1) % GROQ_API_KEYS.length
  return key
}

const UNIT_MAP = {
  inches: { es: 'Pulgadas', fr: 'Pouces', de: 'Zoll', pt: 'Polegadas' },
  inch: { es: 'Pulgada', fr: 'Pouce', de: 'Zoll', pt: 'Polegada' },
  feet: { es: 'Pies', fr: 'Pieds', de: 'Fuß', pt: 'Pés' },
  foot: { es: 'Pie', fr: 'Pied', de: 'Fuß', pt: 'Pé' },
  meters: { es: 'Metros', fr: 'Mètres', de: 'Meter', pt: 'Metros' },
  meter: { es: 'Metro', fr: 'Mètre', de: 'Meter', pt: 'Metro' },
  miles: { es: 'Millas', fr: 'Milles', de: 'Meilen', pt: 'Milhas' },
  mile: { es: 'Milla', fr: 'Mille', de: 'Meile', pt: 'Milha' },
  yards: { es: 'Yardas', fr: 'Yards', de: 'Yards', pt: 'Jardas' },
  yard: { es: 'Yarda', fr: 'Yard', de: 'Yard', pt: 'Jarda' },
  millimeters: { es: 'Milímetros', fr: 'Millimètres', de: 'Millimeter', pt: 'Milímetros' },
  millimeter: { es: 'Milímetro', fr: 'Millimètre', de: 'Millimeter', pt: 'Milímetro' },
  nanometers: { es: 'Nanómetros', fr: 'Nanomètres', de: 'Nanometer', pt: 'Nanômetros' },
  nanometer: { es: 'Nanómetro', fr: 'Nanomètre', de: 'Nanometer', pt: 'Nanômetro' },
  fathoms: { es: 'Brazas', fr: 'Brasses', de: 'Faden', pt: 'Braças' },
  fathom: { es: 'Braza', fr: 'Brasse', de: 'Faden', pt: 'Braça' },
  ounces: { es: 'Onzas', fr: 'Onces', de: 'Unzen', pt: 'Onças' },
  ounce: { es: 'Onza', fr: 'Once', de: 'Unze', pt: 'Onça' },
  pounds: { es: 'Libras', fr: 'Livres', de: 'Pfund', pt: 'Libras' },
  pound: { es: 'Libra', fr: 'Livre', de: 'Pfund', pt: 'Libra' },
  grams: { es: 'Gramos', fr: 'Grammes', de: 'Gramm', pt: 'Gramas' },
  gram: { es: 'Gramo', fr: 'Gramme', de: 'Gramm', pt: 'Grama' },
  stones: { es: 'Piedras', fr: 'Pierres', de: 'Stone', pt: 'Pedras' },
  stone: { es: 'Piedra', fr: 'Pierre', de: 'Stone', pt: 'Pedra' },
  tons: { es: 'Toneladas', fr: 'Tonnes', de: 'Tonnen', pt: 'Toneladas' },
  ton: { es: 'Tonelada', fr: 'Tonne', de: 'Tonne', pt: 'Tonelada' },
  carats: { es: 'Quilates', fr: 'Carats', de: 'Karat', pt: 'Quilates' },
  grains: { es: 'Granos', fr: 'Grains', de: 'Körner', pt: 'Grãos' },
  gallons: { es: 'Galones', fr: 'Gallons', de: 'Gallonen', pt: 'Galões' },
  gallon: { es: 'Galón', fr: 'Gallon', de: 'Gallone', pt: 'Galão' },
  liters: { es: 'Litros', fr: 'Litres', de: 'Liter', pt: 'Litros' },
  liter: { es: 'Litro', fr: 'Litre', de: 'Liter', pt: 'Litro' },
  quarts: { es: 'Cuartos', fr: 'Quarts', de: 'Quarts', pt: 'Quartos' },
  quart: { es: 'Cuarto', fr: 'Quart', de: 'Quart', pt: 'Quarto' },
  pints: { es: 'Pintas', fr: 'Pintes', de: 'Pinten', pt: 'Pintas' },
  pint: { es: 'Pinta', fr: 'Pinte', de: 'Pint', pt: 'Pinta' },
  cups: { es: 'Tazas', fr: 'Tasses', de: 'Tassen', pt: 'Xícaras' },
  cup: { es: 'Taza', fr: 'Tasse', de: 'Tasse', pt: 'Xícara' },
  tablespoons: { es: 'Cucharadas', fr: 'Cuillères à soupe', de: 'Esslöffel', pt: 'Colheres de sopa' },
  tablespoon: { es: 'Cucharada', fr: 'Cuillère à soupe', de: 'Esslöffel', pt: 'Colher de sopa' },
  teaspoons: { es: 'Cucharaditas', fr: 'Cuillères à café', de: 'Teelöffel', pt: 'Colheres de chá' },
  teaspoon: { es: 'Cucharadita', fr: 'Cuillère à café', de: 'Teelöffel', pt: 'Colher de chá' },
  barrels: { es: 'Barriles', fr: 'Barils', de: 'Fässer', pt: 'Barris' },
  acres: { es: 'Acres', fr: 'Acres', de: 'Morgen', pt: 'Acres' },
  hectares: { es: 'Hectáreas', fr: 'Hectares', de: 'Hektar', pt: 'Hectares' },
  calories: { es: 'Calorías', fr: 'Calories', de: 'Kalorien', pt: 'Calorias' },
  seconds: { es: 'Segundos', fr: 'Secondes', de: 'Sekunden', pt: 'Segundos' },
  second: { es: 'Segundo', fr: 'Seconde', de: 'Sekunde', pt: 'Segundo' },
  minutes: { es: 'Minutos', fr: 'Minutes', de: 'Minuten', pt: 'Minutos' },
  minute: { es: 'Minuto', fr: 'Minute', de: 'Minute', pt: 'Minuto' },
  hours: { es: 'Horas', fr: 'Heures', de: 'Stunden', pt: 'Horas' },
  hour: { es: 'Hora', fr: 'Heure', de: 'Stunde', pt: 'Hora' },
  days: { es: 'Días', fr: 'Jours', de: 'Tage', pt: 'Dias' },
  day: { es: 'Día', fr: 'Jour', de: 'Tag', pt: 'Dia' },
  weeks: { es: 'Semanas', fr: 'Semaines', de: 'Wochen', pt: 'Semanas' },
  week: { es: 'Semana', fr: 'Semaine', de: 'Woche', pt: 'Semana' },
  months: { es: 'Meses', fr: 'Mois', de: 'Monate', pt: 'Meses' },
  month: { es: 'Mes', fr: 'Mois', de: 'Monat', pt: 'Mês' },
  years: { es: 'Años', fr: 'Ans', de: 'Jahre', pt: 'Anos' },
  year: { es: 'Año', fr: 'An', de: 'Jahr', pt: 'Ano' },
  decades: { es: 'Décadas', fr: 'Décennies', de: 'Jahrzehnte', pt: 'Décadas' },
  decade: { es: 'Década', fr: 'Décennie', de: 'Jahrzehnt', pt: 'Década' },
  milliseconds: { es: 'Milisegundos', fr: 'Millisecondes', de: 'Millisekunden', pt: 'Milissegundos' },
  atmospheres: { es: 'Atmósferas', fr: 'Atmosphères', de: 'Atmosphären', pt: 'Atmosferas' },
}

const MULTI_WORD_UNITS = [
  { key: 'square feet', es: 'Pies Cuadrados', fr: 'Pieds Carrés', de: 'Quadratfuß', pt: 'Pés Quadrados' },
  { key: 'square meters', es: 'Metros Cuadrados', fr: 'Mètres Carrés', de: 'Quadratmeter', pt: 'Metros Quadrados' },
  { key: 'square miles', es: 'Millas Cuadradas', fr: 'Milles Carrés', de: 'Quadratmeilen', pt: 'Milhas Quadradas' },
  { key: 'square yards', es: 'Yardas Cuadradas', fr: 'Yards Carrés', de: 'Quadratyards', pt: 'Jardas Quadradas' },
  { key: 'square inches', es: 'Pulgadas Cuadradas', fr: 'Pouces Carrés', de: 'Quadratzoll', pt: 'Polegadas Quadradas' },
  { key: 'cubic feet', es: 'Pies Cúbicos', fr: 'Pieds Cubes', de: 'Kubikfuß', pt: 'Pés Cúbicos' },
  { key: 'fluid ounces', es: 'Onzas Líquidas', fr: 'Onces Liquides', de: 'Flüssigunzen', pt: 'Onças Fluidas' },
  { key: 'light years', es: 'Años Luz', fr: 'Années-Lumière', de: 'Lichtjahre', pt: 'Anos-Luz' },
  { key: 'metric tons', es: 'Toneladas Métricas', fr: 'Tonnes Métriques', de: 'Metrische Tonnen', pt: 'Toneladas Métricas' },
  { key: 'pound-force', es: 'Libra-Fuerza', fr: 'Livre-Force', de: 'Pfund-Kraft', pt: 'Libra-Força' },
  { key: 'foot-pounds', es: 'Pie-Libras', fr: 'Pied-Livres', de: 'Fuß-Pfund', pt: 'Pé-Libras' },
  { key: 'foot candles', es: 'Bujías de Pie', fr: 'Bougies-Pied', de: 'Fußkerzen', pt: 'Velas de Pé' },
  { key: 'pascal-seconds', es: 'Pascal-Segundos', fr: 'Pascal-Secondes', de: 'Pascal-Sekunden', pt: 'Pascal-Segundos' },
]

function readExistingOverrides(locale) {
  const path = join(OVERRIDES_DIR, `${locale}.json`)
  if (!existsSync(path)) return {}
  try {
    return JSON.parse(readFileSync(path, 'utf-8'))
  } catch {
    return {}
  }
}

function writeOverrides(locale, data) {
  const path = join(OVERRIDES_DIR, `${locale}.json`)
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

function translateUnitWord(word, locale) {
  const lower = word.toLowerCase()
  if (UNIT_MAP[lower]) return UNIT_MAP[lower][locale]
  return null
}

function translateUnitsInPhrase(phrase, locale) {
  let result = phrase

  for (const mwu of MULTI_WORD_UNITS) {
    const regex = new RegExp('\\b' + mwu.key.replace(/-/g, '\\-') + '\\b', 'gi')
    if (regex.test(result)) {
      result = result.replace(regex, mwu[locale])
    }
  }

  const words = result.split(/(\s+)/)
  const translated = words.map(w => {
    if (w.trim().length === 0) return w
    const transl = translateUnitWord(w, locale)
    if (transl) {
      const isUpperCase = w === w.toUpperCase()
      const isCapitalized = w[0] === w[0].toUpperCase() && w.slice(1) === w.slice(1).toLowerCase()
      if (isUpperCase) return transl.toUpperCase()
      if (isCapitalized) return transl.charAt(0).toUpperCase() + transl.slice(1)
      return transl
    }
    return w
  })
  return translated.join('')
}

function systematicTranslate(entry, locale) {
  const title = entry.title
  const desc = entry.description
  const converterMatch = title.match(/^(.+)\s+to\s+(.+)\s+Converter$/)
  const calculatorMatch = title.match(/^(.+)\s+Calculator$/)
  const converterPlainMatch = title.match(/^(.+)\s+Converter$/)

  if (converterMatch) {
    let xPart = converterMatch[1].trim()
    let yPart = converterMatch[2].trim()
    const translatedX = translateUnitsInPhrase(xPart, locale)
    const translatedY = translateUnitsInPhrase(yPart, locale)
    const patterns = {
      es: `Convertidor de ${translatedX} a ${translatedY}`,
      fr: `Convertisseur de ${translatedX} en ${translatedY}`,
      de: `${translatedX}-zu-${translatedY}-Konverter`,
      pt: `Conversor de ${translatedX} para ${translatedY}`,
    }
    return { title: patterns[locale], description: desc }
  }

  if (calculatorMatch) {
    const noun = calculatorMatch[1].trim()
    const patterns = {
      es: `Calculadora de ${noun}`,
      fr: `Calculatrice ${noun}`,
      de: `${noun}-Rechner`,
      pt: `Calculadora de ${noun}`,
    }
    return { title: patterns[locale], description: desc }
  }

  if (converterPlainMatch) {
    const noun = converterPlainMatch[1].trim()
    const translatedNoun = translateUnitsInPhrase(noun, locale)
    const patterns = {
      es: `Convertidor de ${translatedNoun}`,
      fr: `Convertisseur de ${translatedNoun}`,
      de: `${translatedNoun}-Konverter`,
      pt: `Conversor de ${translatedNoun}`,
    }
    return { title: patterns[locale], description: desc }
  }

  return { title, description: desc }
}

async function translateWithOpenAI(batch, targetLocale, model = 'gpt-4o-mini', providedKey = null) {
  let apiKey = providedKey || process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY || process.env.NARAROUTER_API_KEY || process.env.GROQ_API_KEY
  if (!apiKey && GROQ_API_KEYS.length === 0) throw new Error('OPENAI_API_KEY, OPENROUTER_API_KEY, NARAROUTER_API_KEY, or GROQ_API_KEY not set (and no GROQ_API_KEYS available)')

  let isOpenRouter = false
  let isNaraRouter = false
  let isGroq = false

  if (!apiKey) {
    apiKey = getNextGroqKey()
  }

  if (apiKey.startsWith('sk-or-')) {
    isOpenRouter = true
  } else if (apiKey.startsWith('sk-nry-')) {
    isNaraRouter = true
  } else if (apiKey.startsWith('gsk_')) {
    isGroq = true
  }

  let apiUrl = 'https://api.openai.com/v1/chat/completions'
  let effectiveModel = model
  if (isOpenRouter) {
    apiUrl = 'https://openrouter.ai/api/v1/chat/completions'
    effectiveModel = `openai/${model}`
  } else if (isNaraRouter) {
    apiUrl = 'https://router.bynara.id/v1/chat/completions'
    effectiveModel = 'mistral-large'
  } else if (isGroq) {
    apiUrl = 'https://api.groq.com/openai/v1/chat/completions'
    effectiveModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
  }

  const localeName = { es: 'Spanish', fr: 'French', de: 'German', pt: 'Portuguese', ru: 'Russian', ar: 'Arabic', hi: 'Hindi', ja: 'Japanese', 'zh-CN': 'Chinese (Simplified)' }

  const prompt = `Translate the following calculator titles and descriptions to ${localeName[targetLocale] || targetLocale}.

Return a JSON object where each key is the slug, and the value is { "title": "<translated title>", "description": "<translated description>" }.

Guidelines:
- Keep the same meaning and tone
- Adapt units/measurements to locale conventions if applicable
- Keep proper nouns (brands, product names) in English
- For Arabic: ensure the translation reads naturally in Arabic script
- For Japanese/Chinese: use natural phrasing without excessive formality
- For Hindi: use standard Hindi (not overly Sanskritized or Urdu-ized)

Entries to translate:
${JSON.stringify(batch, null, 2)}`

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  }
  if (isOpenRouter) {
    headers['HTTP-Referer'] = 'https://www.jdcalc.com'
    headers['X-Title'] = 'JDCALC Translation'
  }
  if (isNaraRouter) {
    headers['HTTP-Referer'] = 'https://www.jdcalc.com'
    headers['X-Title'] = 'JDCALC Translation'
  }

  const maxRetries = 3
  let lastError

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          ...(isOpenRouter && { 'HTTP-Referer': 'https://www.jdcalc.com', 'X-Title': 'JDCALC Translation' }),
          ...(isNaraRouter && { 'HTTP-Referer': 'https://www.jdcalc.com', 'X-Title': 'JDCALC Translation' }),
        },
        body: JSON.stringify({
          model: effectiveModel,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          response_format: { type: 'json_object' },
        }),
      })

      if (!response.ok) {
        const err = await response.text()
        if (response.status === 429 && attempt < maxRetries) {
          const wait = Math.min(attempt * 5000, 15000)
          console.error(`\n⚠️  Rate limited on key ${apiKey.substring(0, 12)}... (attempt ${attempt}/${maxRetries}), waiting ${wait/1000}s...`)
          // Try next key on rate limit
          if (GROQ_API_KEYS.length > 0) {
            apiKey = getNextGroqKey()
            console.error(`   Switching to next key: ${apiKey.substring(0, 12)}...`)
            // Re-detect provider
            if (apiKey.startsWith('sk-or-')) { isOpenRouter = true; isGroq = false; isNaraRouter = false; apiUrl = 'https://openrouter.ai/api/v1/chat/completions'; effectiveModel = `openai/${model}`; }
            else if (apiKey.startsWith('sk-nry-')) { isNaraRouter = true; isGroq = false; isOpenRouter = false; apiUrl = 'https://router.bynara.id/v1/chat/completions'; effectiveModel = 'mistral-large'; }
            else if (apiKey.startsWith('gsk_')) { isGroq = true; isOpenRouter = false; isNaraRouter = false; apiUrl = 'https://api.groq.com/openai/v1/chat/completions'; effectiveModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'; }
          }
          await new Promise(r => setTimeout(r, wait))
          continue
        }
        throw new Error(`API error (${response.status}): ${err}`)
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content
      if (!content) throw new Error('No content in API response')

      const parsed = JSON.parse(content)
      return parsed
    } catch (e) {
      lastError = e
      if (attempt < maxRetries) {
        const wait = attempt * 3000
        console.error(`\n⚠️  API attempt ${attempt}/${maxRetries} failed, retrying in ${wait/1000}s...`)
        await new Promise(r => setTimeout(r, wait))
      }
    }
  }
  throw lastError || new Error('All retries exhausted')
}

function showProgress(current, total, locale) {
  const pct = ((current / total) * 100).toFixed(1)
  const barLen = 30
  const filled = Math.round((current / total) * barLen)
  const bar = '█'.repeat(filled) + '░'.repeat(barLen - filled)
  process.stdout.write(`\r[${bar}] ${pct}% — ${locale}: ${current}/${total}`)
}

async function main() {
  const systematic = process.argv.includes('--systematic')
  let localeArg = process.argv.slice(2).find(a => !a.startsWith('--'))
  const incremental = process.argv.includes('--incremental')
  const force = process.argv.includes('--force')
  const retryFailed = process.argv.includes('--retry-failed')
  const missingTranslation = process.argv.includes('--missing-translation')
  const dryRun = process.argv.includes('--dry-run')
  const localeFromFlag = process.argv.find(a => a.startsWith('--locale='))?.split('=')[1]
  if (localeFromFlag && !localeArg) { localeArg = localeFromFlag }
  const batchSize = parseInt(process.env.BATCH_SIZE || '10', 10)
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
  const concurrency = parseInt(process.env.CONCURRENCY || '3', 10)

  const { calculatorRegistry: allEntries } = await import('@calcuniverse/calculator-registry')
  console.log(`📖 Read ${allEntries.length} entries from registry`)

  if (dryRun) {
    let totalMissing = 0
    for (const locale of LOCALES) {
      if (localeArg && locale !== localeArg) continue
      const existing = readExistingOverrides(locale)
      const missing = allEntries.filter(e => !existing[e.slug])
      const existingCount = Object.keys(existing).length
      console.log(`  ${locale}: ${existingCount} existing, ${missing.length} missing → ${missing.length * 2} fields to translate`)
      totalMissing += missing.length
    }
    console.log(`\n📊 Total entries needing translation across all locales: ${totalMissing}`)
    console.log(`   Approximate total fields: ${totalMissing * 2}`)
    const estTokens = totalMissing * 80
    console.log(`   Estimated tokens: ~${estTokens.toLocaleString()}`)
    if (process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY || process.env.NARAROUTER_API_KEY) {
      const estCost = (estTokens / 1_000_000) * 0.15
      console.log(`   Estimated cost (gpt-4o-mini): ~$${estCost.toFixed(2)}`)
    }
    return
  }

  if (systematic) {
    console.log('🔧 Using systematic pattern-based translation (no API key needed)')
    for (const locale of LOCALES) {
      if (localeArg && locale !== localeArg) continue
      const existing = readExistingOverrides(locale)
      const entriesToTranslate = allEntries.filter(e => {
        if (incremental) return !existing[e.slug]
        if (force) return true
        return true
      })
      if (entriesToTranslate.length === 0) {
        console.log(`✅ ${locale}: all ${allEntries.length} entries already done (--incremental)`)
        continue
      }
      const overrides = { ...existing }
      if (LATIN_LOCALES.includes(locale)) {
        for (const entry of entriesToTranslate) {
          overrides[entry.slug] = systematicTranslate(entry, locale)
        }
      } else {
        for (const entry of entriesToTranslate) {
          overrides[entry.slug] = { title: entry.title, description: entry.description }
        }
      }
      writeOverrides(locale, overrides)
      const count = Object.keys(overrides).length
      console.log(`  ${locale}: ${count}/${allEntries.length} entries written`)
    }
    console.log('\n📊 Summary:')
    for (const locale of LOCALES) {
      const existing = readExistingOverrides(locale)
      console.log(`  ${locale}: ${Object.keys(existing).length}/${allEntries.length} entries`)
    }
    return
  }

  const localesToProcess = localeArg ? [localeArg] : LOCALES

  for (const locale of localesToProcess) {
    if (!LOCALES.includes(locale)) {
      console.error(`❌ Unknown locale "${locale}". Valid: ${LOCALES.join(', ')}`)
      process.exit(1)
    }

    const existing = readExistingOverrides(locale)
    const entriesToTranslate = allEntries.filter(e => {
      if (incremental) return !existing[e.slug]
      if (force) return true
      if (missingTranslation) {
        const ov = existing[e.slug]
        if (!ov || !ov.title) return true
        return /^[\x00-\x7F]*$/.test(ov.title)
      }
      if (retryFailed) {
        const ov = existing[e.slug]
        if (!ov) return true
        const prefix = { es:'Gratis', fr:'Gratuit', de:'Kostenlos', pt:'Grátis', ru:'Бесплатно', ar:'مجاني', hi:'मुफ्त', ja:'無料', 'zh-CN':'免费' }[locale]
        return ov.description && ov.description.startsWith(prefix)
      }
      return !existing[e.slug]
    })

    if (entriesToTranslate.length === 0) {
      if (retryFailed) console.log(`✅ ${locale}: no failed entries to retry`)
      else if (missingTranslation) console.log(`✅ ${locale}: all entries already translated (--missing-translation)`)
      else console.log(`✅ ${locale}: all ${allEntries.length} entries already translated (--incremental)`)
      continue
    }

    if (force) {
      console.log(`\n🌐 Force-translating ALL ${entriesToTranslate.length} entries for "${locale}" (--force)...`)
    } else if (missingTranslation) {
      console.log(`\n🌐 Translating ${entriesToTranslate.length} untranslated entries for "${locale}" (--missing-translation)...`)
    } else if (retryFailed) {
      console.log(`\n🌐 Retry-translating ${entriesToTranslate.length} failed entries for "${locale}" (--retry-failed)...`)
    } else {
      console.log(`\n🌐 Translating ${entriesToTranslate.length} entries for "${locale}"...`)
    }

    if (!process.env.OPENAI_API_KEY && !process.env.OPENROUTER_API_KEY && !process.env.NARAROUTER_API_KEY && !process.env.GROQ_API_KEY && GROQ_API_KEYS.length === 0) {
      const overrides = { ...existing }
      for (const entry of entriesToTranslate) {
        overrides[entry.slug] = {
          title: `[TBD: ${entry.title}]`,
          description: entry.description,
        }
      }
      writeOverrides(locale, overrides)
      console.log(`   ⚠️  No API key set. Wrote placeholder entries for ${entriesToTranslate.length} slugs.`)
      console.log(`   ℹ️  Set OPENAI_API_KEY, OPENROUTER_API_KEY, or NARAROUTER_API_KEY and re-run.`)
      continue
    }

    const overrides = { ...existing }
    const batches = []
    for (let i = 0; i < entriesToTranslate.length; i += batchSize) {
      batches.push(entriesToTranslate.slice(i, i + batchSize))
    }

    let completed = 0
    const total = entriesToTranslate.length

    for (let i = 0; i < batches.length; i += concurrency) {
      const batchGroup = batches.slice(i, i + concurrency)
      const results = await Promise.allSettled(
        batchGroup.map(batch =>
          translateWithOpenAI(
            batch.map(e => ({ slug: e.slug, title: e.title, description: e.description })),
            locale,
            model
          ).catch(err => {
            console.error(`\n❌ Batch error (entries ${completed + 1}-${completed + batchGroup[0].length}): ${err.message}`)
            const fallback = {}
            for (const e of batch) {
              if (!overrides[e.slug]) {
                fallback[e.slug] = { title: e.title, description: e.description }
              }
            }
            return fallback
          })
        )
      )

      for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
          const translated = result.value
          for (const [slug, data] of Object.entries(translated)) {
            overrides[slug] = data
          }
          completed += Object.keys(translated).length
        }
      }

      writeOverrides(locale, overrides)
      showProgress(completed, total, locale)
    }

    console.log(`\n✅ ${locale}: ${Object.keys(overrides).length}/${allEntries.length} entries in override file`)
  }

  if (!localeArg) {
    console.log('\n📊 Summary:')
    for (const locale of LOCALES) {
      const existing = readExistingOverrides(locale)
      console.log(`  ${locale}: ${Object.keys(existing).length}/${allEntries.length} entries`)
    }
  }
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err)
  process.exit(1)
})
