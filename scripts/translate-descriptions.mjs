import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES = ['es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi', 'ja', 'zh-CN'];
const OVERRIDES_DIR = join(__dirname, '..', 'src', 'i18n', 'calculator-overrides');

const LOCALE_FREE = { es:'Gratis', fr:'Gratuit', de:'Kostenlos', pt:'Grátis', ru:'Бесплатный', ar:'مجاني', hi:'मुफ्त', ja:'無料', 'zh-CN':'免费' };
const LOCALE_CONVERTER = { es:'Convertidor', fr:'Convertisseur', de:'Konverter', pt:'Conversor', ru:'Конвертер', ar:'محول', hi:'कनवर्टर', ja:'コンバーター', 'zh-CN':'转换器' };
const LOCALE_CALC = { es:'Calculadora', fr:'Calculatrice', de:'Rechner', pt:'Calculadora', ru:'Калькулятор', ar:'حاسبة', hi:'कैलकुलेटर', ja:'計算機', 'zh-CN':'计算器' };
const LOCALE_CONVERT = { es:'Convertir', fr:'Convertir', de:'Konvertieren', pt:'Converter', ru:'Конвертировать', ar:'تحويل', hi:'कनवर्ट करें', ja:'変換', 'zh-CN':'转换' };
const LOCALE_TO = { es:'a', fr:'en', de:'zu', pt:'para', ru:'в', ar:'إلى', hi:'से', ja:'へ', 'zh-CN':'到' };
const LOCALE_DE = { es:'de', fr:'de', de:'', pt:'de', ru:'', ar:'', hi:'', ja:'', 'zh-CN':'' };

// Body phrase translations (for parts after the em-dash)
const BODY_ES = {
  'Convert': 'Convertir',
  'instantly': 'al instante',
  'for any measurement': 'para cualquier medida',
  'for distance': 'para distancia',
  'for nautical depth': 'para profundidad náutica',
  'for atomic scales': 'para escalas atómicas',
  'for gemstones': 'para piedras preciosas',
  'for natural gas': 'para gas natural',
  'Accurate fast and reliable unit conversion tool supporting multiple units and decimal precision': 'Herramienta de conversión de unidades precisa rápida y confiable que admite múltiples unidades y precisión decimal',
  'Perfect for students travelers engineers and professionals who need instant measurement conversions': 'Perfecto para estudiantes viajeros ingenieros y profesionales que necesitan conversiones de medida instantáneas',
  'Bookmark for quick access': 'Marque para acceso rápido',
  'No registration required': 'Sin registro necesario',
  'Works offline': 'Funciona sin conexión',
  'mobile friendly': 'compatible con móviles',
  'Designed for students researchers and data analysts': 'Diseñado para estudiantes investigadores y analistas de datos',
};

const BODY_FR = {
  'Convert': 'Convertir',
  'instantly': 'instantanément',
  'for any measurement': 'pour toute mesure',
  'for distance': 'pour la distance',
  'for nautical depth': 'pour la profondeur nautique',
  'for atomic scales': 'pour les échelles atomiques',
  'for gemstones': 'pour les pierres précieuses',
  'for natural gas': 'pour le gaz naturel',
  'Accurate fast and reliable unit conversion tool supporting multiple units and decimal precision': 'Outil de conversion d\'unités précis rapide et fiable prenant en charge plusieurs unités et une précision décimale',
  'Perfect for students travelers engineers and professionals who need instant measurement conversions': 'Parfait pour les étudiants voyageurs ingénieurs et professionnels qui ont besoin de conversions de mesure instantanées',
  'Bookmark for quick access': 'Ajouter aux favoris',
  'No registration required': 'Pas d\'inscription requise',
  'Works offline': 'Fonctionne hors ligne',
  'mobile friendly': 'adapté aux mobiles',
  'Designed for students researchers and data analysts': 'Conçu pour les étudiants chercheurs et analystes de données',
};

