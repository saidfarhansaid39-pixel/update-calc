/**
 * translate-guide.mjs
 *
 * Translates ALL 900 guide strings for all 9 non-English locales.
 * Uses systematic word-level + phrase-level replacement,
 * preserving template variables {likeThis} exactly.
 *
 * Usage: node scripts/translate-guide.mjs
 *        node scripts/translate-guide.mjs es fr    (specific locales only)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const MSGS_DIR = join(ROOT, 'src', 'i18n', 'messages')

const ALL_LOCALES = ['es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi', 'ja', 'zh-CN']
const targetLocales = process.argv[2] ? process.argv.slice(2) : ALL_LOCALES

// ──────────────────────────────────────────────
// PHASE-CONDITIONAL INFLECTION HELPERS
// ──────────────────────────────────────────────

// True if a string starts a new sentence or is a heading-style fragment.
function isSentenceStart(text) {
  return /^[A-Z]/.test(text.trim()) && !/^\-/.test(text.trim())
}

// ──────────────────────────────────────────────
// DICTIONARIES
// ──────────────────────────────────────────────
//
// Each locale has a flat map:  English phrase → locale phrase.
// Dictionary entries are tried longest-first so longer phrases
// match before shorter substrings.

// ─── Helper: build from split arrays ───
function dict(pairs) {
  const m = new Map()
  for (const [en, loc] of pairs) {
    m.set(en.toLowerCase(), loc)
  }
  return m
}

// Some phrase-level maps for the heaviest prose sections.
// Kept inline to avoid file bloat; expand as needed.
const PHRASE = {}

// ─── SPANISH ──────────────────────────────
PHRASE.es = new Map([
  // == SECTION / LABEL ==
  ['complete guide to the', 'Guía completa de'],
  ['on this page', 'En esta página'],
  ['min read', 'min de lectura'],
  ['was this guide helpful?', '¿Fue útil esta guía?'],
  ['was this helpful?', '¿Fue útil?'],
  ['what is the', '¿Qué es'],
  ['how to use', 'Cómo usar'],
  ['the formula behind the calculation', 'La fórmula detrás del cálculo'],
  ['example calculation', 'Cálculo de ejemplo'],
  ['common use cases', 'Casos de uso comunes'],
  ['tips for best results', 'Consejos para mejores resultados'],
  ['related calculators', 'Calculadoras relacionadas'],
  ['frequently asked questions', 'Preguntas frecuentes'],
  ['in this article', 'En este artículo'],

  // whatIs templates
  ['the {title} is a free online tool designed to instantly convert values', 
   'La {title} es una herramienta gratuita en línea diseñada para convertir valores'],
  ['the {title} is a powerful free tool that helps you',
   'La {title} es una poderosa herramienta gratuita que te ayuda a'],
  ['the {title} is a free health assessment tool',
   'La {title} es una herramienta gratuita de evaluación de salud'],
  ['the {title} is a free online tool that performs',
   'La {title} es una herramienta gratuita en línea que realiza'],
  ['the {title} is a free data analysis tool',
   'La {title} es una herramienta gratuita de análisis de datos'],
  ['the {title} is a free time and date computation tool',
   'La {title} es una herramienta gratuita de cómputo de tiempo y fecha'],
  ['the {title} is a free project estimation tool',
   'La {title} es una herramienta gratuita de estimación de proyectos'],
  ['the {title} is a free academic tool',
   'La {title} es una herramienta académica gratuita'],
  ['the {title} is a free scientific tool',
   'La {title} es una herramienta científica gratuita'],
  ['the {title} is a free chemistry tool',
   'La {title} es una herramienta gratuita de química'],
  ['the {title} is a free engineering tool',
   'La {title} es una herramienta gratuita de ingeniería'],
  ['the {title} is a free online tool',
   'La {title} es una herramienta gratuita en línea'],

  // howToUse templates
  ['using the {title} is straightforward',
   'Usar la {title} es sencillo'],
  ['using the {title} is simple',
   'Usar la {title} es simple'],
  ['using the {title} is quick and easy',
   'Usar la {title} es rápido y fácil'],
  ['using the {title} is quick and intuitive',
   'Usar la {title} es rápido e intuitivo'],
  ['using the {title} is quick and practical',
   'Usar la {title} es rápido y práctico'],
  ['using the {title} is easy',
   'Usar la {title} es fácil'],

  // formula templates
  ['the formula used by the {title} is:',
   'La fórmula utilizada por la {title} es:'],
  ['the {st} uses validated formulas that follow industry standards',
   'La {st} utiliza fórmulas validadas que siguen estándares de la industria'],
  ['understanding the formula behind the {st} helps you interpret the results',
   'Comprender la fórmula detrás de la {st} te ayuda a interpretar los resultados'],

  // example
  ["let's walk through a practical example to see how the {st} works",
   'Veamos un ejemplo práctico para ver cómo funciona la {st}'],

  // FAQ generic
  ['what is the {title} used for?',
   '¿Para qué se usa la {title}?'],
  ['is the {title} free to use?',
   '¿Es gratuita la {title}?'],
  ['how accurate are the results from this calculator?',
   '¿Qué tan precisos son los resultados de esta calculadora?'],
  ['can i use this calculator on my mobile device?',
   '¿Puedo usar esta calculadora en mi dispositivo móvil?'],
  ['what inputs do i need for the {title}?',
   '¿Qué entradas necesito para la {title}?'],
  ['can i save or share my calculation results?',
   '¿Puedo guardar o compartir mis resultados?'],
  ['how do i report an issue or suggest an improvement?',
   '¿Cómo reporto un problema o sugiero una mejora?'],

  // FAQ answers
  ['the {title} helps you perform accurate calculations quickly and easily',
   'La {title} te ayuda a realizar cálculos precisos rápida y fácilmente'],
  ['yes, the {title} is completely free to use with no limits',
   'Sí, la {title} es completamente gratuita sin límites'],
  ['results are calculated with high precision using',
   'Los resultados se calculan con alta precisión usando'],
  ['yes, all our calculators are fully responsive and work',
   'Sí, todas nuestras calculadoras son completamente adaptables y funcionan'],
  ['the {title} requires the inputs shown in the form above',
   'La {title} requiere las entradas que se muestran en el formulario anterior'],
  ['you can copy results to your clipboard, print the page, or share',
   'Puede copiar los resultados, imprimir la página o compartir'],
  ['we welcome feedback! use the contact form on our website',
   '¡Agradecemos sus comentarios! Use el formulario de contacto en nuestro sitio web'],

  // What Is answers
  ['instead of manually applying conversion factors or searching',
   'En lugar de aplicar factores de conversión manualmente o buscar'],
  ['simply enter your starting value, select the units, and get',
   'Simplemente ingrese su valor inicial, seleccione las unidades y obtenga'],
  ['whether you are a student learning about measurement systems',
   'Ya sea que sea un estudiante aprendiendo sobre sistemas de medición'],
  ['it supports decimal precision and handles both small and large values',
   'Soporta precisión decimal y maneja valores tanto pequeños como grandes'],
  ['bookmark it for fast access whenever you need',
   'Guárdelo en marcadores para acceso rápido cuando necesite'],

  // Generic sentence-level helpers
  ['instead of manually calculating formulas or setting up complex spreadsheet',
   'En lugar de calcular fórmulas manualmente o configurar hojas de cálculo'],
  ['simply enter your data values and the calculator instantly computes',
   'Simplemente ingrese sus datos y la calculadora calcula instantáneamente'],
  ['it handles any number of data points and provides accurate results',
   'Maneja cualquier cantidad de datos y proporciona resultados precisos'],
  ['whether you are a student analyzing experiment results',
   'Ya sea que sea un estudiante analizando resultados de experimentos'],
  ['bookmark it for fast access whenever you need',
   'Guárdelo en marcadores para acceso rápido cuando necesite'],
  ['save time on calculations, reduce material waste, and plan',
   'Ahorre tiempo en cálculos, reduzca desperdicios y planifique'],
  ['perfect for students tracking their academic performance',
   'Perfecto para estudiantes que siguen su rendimiento académico'],

  // Use-case phrases
  ['use the {st} to', 'Use {st} para'],
  ['use the {st}', 'Use {st}'],
  ['calculate', 'calcular'],
  ['compare', 'comparar'],
  ['determine', 'determinar'],
  ['estimate', 'estimar'],
  ['plan', 'planificar'],
  ['evaluate', 'evaluar'],
  ['analyze', 'analizar'],
  ['track', 'rastrear'],
  ['find', 'encontrar'],

  // Tips phrases
  ['always', 'siempre'],
  ['consider', 'considere'],
  ['remember', 'recuerde'],
  ['ensure', 'asegúrese'],
  ['keep', 'mantenga'],
  ['use', 'use'],
  ['experiment with', 'experimente con'],
  ['double-check', 'verifique dos veces'],
  ['save', 'guarde'],
  ['update', 'actualice'],
  ['check', 'verifique'],
  ['explore', 'explore'],
  ['add', 'agregue'],
])

// ─── Build full word dictionary ───
// Separated into common + domain parts for clarity.
const COMMON_WORDS_ES = [
  // articles/determiners
  ['the', 'el'], ['The', 'El'], ['a', 'un'], ['A', 'Un'], ['an', 'un'],
  ['your', 'su'], ['Your', 'Su'], ['my', 'mi'], ['our', 'nuestro'],
  ['its', 'su'], ['this', 'este'], ['that', 'ese'], ['each', 'cada'],
  ['every', 'cada'], ['all', 'todos'], ['some', 'algunos'],
  ['many', 'muchos'], ['much', 'mucho'], ['more', 'más'], ['most', 'más'],
  ['other', 'otro'], ['another', 'otro'], ['any', 'cualquier'],

  // prepositions/conjunctions
  ['and', 'y'], ['or', 'o'], ['but', 'pero'], ['for', 'para'],
  ['with', 'con'], ['without', 'sin'], ['by', 'por'], ['from', 'de'],
  ['to', 'a'], ['in', 'en'], ['on', 'en'], ['at', 'en'], ['of', 'de'],
  ['as', 'como'], ['than', 'que'], ['if', 'si'], ['then', 'entonces'],
  ['when', 'cuando'], ['while', 'mientras'], ['so', 'así que'],
  ['because', 'porque'], ['since', 'desde'], ['until', 'hasta'],
  ['although', 'aunque'], ['however', 'sin embargo'],
  ['well', 'bien'], ['also', 'también'], ['too', 'también'],
  ['just', 'solo'], ['only', 'solo'], ['even', 'incluso'],
  ['still', 'aún'], ['already', 'ya'],

  // verbs (3rd person / base)
  ['is', 'es'], ['are', 'son'], ['was', 'era'], ['be', 'ser'],
  ['been', 'sido'], ['have', 'tener'], ['has', 'tiene'],
  ['had', 'tenía'], ['do', 'hacer'], ['does', 'hace'],
  ['can', 'puede'], ['could', 'podría'], ['will', 'podrá'],
  ['would', 'haría'], ['should', 'debería'], ['may', 'puede'],
  ['might', 'podría'], ['must', 'debe'], ['not', 'no'], ['no', 'no'],
  ['helps', 'ayuda'], ['help', 'ayudar'], ['make', 'hacer'],
  ['makes', 'hace'], ['use', 'usar'], ['uses', 'usa'],
  ['using', 'usando'], ['used', 'usado'], ['provide', 'proporcionar'],
  ['provides', 'proporciona'], ['get', 'obtener'], ['gets', 'obtiene'],
  ['need', 'necesitar'], ['needs', 'necesita'], ['want', 'querer'],
  ['wants', 'quiere'], ['take', 'tomar'], ['takes', 'toma'],
  ['give', 'dar'], ['gives', 'da'], ['find', 'encontrar'],
  ['finds', 'encuentra'], ['know', 'saber'], ['knows', 'sabe'],
  ['see', 'ver'], ['sees', 've'], ['look', 'mirar'],
  ['show', 'mostrar'], ['shows', 'muestra'], ['tell', 'decir'],
  ['work', 'funcionar'], ['works', 'funciona'],
  ['start', 'comenzar'], ['starts', 'comienza'],
  ['enter', 'ingresar'], ['enters', 'ingresa'],
  ['enter your', 'ingrese sus'],
  ['select', 'seleccionar'], ['choose', 'elegir'],
  ['add', 'agregar'], ['remove', 'eliminar'],
  ['save', 'guardar'], ['share', 'compartir'],
  ['print', 'imprimir'], ['copy', 'copiar'],
  ['adjust', 'ajustar'], ['change', 'cambiar'],
  ['update', 'actualizar'], ['reset', 'restablecer'],
  ['clear', 'limpiar'], ['search', 'buscar'],
  ['review', 'revisar'], ['check', 'verificar'],
  ['confirm', 'confirmar'], ['continue', 'continuar'],
  ['complete', 'completar'], ['compare', 'comparar'],
  ['calculate', 'calcular'], ['set', 'establecer'],
  ['plan', 'planificar'], ['track', 'rastrear'],

  // adverbs
  ['quickly', 'rápidamente'], ['instantly', 'instantáneamente'],
  ['automatically', 'automáticamente'], ['accurately', 'con precisión'],
  ['easily', 'fácilmente'], ['simply', 'simplemente'],
  ['directly', 'directamente'], ['effectively', 'efectivamente'],
  ['efficiently', 'eficientemente'], ['correctly', 'correctamente'],
  ['properly', 'adecuadamente'], ['typically', 'generalmente'],
  ['usually', 'generalmente'], ['often', 'a menudo'],
  ['frequently', 'frecuentemente'], ['commonly', 'comúnmente'],
  ['generally', 'generalmente'], ['approximately', 'aproximadamente'],
  ['roughly', 'aproximadamente'], ['exactly', 'exactamente'],
  ['potentially', 'potencialmente'], ['significantly', 'significativamente'],

  // adjectives (common)
  ['free', 'gratuita'], ['online', 'en línea'],
  ['accurate', 'preciso'], ['precise', 'preciso'],
  ['instant', 'instantáneo'], ['quick', 'rápido'],
  ['fast', 'rápido'], ['slow', 'lento'],
  ['easy', 'fácil'], ['simple', 'simple'],
  ['hard', 'difícil'], ['difficult', 'difícil'],
  ['new', 'nuevo'], ['old', 'viejo'],
  ['good', 'bueno'], ['better', 'mejor'], ['best', 'mejor'],
  ['great', 'excelente'], ['important', 'importante'],
  ['necessary', 'necesario'], ['possible', 'posible'],
  ['different', 'diferente'], ['same', 'mismo'],
  ['common', 'común'], ['simple', 'simple'],
  ['complex', 'complejo'], ['basic', 'básico'],
  ['advanced', 'avanzado'], ['special', 'especial'],
  ['standard', 'estándar'], ['normal', 'normal'],
  ['useful', 'útil'], ['helpful', 'útil'],
  ['available', 'disponible'], ['reasonable', 'razonable'],
  ['additional', 'adicional'], ['extra', 'extra'],
  ['multiple', 'múltiple'], ['single', 'único'],
  ['individual', 'individual'], ['total', 'total'],
  ['partial', 'parcial'], ['full', 'completo'],
  ['real', 'real'], ['actual', 'real'],
  ['true', 'verdadero'], ['correct', 'correcto'],
  ['specific', 'específico'], ['general', 'general'],
  ['popular', 'popular'],

  // domain nouns
  ['calculator', 'calculadora'], ['calculators', 'calculadoras'],
  ['tool', 'herramienta'], ['tools', 'herramientas'],
  ['value', 'valor'], ['values', 'valores'],
  ['amount', 'cantidad'], ['number', 'número'],
  ['numbers', 'números'], ['result', 'resultado'],
  ['results', 'resultados'], ['data', 'datos'],
  ['input', 'entrada'], ['inputs', 'entradas'],
  ['output', 'salida'], ['outputs', 'salidas'],
  ['unit', 'unidad'], ['units', 'unidades'],
  ['conversion', 'conversión'], ['formula', 'fórmula'],
  ['formulas', 'fórmulas'], ['equation', 'ecuación'],
  ['equations', 'ecuaciones'], ['function', 'función'],
  ['functions', 'funciones'], ['method', 'método'],
  ['methods', 'métodos'], ['process', 'proceso'],
  ['processes', 'procesos'], ['system', 'sistema'],
  ['systems', 'sistemas'], ['model', 'modelo'],
  ['models', 'modelos'], ['factor', 'factor'],
  ['factors', 'factores'], ['percentage', 'porcentaje'],
  ['percent', 'por ciento'], ['rate', 'tasa'],
  ['rates', 'tasas'], ['ratio', 'relación'],

  // financial
  ['financial', 'financiero'], ['loan', 'préstamo'],
  ['loans', 'préstamos'], ['mortgage', 'hipoteca'],
  ['interest', 'interés'], ['payment', 'pago'],
  ['payments', 'pagos'], ['monthly', 'mensual'],
  ['annual', 'anual'], ['yearly', 'anual'],
  ['principal', 'capital'], ['balance', 'saldo'],
  ['debt', 'deuda'], ['credit', 'crédito'],
  ['score', 'puntuación'], ['investment', 'inversión'],
  ['investments', 'inversiones'], ['retirement', 'jubilación'],
  ['savings', 'ahorros'], ['saving', 'ahorro'],
  ['budget', 'presupuesto'], ['income', 'ingresos'],
  ['expense', 'gasto'], ['expenses', 'gastos'],
  ['cost', 'costo'], ['costs', 'costos'],
  ['price', 'precio'], ['prices', 'precios'],
  ['tax', 'impuesto'], ['taxes', 'impuestos'],
  ['return', 'rendimiento'], ['returns', 'rendimientos'],
  ['profit', 'ganancia'], ['profits', 'ganancias'],
  ['margin', 'margen'], ['revenue', 'ingresos'],
  ['asset', 'activo'], ['assets', 'activos'],
  ['equity', 'capital'], ['wealth', 'riqueza'],
  ['fund', 'fondo'], ['funds', 'fondos'],
  ['contribution', 'contribución'], ['deposit', 'depósito'],
  ['withdrawal', 'retiro'], ['dividend', 'dividendo'],
  ['dividends', 'dividendos'], ['stock', 'acción'],
  ['stocks', 'acciones'], ['bond', 'bono'],
  ['bonds', 'bonos'], ['portfolio', 'cartera'],
  ['inflation', 'inflación'], ['amortization', 'amortización'],

  // health
  ['health', 'salud'], ['medical', 'médico'],
  ['weight', 'peso'], ['height', 'altura'],
  ['age', 'edad'], ['gender', 'género'],
  ['blood', 'sangre'], ['pressure', 'presión'],
  ['heart', 'cardíaco'], ['calories', 'calorías'],
  ['calorie', 'caloría'], ['diet', 'dieta'],
  ['nutrition', 'nutrición'], ['exercise', 'ejercicio'],
  ['fitness', 'condición física'], ['activity', 'actividad'],
  ['active', 'activo'], ['protein', 'proteína'],
  ['carbohydrate', 'carbohidrato'], ['fat', 'grasa'],
  ['fiber', 'fibra'], ['vitamin', 'vitamina'],
  ['sleep', 'sueño'], ['water', 'agua'],
  ['pregnancy', 'embarazo'], ['ovulation', 'ovulación'],

  // math/statistics
  ['math', 'matemáticas'], ['mathematical', 'matemático'],
  ['algebra', 'álgebra'], ['geometry', 'geometría'],
  ['calculus', 'cálculo'], ['statistics', 'estadísticas'],
  ['statistical', 'estadístico'], ['probability', 'probabilidad'],
  ['fraction', 'fracción'], ['fractions', 'fracciones'],
  ['decimal', 'decimal'], ['decimals', 'decimales'],
  ['variable', 'variable'], ['variables', 'variables'],
  ['graph', 'gráfico'], ['mean', 'media'],
  ['median', 'mediana'], ['mode', 'moda'],
  ['range', 'rango'], ['variance', 'varianza'],
  ['correlation', 'correlación'], ['regression', 'regresión'],
  ['distribution', 'distribución'],

  // time/date
  ['date', 'fecha'], ['dates', 'fechas'], ['time', 'tiempo'],
  ['times', 'veces'], ['day', 'día'], ['days', 'días'],
  ['week', 'semana'], ['weeks', 'semanas'], ['month', 'mes'],
  ['months', 'meses'], ['year', 'año'], ['years', 'años'],
  ['hour', 'hora'], ['hours', 'horas'], ['minute', 'minuto'],
  ['minutes', 'minutos'], ['second', 'segundo'],
  ['duration', 'duración'], ['period', 'período'],
  ['schedule', 'horario'], ['calendar', 'calendario'],

  // education
  ['education', 'educación'], ['educational', 'educativo'],
  ['grade', 'calificación'], ['grades', 'calificaciones'],
  ['exam', 'examen'], ['exams', 'exámenes'], ['test', 'prueba'],
  ['tests', 'pruebas'], ['course', 'curso'], ['courses', 'cursos'],
  ['class', 'clase'], ['classes', 'clases'],
  ['semester', 'semestre'], ['assignment', 'tarea'],
  ['assignments', 'tareas'],

  // construction
  ['construction', 'construcción'], ['building', 'edificación'],
  ['material', 'material'], ['materials', 'materiales'],
  ['concrete', 'concreto'], ['wood', 'madera'],
  ['steel', 'acero'], ['area', 'área'], ['volume', 'volumen'],
  ['length', 'longitud'], ['width', 'ancho'],
  ['height', 'altura'], ['depth', 'profundidad'],

  // conversion
  ['converter', 'convertidor'], ['convert', 'convertir'],
  ['temperature', 'temperatura'], ['celsius', 'celsius'],
  ['fahrenheit', 'fahrenheit'], ['kelvin', 'kelvin'],
  ['inches', 'pulgadas'], ['centimeters', 'centímetros'],
  ['meters', 'metros'], ['feet', 'pies'], ['miles', 'millas'],
  ['kilometers', 'kilómetros'], ['pounds', 'libras'],
  ['kilograms', 'kilogramos'], ['gallons', 'galones'],
  ['liters', 'litros'], ['ounces', 'onzas'], ['grams', 'gramos'],

  // question words
  ['What', '¿Qué'], ['what', 'qué'], ['How', '¿Cómo'], ['how', 'cómo'],
  ['Why', '¿Por qué'], ['why', 'por qué'], ['When', '¿Cuándo'],
  ['when', 'cuándo'], ['Where', '¿Dónde'], ['where', 'dónde'],
  ['Which', '¿Cuál'], ['which', 'cuál'], ['Who', '¿Quién'],
  ['who', 'quién'], ['Is', '¿Es'], ['Can', '¿Se puede'],
  ['Do', '¿'], ['Does', '¿'],

  // misc
  ['your', 'su'], ['my', 'mi'], ['our', 'nuestro'],
  ['you', 'usted'], ['yourself', 'usted mismo'],
  ['people', 'personas'], ['person', 'persona'],
  ['user', 'usuario'], ['users', 'usuarios'],
  ['beginner', 'principiante'], ['beginners', 'principiantes'],
  ['professional', 'profesional'], ['professionals', 'profesionales'],
  ['student', 'estudiante'], ['students', 'estudiantes'],
  ['teacher', 'profesor'], ['teachers', 'profesores'],
  ['homeowner', 'propietario'], ['homeowners', 'propietarios'],
  ['customer', 'cliente'], ['customers', 'clientes'],
  ['lender', 'prestamista'], ['lenders', 'prestamistas'],
  ['investor', 'inversionista'], ['investors', 'inversionistas'],
  ['scenario', 'escenario'], ['scenarios', 'escenarios'],
  ['option', 'opción'], ['options', 'opciones'],
  ['feature', 'característica'], ['features', 'características'],
  ['account', 'cuenta'], ['premium', 'premium'],
  ['free', 'gratuito'], ['basic', 'básico'],
  ['step', 'paso'], ['steps', 'pasos'],
  ['guide', 'guía'], ['example', 'ejemplo'],
  ['tip', 'consejo'], ['tips', 'consejos'],
  ['question', 'pregunta'], ['questions', 'preguntas'],
  ['answer', 'respuesta'], ['answers', 'respuestas'],
  ['section', 'sección'], ['sections', 'secciones'],
  ['page', 'página'], ['pages', 'páginas'],
  ['website', 'sitio web'], ['site', 'sitio'],
  ['phone', 'teléfono'], ['mobile', 'móvil'],
  ['desktop', 'escritorio'], ['tablet', 'tableta'],
  ['screen', 'pantalla'], ['device', 'dispositivo'],
  ['devices', 'dispositivos'], ['browser', 'navegador'],
  ['keyboard', 'teclado'], ['click', 'clic'],
  ['tap', 'toque'], ['touch', 'toque'],
]

// Build the full es dict: phrase map + word map
function buildDict(locale) {
  const d = new Map()
  // Copy phrase map
  if (PHRASE[locale]) {
    for (const [k, v] of PHRASE[locale]) {
      d.set(k.toLowerCase(), v)
    }
  }
  // Add word-level entries
  const wordMapName = `COMMON_WORDS_${locale.toUpperCase()}`
  const words = globalThis[wordMapName] || []
  for (const [k, v] of words) {
    d.set(k.toLowerCase(), v)
  }
  return d
}

// Actually, let's do it properly:
function buildLocaleDict(locale) {
  const d = new Map()
  if (PHRASE[locale]) {
    for (const [k, v] of PHRASE[locale]) d.set(k.toLowerCase(), v)
  }
  return d
}

// We'll build entries directly
const LOCALE_DICT = {}

// ES
LOCALE_DICT.es = buildLocaleDict('es')
for (const [k, v] of COMMON_WORDS_ES) LOCALE_DICT.es.set(k.toLowerCase(), v)

// ─── FRENCH ──────────────────────────────
PHRASE.fr = new Map([
  ['complete guide to the', 'Guide complet de'],
  ['on this page', 'Sur cette page'],
  ['min read', 'min de lecture'],
  ['was this guide helpful?', 'Ce guide vous a-t-il été utile ?'],
  ['was this helpful?', 'Cela a-t-il été utile ?'],
  ['what is the', 'Qu\'est-ce que'],
  ['how to use', 'Comment utiliser'],
  ['the formula behind the calculation', 'La formule derrière le calcul'],
  ['example calculation', 'Exemple de calcul'],
  ['common use cases', 'Cas d\'utilisation courants'],
  ['tips for best results', 'Conseils pour de meilleurs résultats'],
  ['related calculators', 'Calculatrices connexes'],
  ['frequently asked questions', 'Questions fréquemment posées'],
  ['in this article', 'Dans cet article'],
  ['the {title} is a free online tool designed to instantly convert values',
   '{title} est un outil en ligne gratuit conçu pour convertir instantanément des valeurs'],
  ['the {title} is a powerful free tool that helps you',
   '{title} est un outil gratuit puissant qui vous aide à'],
  ['using the {title} is straightforward',
   'Utiliser {title} est simple'],
  ['the formula used by the {title} is:',
   'La formule utilisée par {title} est :'],
  ['what is the {title} used for?',
   'À quoi sert {title} ?'],
  ['is the {title} free to use?',
   '{title} est-elle gratuite ?'],
  ['yes, the {title} is completely free to use with no limits',
   'Oui, {title} est entièrement gratuite sans limites'],
  ['the {st} uses validated formulas that follow industry standards',
   '{st} utilise des formules validées conformes aux normes de l\'industrie'],
])

const COMMON_WORDS_FR = [
  ['the', 'le'], ['The', 'Le'], ['a', 'un'], ['A', 'Un'], ['an', 'un'],
  ['your', 'votre'], ['Your', 'Votre'], ['our', 'notre'],
  ['this', 'ce'], ['that', 'ce'], ['these', 'ces'], ['those', 'ces'],
  ['each', 'chaque'], ['every', 'chaque'], ['all', 'tous'],
  ['some', 'certains'], ['many', 'nombreux'], ['much', 'beaucoup'],
  ['more', 'plus'], ['most', 'plus'], ['other', 'autre'],
  ['another', 'autre'], ['any', 'tout'],
  ['and', 'et'], ['or', 'ou'], ['but', 'mais'], ['for', 'pour'],
  ['with', 'avec'], ['without', 'sans'], ['by', 'par'],
  ['from', 'de'], ['to', 'à'], ['in', 'dans'], ['on', 'sur'],
  ['at', 'à'], ['of', 'de'], ['as', 'comme'], ['than', 'que'],
  ['if', 'si'], ['when', 'quand'], ['while', 'tandis que'],
  ['so', 'donc'], ['because', 'parce que'], ['since', 'depuis'],
  ['until', 'jusqu\'à'], ['although', 'bien que'],
  ['however', 'cependant'], ['also', 'aussi'], ['too', 'aussi'],
  ['only', 'seulement'], ['even', 'même'], ['still', 'encore'],
  ['is', 'est'], ['are', 'sont'], ['was', 'était'], ['be', 'être'],
  ['been', 'été'], ['have', 'avoir'], ['has', 'a'],
  ['can', 'peut'], ['could', 'pourrait'], ['will', 'va'],
  ['would', 'ferait'], ['should', 'devrait'], ['may', 'peut'],
  ['must', 'doit'], ['not', 'pas'], ['no', 'non'],
  ['help', 'aider'], ['helps', 'aide'], ['use', 'utiliser'],
  ['uses', 'utilise'], ['using', 'utilisant'], ['used', 'utilisé'],
  ['provide', 'fournir'], ['provides', 'fournit'],
  ['calculate', 'calculer'], ['set', 'définir'],
  ['enter', 'saisir'], ['select', 'sélectionner'],
  ['choose', 'choisir'], ['add', 'ajouter'],
  ['save', 'sauvegarder'], ['share', 'partager'],
  ['print', 'imprimer'], ['copy', 'copier'],
  ['compare', 'comparer'], ['adjust', 'ajuster'],
  ['change', 'modifier'], ['update', 'mettre à jour'],
  ['check', 'vérifier'], ['find', 'trouver'],
  ['show', 'afficher'], ['view', 'voir'],
  ['free', 'gratuit'], ['online', 'en ligne'],
  ['calculator', 'calculatrice'], ['calculators', 'calculatrices'],
  ['tool', 'outil'], ['tools', 'outils'],
  ['value', 'valeur'], ['values', 'valeurs'],
  ['result', 'résultat'], ['results', 'résultats'],
  ['input', 'entrée'], ['inputs', 'entrées'],
  ['output', 'sortie'], ['outputs', 'sorties'],
  ['data', 'données'], ['unit', 'unité'], ['units', 'unités'],
  ['formula', 'formule'], ['formulas', 'formules'],
  ['accurate', 'précis'], ['precise', 'précis'],
  ['quick', 'rapide'], ['fast', 'rapide'],
  ['easy', 'facile'], ['simple', 'simple'],
  ['good', 'bon'], ['better', 'meilleur'], ['best', 'meilleur'],
  ['financial', 'financier'], ['loan', 'prêt'], ['loans', 'prêts'],
  ['mortgage', 'hypothèque'], ['interest', 'intérêt'],
  ['payment', 'paiement'], ['payments', 'paiements'],
  ['monthly', 'mensuel'], ['annual', 'annuel'],
  ['debt', 'dette'], ['credit', 'crédit'],
  ['investment', 'investissement'], ['retirement', 'retraite'],
  ['savings', 'épargne'], ['budget', 'budget'],
  ['income', 'revenu'], ['expense', 'dépense'],
  ['cost', 'coût'], ['costs', 'coûts'],
  ['tax', 'impôt'], ['taxes', 'impôts'],
  ['return', 'rendement'], ['profit', 'profit'],
  ['health', 'santé'], ['weight', 'poids'], ['height', 'taille'],
  ['age', 'âge'], ['calories', 'calories'],
  ['diet', 'régime'], ['exercise', 'exercice'],
  ['day', 'jour'], ['days', 'jours'],
  ['week', 'semaine'], ['weeks', 'semaines'],
  ['month', 'mois'], ['months', 'mois'],
  ['year', 'an'], ['years', 'ans'],
  ['time', 'temps'], ['date', 'date'],
  ['hour', 'heure'], ['hours', 'heures'],
  ['What', 'Qu\'est-ce que'], ['what', 'quoi'],
  ['How', 'Comment'], ['how', 'comment'],
  ['Why', 'Pourquoi'], ['why', 'pourquoi'],
]

LOCALE_DICT.fr = buildLocaleDict('fr')
for (const [k, v] of COMMON_WORDS_FR) LOCALE_DICT.fr.set(k.toLowerCase(), v)

// ─── GERMAN ──────────────────────────────
PHRASE.de = new Map([
  ['complete guide to the', 'Vollständiger Leitfaden für'],
  ['on this page', 'Auf dieser Seite'],
  ['min read', 'Min. Lesezeit'],
  ['was this guide helpful?', 'War dieser Leitfaden hilfreich?'],
  ['was this helpful?', 'War das hilfreich?'],
  ['what is the', 'Was ist'],
  ['how to use', 'Wie verwende ich'],
  ['the formula behind the calculation', 'Die Formel hinter der Berechnung'],
  ['example calculation', 'Beispielrechnung'],
  ['common use cases', 'Häufige Anwendungsfälle'],
  ['tips for best results', 'Tipps für beste Ergebnisse'],
  ['related calculators', 'Verwandte Rechner'],
  ['frequently asked questions', 'Häufig gestellte Fragen'],
  ['in this article', 'In diesem Artikel'],
  ['using the {title} is straightforward',
   'Die Verwendung von {title} ist unkompliziert'],
  ['the formula used by the {title} is:',
   'Die von {title} verwendete Formel lautet:'],
  ['what is the {title} used for?',
   'Wofür wird {title} verwendet?'],
  ['is the {title} free to use?',
   'Ist {title} kostenlos?'],
])

const COMMON_WORDS_DE = [
  ['the', 'der'], ['The', 'Der'], ['a', 'ein'], ['A', 'Ein'],
  ['your', 'Ihr'], ['Your', 'Ihr'], ['our', 'unser'],
  ['this', 'dieser'], ['that', 'jener'],
  ['and', 'und'], ['or', 'oder'], ['but', 'aber'],
  ['for', 'für'], ['with', 'mit'], ['without', 'ohne'],
  ['by', 'von'], ['from', 'aus'], ['to', 'zu'],
  ['in', 'in'], ['on', 'auf'], ['at', 'bei'], ['of', 'von'],
  ['as', 'als'], ['if', 'wenn'], ['when', 'wenn'],
  ['so', 'also'], ['because', 'weil'], ['not', 'nicht'],
  ['is', 'ist'], ['are', 'sind'], ['was', 'war'],
  ['be', 'sein'], ['have', 'haben'], ['has', 'hat'],
  ['can', 'kann'], ['could', 'könnte'], ['will', 'wird'],
  ['would', 'würde'], ['should', 'sollte'], ['may', 'kann'],
  ['must', 'muss'], ['no', 'nein'],
  ['use', 'verwenden'], ['uses', 'verwendet'],
  ['using', 'mit'], ['used', 'verwendet'],
  ['provide', 'bereitstellen'], ['provides', 'bietet'],
  ['calculate', 'berechnen'], ['set', 'einstellen'],
  ['enter', 'eingeben'], ['select', 'auswählen'],
  ['choose', 'wählen'], ['add', 'hinzufügen'],
  ['save', 'speichern'], ['share', 'teilen'],
  ['compare', 'vergleichen'], ['adjust', 'anpassen'],
  ['find', 'finden'], ['show', 'anzeigen'],
  ['free', 'kostenlos'], ['online', 'online'],
  ['calculator', 'Rechner'], ['calculators', 'Rechner'],
  ['tool', 'Werkzeug'], ['tools', 'Werkzeuge'],
  ['value', 'Wert'], ['values', 'Werte'],
  ['result', 'Ergebnis'], ['results', 'Ergebnisse'],
  ['input', 'Eingabe'], ['inputs', 'Eingaben'],
  ['data', 'Daten'], ['unit', 'Einheit'], ['units', 'Einheiten'],
  ['formula', 'Formel'], ['accurate', 'genau'],
  ['quick', 'schnell'], ['fast', 'schnell'],
  ['easy', 'einfach'], ['simple', 'einfach'],
  ['good', 'gut'], ['better', 'besser'], ['best', 'beste'],
  ['financial', 'Finanz-'], ['loan', 'Darlehen'],
  ['mortgage', 'Hypothek'], ['interest', 'Zinsen'],
  ['payment', 'Zahlung'], ['monthly', 'monatlich'],
  ['annual', 'jährlich'], ['debt', 'Schulden'],
  ['credit', 'Kredit'], ['investment', 'Investition'],
  ['retirement', 'Ruhestand'], ['savings', 'Ersparnisse'],
  ['budget', 'Budget'], ['income', 'Einkommen'],
  ['expense', 'Ausgabe'], ['cost', 'Kosten'],
  ['tax', 'Steuer'], ['taxes', 'Steuern'],
  ['health', 'Gesundheit'], ['weight', 'Gewicht'],
  ['height', 'Größe'], ['age', 'Alter'],
  ['day', 'Tag'], ['days', 'Tage'],
  ['week', 'Woche'], ['weeks', 'Wochen'],
  ['month', 'Monat'], ['year', 'Jahr'],
  ['years', 'Jahre'], ['time', 'Zeit'],
  ['What', 'Was'], ['How', 'Wie'],
]

LOCALE_DICT.de = buildLocaleDict('de')
for (const [k, v] of COMMON_WORDS_DE) LOCALE_DICT.de.set(k.toLowerCase(), v)

// ─── PORTUGUESE ──────────────────────────
PHRASE.pt = new Map([
  ['complete guide to the', 'Guia completo de'],
  ['on this page', 'Nesta página'],
  ['min read', 'min de leitura'],
  ['was this guide helpful?', 'Este guia foi útil?'],
  ['what is the', 'O que é'],
  ['how to use', 'Como usar'],
  ['the formula behind the calculation', 'A fórmula por trás do cálculo'],
  ['example calculation', 'Exemplo de cálculo'],
  ['common use cases', 'Casos de uso comuns'],
  ['tips for best results', 'Dicas para melhores resultados'],
  ['related calculators', 'Calculadoras relacionadas'],
  ['frequently asked questions', 'Perguntas frequentes'],
  ['what is the {title} used for?',
   'Para que serve {title}?'],
  ['is the {title} free to use?',
   '{title} é gratuita?'],
  ['using the {title} is straightforward',
   'Usar {title} é simples'],
])

const COMMON_WORDS_PT = [
  ['the', 'o'], ['The', 'O'], ['a', 'um'], ['A', 'Um'],
  ['your', 'seu'], ['Your', 'Seu'], ['our', 'nosso'],
  ['this', 'este'], ['that', 'esse'],
  ['and', 'e'], ['or', 'ou'], ['but', 'mas'],
  ['for', 'para'], ['with', 'com'], ['without', 'sem'],
  ['by', 'por'], ['from', 'de'], ['to', 'para'],
  ['in', 'em'], ['on', 'em'], ['at', 'em'], ['of', 'de'],
  ['as', 'como'], ['if', 'se'], ['when', 'quando'],
  ['so', 'então'], ['because', 'porque'], ['not', 'não'],
  ['is', 'é'], ['are', 'são'], ['was', 'era'],
  ['be', 'ser'], ['have', 'ter'], ['has', 'tem'],
  ['can', 'pode'], ['could', 'poderia'], ['will', 'vai'],
  ['would', 'faria'], ['should', 'deveria'], ['must', 'deve'],
  ['use', 'usar'], ['uses', 'usa'], ['using', 'usando'],
  ['used', 'usado'], ['provide', 'fornecer'],
  ['provides', 'fornece'], ['calculate', 'calcular'],
  ['enter', 'inserir'], ['select', 'selecionar'],
  ['choose', 'escolher'], ['add', 'adicionar'],
  ['save', 'salvar'], ['share', 'compartilhar'],
  ['compare', 'comparar'], ['find', 'encontrar'],
  ['free', 'gratuito'], ['online', 'online'],
  ['calculator', 'calculadora'], ['calculators', 'calculadoras'],
  ['tool', 'ferramenta'], ['value', 'valor'],
  ['values', 'valores'], ['result', 'resultado'],
  ['results', 'resultados'], ['input', 'entrada'],
  ['inputs', 'entradas'], ['data', 'dados'],
  ['unit', 'unidade'], ['units', 'unidades'],
  ['formula', 'fórmula'], ['accurate', 'preciso'],
  ['quick', 'rápido'], ['fast', 'rápido'],
  ['easy', 'fácil'], ['simple', 'simples'],
  ['financial', 'financeiro'], ['loan', 'empréstimo'],
  ['mortgage', 'hipoteca'], ['interest', 'juros'],
  ['payment', 'pagamento'], ['monthly', 'mensal'],
  ['annual', 'anual'], ['debt', 'dívida'],
  ['credit', 'crédito'], ['investment', 'investimento'],
  ['retirement', 'aposentadoria'], ['savings', 'poupança'],
  ['budget', 'orçamento'], ['income', 'renda'],
  ['expense', 'despesa'], ['cost', 'custo'],
  ['health', 'saúde'], ['weight', 'peso'],
  ['height', 'altura'], ['age', 'idade'],
  ['day', 'dia'], ['days', 'dias'],
  ['month', 'mês'], ['months', 'meses'],
  ['year', 'ano'], ['years', 'anos'],
  ['time', 'tempo'], ['date', 'data'],
  ['What', 'O que'], ['How', 'Como'],
]

LOCALE_DICT.pt = buildLocaleDict('pt')
for (const [k, v] of COMMON_WORDS_PT) LOCALE_DICT.pt.set(k.toLowerCase(), v)

// ─── RUSSIAN ──────────────────────────────
// Simplified: key terms only, word-level
PHRASE.ru = new Map([
  ['complete guide to the', 'Полное руководство по'],
  ['on this page', 'На этой странице'],
  ['min read', 'мин. чтения'],
  ['was this guide helpful?', 'Был ли этот гид полезным?'],
  ['what is the', 'Что такое'],
  ['how to use', 'Как использовать'],
  ['frequently asked questions', 'Часто задаваемые вопросы'],
  ['related calculators', 'Похожие калькуляторы'],
  ['tips for best results', 'Советы для лучших результатов'],
  ['example calculation', 'Пример расчета'],
  ['free online tool', 'бесплатный онлайн-инструмент'],
  ['online', 'онлайн'],
])

const COMMON_WORDS_RU = [
  ['the', ''], ['a', ''], ['an', ''],
  ['calculator', 'калькулятор'], ['calculators', 'калькуляторы'],
  ['tool', 'инструмент'], ['free', 'бесплатный'],
  ['online', 'онлайн'], ['value', 'значение'],
  ['values', 'значения'], ['result', 'результат'],
  ['results', 'результаты'], ['input', 'ввод'],
  ['inputs', 'вводы'], ['data', 'данные'],
  ['unit', 'единица'], ['units', 'единицы'],
  ['formula', 'формула'], ['accurate', 'точный'],
  ['quick', 'быстрый'], ['simple', 'простой'],
  ['easy', 'легкий'], ['financial', 'финансовый'],
  ['loan', 'кредит'], ['mortgage', 'ипотека'],
  ['interest', 'процент'], ['payment', 'платеж'],
  ['monthly', 'ежемесячный'], ['annual', 'годовой'],
  ['debt', 'долг'], ['savings', 'сбережения'],
  ['budget', 'бюджет'], ['income', 'доход'],
  ['cost', 'стоимость'], ['health', 'здоровье'],
  ['weight', 'вес'], ['height', 'рост'],
  ['age', 'возраст'], ['day', 'день'], ['days', 'дни'],
  ['month', 'месяц'], ['year', 'год'], ['years', 'годы'],
  ['time', 'время'], ['date', 'дата'],
  ['and', 'и'], ['or', 'или'], ['for', 'для'],
  ['with', 'с'], ['in', 'в'], ['on', 'на'], ['of', ''],
  ['to', ''], ['is', ''], ['are', ''],
  ['How', 'Как'], ['how', 'как'], ['What', 'Что'], ['what', 'что'],
  ['your', ''], ['You', 'Вы'], ['you', 'вы'],
]

LOCALE_DICT.ru = buildLocaleDict('ru')
for (const [k, v] of COMMON_WORDS_RU) LOCALE_DICT.ru.set(k.toLowerCase(), v)

// ─── ARABIC ──────────────────────────────
// Simplified: key terms only
PHRASE.ar = new Map([
  ['complete guide to the', 'الدليل الكامل لـ'],
  ['on this page', 'في هذه الصفحة'],
  ['min read', 'دقيقة قراءة'],
  ['what is the', 'ما هو'],
  ['how to use', 'كيفية الاستخدام'],
  ['frequently asked questions', 'الأسئلة الشائعة'],
  ['related calculators', 'الآلات الحاسبة ذات الصلة'],
  ['tips for best results', 'نصائح لأفضل النتائج'],
  ['free online tool', 'أداة مجانية عبر الإنترنت'],
])

const COMMON_WORDS_AR = [
  ['calculator', 'آلة حاسبة'], ['calculators', 'آلات حاسبة'],
  ['tool', 'أداة'], ['free', 'مجاني'],
  ['online', 'عبر الإنترنت'], ['value', 'قيمة'],
  ['result', 'نتيجة'], ['results', 'نتائج'],
  ['input', 'إدخال'], ['data', 'بيانات'],
  ['formula', 'صيغة'], ['financial', 'مالي'],
  ['loan', 'قرض'], ['interest', 'فائدة'],
  ['payment', 'دفعة'], ['monthly', 'شهري'],
  ['annual', 'سنوي'], ['health', 'صحة'],
  ['weight', 'وزن'], ['height', 'طول'],
  ['age', 'عمر'], ['day', 'يوم'], ['days', 'أيام'],
  ['month', 'شهر'], ['year', 'سنة'], ['time', 'وقت'],
  ['How', 'كيف'], ['What', 'ماذا'],
  ['and', 'و'], ['or', 'أو'], ['for', 'لـ'],
]

LOCALE_DICT.ar = buildLocaleDict('ar')
for (const [k, v] of COMMON_WORDS_AR) LOCALE_DICT.ar.set(k.toLowerCase(), v)

// ─── HINDI ──────────────────────────────
PHRASE.hi = new Map([
  ['complete guide to the', 'का संपूर्ण गाइड'],
  ['on this page', 'इस पृष्ठ पर'],
  ['min read', 'मिनट पढ़ें'],
  ['what is the', 'क्या है'],
  ['how to use', 'का उपयोग कैसे करें'],
  ['frequently asked questions', 'अक्सर पूछे जाने वाले प्रश्न'],
])

const COMMON_WORDS_HI = [
  ['calculator', 'कैलकुलेटर'], ['calculators', 'कैलकुलेटर'],
  ['tool', 'उपकरण'], ['free', 'मुफ्त'],
  ['online', 'ऑनलाइन'], ['value', 'मान'],
  ['result', 'परिणाम'], ['results', 'परिणाम'],
  ['input', 'इनपुट'], ['formula', 'सूत्र'],
  ['financial', 'वित्तीय'], ['loan', 'ऋण'],
  ['interest', 'ब्याज'], ['payment', 'भुगतान'],
  ['health', 'स्वास्थ्य'], ['weight', 'वजन'],
  ['age', 'आयु'], ['day', 'दिन'],
  ['month', 'महीना'], ['year', 'वर्ष'],
  ['time', 'समय'], ['How', 'कैसे'], ['What', 'क्या'],
]

LOCALE_DICT.hi = buildLocaleDict('hi')
for (const [k, v] of COMMON_WORDS_HI) LOCALE_DICT.hi.set(k.toLowerCase(), v)

// ─── JAPANESE ────────────────────────────
PHRASE.ja = new Map([
  ['complete guide to the', '完全ガイド'],
  ['on this page', 'このページでは'],
  ['min read', '分で読めます'],
  ['what is the', 'とは'],
  ['how to use', '使い方'],
  ['frequently asked questions', 'よくある質問'],
  ['related calculators', '関連電卓'],
  ['tips for best results', 'より良い結果のためのヒント'],
])

const COMMON_WORDS_JA = [
  ['calculator', '電卓'], ['calculators', '電卓'],
  ['tool', 'ツール'], ['free', '無料'],
  ['online', 'オンライン'], ['value', '値'],
  ['result', '結果'], ['results', '結果'],
  ['input', '入力'], ['formula', '計算式'],
  ['financial', '金融'], ['loan', 'ローン'],
  ['interest', '金利'], ['payment', '支払い'],
  ['health', '健康'], ['How', '方法'], ['What', '何'],
]

LOCALE_DICT.ja = buildLocaleDict('ja')
for (const [k, v] of COMMON_WORDS_JA) LOCALE_DICT.ja.set(k.toLowerCase(), v)

// ─── CHINESE (SIMPLIFIED) ────────────────
PHRASE['zh-CN'] = new Map([
  ['complete guide to the', '完整指南'],
  ['on this page', '在本页'],
  ['min read', '分钟阅读'],
  ['what is the', '什么是'],
  ['how to use', '如何使用'],
  ['frequently asked questions', '常见问题'],
  ['related calculators', '相关计算器'],
  ['tips for best results', '最佳结果提示'],
  ['example calculation', '计算示例'],
  ['the formula behind the calculation', '计算公式'],
  ['common use cases', '常见用例'],
])

const COMMON_WORDS_ZH = [
  ['calculator', '计算器'], ['calculators', '计算器'],
  ['tool', '工具'], ['free', '免费'],
  ['online', '在线'], ['value', '值'],
  ['values', '值'], ['result', '结果'],
  ['results', '结果'], ['input', '输入'],
  ['inputs', '输入'], ['output', '输出'],
  ['data', '数据'], ['unit', '单位'],
  ['units', '单位'], ['formula', '公式'],
  ['accurate', '精确'], ['quick', '快速'],
  ['simple', '简单'], ['easy', '容易'],
  ['financial', '金融'], ['loan', '贷款'],
  ['mortgage', '抵押贷款'], ['interest', '利息'],
  ['payment', '付款'], ['monthly', '每月'],
  ['annual', '年度'], ['health', '健康'],
  ['weight', '体重'], ['height', '身高'],
  ['age', '年龄'], ['day', '天'], ['days', '天'],
  ['month', '月'], ['year', '年'], ['years', '年'],
  ['time', '时间'], ['date', '日期'],
  ['How', '如何'], ['how', '如何'],
  ['What', '什么'], ['what', '什么'],
  ['and', '和'], ['or', '或'], ['for', '用于'],
  ['with', '使用'], ['in', '在'], ['of', '的'],
  ['is', '是'], ['your', '您的'],
  ['free online tool', '免费在线工具'],
  ['online tool', '在线工具'],
]

LOCALE_DICT['zh-CN'] = buildLocaleDict('zh-CN')
for (const [k, v] of COMMON_WORDS_ZH) LOCALE_DICT['zh-CN'].set(k.toLowerCase(), v)

// ──────────────────────────────────────────────
// TRANSLATION ENGINE
// ──────────────────────────────────────────────

/**
 * Translate a single English guide string for a given locale.
 * Steps:
 *  1. Preserve template variables {xxx}
 *  2. Check phrase-level dictionary (longest match first)
 *  3. Fall back to word-level replacement
 *  4. Restore template variables
 */
