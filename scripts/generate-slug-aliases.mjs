import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LOCALES = ['es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi', 'ja', 'zh-CN']
const OVERRIDES_DIR = join(__dirname, '..', 'src', 'i18n', 'calculator-overrides')
const REGISTRY_PATH = join(__dirname, '..', 'packages', 'calculator-registry', 'src', 'registry.ts')
const OUTPUT_PATH = join(__dirname, '..', 'src', 'lib', 'slug-aliases.json')

const CYRILLIC_MAP = {
  'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i',
  'й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t',
  'у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y',
  'ь':'','э':'e','ю':'yu','я':'ya',
  'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'Yo','Ж':'Zh','З':'Z','И':'I',
  'Й':'Y','К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P','Р':'R','С':'S','Т':'T',
  'У':'U','Ф':'F','Х':'Kh','Ц':'Ts','Ч':'Ch','Ш':'Sh','Щ':'Shch','Ъ':'','Ы':'Y',
  'Ь':'','Э':'E','Ю':'Yu','Я':'Ya',
}

const ARABIC_MAP = {
  'ا':'a','أ':'a','إ':'e','آ':'a','ب':'b','ت':'t','ث':'th','ج':'j','ح':'h','خ':'kh',
  'د':'d','ذ':'dh','ر':'r','ز':'z','س':'s','ش':'sh','ص':'s','ض':'d','ط':'t','ظ':'z',
  'ع':'a','غ':'gh','ف':'f','ق':'q','ك':'k','ل':'l','م':'m','ن':'n','ه':'h','و':'w',
  'ي':'y','ى':'a','ة':'h','ئ':'e','ؤ':'o','ء':'a',
}

const DEVANAGARI_MAP = {
  'अ':'a','आ':'aa','इ':'i','ई':'ee','उ':'u','ऊ':'oo','ए':'e','ऐ':'ai','ओ':'o','औ':'au',
  'क':'ka','ख':'kha','ग':'ga','घ':'gha','ङ':'nga',
  'च':'cha','छ':'chha','ज':'ja','झ':'jha','ञ':'nya',
  'ट':'ta','ठ':'tha','ड':'da','ढ':'dha','ण':'na','त':'ta','थ':'tha','द':'da','ध':'dha','न':'na',
  'प':'pa','फ':'pha','ब':'ba','भ':'bha','म':'ma',
  'य':'ya','र':'ra','ल':'la','व':'va','श':'sha','ष':'sha','स':'sa','ह':'ha',
  'ा':'aa','ि':'i','ी':'ee','ु':'u','ू':'oo','े':'e','ै':'ai','ो':'o','ौ':'au',
  'ं':'n','ः':'h','्':'','ॉ':'o','ॅ':'e',
}

const KATAKANA_MAP = {
  'ア':'a','イ':'i','ウ':'u','エ':'e','オ':'o',
  'カ':'ka','キ':'ki','ク':'ku','ケ':'ke','コ':'ko',
  'サ':'sa','シ':'shi','ス':'su','セ':'se','ソ':'so',
  'タ':'ta','チ':'chi','ツ':'tsu','テ':'te','ト':'to',
  'ナ':'na','ニ':'ni','ヌ':'nu','ネ':'ne','ノ':'no',
  'ハ':'ha','ヒ':'hi','フ':'fu','ヘ':'he','ホ':'ho',
  'マ':'ma','ミ':'mi','ム':'mu','メ':'me','モ':'mo',
  'ヤ':'ya','ユ':'yu','ヨ':'yo',
  'ラ':'ra','リ':'ri','ル':'ru','レ':'re','ロ':'ro',
  'ワ':'wa','ヲ':'wo','ン':'n',
  'ガ':'ga','ギ':'gi','グ':'gu','ゲ':'ge','ゴ':'go',
  'ザ':'za','ジ':'ji','ズ':'zu','ゼ':'ze','ゾ':'zo',
  'ダ':'da','ヂ':'ji','ヅ':'zu','デ':'de','ド':'do',
  'バ':'ba','ビ':'bi','ブ':'bu','ベ':'be','ボ':'bo',
  'パ':'pa','ピ':'pi','プ':'pu','ペ':'pe','ポ':'po',
  'ャ':'ya','ュ':'yu','ョ':'yo','ァ':'a','ィ':'i','ゥ':'u','ェ':'e','ォ':'o',
  'ッ':'','ー':'','ヴ':'vu','ヵ':'ka','ヶ':'ke',
  '㌢':'cenchi','㌔':'kilo','㌘':'gram','㌧':'ton','㌦':'doru','㌣':'sent',
  '㌫':'paasento','㌻':'peiji','㍉':'miri','㍊':'mega','㍍':'metro','㌅':'inchi',
}