const BODY_DE = {
  'Convert': 'Konvertieren',
  'instantly': 'sofort',
  'for any measurement': 'für jede Messung',
  'for distance': 'für Entfernungen',
  'for nautical depth': 'für nautische Tiefe',
  'for atomic scales': 'für atomare Skalen',
  'for gemstones': 'für Edelsteine',
  'for natural gas': 'für Erdgas',
  'Accurate fast and reliable unit conversion tool supporting multiple units and decimal precision': 'Präzises schnelles und zuverlässiges Einheitenumrechnungstool mit Unterstützung für mehrere Einheiten und Dezimalgenauigkeit',
  'Perfect for students travelers engineers and professionals who need instant measurement conversions': 'Perfekt für Studenten Reisende Ingenieure und Fachleute die sofortige Maßumrechnungen benötigen',
  'Bookmark for quick access': 'Für schnellen Zugriff merken',
  'No registration required': 'Keine Registrierung erforderlich',
  'Works offline': 'Funktioniert offline',
  'mobile friendly': 'mobilfreundlich',
  'Designed for students researchers and data analysts': 'Entwickelt für Studenten Forscher und Datenanalysten',
};

const BODY_PT = {
  'Convert': 'Converter',
  'instantly': 'instantaneamente',
  'for any measurement': 'para qualquer medida',
  'for distance': 'para distância',
  'for nautical depth': 'para profundidade náutica',
  'for atomic scales': 'para escalas atômicas',
  'for gemstones': 'para pedras preciosas',
  'for natural gas': 'para gás natural',
  'Accurate fast and reliable unit conversion tool supporting multiple units and decimal precision': 'Ferramenta de conversão de unidades precisa rápida e confiável com suporte a múltiplas unidades e precisão decimal',
  'Perfect for students travelers engineers and professionals who need instant measurement conversions': 'Perfeito para estudantes viajantes engenheiros e profissionais que precisam de conversões de medida instantâneas',
  'Bookmark for quick access': 'Salve para acesso rápido',
  'No registration required': 'Sem registro necessário',
  'Works offline': 'Funciona offline',
  'mobile friendly': 'compatível com dispositivos móveis',
  'Designed for students researchers and data analysts': 'Projetado para estudantes pesquisadores e analistas de dados',
};

const BODY_RU = {
  'Convert': 'Конвертировать',
  'instantly': 'мгновенно',
  'for any measurement': 'для любых измерений',
  'for distance': 'для расстояния',
  'for nautical depth': 'для морской глубины',
  'for atomic scales': 'для атомных масштабов',
  'for gemstones': 'для драгоценных камней',
  'for natural gas': 'для природного газа',
  'Accurate fast and reliable unit conversion tool supporting multiple units and decimal precision': 'Точный быстрый и надежный инструмент конвертации единиц измерения поддерживающий несколько единиц и десятичную точность',
  'Perfect for students travelers engineers and professionals who need instant measurement conversions': 'Идеально подходит для студентов путешественников инженеров и профессионалов которым нужны мгновенные конвертации измерений',
  'Bookmark for quick access': 'Добавьте в закладки для быстрого доступа',
  'No registration required': 'Без регистрации',
  'Works offline': 'Работает офлайн',
  'mobile friendly': 'мобильная версия',
  'Designed for students researchers and data analysts': 'Предназначено для студентов исследователей и аналитиков данных',
};

const BODY_AR = {
  'Convert': 'تحويل',
  'instantly': 'فوراً',
  'for any measurement': 'لأي قياس',
  'for distance': 'للمسافة',
  'for nautical depth': 'للعمق البحري',
  'for atomic scales': 'للمقاييس الذرية',
  'for gemstones': 'للأحجار الكريمة',
  'for natural gas': 'للغاز الطبيعي',
  'Accurate fast and reliable unit conversion tool supporting multiple units and decimal precision': 'أداة تحويل وحدات دقيقة وسريعة وموثوقة تدعم وحدات متعددة ودقة عشرية',
  'Perfect for students travelers engineers and professionals who need instant measurement conversions': 'مثالي للطلاب والمسافرين والمهندسين والمحترفين الذين يحتاجون إلى تحويلات قياس فورية',
  'Bookmark for quick access': 'احفظ للوصول السريع',
  'No registration required': 'لا يتطلب تسجيلاً',
  'Works offline': 'يعمل بدون اتصال',
  'mobile friendly': 'متوافق مع الجوال',
  'Designed for students researchers and data analysts': 'مصمم للطلاب والباحثين ومحللي البيانات',
};