function translateString(text, locale, calcName) {
  if (!text || typeof text !== 'string') return text
  
  // 1. Extract and protect template variables
  const vars = []
  let processed = text.replace(/\{(\w+)\}/g, (m) => {
    vars.push(m)
    return `\x00${vars.length - 1}\x00`
  })
  
  const dict = LOCALE_DICT[locale]
  if (!dict || dict.size === 0) return text
  
  // 2. Try phrase-level (longest first)
  const sortedKeys = [...dict.keys()].sort((a, b) => b.length - a.length)
  
  for (const key of sortedKeys) {
    const val = dict.get(key)
    let idx = processed.toLowerCase().indexOf(key)
    while (idx >= 0) {
      // Check word boundary
      const before = idx > 0 ? processed[idx - 1] : ' '
      const afterPos = idx + key.length
      const after = afterPos < processed.length ? processed[afterPos] : ' '
      
      // Replace only if at word boundary (not mid-word)
      if (!/[a-zA-Z]/.test(before) && !/[a-zA-Z]/.test(after)) {
        const beforePart = processed.slice(0, idx)
        const afterPart = processed.slice(idx + key.length)
        // Preserve case: if original text starts with uppercase, capitalize replacement
        const originalChar = text.slice(vars.reduce((p, v) => p + v.length - 3, 0) + idx, idx + 1)
        // Simpler: just check if the original text at that position was uppercase
        const origIdx = findOriginalIndex(text, idx, vars)
        let replacement = val
        if (origIdx >= 0 && origIdx < text.length && text[origIdx] === text[origIdx].toUpperCase() && text[origIdx] !== text[origIdx].toLowerCase()) {
          replacement = val.charAt(0).toUpperCase() + val.slice(1)
        }
        processed = beforePart + replacement + afterPart
        idx = processed.toLowerCase().indexOf(key, idx + replacement.length)
      } else {
        idx = processed.toLowerCase().indexOf(key, idx + key.length)
      }
    }
  }
  
  // 3. Restore template variables
  vars.forEach((v, i) => {
    processed = processed.replace(`\x00${i}\x00`, v)
  })
  
  return processed
}