const KANJI_MAP = {
  '秒':'byo','分':'fun','時間':'jikan','日':'nichi','週間':'shukan','ヶ月':'kagetsu','年':'nen',
  '十年':'junen','度':'do','気':'ki','圧':'atsu','摂':'setsu','氏':'shi','華':'ka',
  '光':'hikari','速':'soku','力':'ryoku','重':'ju','量':'ryo','温':'on','度':'do',
  '長':'cho','面':'men','積':'seki','体':'tai','積':'seki',
  '角':'kaku','周':'shu','波':'ha','数':'su','値':'chi',
  '百':'hyaku','千':'sen','万':'man','億':'oku',
  '方':'hoo','平':'hei','立':'ritsu','円':'en',
}

const HIRAGANA_MAP = {
  'あ':'a','い':'i','う':'u','え':'e','お':'o',
  'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
  'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
  'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
  'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
  'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
  'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
  'や':'ya','ゆ':'yu','よ':'yo',
  'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
  'わ':'wa','を':'wo','ん':'n',
  'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
  'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
  'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do',
  'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
  'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
  'ゃ':'ya','ゅ':'yu','ょ':'yo','っ':'','ー':'',
  'を':'o','ぁ':'a','ぃ':'i','ぅ':'u','ぇ':'e','ぉ':'o',
}

function transliterate(text) {
  let s = text
  const chars = [...s]
  const result = []
  for (const ch of chars) {
    if (CYRILLIC_MAP[ch]) { result.push(CYRILLIC_MAP[ch]); continue }
    if (ARABIC_MAP[ch]) { result.push(ARABIC_MAP[ch]); continue }
    if (DEVANAGARI_MAP[ch]) { result.push(DEVANAGARI_MAP[ch]); continue }
    if (HIRAGANA_MAP[ch]) { result.push(HIRAGANA_MAP[ch]); continue }
    if (KATAKANA_MAP[ch]) { result.push(KATAKANA_MAP[ch]); continue }
    if (KANJI_MAP[ch]) { result.push(KANJI_MAP[ch]); continue }
    result.push(ch)
  }
  return result.join('')
}

function slugify(text) {
  let s = text.toLowerCase()
  s = transliterate(s)
  s = s.replace(/[áàäâã]/g, 'a')
  s = s.replace(/[éèëê]/g, 'e')
  s = s.replace(/[íìïî]/g, 'i')
  s = s.replace(/[óòöôõ]/g, 'o')
  s = s.replace(/[úùüû]/g, 'u')
  s = s.replace(/[ñ]/g, 'n')
  s = s.replace(/[ç]/g, 'c')
  s = s.replace(/[^a-z0-9]+/g, '-')
  s = s.replace(/^-+|-+$/g, '')
  return s
}

function extractRegistryEntries(content) {
  const entries = []
  const regex = /\{\s*slug:\s*'([^']+)'[\s\S]*?category:\s*'([^']+)'[\s\S]*?hubSlug:\s*'([^']+)'/g
  let match
  while ((match = regex.exec(content)) !== null) {
    entries.push({ slug: match[1], category: match[2], hubSlug: match[3] })
  }
  return entries
}

const registryContent = readFileSync(REGISTRY_PATH, 'utf-8')
const registryEntries = extractRegistryEntries(registryContent)
console.log(`📖 Read ${registryEntries.length} entries from registry`)

const result = {}
for (const locale of LOCALES) {
  const overridePath = join(OVERRIDES_DIR, `${locale}.json`)
  if (!existsSync(overridePath)) {
    console.log(`  ${locale}: override file not found, skipping`)
    continue
  }
  const overrides = JSON.parse(readFileSync(overridePath, 'utf-8'))
  const localeMap = {}
  const seen = new Set()
  let collisions = 0

  for (const entry of registryEntries) {
    const override = overrides[entry.slug]
    const title = override?.title
    if (!title) continue

    const localizedSlug = slugify(title)
    if (!localizedSlug || localizedSlug === entry.slug) continue

    const target = `${entry.hubSlug}/${entry.slug}`
    if (seen.has(localizedSlug)) {
      const alternative = `${localizedSlug}-${entry.category}`
      if (!seen.has(alternative)) {
        localeMap[alternative] = target
        seen.add(alternative)
        collisions++
      }
    } else {
      localeMap[localizedSlug] = target
      seen.add(localizedSlug)
    }
  }

  result[locale] = localeMap
  console.log(`  ${locale}: ${Object.keys(localeMap).length} aliases (${collisions} collisions resolved)`)
}

const total = Object.values(result).reduce((s, m) => s + Object.keys(m).length, 0)
writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2), 'utf-8')
console.log(`\n✅ Written ${total} total aliases to ${OUTPUT_PATH}`)