const BODY_HI = {
  'Convert': 'कनवर्ट करें',
  'instantly': 'तुरंत',
  'for any measurement': 'किसी भी माप के लिए',
  'for distance': 'दूरी के लिए',
  'for nautical depth': 'समुद्री गहराई के लिए',
  'for atomic scales': 'परमाणु पैमाने के लिए',
  'for gemstones': 'रत्नों के लिए',
  'for natural gas': 'प्राकृतिक गैस के लिए',
  'Accurate fast and reliable unit conversion tool supporting multiple units and decimal precision': 'सटीक तेज़ और विश्वसनीय इकाई रूपांतरण उपकरण जो एकाधिक इकाइयों और दशमलव सटीकता का समर्थन करता है',
  'Perfect for students travelers engineers and professionals who need instant measurement conversions': 'छात्रों यात्रियों इंजीनियरों और पेशेवरों के लिए आदर्श जिन्हें तुरंत माप रूपांतरण की आवश्यकता है',
  'Bookmark for quick access': 'त्वरित पहुंच के लिए बुकमार्क करें',
  'No registration required': 'कोई पंजीकरण आवश्यक नहीं',
  'Works offline': 'ऑफ़लाइन काम करता है',
  'mobile friendly': 'मोबाइल के अनुकूल',
  'Designed for students researchers and data analysts': 'छात्रों शोधकर्ताओं और डेटा विश्लेषकों के लिए डिज़ाइन किया गया',
};

const BODY_JA = {
  'Convert': '変換',
  'instantly': '即座に',
  'for any measurement': 'あらゆる測定に対応',
  'for distance': '距離に対応',
  'for nautical depth': '航海深度に対応',
  'for atomic scales': '原子スケールに対応',
  'for gemstones': '宝石に対応',
  'for natural gas': '天然ガスに対応',
  'Accurate fast and reliable unit conversion tool supporting multiple units and decimal precision': '複数の単位と小数点精度をサポートする正確で高速かつ信頼性の高い単位変換ツール',
  'Perfect for students travelers engineers and professionals who need instant measurement conversions': '即時測定変換を必要とする学生旅行者エンジニア専門家に最適',
  'Bookmark for quick access': 'クイックアクセス用にブックマーク',
  'No registration required': '登録不要',
  'Works offline': 'オフラインでも動作',
  'mobile friendly': 'モバイル対応',
  'Designed for students researchers and data analysts': '学生研究者データアナリスト向けに設計',
};

const BODY_ZH = {
  'Convert': '转换',
  'instantly': '立即',
  'for any measurement': '适用于任何测量',
  'for distance': '适用于距离',
  'for nautical depth': '适用于航海深度',
  'for atomic scales': '适用于原子尺度',
  'for gemstones': '适用于宝石',
  'for natural gas': '适用于天然气',
  'Accurate fast and reliable unit conversion tool supporting multiple units and decimal precision': '准确快速可靠的单位转换工具支持多种单位和十进制精度',
  'Perfect for students travelers engineers and professionals who need instant measurement conversions': '非常适合学生旅行者工程师和专业人士需要即时测量转换',
  'Bookmark for quick access': '收藏以便快速访问',
  'No registration required': '无需注册',
  'Works offline': '离线可用',
  'mobile friendly': '移动设备友好',
  'Designed for students researchers and data analysts': '专为学生研究人员和数据分析师设计',
};

const BODY_MAP = { es: BODY_ES, fr: BODY_FR, de: BODY_DE, pt: BODY_PT, ru: BODY_RU, ar: BODY_AR, hi: BODY_HI, ja: BODY_JA, 'zh-CN': BODY_ZH };

// Additional calculator feature translations
const FEAT_ES = {
  'Solve ': 'Resuelve ',
  ' problems with our interactive ': ' problemas con nuestra ',
  ' calculator': ' calculadora',
  'Features formula derivation step-by-step solutions and visual simulations': 'Incluye derivación de fórmulas soluciones paso a paso y simulaciones visuales',
  'Compute ': 'Calcula ',
  ' values with confidence using our intuitive statistical tool': ' valores con confianza usando nuestra herramienta estadística intuitiva',
  'Features data input validation visual distributions and detailed step-by-step methodology': 'Incluye validación de datos de entrada distribuciones visuales y metodología detallada paso a paso',
  'Perfect for STEM students teachers and engineering professionals requiring accurate scientific computations': 'Perfecto para estudiantes STEM profesores y profesionales de ingeniería que necesitan cálculos científicos precisos',
};