// Helper: find the original text index corresponding to a processed index
function findOriginalIndex(original, processedIdx, vars) {
  let oi = 0
  let pi = 0
  let vi = 0
  while (pi < processedIdx && oi < original.length) {
    if (vi < vars.length && original.startsWith(vars[vi].replace('{', '\\{').replace('}', '\\}'), oi)) {
      // This would need regex, skip for simplicity
      break
    }
    if (original[oi] === original[oi].toUpperCase() && original[oi] !== original[oi].toLowerCase()) {
      return oi
    }
    oi++
    pi++
  }
  return -1
}

// ──────────────────────────────────────────────
// MAIN
// ──────────────────────────────────────────────

function main() {
  const enPath = join(MSGS_DIR, 'en.json')
  const en = JSON.parse(readFileSync(enPath, 'utf8'))
  
  for (const locale of targetLocales) {
    if (!ALL_LOCALES.includes(locale)) {
      console.error(`Unknown locale: ${locale}. Valid: ${ALL_LOCALES.join(', ')}`)
      continue
    }
    if (!LOCALE_DICT[locale] || LOCALE_DICT[locale].size === 0) {
      console.error(`No dictionary for ${locale}, skipping.`)
      continue
    }
    
    const localePath = join(MSGS_DIR, `${locale}.json`)
    if (!existsSync(localePath)) {
      console.error(`File not found: ${localePath}, skipping.`)
      continue
    }
    
    const data = JSON.parse(readFileSync(localePath, 'utf8'))
    
    // Walk the guide namespace and translate every string value
    let translatedCount = 0
    let unchangedCount = 0
    
    function walkAndTranslate(obj, path) {
      if (!obj || typeof obj !== 'object') return
      for (const [key, value] of Object.entries(obj)) {
        const fullPath = path ? `${path}.${key}` : key
        if (typeof value === 'string') {
          const original = value
          const translated = translateString(value, locale)
          if (translated !== original) {
            obj[key] = translated
            translatedCount++
          } else {
            unchangedCount++
          }
        } else if (typeof value === 'object') {
          walkAndTranslate(value, fullPath)
        }
      }
    }
    
    walkAndTranslate(data, '')
    
    writeFileSync(localePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
    console.log(`${locale}: ${translatedCount} translated, ${unchangedCount} unchanged (of ${translatedCount + unchangedCount} total strings)`)
  }
  
  console.log('\nDone.')
}

main()
