import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LOCALES = ['es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi', 'ja', 'zh-CN']
const LATIN_LOCALES = ['es', 'fr', 'de', 'pt']
const OVERRIDES_DIR = join(__dirname, '..', 'src', 'i18n', 'calculator-overrides')

const UNIT_MAP = {
  inches: { es: 'Pulgadas', fr: 'Pouces', de: 'Zoll', pt: 'Polegadas', ru: 'Дюймы', ar: 'بوصات', hi: 'इंच', ja: 'インチ', 'zh-CN': '英寸' },
  inch: { es: 'Pulgada', fr: 'Pouce', de: 'Zoll', pt: 'Polegada', ru: 'Дюйм', ar: 'بوصة', hi: 'इंच', ja: 'インチ', 'zh-CN': '英寸' },
  feet: { es: 'Pies', fr: 'Pieds', de: 'Fuß', pt: 'Pés', ru: 'Футы', ar: 'أقدام', hi: 'फीट', ja: 'フィート', 'zh-CN': 'フィート' },
  foot: { es: 'Pie', fr: 'Pied', de: 'Fuß', pt: 'Pé', ru: 'Фут', ar: 'قدم', hi: 'फुट', ja: 'フィート', 'zh-CN': 'フィート' },
  meters: { es: 'Metros', fr: 'Mètres', de: 'Meter', pt: 'Metros', ru: 'Метры', ar: 'أمتار', hi: 'मीटर', ja: 'メートル', 'zh-CN': '米' },
  meter: { es: 'Metro', fr: 'Mètre', de: 'Meter', pt: 'Metro', ru: 'Метр', ar: 'متر', hi: 'मीटर', ja: 'メートル', 'zh-CN': '米' },
  miles: { es: 'Millas', fr: 'Milles', de: 'Meilen', pt: 'Milhas', ru: 'Мили', ar: 'أميال', hi: 'मील', ja: 'マイル', 'zh-CN': 'マイル' },
  mile: { es: 'Milla', fr: 'Mille', de: 'Meile', pt: 'Milha', ru: 'Миля', ar: 'ميل', hi: 'मील', ja: 'マイル', 'zh-CN': 'マイル' },
  pounds: { es: 'Libras', fr: 'Livres', de: 'Pfund', pt: 'Libras', ru: 'Фунты', ar: 'أرطال', hi: 'पाउंड', ja: 'ポンド', 'zh-CN': '磅' },
  pound: { es: 'Libra', fr: 'Livre', de: 'Pfund', pt: 'Libra', ru: 'Фунт', ar: 'رطل', hi: 'पाउंड', ja: 'ポンド', 'zh-CN': '磅' },
  grams: { es: 'Gramos', fr: 'Grammes', de: 'Gramm', pt: 'Gramas', ru: 'Граммы', ar: 'جرامات', hi: 'ग्राम', ja: 'グラム', 'zh-CN': '克' },
  gram: { es: 'Gramo', fr: 'Gramme', de: 'Gramm', pt: 'Grama', ru: 'Грамм', ar: 'جرام', hi: 'ग्राम', ja: 'グラム', 'zh-CN': '克' },
  liters: { es: 'Litros', fr: 'Litres', de: 'Liter', pt: 'Litros', ru: 'Литры', ar: 'لترات', hi: 'लीटर', ja: 'リットル', 'zh-CN': '升' },
  liters2: {},
}

function translateUnitsInPhrase(phrase, locale) {
  const words = phrase.split(/(\s+)/)
  return words.map(w => {
    if (w.trim().length === 0) return w
    const lower = w.toLowerCase().replace(/s$/, '')
    const map = UNIT_MAP[lower] || UNIT_MAP[w.toLowerCase()]
    if (map && map[locale]) {
      const transl = map[locale]
      if (w === w.toUpperCase()) return transl.toUpperCase()
      if (w[0] === w[0].toUpperCase()) return transl.charAt(0).toUpperCase() + transl.slice(1)
      return transl
    }
    return w
  }).join('')
}

