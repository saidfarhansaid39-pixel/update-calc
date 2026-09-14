import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(__dirname);
const enPath = path.join(dir, 'en.json');
const ruPath = path.join(dir, 'ru.json');
const ruBakPath = path.join(dir, 'ru.json.bak');

const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
const ru = JSON.parse(fs.readFileSync(ruPath, 'utf-8'));

// Backup ru.json
fs.copyFileSync(ruPath, ruBakPath);

// ========== SPECIFIC MULTI-WORD TERM MAPPINGS ==========
const termMap = {
  "Pasta Serving Size": "Размер порции пасты",
  "Rice Serving Size": "Размер порции риса",
  "Rice Water Ratio": "Соотношение риса и воды",
  "Quinoa Cooking": "Приготовление киноа",
  "Oatmeal Ratio": "Соотношение овсянки",
  "Chicken Temperature": "Температура курицы",
  "Beef Temperature": "Температура говядины",
  "Pork Temperature": "Температура свинины",
  "Fish Temperature": "Температура рыбы",
  "Turkey Temperature": "Температура индейки",
  "Oven Cooking Time": "Время приготовления в духовке",
  "Convection Oven Conversion": "Конвекция духовки",
  "Air Fryer Conversion": "Фритюрница конвекция",
  "Slow Cooker Conversion": "Медленноварка конвекция",
  "Pressure Cooker Time": "Время скороварки",
  "Microwave Cooking Time": "Время микроволновки",
  "Grill Temperature": "Температура гриля",
  "Smoker Time": "Время копчения",
  "Portion Scaling": "Масштабирование порций",
  "Batch Scaling": "Масштабирование партий",
  "Sheet Pan Portions": "Порции противня",
  "Cake Batter": "Тесто для торта",
  "Cake Pan Size": "Размер формы для торта",
  "Baking Dish Volume": "Объем формы для запекания",
  "Loaf Pan Size": "Размер формы для хлеба",
  "Muffin Tin Portions": "Порции формы для маффинов",
  "Cupcake Icing": "Глазурь для капкейков",
  "Cookie Dough Portions": "Порции теста для печенья",
  "Pie Crust": "Тесто для пирога",
  "Cream Puff": "Заварное пирожное",
  "Cheesecake Batter": "Тесто для чизкейка",
  "Ganache Ratio": "Соотношение ганаша",
  "Buttercream": "Масляный крем",
  "Canning Time": "Время консервации",
  "Pickling Brine": "Рассол для маринования",
  "Fermentation Salt": "Соль для ферментации",
  "Cheese Making": "Сыроделие",
  "Ice Cream Base": "Основа для мороженого",
  "Coffee Brew Ratio": "Соотношение заваривания кофе",
  "Blood Type Child": "Группа крови ребенка",
  "Blood Type Parent": "Группа крови родителя",
  "Running Pace": "Темп бега",
  "Half Marathon Pace": "Темп полумарафона",
  "Marathon Pace": "Темп марафона",
  "5K Pace": "Темп 5 км",
  "10K Pace": "Темп 10 км",
  "Running Goal Time": "Целевое время бега",
  "VO2max Running": "МПК бег",
  "Running Economy": "Экономичность бега",
  "Heart Rate Zones": "Зоны пульса",
  "Max Heart Rate": "Максимальный пульс",
  "Resting Heart Rate": "Пульс в покое",
  "Heart Rate Recovery": "Восстановление пульса",
  "Training Load": "Тренировочная нагрузка",
  "Weekly Mileage": "Еженедельный километраж",
  "Interval Training": "Интервальная тренировка",
  "Tempo Run": "Темповый бег",
  "Fartlek Training": "Фартлек",
  "Hill Repeats": "Повторения в гору",
  "Long Run Pace": "Темп длительного бега",
  "Recovery Run": "Восстановительный бег",
  "Cycling Speed": "Скорость велосипеда",
  "Cycling Power": "Мощность велосипеда",
  "Power to Weight": "Мощность/вес",
  "FTP Cycling": "ФТП велоспорт",
  "Critical Power": "Критическая мощность",
  "Cycling Cadence": "Каденс велоспорт",
  "Gear Inches": "Передаточные дюймы",
  "Cycling Aerodynamics": "Аэродинамика велоспорт",
  "Rolling Resistance": "Сопротивление качению",
  "Cycling Climb": "Подъем велоспорт",
  "Swimming Pace": "Темп плавания",
  "Swim Stroke Rate": "Темп гребка",
  "SWOLF Score": "Показатель SWOLF",
  "Triathlon Pace": "Темп триатлона",
  "Triathlon Splits": "Сегменты триатлона",
  "Ironman Pace": "Темп Ironman",
  "Half Ironman Pace": "Темп Half Ironman",
  "Olympic Triathlon": "Олимпийский триатлон",
  "One Rep Max": "Максимум одного повторения",
  "Estimated Max": "Расчетный максимум",
  "Rep Max Percentage": "Процент от максимума",
  "Volume Load": "Объем нагрузки",
  "Rest Pause": "Отдых-пауза",
  "Progressive Overload": "Прогрессивная нагрузка",
  "CrossFit Workout": "Тренировка CrossFit",
  "Tabata Timer": "Таймер Табата",
  "HIIT Timer": "Таймер ВИИТ",
  "Yoga Session": "Занятие йогой",
  "Flexibility Test": "Тест гибкости",
  "Vertical Jump": "Вертикальный прыжок",
  "Agility T-Test": "T-тест ловкости",
  "Illinois Agility": "Иллинойс ловкость",
  "Wingate Test": "Тест Вингейта",
};