const FEAT_FR = {
  'Solve ': 'Résolvez ',
  ' problems with our interactive ': ' problèmes avec notre ',
  ' calculator': ' calculatrice',
  'Features formula derivation step-by-step solutions and visual simulations': 'Avec dérivation de formules solutions étape par étape et simulations visuelles',
  'Compute ': 'Calculez ',
  ' values with confidence using our intuitive statistical tool': ' valeurs en toute confiance avec notre outil statistique intuitif',
  'Features data input validation visual distributions and detailed step-by-step methodology': 'Avec validation des données distributions visuelles et méthodologie détaillée étape par étape',
  'Perfect for STEM students teachers and engineering professionals requiring accurate scientific computations': 'Parfait pour les étudiants STEM les enseignants et les professionnels de l\'ingénierie nécessitant des calculs scientifiques précis',
};

const FEAT_DE = {
  'Solve ': 'Lösen Sie ',
  ' problems with our interactive ': ' Probleme mit unserem interaktiven ',
  ' calculator': ' Rechner',
  'Features formula derivation step-by-step solutions and visual simulations': 'Bietet Formelherleitung Schritt-für-Schritt-Lösungen und visuelle Simulationen',
  'Compute ': 'Berechnen Sie ',
  ' values with confidence using our intuitive statistical tool': ' Werte mit unserem intuitiven Statistik-Tool',
  'Features data input validation visual distributions and detailed step-by-step methodology': 'Bietet Dateneingabevalidierung visuelle Verteilungen und detaillierte Schritt-für-Schritt-Methodik',
  'Perfect for STEM students teachers and engineering professionals requiring accurate scientific computations': 'Perfekt für Studenten Lehrer und Ingenieure die genaue wissenschaftliche Berechnungen benötigen',
};

const FEAT_PT = {
  'Solve ': 'Resolva ',
  ' problems with our interactive ': ' problemas com nossa ',
  ' calculator': ' calculadora',
  'Features formula derivation step-by-step solutions and visual simulations': 'Recursos derivação de fórmulas soluções passo a passo e simulações visuais',
  'Compute ': 'Calcule ',
  ' values with confidence using our intuitive statistical tool': ' valores com confiança usando nossa ferramenta estatística intuitiva',
  'Features data input validation visual distributions and detailed step-by-step methodology': 'Recursos validação de dados de entrada distribuições visuais e metodologia detalhada passo a passo',
  'Perfect for STEM students teachers and engineering professionals requiring accurate scientific computations': 'Perfeito para estudantes STEM professores e profissionais de engenharia que precisam de cálculos científicos precisos',
};

const FEAT_RU = {
  'Solve ': 'Решайте ',
  ' problems with our interactive ': ' задачи с помощью нашего интерактивного ',
  ' calculator': ' калькулятора',
  'Features formula derivation step-by-step solutions and visual simulations': 'Включает вывод формул пошаговые решения и визуальные симуляции',
  'Compute ': 'Вычисляйте ',
  ' values with confidence using our intuitive statistical tool': ' значения с помощью нашего интуитивного статистического инструмента',
  'Features data input validation visual distributions and detailed step-by-step methodology': 'Включает проверку данных визуальные распределения и подробную пошаговую методологию',
  'Perfect for STEM students teachers and engineering professionals requiring accurate scientific computations': 'Идеально подходит для студентов преподавателей и инженеров которым нужны точные научные расчеты',
};

const FEAT_AR = {
  'Solve ': 'حل ',
  ' problems with our interactive ': ' مسائل باستخدام ',
  ' calculator': ' الحاسبة التفاعلية',
  'Features formula derivation step-by-step solutions and visual simulations': 'يشمل اشتقاق الصيغ والحلول خطوة بخطوة والمحاكاة البصرية',
  'Compute ': 'احسب ',
  ' values with confidence using our intuitive statistical tool': ' القيم بثقة باستخدام أداتنا الإحصائية البديهية',
  'Features data input validation visual distributions and detailed step-by-step methodology': 'يشمل التحقق من صحة البيانات والتوزيعات المرئية والمنهجية التفصيلية خطوة بخطوة',
  'Perfect for STEM students teachers and engineering professionals requiring accurate scientific computations': 'مثالي لطلاب STEM والمدرسين والمهندسين المحترفين الذين يحتاجون إلى حسابات علمية دقيقة',
};