function systematicTranslate(entry, locale) {
  const title = entry.title
  const converterMatch = title.match(/^(.+)\s+to\s+(.+)\s+Converter$/)
  const calculatorMatch = title.match(/^(.+)\s+Calculator$/)
  const converterPlainMatch = title.match(/^(.+)\s+Converter$/)
  if (converterMatch) {
    const x = translateUnitsInPhrase(converterMatch[1].trim(), locale)
    const y = translateUnitsInPhrase(converterMatch[2].trim(), locale)
    const patterns = {
      es: `Convertidor de ${x} a ${y}`, fr: `Convertisseur de ${x} en ${y}`, de: `${x}-zu-${y}-Konverter`,
      pt: `Conversor de ${x} para ${y}`, ru: `Конвертер ${x} в ${y}`, ar: `محول ${x} إلى ${y}`,
      hi: `${x} से ${y} कन्वर्टर`, ja: `${x}から${y}換算`, 'zh-CN': `${x}转${y}转换器`,
    }
    return { title: patterns[locale], description: entry.description }
  }
  if (calculatorMatch) {
    const noun = calculatorMatch[1].trim()
    const patterns = {
      es: `Calculadora de ${noun}`, fr: `Calculatrice ${noun}`, de: `${noun}-Rechner`,
      pt: `Calculadora de ${noun}`, ru: `Калькулятор ${noun}`, ar: `حاسبة ${noun}`,
      hi: `${noun} कैलकुलेटर`, ja: `${noun}計算機`, 'zh-CN': `${noun}计算器`,
    }
    return { title: patterns[locale], description: entry.description }
  }
  if (converterPlainMatch) {
    const noun = converterPlainMatch[1].trim()
    const translatedNoun = translateUnitsInPhrase(noun, locale)
    const patterns = {
      es: `Convertidor de ${translatedNoun}`, fr: `Convertisseur de ${translatedNoun}`, de: `${translatedNoun}-Konverter`,
      pt: `Conversor de ${translatedNoun}`, ru: `Конвертер ${translatedNoun}`, ar: `محول ${translatedNoun}`,
      hi: `${translatedNoun} कन्वर्टर`, ja: `${translatedNoun}換算`, 'zh-CN': `${translatedNoun}转换器`,
    }
    return { title: patterns[locale], description: entry.description }
  }
  return { title: entry.title, description: entry.description }
}

function isNonLatinScript(text) {
  return /[ր-֏֑-ׇـ-ۿऀ-ॏ぀-ヿ一-鿿]/.test(text)
}

function isEnglish(text) {
  return text != null && /[A-Za-z]/.test(text) && !isNonLatinScript(text)
}

const { calculatorRegistry: allEntries } = await import('@calcuniverse/calculator-registry')
const bySlug = Object.fromEntries(allEntries.map(e => [e.slug, e]))

for (const locale of LOCALES) {
  const path = join(OVERRIDES_DIR, `${locale}.json`)
  const existing = existsSync(path) ? JSON.parse(readFileSync(path, 'utf-8')) : {}
  const result = {}

  for (const entry of allEntries) {
    const cur = existing[entry.slug]
    // Keep existing AI-translated (non-English) title if present
    if (cur && cur.title && isNonLatinScript(cur.title)) {
      result[entry.slug] = cur
      continue
    }
    // Apply pattern translation
    const pattern = systematicTranslate(entry, locale)
    if (pattern.title !== entry.title) {
      result[entry.slug] = pattern
    } else {
      // Fall back to existing (may be English or pattern)
      result[entry.slug] = cur || { title: entry.title, description: entry.description }
    }
  }

  writeFileSync(path, JSON.stringify(result, null, 2) + '\n', 'utf-8')
  const nonEng = Object.values(result).filter(v => v.title && isNonLatinScript(v.title)).length
  console.log(`${locale}: ${Object.keys(result).length} entries, ${nonEng} translated (non-Latin script)`)
}
console.log('\n✅ Restore + merge complete')