// ========== WORD-LEVEL TRANSLATIONS ==========
const wordMap = {
  "Advanced": "Продвинутый",
  "Pro": "Профи",
  "Professional": "Профессиональный",
  "Premium": "Премиум",
  "Standard": "Стандартный",
  "Deluxe": "Делюкс",
  "Basic": "Базовый",
  "Ultimate": "Ультимативный",
  "Credit": "Кредит",
  "Loan": "Займ",
  "Mortgage": "Ипотека",
  "Investment": "Инвестиции",
  "Retirement": "Пенсия",
  "Savings": "Сбережения",
  "Budget": "Бюджет",
  "Debt": "Долг",
  "Tax": "Налог",
  "Insurance": "Страхование",
  "Price": "Цена",
  "Earnings": "Прибыль",
  "Ratio": "Коэффициент",
  "Value": "Стоимость",
  "Income": "Доход",
  "Expense": "Расход",
  "Interest": "Процент",
  "Payment": "Платеж",
  "Balance": "Баланс",
  "Return": "Доходность",
  "Calculator": "Калькулятор",
  "Converter": "Конвертер",
  "Time": "Время",
  "Date": "Дата",
  "Weight": "Вес",
  "Height": "Рост",
  "Length": "Длина",
  "Volume": "Объем",
  "Area": "Площадь",
  "Speed": "Скорость",
  "Force": "Сила",
  "Energy": "Энергия",
  "Power": "Мощность",
  "Pressure": "Давление",
  "Temperature": "Температура",
  "Percent": "Процент",
  "Percentage": "Процент",
  "Grade": "Оценка",
  "Score": "Балл",
  "Average": "Среднее",
  "Mean": "Среднее",
  "Median": "Медиана",
  "Mode": "Мода",
  "Range": "Размах",
  "Deviation": "Отклонение",
  "Variance": "Дисперсия",
  "Probability": "Вероятность",
  "Distribution": "Распределение",
  "Sample": "Выборка",
  "Population": "Популяция",
  "Test": "Тест",
  "Free": "Бесплатно",
  "Total": "Общий",
  "Net": "Чистый",
  "Gross": "Валовый",
  "Rate": "Ставка",
  "Fee": "Комиссия",
  "Cost": "Стоимость",
  "Amount": "Сумма",
  "Simple": "Простой",
  "Compound": "Сложный",
  "Daily": "Ежедневный",
  "Monthly": "Ежемесячный",
  "Yearly": "Ежегодный",
  "Annual": "Годовой",
  "Weekly": "Еженедельный",
};