const FEAT_HI = {
  'Solve ': 'हल करें ',
  ' problems with our interactive ': ' समस्याएं हमारे इंटरैक्टिव ',
  ' calculator': ' कैलकुलेटर से',
  'Features formula derivation step-by-step solutions and visual simulations': 'सूत्र व्युत्पत्ति चरण-दर-चरण समाधान और दृश्य सिमुलेशन शामिल हैं',
  'Compute ': 'गणना करें ',
  ' values with confidence using our intuitive statistical tool': ' मान हमारे सहज सांख्यिकीय उपकरण का उपयोग करके आत्मविश्वास से',
  'Features data input validation visual distributions and detailed step-by-step methodology': 'डेटा इनपुट सत्यापन दृश्य वितरण और विस्तृत चरण-दर-चरण पद्धति शामिल है',
  'Perfect for STEM students teachers and engineering professionals requiring accurate scientific computations': 'STEM छात्रों शिक्षकों और इंजीनियरिंग पेशेवरों के लिए आदर्श जिन्हें सटीक वैज्ञानिक गणनाओं की आवश्यकता है',
};

const FEAT_JA = {
  'Solve ': '解決 ',
  ' problems with our interactive ': ' 問題をインタラクティブな ',
  ' calculator': ' 計算機で',
  'Features formula derivation step-by-step solutions and visual simulations': '公式導出ステップバイステップ解法視覚シミュレーションを搭載',
  'Compute ': '計算 ',
  ' values with confidence using our intuitive statistical tool': ' 値を直感的な統計ツールで自信を持って計算',
  'Features data input validation visual distributions and detailed step-by-step methodology': 'データ入力検証視覚分布詳細なステップバイステップ手法を搭載',
  'Perfect for STEM students teachers and engineering professionals requiring accurate scientific computations': '正確な科学計算を必要とするSTEMの学生教師エンジニアに最適',
};

const FEAT_ZH = {
  'Solve ': '解决 ',
  ' problems with our interactive ': ' 问题使用我们的互动 ',
  ' calculator': ' 计算器',
  'Features formula derivation step-by-step solutions and visual simulations': '包含公式推导逐步解决方案和可视化模拟',
  'Compute ': '计算 ',
  ' values with confidence using our intuitive statistical tool': ' 值使用我们直观的统计工具自信地计算',
  'Features data input validation visual distributions and detailed step-by-step methodology': '包含数据输入验证可视化分布和详细的逐步方法',
  'Perfect for STEM students teachers and engineering professionals requiring accurate scientific computations': '非常适合STEM学生教师和工程专业人士需要精确的科学计算',
};

const FEAT_MAP = { es: FEAT_ES, fr: FEAT_FR, de: FEAT_DE, pt: FEAT_PT, ru: FEAT_RU, ar: FEAT_AR, hi: FEAT_HI, ja: FEAT_JA, 'zh-CN': FEAT_ZH };

