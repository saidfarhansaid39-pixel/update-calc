import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OVERRIDES_DIR = join(__dirname, '..', 'src', 'i18n', 'calculator-overrides')
const REGISTRY_PATH = join(__dirname, '..', 'packages', 'calculator-registry', 'src', 'registry.ts')

const LOCALES = ['ru', 'ar', 'hi', 'ja', 'zh-CN']

const LOCALE_META = {
  ru: { converter: 'Конвертер', calculator: 'Калькулятор', to: 'в', free: 'Бесплатно' },
  ar: { converter: 'محول', calculator: 'حاسبة', to: 'إلى', free: 'مجاني' },
  hi: { converter: 'कनवर्टर', calculator: 'कैलकुलेटर', to: 'से', free: 'मुफ्त' },
  ja: { converter: 'コンバーター', calculator: '計算機', to: 'から', free: '無料' },
  'zh-CN': { converter: '转换器', calculator: '计算器', to: '到', free: '免费' },
}

function readJSON(path) {
  return JSON.parse(readFileSync(path, 'utf-8'))
}

function writeJSON(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

const UNIT_MAP = {
  inches: { ru: 'дюймы', ar: 'إنش', hi: 'इंच', ja: 'インチ', 'zh-CN': '英寸' },
  inch: { ru: 'дюйм', ar: 'إنش', hi: 'इंच', ja: 'インチ', 'zh-CN': '英寸' },
  cm: { ru: 'см', ar: 'سم', hi: 'सेमी', ja: 'センチメートル', 'zh-CN': '厘米' },
  feet: { ru: 'футы', ar: 'قدم', hi: 'फीट', ja: 'フィート', 'zh-CN': '英尺' },
  foot: { ru: 'фут', ar: 'قدم', hi: 'फुट', ja: 'フィート', 'zh-CN': '英尺' },
  meters: { ru: 'метры', ar: 'أمتار', hi: 'मीटर', ja: 'メートル', 'zh-CN': '米' },
  meter: { ru: 'метр', ar: 'متر', hi: 'मीटर', ja: 'メートル', 'zh-CN': '米' },
  miles: { ru: 'мили', ar: 'أميال', hi: 'मील', ja: 'マイル', 'zh-CN': '英里' },
  mile: { ru: 'миля', ar: 'ميل', hi: 'मील', ja: 'マイル', 'zh-CN': '英里' },
  yards: { ru: 'ярды', ar: 'ياردات', hi: 'गज', ja: 'ヤード', 'zh-CN': '码' },
  yard: { ru: 'ярд', ar: 'يارد', hi: 'गज', ja: 'ヤード', 'zh-CN': '码' },
  millimeters: { ru: 'миллиметры', ar: 'مليمترات', hi: 'मिलीमीटर', ja: 'ミリメートル', 'zh-CN': '毫米' },
  millimeter: { ru: 'миллиметр', ar: 'مليمتر', hi: 'मिलीमीटर', ja: 'ミリメートル', 'zh-CN': '毫米' },
  mm: { ru: 'мм', ar: 'مم', hi: 'मिमी', ja: 'ミリメートル', 'zh-CN': '毫米' },
  nanometers: { ru: 'нанометры', ar: 'نانومترات', hi: 'नैनोमीटर', ja: 'ナノメートル', 'zh-CN': '纳米' },
  nanometer: { ru: 'нанометр', ar: 'नैनोमीटر', hi: 'नैनोमीटर', ja: 'ナノメートル', 'zh-CN': '纳米' },
  nm: { ru: 'нм', ar: 'نانومتر', hi: 'नैनोमीटर', ja: 'ナノメートル', 'zh-CN': '纳米' },
  fathoms: { ru: 'сажени', ar: 'قامات', hi: 'फ़ादम', ja: 'ファゾム', 'zh-CN': '英寻' },
  fathom: { ru: 'сажень', ar: 'قامة', hi: 'फ़ादम', ja: 'ファゾム', 'zh-CN': '英寻' },
  ounces: { ru: 'унции', ar: 'أوقيات', hi: 'औंस', ja: 'オンス', 'zh-CN': '盎司' },
  ounce: { ru: 'унция', ar: 'أوقية', hi: 'औंस', ja: 'オンス', 'zh-CN': '盎司' },
  oz: { ru: 'унции', ar: 'أوقية', hi: 'औंस', ja: 'オンス', 'zh-CN': '盎司' },
  pounds: { ru: 'фунты', ar: 'جنيه', hi: 'पाउंड', ja: 'ポンド', 'zh-CN': '磅' },
  pound: { ru: 'фунт', ar: 'جنيه', hi: 'पाउंड', ja: 'ポンド', 'zh-CN': '磅' },
  lbs: { ru: 'фунты', ar: 'رطل', hi: 'पाउंड', ja: 'ポンド', 'zh-CN': '磅' },
  grams: { ru: 'граммы', ar: 'جرامات', hi: 'ग्राम', ja: 'グラム', 'zh-CN': '克' },
  gram: { ru: 'грамм', ar: 'جرام', hi: 'ग्राम', ja: 'グラム', 'zh-CN': '克' },
  g: { ru: 'г', ar: 'جم', hi: 'ग्राम', ja: 'グラム', 'zh-CN': '克' },
  stones: { ru: 'камни', ar: 'أحجار', hi: 'स्टोन', ja: 'ストーン', 'zh-CN': '英石' },
  stone: { ru: 'камень', ar: 'حجر', hi: 'स्टोन', ja: 'ストーン', 'zh-CN': '英石' },
  tons: { ru: 'тонны', ar: 'أطنان', hi: 'टन', ja: 'トン', 'zh-CN': '吨' },
  ton: { ru: 'тонна', ar: 'طن', hi: 'टन', ja: 'トン', 'zh-CN': '吨' },
  carats: { ru: 'караты', ar: 'قيراطات', hi: 'कैरट', ja: 'カラット', 'zh-CN': '克拉' },
  grains: { ru: 'граны', ar: 'حبوب', hi: 'ग्रेन', ja: 'グレーン', 'zh-CN': '格令' },
  gallons: { ru: 'галлоны', ar: 'غالونات', hi: 'गैलन', ja: 'ガロン', 'zh-CN': '加仑' },
  gallon: { ru: 'галлон', ar: 'غالون', hi: 'गैलन', ja: 'ガロン', 'zh-CN': '加仑' },
  liters: { ru: 'литры', ar: 'لترات', hi: 'लीटर', ja: 'リットル', 'zh-CN': '升' },
  liter: { ru: 'литр', ar: 'لتر', hi: 'लीटर', ja: 'リットル', 'zh-CN': '升' },
  l: { ru: 'л', ar: 'لتر', hi: 'लीटर', ja: 'リットル', 'zh-CN': '升' },
  ml: { ru: 'мл', ar: 'مل', hi: 'मिलीलीटर', ja: 'ミリリットル', 'zh-CN': '毫升' },
  quarts: { ru: 'кварты', ar: 'كوارتات', hi: 'क्वार्ट', ja: 'クォート', 'zh-CN': '夸脱' },
  quart: { ru: 'кварта', ar: 'كوارت', hi: 'क्वार्ट', ja: 'クォート', 'zh-CN': '夸脱' },
  pints: { ru: 'пинты', ar: 'باينتات', hi: 'पिंट', ja: 'パイント', 'zh-CN': '品脱' },
  pint: { ru: 'пинта', ar: 'باينت', hi: 'पिंट', ja: 'パイント', 'zh-CN': '品脱' },
  cups: { ru: 'чашки', ar: 'أكواب', hi: 'कप', ja: 'カップ', 'zh-CN': '杯' },
  cup: { ru: 'чашка', ar: 'كوب', hi: 'कप', ja: 'カップ', 'zh-CN': '杯' },
  tablespoons: { ru: 'столовые ложки', ar: 'ملاعق طعام', hi: 'बड़े चम्मच', ja: '大さじ', 'zh-CN': '汤匙' },
  tablespoon: { ru: 'столовая ложка', ar: 'ملعقة طعام', hi: 'बड़ा चम्मच', ja: '大さじ', 'zh-CN': '汤匙' },
  tbsp: { ru: 'ст.л.', ar: 'ملعقة طعام', hi: 'बड़ा चम्मच', ja: '大さじ', 'zh-CN': '汤匙' },
  teaspoons: { ru: 'чайные ложки', ar: 'ملاعق شاي', hi: 'छोटे चम्मच', ja: '小さじ', 'zh-CN': '茶匙' },
  teaspoon: { ru: 'чайная ложка', ar: 'ملعقة شاي', hi: 'छोटा चम्मच', ja: '小さじ', 'zh-CN': '茶匙' },
  tsp: { ru: 'ч.л.', ar: 'ملعقة شاي', hi: 'छोटा चम्मच', ja: '小さじ', 'zh-CN': '茶匙' },
  barrels: { ru: 'баррели', ar: 'براميل', hi: 'बैरल', ja: 'バレル', 'zh-CN': '桶' },
  acres: { ru: 'акры', ar: 'فدان', hi: 'एकड़', ja: 'エーカー', 'zh-CN': '英亩' },
  hectares: { ru: 'гектары', ar: 'هكتارات', hi: 'हेक्टेयर', ja: 'ヘクタール', 'zh-CN': '公顷' },
  calories: { ru: 'калории', ar: 'سعرات حرارية', hi: 'कैलोरी', ja: 'カロリー', 'zh-CN': '卡路里' },
  calorie: { ru: 'калория', ar: 'سعرة حرارية', hi: 'कैलोरी', ja: 'カロリー', 'zh-CN': '卡路里' },
  seconds: { ru: 'секунды', ar: 'ثوان', hi: 'सेकंड', ja: '秒', 'zh-CN': '秒' },
  second: { ru: 'секунда', ar: 'ثانية', hi: 'सेकंड', ja: '秒', 'zh-CN': '秒' },
  minutes: { ru: 'минуты', ar: 'دقائق', hi: 'मिनट', ja: '分', 'zh-CN': '分钟' },
  minute: { ru: 'минута', ar: 'دقيقة', hi: 'मिनट', ja: '分', 'zh-CN': '分钟' },
  hours: { ru: 'часы', ar: 'ساعات', hi: 'घंटे', ja: '時間', 'zh-CN': '小时' },
  hour: { ru: 'час', ar: 'ساعة', hi: 'घंटा', ja: '時間', 'zh-CN': '小时' },
  days: { ru: 'дни', ar: 'أيام', hi: 'दिन', ja: '日', 'zh-CN': '天' },
  day: { ru: 'день', ar: 'يوم', hi: 'दिन', ja: '日', 'zh-CN': '天' },
  weeks: { ru: 'недели', ar: 'أسابيع', hi: 'सप्ताह', ja: '週間', 'zh-CN': '周' },
  week: { ru: 'неделя', ar: 'أسبوع', hi: 'सप्ताह', ja: '週間', 'zh-CN': '周' },
  months: { ru: 'месяцы', ar: 'أشهر', hi: 'महीने', ja: 'ヶ月', 'zh-CN': '个月' },
  month: { ru: 'месяц', ar: 'شهر', hi: 'महीना', ja: 'ヶ月', 'zh-CN': '个月' },
  years: { ru: 'годы', ar: 'سنوات', hi: 'साल', ja: '年', 'zh-CN': '年' },
  year: { ru: 'год', ar: 'سنة', hi: 'साल', ja: '年', 'zh-CN': '年' },
  decades: { ru: 'десятилетия', ar: 'عقود', hi: 'दशक', ja: '十年', 'zh-CN': '十年' },
  decade: { ru: 'десятилетие', ar: 'عقد', hi: 'दशक', ja: '十年', 'zh-CN': '十年' },
  milliseconds: { ru: 'миллисекунды', ar: 'ألف من الثانية', hi: 'मिलीसेकंड', ja: 'ミリ秒', 'zh-CN': '毫秒' },
  ms: { ru: 'мс', ar: 'ملي ثانية', hi: 'मिलीसेकंड', ja: 'ミリ秒', 'zh-CN': '毫秒' },
  atmospheres: { ru: 'атмосферы', ar: 'أجواء', hi: 'वायुमंडल', ja: '気圧', 'zh-CN': '大气压' },
  atm: { ru: 'атм', ar: 'ضغط جوي', hi: 'वायुमंडल', ja: '気圧', 'zh-CN': '大气压' },
  kg: { ru: 'кг', ar: 'كجم', hi: 'किग्रा', ja: 'キログラム', 'zh-CN': '公斤' },
  km: { ru: 'км', ar: 'كم', hi: 'किमी', ja: 'キロメートル', 'zh-CN': '公里' },
  mph: { ru: 'миль/ч', ar: 'ميل/ساعة', hi: 'मील/घंटा', ja: 'マイル/時', 'zh-CN': '英里/小时' },
  kmh: { ru: 'км/ч', ar: 'كم/ساعة', hi: 'किमी/घंटा', ja: 'キロメートル/時', 'zh-CN': '公里/小时' },
  knots: { ru: 'узлы', ar: 'عقدة', hi: 'नॉट', ja: 'ノット', 'zh-CN': '节' },
  mach: { ru: 'Маха', ar: 'ماخ', hi: 'मैक', ja: 'マッハ', 'zh-CN': '马赫' },
  fps: { ru: 'фут/с', ar: 'قدم/ثانية', hi: 'फीट/सेकंड', ja: 'フィート/秒', 'zh-CN': '英尺/秒' },
  psi: { ru: 'PSI', ar: 'رطل/بوصة²', hi: 'PSI', ja: 'PSI', 'zh-CN': 'PSI' },
  bar: { ru: 'бар', ar: 'بار', hi: 'बार', ja: 'バール', 'zh-CN': '巴' },
  pascals: { ru: 'паскали', ar: 'باسكال', hi: 'पास्कल', ja: 'パスカル', 'zh-CN': '帕斯卡' },
  pascal: { ru: 'паскаль', ar: 'باسكال', hi: 'पास्कल', ja: 'パスカル', 'zh-CN': '帕斯卡' },
  pa: { ru: 'Па', ar: 'باسكال', hi: 'पास्कल', ja: 'パスカル', 'zh-CN': '帕斯卡' },
  mmhg: { ru: 'мм рт. ст.', ar: 'مم زئبق', hi: 'मिमी एचजी', ja: 'mmHg', 'zh-CN': '毫米汞柱' },
  kpa: { ru: 'кПа', ar: 'كيلوباسكال', hi: 'किलोपास्कल', ja: 'キロパスカル', 'zh-CN': '千帕' },
  torr: { ru: 'торр', ar: 'تور', hi: 'टॉर', ja: 'トル', 'zh-CN': '托' },
  joules: { ru: 'джоули', ar: 'جولات', hi: 'जूल', ja: 'ジュール', 'zh-CN': '焦耳' },
  joule: { ru: 'джоуль', ar: 'جول', hi: 'जूल', ja: 'ジュール', 'zh-CN': '焦耳' },
  j: { ru: 'Дж', ar: 'جول', hi: 'जूल', ja: 'ジュール', 'zh-CN': '焦耳' },
  kwh: { ru: 'кВт·ч', ar: 'كيلوواط ساعة', hi: 'किलोवाट घंटा', ja: 'キロワット時', 'zh-CN': '千瓦时' },
  btu: { ru: 'BTU', ar: 'وحدة حرارية بريطانية', hi: 'BTU', ja: 'BTU', 'zh-CN': 'BTU' },
  'ev': { ru: 'эВ', ar: 'إلكترون فولت', hi: 'eV', ja: 'eV', 'zh-CN': '电子伏' },
  therm: { ru: 'терм', ar: 'ثيرم', hi: 'थर्म', ja: 'サーム', 'zh-CN': '撒姆' },
  hp: { ru: 'л.с.', ar: 'حصان', hi: 'HP', ja: '馬力', 'zh-CN': '马力' },
  kw: { ru: 'кВт', ar: 'كيلوواط', hi: 'किलोवाट', ja: 'キロワット', 'zh-CN': '千瓦' },
  watts: { ru: 'ватты', ar: 'واط', hi: 'वाट', ja: 'ワット', 'zh-CN': '瓦' },
  bytes: { ru: 'байты', ar: 'بايت', hi: 'बाइट', ja: 'バイト', 'zh-CN': '字节' },
  kb: { ru: 'КБ', ar: 'كيلوبايت', hi: 'KB', ja: 'KB', 'zh-CN': 'KB' },
  mb: { ru: 'МБ', ar: 'ميجابايت', hi: 'MB', ja: 'MB', 'zh-CN': 'MB' },
  gb: { ru: 'ГБ', ar: 'جيجابايت', hi: 'GB', ja: 'GB', 'zh-CN': 'GB' },
  tb: { ru: 'ТБ', ar: 'تيرابايت', hi: 'TB', ja: 'TB', 'zh-CN': 'TB' },
  pb: { ru: 'ПБ', ar: 'بيتابايت', hi: 'PB', ja: 'PB', 'zh-CN': 'PB' },
  bits: { ru: 'биты', ar: 'بت', hi: 'बिट', ja: 'ビット', 'zh-CN': '位' },
  mbps: { ru: 'Мбит/с', ar: 'ميجابت/ثانية', hi: 'Mbps', ja: 'Mbps', 'zh-CN': 'Mbps' },
  gbps: { ru: 'Гбит/с', ar: 'جيجابت/ثانية', hi: 'Gbps', ja: 'Gbps', 'zh-CN': 'Gbps' },
  degrees: { ru: 'градусы', ar: 'درجات', hi: 'डिग्री', ja: '度', 'zh-CN': '度' },
  degree: { ru: 'градус', ar: 'درجة', hi: 'डिग्री', ja: '度', 'zh-CN': '度' },
  radians: { ru: 'радианы', ar: 'راديان', hi: 'रेडियन', ja: 'ラジアン', 'zh-CN': '弧度' },
  radian: { ru: 'радиан', ar: 'راديان', hi: 'रेडियन', ja: 'ラジアン', 'zh-CN': '弧度' },
  gradians: { ru: 'грады', ar: 'جراد', hi: 'ग्रेडियन', ja: 'グラジアン', 'zh-CN': '百分度' },
  newtons: { ru: 'ньютоны', ar: 'نيوتن', hi: 'न्यूटन', ja: 'ニュートン', 'zh-CN': '牛顿' },
  newton: { ru: 'ньютон', ar: 'نيوتن', hi: 'न्यूटन', ja: 'ニュートン', 'zh-CN': '牛顿' },
  dynes: { ru: 'дины', ar: 'داين', hi: 'डाइन', ja: 'ダイン', 'zh-CN': '达因' },
  hz: { ru: 'Гц', ar: 'هرتز', hi: 'हर्ट्ज', ja: 'Hz', 'zh-CN': '赫兹' },
  khz: { ru: 'кГц', ar: 'كيلوهرتز', hi: 'किलोहर्ट्ज', ja: 'kHz', 'zh-CN': '千赫兹' },
  mhz: { ru: 'МГц', ar: 'ميجاهرتز', hi: 'मेगाहर्ट्ज', ja: 'MHz', 'zh-CN': '兆赫兹' },
  ghz: { ru: 'ГГц', ar: 'جيجاهرتز', hi: 'गीगाहर्ट्ज', ja: 'GHz', 'zh-CN': '吉赫兹' },
  celsius: { ru: 'Цельсия', ar: 'سيليسيوس', hi: 'सेल्सियस', ja: '摂氏', 'zh-CN': '摄氏度' },
  fahrenheit: { ru: 'Фаренгейта', ar: 'فهرنهايت', hi: 'फारेनहाइट', ja: '華氏', 'zh-CN': '华氏度' },
  kelvin: { ru: 'Кельвина', ar: 'كلفن', hi: 'केल्विन', ja: 'ケルビン', 'zh-CN': '开尔文' },
  'square feet': { ru: 'квадратные футы', ar: 'قدم مربع', hi: 'वर्ग फीट', ja: '平方フィート', 'zh-CN': '平方英尺' },
  'square meters': { ru: 'квадратные метры', ar: 'أمتار مربعة', hi: 'वर्ग मीटर', ja: '平方メートル', 'zh-CN': '平方米' },
  'square miles': { ru: 'квадратные мили', ar: 'أميال مربعة', hi: 'वर्ग मील', ja: '平方マイル', 'zh-CN': '平方英里' },
  'square yards': { ru: 'квадратные ярды', ar: 'ياردات مربعة', hi: 'वर्ग गज', ja: '平方ヤード', 'zh-CN': '平方码' },
  'square inches': { ru: 'квадратные дюймы', ar: 'بوصة مربعة', hi: 'वर्ग इंच', ja: '平方インチ', 'zh-CN': '平方英寸' },
  'cubic feet': { ru: 'кубические футы', ar: 'قدم مكعب', hi: 'घन फीट', ja: '立方フィート', 'zh-CN': '立方英尺' },
  'fluid ounces': { ru: 'жидкие унции', ar: 'أوقية سائلة', hi: 'द्रव औंस', ja: '液量オンス', 'zh-CN': '液量盎司' },
  'light years': { ru: 'световые годы', ar: 'سنوات ضوئية', hi: 'प्रकाश वर्ष', ja: '光年', 'zh-CN': '光年' },
  'metric tons': { ru: 'метрические тонны', ar: 'أطنان مترية', hi: 'मीट्रिक टन', ja: 'メトリックトン', 'zh-CN': '公吨' },
  'pound-force': { ru: 'фунт-сила', ar: 'رطل-قوة', hi: 'पाउंड-बल', ja: 'ポンド重', 'zh-CN': '磅力' },
  'pound-force': { ru: 'фунт-сила', ar: 'رطل-قوة', hi: 'पाउंड-बल', ja: 'ポンド重', 'zh-CN': '磅力' },
  'foot-pounds': { ru: 'фут-фунты', ar: 'قدم-رطل', hi: 'फुट-पाउंड', ja: 'フィートポンド', 'zh-CN': '英尺磅' },
  'foot candles': { ru: 'фут-канделы', ar: 'قدم-شمعة', hi: 'फुट कैंडल', ja: 'フートキャンドル', 'zh-CN': '英尺烛光' },
  'pascal-seconds': { ru: 'паскаль-секунды', ar: 'باسكال-ثانية', hi: 'पास्कल-सेकंड', ja: 'パスカル秒', 'zh-CN': '帕斯卡秒' },
  'sticks of butter': { ru: 'палочки масла', ar: 'أصابع زبدة', hi: 'मक्खन की स्टिक', ja: 'バターのスティック', 'zh-CN': '黄油棒' },
  'speed of light': { ru: 'скорость света', ar: 'سرعة الضوء', hi: 'प्रकाश की गति', ja: '光速', 'zh-CN': '光速' },
  'g-force': { ru: 'G-сила', ar: 'قوة جاذبية', hi: 'G-बल', ja: 'G力', 'zh-CN': 'G力' },
  angstroms: { ru: 'ангстремы', ar: 'أنجستروم', hi: 'एंगस्ट्रॉम', ja: 'オングストローム', 'zh-CN': '埃' },
  'pound-feet': { ru: 'фунт-футы', ar: 'رطل-قدم', hi: 'पाउंड-फीट', ja: 'ポンドフィート', 'zh-CN': '磅英尺' },
}

const MULTI_WORD_UNIT_KEYS = [
  'square feet', 'square meters', 'square miles', 'square yards', 'square inches',
  'cubic feet', 'fluid ounces', 'light years', 'metric tons', 'pound-force',
  'foot-pounds', 'foot candles', 'pascal-seconds', 'sticks of butter', 'speed of light',
  'g-force', 'pound-feet',
]

const PHRASE_UNITS = {
  'g-force': { ru: 'G-сила', ar: 'قوة جاذبية', hi: 'G-बल', ja: 'G力', 'zh-CN': 'G力' },
}

function translateUnitWord(word, locale) {
  const lower = word.toLowerCase()
  if (UNIT_MAP[lower]) return UNIT_MAP[lower][locale]
  return null
}

function translateUnitsInPhrase(phrase, locale) {
  let result = phrase

  for (const mwuKey of MULTI_WORD_UNIT_KEYS) {
    const regex = new RegExp('\\b' + mwuKey.replace(/-/g, '\\-') + '\\b', 'gi')
    if (regex.test(result)) {
      result = result.replace(regex, UNIT_MAP[mwuKey][locale])
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

function translateTitle(entry, locale) {
  const title = entry.title
  const meta = LOCALE_META[locale]

  if (locale === 'ja') {
    const jaConverterMatch = title.match(/^(.+)\s+to\s+(.+)\s+Converter$/)
    if (jaConverterMatch) {
      let xPart = translateUnitsInPhrase(jaConverterMatch[1].trim(), locale)
      let yPart = translateUnitsInPhrase(jaConverterMatch[2].trim(), locale)
      return `${xPart}から${yPart}への${meta.converter}`
    }
    const jaCalcMatch = title.match(/^(.+)\s+Calculator$/)
    if (jaCalcMatch) {
      const noun = translateUnitsInPhrase(jaCalcMatch[1].trim(), locale)
      return `${noun}${meta.calculator}`
    }
    const jaConvPlainMatch = title.match(/^(.+)\s+Converter$/)
    if (jaConvPlainMatch) {
      const noun = translateUnitsInPhrase(jaConvPlainMatch[1].trim(), locale)
      return `${noun}${meta.converter}`
    }
    return title
  }

  if (locale === 'zh-CN') {
    const zhConverterMatch = title.match(/^(.+)\s+to\s+(.+)\s+Converter$/)
    if (zhConverterMatch) {
      let xPart = translateUnitsInPhrase(zhConverterMatch[1].trim(), locale)
      let yPart = translateUnitsInPhrase(zhConverterMatch[2].trim(), locale)
      return `${xPart}${meta.to}${yPart}${meta.converter}`
    }
    const zhCalcMatch = title.match(/^(.+)\s+Calculator$/)
    if (zhCalcMatch) {
      const noun = translateUnitsInPhrase(zhCalcMatch[1].trim(), locale)
      return `${noun}${meta.calculator}`
    }
    const zhConvPlainMatch = title.match(/^(.+)\s+Converter$/)
    if (zhConvPlainMatch) {
      const noun = translateUnitsInPhrase(zhConvPlainMatch[1].trim(), locale)
      return `${noun}${meta.converter}`
    }
    return title
  }

  if (locale === 'hi') {
    const hiConverterMatch = title.match(/^(.+)\s+to\s+(.+)\s+Converter$/)
    if (hiConverterMatch) {
      let xPart = translateUnitsInPhrase(hiConverterMatch[1].trim(), locale)
      let yPart = translateUnitsInPhrase(hiConverterMatch[2].trim(), locale)
      return `${xPart} ${meta.to} ${yPart} ${meta.converter}`
    }
    const hiCalcMatch = title.match(/^(.+)\s+Calculator$/)
    if (hiCalcMatch) {
      const noun = translateUnitsInPhrase(hiCalcMatch[1].trim(), locale)
      return `${noun} ${meta.calculator}`
    }
    const hiConvPlainMatch = title.match(/^(.+)\s+Converter$/)
    if (hiConvPlainMatch) {
      const noun = translateUnitsInPhrase(hiConvPlainMatch[1].trim(), locale)
      return `${noun} ${meta.converter}`
    }
    return title
  }

  const converterMatch = title.match(/^(.+)\s+to\s+(.+)\s+Converter$/)
  const calculatorMatch = title.match(/^(.+)\s+Calculator$/)
  const converterPlainMatch = title.match(/^(.+)\s+Converter$/)

  if (converterMatch) {
    let xPart = translateUnitsInPhrase(converterMatch[1].trim(), locale)
    let yPart = translateUnitsInPhrase(converterMatch[2].trim(), locale)
    return `${meta.converter} ${xPart} ${meta.to} ${yPart}`
  }

  if (calculatorMatch) {
    const noun = translateUnitsInPhrase(calculatorMatch[1].trim(), locale)
    return `${meta.calculator} ${noun}`
  }

  if (converterPlainMatch) {
    const noun = translateUnitsInPhrase(converterPlainMatch[1].trim(), locale)
    return `${meta.converter} ${noun}`
  }

  return title
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

const allEntries = []
const entryRegex = /\{\s*slug:\s*'([^']+)',\s*title:\s*'([^']+)',\s*description:\s*'([^']+)'/g
let entryMatch
while ((entryMatch = entryRegex.exec(registryContent)) !== null) {
  allEntries.push({ slug: entryMatch[1], title: entryMatch[2], description: entryMatch[3] })
}

console.log(`📖 Read ${allEntries.length} entries from registry`)

const stats = {}

for (const locale of LOCALES) {
  const overridePath = join(OVERRIDES_DIR, `${locale}.json`)
  const overrides = readJSON(overridePath)
  let translatedCount = 0
  let skippedCount = 0

  for (const entry of allEntries) {
    const existing = overrides[entry.slug]
    const currentTitle = existing?.title || entry.title

    const isEnglish = /^[a-zA-Z0-9\s\-/°²³]+$/.test(currentTitle)
    if (!isEnglish) {
      skippedCount++
      continue
    }

    const newTitle = translateTitle(entry, locale)
    if (newTitle !== currentTitle) {
      overrides[entry.slug] = {
        title: newTitle,
        description: existing?.description || entry.description,
      }
      translatedCount++
    }
  }

  writeJSON(overridePath, overrides)
  stats[locale] = { translated: translatedCount, skipped: skippedCount, total: allEntries.length }
  console.log(`  ${locale}: ${translatedCount} translated, ${skippedCount} already non-English, ${allEntries.length} total`)
}

console.log('\n📊 Translation Summary:')
for (const [locale, s] of Object.entries(stats)) {
  console.log(`  ${locale}: ${s.translated} titles translated, ${s.skipped} already localized`)
}