// ========== TRANSLATION FUNCTIONS ==========

function translateWords(phrase) {
  return phrase.split(/(\s+)/).map(part => {
    if (part.trim() === '' || /^\d+$/.test(part)) return part;
    const trimmed = part.trim();
    if (wordMap[trimmed]) {
      // preserve leading/trailing space
      if (part.startsWith(' ')) return ' ' + wordMap[trimmed];
      return wordMap[trimmed];
    }
    return part;
  }).join('');
}

function translateTitle(enTitle) {
  if (!enTitle) return '';

  // 1. Exact match in termMap
  if (termMap[enTitle]) return termMap[enTitle];

  // 2. X to Y Ratio Calculator
  let m = enTitle.match(/^(.+?) to (.+?) Ratio Calculator$/);
  if (m) {
    const x = termMap[m[1]] || m[1];
    const y = termMap[m[2]] || m[2];
    return `Калькулятор соотношения ${x} к ${y}`;
  }

  // 3. X to Y Converter
  m = enTitle.match(/^(.+?) to (.+?) Converter$/);
  if (m) {
    const x = termMap[m[1]] || m[1];
    const y = termMap[m[2]] || m[2];
    return `Конвертер ${x} в ${y}`;
  }

  // 4. Free X
  m = enTitle.match(/^Free (.+)$/);
  if (m) {
    const rest = termMap[m[1]] || translateWords(m[1]);
    return `Бесплатный ${rest}`;
  }

  // 5. X Calculator
  m = enTitle.match(/^(.+) Calculator$/);
  if (m) {
    const x = m[1].trim();
    const tx = termMap[x] || translateWords(x);
    return `Калькулятор ${tx}`;
  }

  // 6. X Converter
  m = enTitle.match(/^(.+) Converter$/);
  if (m) {
    const x = m[1].trim();
    const tx = termMap[x] || translateWords(x);
    return `Конвертер ${tx}`;
  }

  // 7. X to Y (standalone — pattern-matched converter)
  m = enTitle.match(/^(.+?) to (.+)$/);
  if (m) {
    const x = termMap[m[1]] || m[1];
    const y = termMap[m[2]] || m[2];
    return `Конвертер ${x} в ${y}`;
  }

  // 8. Fallback: word-by-word translation then English as-is if unchanged
  const wordTranslated = translateWords(enTitle);
  return wordTranslated || enTitle;
}

// ========== MAIN PROCESSING ==========

const enToRuTitle = new Map();   // English title -> Russian title
let titleChanged = 0;
let descChanged = 0;

// First pass: translate all TBD titles, build lookup
for (const [slug, entry] of Object.entries(ru)) {
  if (!entry.title) continue;
  const enEntry = en[slug];
  if (!enEntry) continue;

  const enTitle = enEntry.title;
  if (entry.title.includes('[TBD:')) {
    const newTitle = translateTitle(enTitle);
    entry.title = newTitle;
    enToRuTitle.set(enTitle, newTitle);
    titleChanged++;
  } else {
    enToRuTitle.set(enTitle, entry.title);
  }
}

// Second pass: fix descriptions with [TBD: ...]
for (const [slug, entry] of Object.entries(ru)) {
  if (!entry.description || !entry.description.includes('[TBD:')) continue;

  const enEntry = en[slug];
  const ownRusTitle = entry.title || '';

  entry.description = entry.description.replace(/\[TBD:\s*([^\]]+)\]/g, (_match, inner) => {
    // Try lookup by English title
    if (enToRuTitle.has(inner)) return enToRuTitle.get(inner);
    // Fallback: use this entry's own translated title
    return ownRusTitle;
  });
  descChanged++;
}

// ========== WRITE OUTPUT ==========

fs.writeFileSync(ruPath, JSON.stringify(ru, null, 2) + '\n');

console.log(`Backup: ${ruBakPath}`);
console.log(`Titles fixed: ${titleChanged}`);
console.log(`Descriptions fixed: ${descChanged}`);
console.log(`Total changes: ${titleChanged + descChanged}`);