function readOverrides(locale) {
  const path = join(OVERRIDES_DIR, `${locale}.json`);
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function writeOverrides(locale, data) {
  const path = join(OVERRIDES_DIR, `${locale}.json`);
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function applyPhrases(text, map) {
  const sorted = Object.keys(map).sort((a, b) => b.length - a.length);
  let result = text;
  for (const key of sorted) {
    const idx = result.indexOf(key);
    if (idx !== -1) {
      result = result.substring(0, idx) + map[key] + result.substring(idx + key.length);
    }
  }
  return result;
}

function translateConverterDesc(desc, locale) {
  // Pattern: "Free X to Y Converter — Convert X to Y ..."
  // Extract X and Y from the title prefix
  const prefixMatch = desc.match(/^Free (.+?) (?:to|→) (.+?) Converter — /);
  if (!prefixMatch) return null;

  const xPart = prefixMatch[1];
  const yPart = prefixMatch[2];
  const afterDash = desc.substring(desc.indexOf('— ') + 2);

  const free = LOCALE_FREE[locale];
  const conv = LOCALE_CONVERTER[locale];
  const convVerb = LOCALE_CONVERT[locale];
  const toW = LOCALE_TO[locale];

  // Build locale-specific prefix
  let prefix;
  switch (locale) {
    case 'es':
      prefix = `${free} ${conv} de ${xPart} ${toW} ${yPart}`;
      break;
    case 'fr':
      prefix = `${free} ${conv} de ${xPart} ${toW} ${yPart}`;
      break;
    case 'de':
      prefix = `${free} ${xPart}-${toW}-${yPart}-${conv}`;
      break;
    case 'pt':
      prefix = `${free} ${conv} de ${xPart} ${toW} ${yPart}`;
      break;
    default:
      prefix = `${free} ${xPart} ${toW} ${yPart} ${conv}`;
  }

  // Translate body
  const bodyMap = BODY_MAP[locale];
  let body = applyPhrases(afterDash, bodyMap);

  // Also translate "Convert X to Y" in body by locale
  const convPatternLower = `convert ${xPart.toLowerCase()} to ${yPart.toLowerCase()}`;
  const convPattern = `Convert ${xPart} to ${yPart}`;
  const locConvPhrase = `${convVerb} ${xPart} ${toW} ${yPart}`;
  
  const idx1 = body.toLowerCase().indexOf(convPatternLower);
  if (idx1 !== -1) {
    body = body.substring(0, idx1) + locConvPhrase + body.substring(idx1 + convPatternLower.length);
  }
  const idx2 = body.indexOf(convPattern);
  if (idx2 !== -1) {
    body = body.substring(0, idx2) + locConvPhrase + body.substring(idx2 + convPattern.length);
  }

  return `${prefix} — ${body}`;
}

function translateCalculatorDesc(desc, locale) {
  // Pattern: "Free X Calculator — ..."
  const prefixMatch = desc.match(/^Free (.+?) Calculator — /);
  if (!prefixMatch) return null;

  const calcName = prefixMatch[1];
  const afterDash = desc.substring(desc.indexOf('— ') + 2);

  const free = LOCALE_FREE[locale];
  const calc = LOCALE_CALC[locale];

  // Build locale-specific prefix
  let prefix;
  switch (locale) {
    case 'es':
    case 'pt':
      prefix = `${free} ${calc} de ${calcName}`;
      break;
    case 'fr':
      prefix = `${free} ${calc} ${calcName}`;
      break;
    case 'de':
      prefix = `${free} ${calcName}-${calc}`;
      break;
    default:
      prefix = `${free} ${calcName} ${calc}`;
  }

  // Translate body
  const bodyMap = BODY_MAP[locale];
  const featMap = FEAT_MAP[locale];
  let body = applyPhrases(afterDash, bodyMap);
  body = applyPhrases(body, featMap);

  return `${prefix} — ${body}`;
}

function translateGenericDesc(desc, locale) {
  // For descriptions that don't match specific patterns, do phrase-based translation
  const bodyMap = BODY_MAP[locale];
  const featMap = FEAT_MAP[locale];
  
  let result = desc;
  if (result.startsWith('Free ')) {
    result = LOCALE_FREE[locale] + result.substring(4);
  }
  const dashIdx = result.indexOf('— ');
  if (dashIdx > 0) {
    // Don't translate the name part between Free and —, only the body after —
    const pre = result.substring(0, dashIdx + 2);
    let body = result.substring(dashIdx + 2);
    body = applyPhrases(body, bodyMap);
    body = applyPhrases(body, featMap);
    result = pre + body;
  } else {
    result = applyPhrases(result, bodyMap);
    result = applyPhrases(result, featMap);
  }
  return result;
}

function translateDescription(desc, locale) {
  if (!desc) return desc;

  const freeWord = LOCALE_FREE[locale];
  if (desc.startsWith(freeWord)) return desc;
  if (!desc.startsWith('Free')) return desc;

  // Try converter pattern first
  if (desc.includes('Converter —') && /^Free .+ (?:to|→) .+ Converter —/.test(desc)) {
    const result = translateConverterDesc(desc, locale);
    if (result) return result;
  }

  // Try calculator pattern
  if (desc.includes('Calculator —') && /^Free .+? Calculator —/.test(desc)) {
    const result = translateCalculatorDesc(desc, locale);
    if (result) return result;
  }

  // Fallback to generic
  return translateGenericDesc(desc, locale);
}

async function main() {
  const { calculatorRegistry: allEntries } = await import('@calcuniverse/calculator-registry');

  console.log(`📖 Read ${allEntries.length} entries from registry\n`);

  let totalTranslated = 0;
  const localeCounts = {};

  for (const locale of LOCALES) {
    const overrides = readOverrides(locale);
    const slugs = Object.keys(overrides);
    let count = 0;
    const updated = { ...overrides };

    for (const slug of slugs) {
      const entry = updated[slug];
      if (!entry || !entry.description) continue;

      const newDesc = translateDescription(entry.description, locale);
      if (newDesc !== entry.description) {
        updated[slug] = { ...entry, description: newDesc };
        count++;
      }
    }

    writeOverrides(locale, updated);
    localeCounts[locale] = count;
    totalTranslated += count;
    console.log(`  ${locale}: ${count}/${slugs.length} descriptions translated`);
  }

  console.log(`\n📊 Total descriptions translated across all locales: ${totalTranslated}`);
}

main().catch(err => { console.error(err); process.exit(1); });
