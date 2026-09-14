import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OVERRIDE_DIR = path.resolve(__dirname, '..', 'src', 'i18n', 'calculator-overrides');
const LOCALES = ['fr', 'de', 'pt', 'ru', 'hi'];

function readJSON(filePath) {
  let raw = fs.readFileSync(filePath, 'utf-8');
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
  return JSON.parse(raw);
}

const en = readJSON(path.join(OVERRIDE_DIR, 'en.json'));

// Per-locale rules — unitMap values have leading/trailing space to preserve boundaries
const RULES = {
  fr: {
    verbPatterns: [
      // "Convert X to Y" — units may contain / ² ³ °
      [/Convert\s+([\w\s\/²³°-]+?)\s+to\s+([\w\s\/²³°-]+?)(?=[,.]|\s+pour|\s+avec|\s+instantan|\s+en|\s+for|\s+und)/gi,
       (_, u1, u2) => `Convertissez ${u1.trim()} en ${u2.trim()}`],
      [/Convert\s+between\s+(.+?)\s+and\s+(.+?)(?=[,.]|\s+pour|\s+avec)/gi,
       (_, u1, u2) => `Convertissez entre ${u1.trim()} et ${u2.trim()}`],
      [/\bConvert\b/gi, 'Convertissez'],
      [/Calculate\s+/gi, 'Calculez '],
      [/\bSolve\s+/gi, 'Résolvez '],
      [/\bMaster\s+/gi, 'Maîtrisez '],
    ],
    unitMap: {
      ' inches ': ' pouces ', ' inch ': ' pouce ', ' in ': ' in ',
      ' feet ': ' pieds ', ' foot ': ' pied ',
      ' meters ': ' mètres ', ' meter ': ' mètre ',
      ' centimeters ': ' centimètres ', ' centimeter ': ' centimètre ',
      ' miles ': ' milles ', ' mile ': ' mille ', ' mi ': ' mi ',
      ' kilometers ': ' kilomètres ', ' kilometer ': ' kilomètre ',
      ' yards ': ' yards ', ' yard ': ' yard ',
      ' pounds ': ' livres ', ' pound ': ' livre ', ' lb ': ' lb ',
      ' ounces ': ' onces ', ' ounce ': ' once ', ' oz ': ' oz ',
      ' gallons ': ' gallons ', ' gallon ': ' gallon ', ' gal ': ' gal ',
      ' liters ': ' litres ', ' liter ': ' litre ', ' L ': ' L ',
      ' millimeters ': ' millimètres ', ' millimeter ': ' millimètre ', ' mm ': ' mm ',
      ' centimeters ': ' centimètres ', ' centimeter ': ' centimètre ', ' cm ': ' cm ',
      ' tonnes ': ' tonnes ', ' tonne ': ' tonne ',
      ' grams ': ' grammes ', ' gram ': ' gramme ', ' g ': ' g ',
      ' kilograms ': ' kilogrammes ', ' kilogram ': ' kilogramme ', ' kg ': ' kg ',
      ' miles per hour ': ' milles par heure ', ' mph ': ' mph ',
      ' kilometers per hour ': ' kilomètres par heure ', ' kmh ': ' kmh ', ' km/h ': ' km/h ',
      ' feet per second ': ' pieds par seconde ', ' fps ': ' fps ',
      ' knots ': ' nœuds ', ' knot ': ' nœud ',
      ' nanometers ': ' nanomètres ', ' nanometer ': ' nanomètre ',
      ' angstroms ': ' angströms ', ' angstrom ': ' angström ',
      ' fathoms ': ' brasses ', ' fathom ': ' brasse ',
      ' light years ': ' années-lumière ', ' light year ': ' année-lumière ',
      ' carats ': ' carats ', ' carat ': ' carat ',
      ' grains ': ' grains ', ' grain ': ' grain ',
      ' stones ': ' stones ', ' stone ': ' stone ',
      ' metric tons ': ' tonnes métriques ', ' metric ton ': ' tonne métrique ',
      ' us tons ': ' tonnes américaines ', ' us ton ': ' tonne américaine ',
      ' US gallons ': ' gallons US ', ' US gallon ': ' gallon US ',
      ' US dollars ': ' dollars US ', ' US dollar ': ' dollar US ',
      ' British pounds ': ' livres sterling ', ' British pound ': ' livre sterling ',
      ' Japanese yen ': ' yens japonais ',
      ' Chinese yuan ': ' yuans chinois ',
      ' Euros ': ' euros ', ' Euro ': ' euro ',
      ' millimeters of mercury ': ' millimètres de mercure ',
      ' square ': ' carré ', ' sq ': ' sq ',
      ' cubic ': ' cubique ',
    },
    boilerplate: [
      [/Accurate fast and reliable unit conversion tool/gi, 'Outil de conversion d\'unités précis, rapide et fiable'],
      [/Accurate fast and reliable/gi, 'Précis, rapide et fiable'],
      [/Quick accurate and easy to use/gi, 'Rapide, précis et facile à utiliser'],
      [/Perfect for students travelers engineers and professionals/gi, 'Idéal pour les étudiants, voyageurs, ingénieurs et professionnels'],
      [/Bookmark for quick access/gi, 'Ajoutez cette page à vos favoris pour un accès rapide'],
      [/Simplify \w+ calculations for daily life/gi, m => m.replace(/calculations for daily life/i, 'calculs pour la vie quotidienne').replace(/Simplify/i, 'Simplifiez')],
      [/supporting multiple units and decimal precision/gi, 'prenant en charge plusieurs unités et une précision décimale'],
      [/for atomic scales/gi, 'pour les échelles atomiques'],
      [/for gemstones/gi, 'pour les pierres précieuses'],
      [/for natural gas/gi, 'pour le gaz naturel'],
      [/for nautical depth/gi, 'pour la profondeur nautique'],
      [/with live rates/gi, 'avec taux en direct'],
      [/for illuminance/gi, 'pour l\'éclairement'],
      [/pressure units/gi, 'unités de pression'],
      [/temperature/gi, 'température'],
      [/Simplify [\w\s]+ calculations for daily life/gi, m => m.replace(/Simplify/i, 'Simplifiez').replace(/calculations for daily life/i, 'calculs pour la vie quotidienne')],
      [/Master \w+ concepts with step-by-step solutions/gi, m => 'Maîtrisez les concepts de ' + (m.match(/Master (\w+)/i)?.[1] || '') + ' avec des solutions étape par étape'],
      [/(Solve|Calculate|Find|Determine) [\w\s]+ problems step by step/gi, m => m.replace(/\b(Solve|Calculate|Find|Determine)\b/i, w => ({Solve:'Résolvez',Calculate:'Calculez',Find:'Trouvez',Determine:'Déterminez'})[w] || w).replace(/step by step/i, 'étape par étape')],
      [/with interactive [\w\s]+ and instant feedback/gi, m => m.replace(/with interactive/i, 'avec des').replace(/and instant feedback/i, 'et des commentaires instantanés')],
      [/Perfect for students(?:,)? teachers(?:,)? and professionals/gi, 'Idéal pour les étudiants, les enseignants et les professionnels'],
      [/Perfect for students and teachers/gi, 'Idéal pour les étudiants et les enseignants'],
      // Catch-all: translate "Perfect for" at start of phrase
      [/\bPerfect for\b/gi, 'Idéal pour'],
      [/\bstep by step\b/gi, 'étape par étape'],
      [/\binteractive\b/gi, 'interactif'],
    ],
  },

  de: {
    verbPatterns: [
      [/Convert\s+([\w\s\/²³°-]+?)\s+to\s+([\w\s\/²³°-]+?)(?=[,.]|\s+für|\s+mit|\s+sofort|\s+und|\s+sowie|\s+in)/gi,
       (_, u1, u2) => `Konvertieren Sie ${u1.trim()} in ${u2.trim()}`],
      [/Convert\s+between\s+(.+?)\s+and\s+(.+?)(?=[,.]|\s+für|\s+mit)/gi,
       (_, u1, u2) => `Konvertieren Sie zwischen ${u1.trim()} und ${u2.trim()}`],
      [/\bConvert\b/gi, 'Konvertieren Sie'],
      [/Calculate\s+/gi, 'Berechnen Sie '],
      [/\bSolve\s+/gi, 'Lösen Sie '],
      [/\bMaster\s+/gi, 'Meistern Sie '],
    ],
    unitMap: {
      ' inches ': ' Zoll ', ' inch ': ' Zoll ',
      ' feet ': ' Fuß ', ' foot ': ' Fuß ',
      ' meters ': ' Meter ', ' meter ': ' Meter ',
      ' centimeters ': ' Zentimeter ', ' centimeter ': ' Zentimeter ',
      ' miles ': ' Meilen ', ' mile ': ' Meile ',
      ' kilometers ': ' Kilometer ', ' kilometer ': ' Kilometer ',
      ' yards ': ' Yards ', ' yard ': ' Yard ',
      ' pounds ': ' Pfund ', ' pound ': ' Pfund ',
      ' ounces ': ' Unzen ', ' ounce ': ' Unze ',
      ' gallons ': ' Gallonen ', ' gallon ': ' Gallone ',
      ' liters ': ' Liter ', ' liter ': ' Liter ',
      ' millimeters ': ' Millimeter ', ' millimeter ': ' Millimeter ',
      ' tonnes ': ' Tonnen ', ' tonne ': ' Tonne ',
      ' grams ': ' Gramm ', ' gram ': ' Gramm ',
      ' kilograms ': ' Kilogramm ', ' kilogram ': ' Kilogramm ',
      ' miles per hour ': ' Meilen pro Stunde ',
      ' kilometers per hour ': ' Kilometer pro Stunde ',
      ' feet per second ': ' Fuß pro Sekunde ',
      ' knots ': ' Knoten ', ' knot ': ' Knoten ',
      ' nanometers ': ' Nanometer ', ' nanometer ': ' Nanometer ',
      ' angstroms ': ' Angström ', ' angstrom ': ' Angström ',
      ' fathoms ': ' Faden ', ' fathom ': ' Faden ',
      ' light years ': ' Lichtjahre ', ' light year ': ' Lichtjahr ',
      ' carats ': ' Karat ', ' carat ': ' Karat ',
      ' grains ': ' Korn ', ' grain ': ' Korn ',
      ' stones ': ' Stone ', ' stone ': ' Stone ',
      ' metric tons ': ' metrische Tonnen ', ' metric ton ': ' metrische Tonne ',
      ' US tons ': ' US-Tonnen ',
      ' US gallons ': ' US-Gallonen ', ' US gallon ': ' US-Gallone ',
      ' US dollars ': ' US-Dollar ',
      ' British pounds ': ' Britische Pfund ',
      ' Japanese yen ': ' Japanische Yen ',
      ' Chinese yuan ': ' Chinesische Yuan ',
      ' Euros ': ' Euro ',
      ' millimeters of mercury ': ' Millimeter Quecksilbersäule ',
      ' square ': ' Quadrat- ',
      ' cubic ': ' Kubik- ',
    },
    boilerplate: [
      [/Accurate fast and reliable unit conversion tool/gi, 'Präzises, schnelles und zuverlässiges Einheitenumrechnungstool'],
      [/Accurate fast and reliable/gi, 'Präzise, schnell und zuverlässig'],
      [/Quick accurate and easy to use/gi, 'Schnell, genau und einfach zu bedienen'],
      [/Perfect for students travelers engineers and professionals/gi, 'Perfekt für Studenten, Reisende, Ingenieure und Fachleute'],
      [/Bookmark for quick access/gi, 'Setzen Sie ein Lesezeichen für schnellen Zugriff'],
      [/Simplify \w+ calculations for daily life/gi, m => m.replace(/calculations for daily life/i, 'Berechnungen für den täglichen Gebrauch').replace(/Simplify/i, 'Vereinfachen Sie')],
      [/supporting multiple units and decimal precision/gi, 'mit Unterstützung für mehrere Einheiten und Dezimalgenauigkeit'],
      [/for atomic scales/gi, 'für atomare Skalen'],
      [/for gemstones/gi, 'für Edelsteine'],
      [/for natural gas/gi, 'für Erdgas'],
      [/for nautical depth/gi, 'für nautische Tiefe'],
      [/with live rates/gi, 'mit Live-Kursen'],
      [/for illuminance/gi, 'für Beleuchtungsstärke'],
      [/pressure units/gi, 'Druckeinheiten'],
      [/Master \w+ concepts with step-by-step solutions/gi, m => 'Meistern Sie ' + m.match(/Master (\w+)/i)[1] + '-Konzepte mit Schritt-für-Schritt-Lösungen'],
      [/(Solve|Calculate|Find|Determine) [\w\s]+ problems step by step/gi, m => m.replace(/\b(Solve|Calculate|Find|Determine)\b/i, w => ({Solve:'Lösen Sie',Calculate:'Berechnen Sie',Find:'Finden Sie',Determine:'Bestimmen Sie'})[w] || w).replace(/step by step/i, 'Schritt für Schritt')],
      [/with interactive [\w\s]+ and instant feedback/gi, m => m.replace(/with interactive/i, 'mit interaktiven').replace(/and instant feedback/i, 'und sofortigem Feedback')],
      [/Perfect for students(?:,)? teachers(?:,)? and professionals/gi, 'Perfekt für Studenten, Lehrer und Fachleute'],
      [/Perfect for students and teachers/gi, 'Perfekt für Studenten und Lehrer'],
      [/\bPerfect for\b/gi, 'Perfekt für'],
      [/\bstep by step\b/gi, 'Schritt für Schritt'],
      [/\binteractive\b/gi, 'interaktiv'],
    ],
  },

  pt: {
    verbPatterns: [
      [/Convert\s+([\w\s\/²³°-]+?)\s+to\s+([\w\s\/²³°-]+?)(?=[,.]|\s+para|\s+com|\s+instant|\s+e|\s+de)/gi,
       (_, u1, u2) => `Converta ${u1.trim()} em ${u2.trim()}`],
      [/Convert\s+between\s+(.+?)\s+and\s+(.+?)(?=[,.]|\s+para|\s+com)/gi,
       (_, u1, u2) => `Converta entre ${u1.trim()} e ${u2.trim()}`],
      [/\bConvert\b/gi, 'Converta'],
      [/Calculate\s+/gi, 'Calcule '],
      [/\bSolve\s+/gi, 'Resolva '],
      [/\bMaster\s+/gi, 'Domine '],
    ],
    unitMap: {
      ' inches ': ' polegadas ', ' inch ': ' polegada ',
      ' feet ': ' pés ', ' foot ': ' pé ',
      ' meters ': ' metros ', ' meter ': ' metro ',
      ' centimeters ': ' centímetros ', ' centimeter ': ' centímetro ',
      ' miles ': ' milhas ', ' mile ': ' milha ',
      ' kilometers ': ' quilômetros ', ' kilometer ': ' quilômetro ',
      ' yards ': ' jardas ', ' yard ': ' jarda ',
      ' pounds ': ' libras ', ' pound ': ' libra ',
      ' ounces ': ' onças ', ' ounce ': ' onça ',
      ' gallons ': ' galões ', ' gallon ': ' galão ',
      ' liters ': ' litros ', ' liter ': ' litro ',
      ' millimeters ': ' milímetros ', ' millimeter ': ' milímetro ',
      ' tonnes ': ' toneladas ', ' tonne ': ' tonelada ',
      ' grams ': ' gramas ', ' gram ': ' grama ',
      ' kilograms ': ' quilogramas ', ' kilogram ': ' quilograma ',
      ' miles per hour ': ' milhas por hora ',
      ' kilometers per hour ': ' quilômetros por hora ',
      ' feet per second ': ' pés por segundo ',
      ' knots ': ' nós ', ' knot ': ' nó ',
      ' nanometers ': ' nanômetros ', ' nanometer ': ' nanômetro ',
      ' angstroms ': ' angströms ', ' angstrom ': ' angström ',
      ' fathoms ': ' braças ', ' fathom ': ' braça ',
      ' light years ': ' anos-luz ', ' light year ': ' ano-luz ',
      ' carats ': ' quilates ', ' carat ': ' quilate ',
      ' grains ': ' grãos ', ' grain ': ' grão ',
      ' stones ': ' stones ', ' stone ': ' stone ',
      ' metric tons ': ' toneladas métricas ',
      ' US tons ': ' toneladas americanas ',
      ' US gallons ': ' galões americanos ',
      ' US dollars ': ' dólares americanos ',
      ' British pounds ': ' libras esterlinas ',
      ' Japanese yen ': ' ienes japoneses ',
      ' Chinese yuan ': ' yuans chineses ',
      ' Euros ': ' euros ',
      ' millimeters of mercury ': ' milímetros de mercúrio ',
      ' square ': ' quadrado ',
      ' cubic ': ' cúbico ',
    },
    boilerplate: [
      [/Accurate fast and reliable unit conversion tool/gi, 'Ferramenta de conversão de unidades precisa, rápida e confiável'],
      [/Accurate fast and reliable/gi, 'Precisa, rápida e confiável'],
      [/Quick accurate and easy to use/gi, 'Rápido, preciso e fácil de usar'],
      [/Perfect for students travelers engineers and professionals/gi, 'Perfeito para estudantes, viajantes, engenheiros e profissionais'],
      [/Bookmark for quick access/gi, 'Adicione aos favoritos para acesso rápido'],
      [/Simplify \w+ calculations for daily life/gi, m => m.replace(/calculations for daily life/i, 'cálculos para o dia a dia').replace(/Simplify/i, 'Simplifique')],
      [/supporting multiple units and decimal precision/gi, 'suportando múltiplas unidades e precisão decimal'],
      [/for atomic scales/gi, 'para escalas atômicas'],
      [/for gemstones/gi, 'para gemas'],
      [/for natural gas/gi, 'para gás natural'],
      [/for nautical depth/gi, 'para profundidade náutica'],
      [/with live rates/gi, 'com taxas em tempo real'],
      [/for illuminance/gi, 'para iluminância'],
      [/pressure units/gi, 'unidades de pressão'],
      [/Master \w+ concepts with step-by-step solutions/gi, m => 'Domine conceitos de ' + (m.match(/Master (\w+)/i)?.[1] || '') + ' com soluções passo a passo'],
      [/(Solve|Calculate|Find|Determine) [\w\s]+ problems step by step/gi, m => m.replace(/\b(Solve|Calculate|Find|Determine)\b/i, w => ({Solve:'Resolva',Calculate:'Calcule',Find:'Encontre',Determine:'Determine'})[w] || w).replace(/step by step/i, 'passo a passo')],
      [/with interactive [\w\s]+ and instant feedback/gi, m => m.replace(/with interactive/i, 'com interativos').replace(/and instant feedback/i, 'e feedback instantâneo')],
      [/Perfect for students(?:,)? teachers(?:,)? and professionals/gi, 'Perfeito para estudantes, professores e profissionais'],
      [/Perfect for students and teachers/gi, 'Perfeito para estudantes e professores'],
      [/\bPerfect for\b/gi, 'Perfeito para'],
      [/\bstep by step\b/gi, 'passo a passo'],
      [/\binteractive\b/gi, 'interativo'],
    ],
  },

  ru: {
    verbPatterns: [
      [/Convert\s+([\w\s\/²³°-]+?)\s+to\s+([\w\s\/²³°-]+?)(?=[,.]|\s+для|\s+с|\s+мгнов|\s+и|\s+в)/gi,
       (_, u1, u2) => `Конвертируйте ${u1.trim()} в ${u2.trim()}`],
      [/Convert\s+between\s+(.+?)\s+and\s+(.+?)(?=[,.]|\s+для|\s+с)/gi,
       (_, u1, u2) => `Конвертируйте между ${u1.trim()} и ${u2.trim()}`],
      [/\bConvert\b/gi, 'Конвертируйте'],
      [/Calculate\s+/gi, 'Рассчитайте '],
      [/\bSolve\s+/gi, 'Решите '],
      [/\bMaster\s+/gi, 'Освойте '],
    ],
    unitMap: {
      ' inches ': ' дюймы ', ' inch ': ' дюйм ',
      ' feet ': ' футы ', ' foot ': ' фут ',
      ' meters ': ' метры ', ' meter ': ' метр ',
      ' centimeters ': ' сантиметры ', ' centimeter ': ' сантиметр ',
      ' miles ': ' мили ', ' mile ': ' миля ',
      ' kilometers ': ' километры ', ' kilometer ': ' километр ',
      ' yards ': ' ярды ', ' yard ': ' ярд ',
      ' pounds ': ' фунты ', ' pound ': ' фунт ',
      ' ounces ': ' унции ', ' ounce ': ' унция ',
      ' gallons ': ' галлоны ', ' gallon ': ' галлон ',
      ' liters ': ' литры ', ' liter ': ' литр ',
      ' millimeters ': ' миллиметры ', ' millimeter ': ' миллиметр ',
      ' tonnes ': ' тонны ', ' tonne ': ' тонна ',
      ' grams ': ' граммы ', ' gram ': ' грамм ',
      ' kilograms ': ' килограммы ', ' kilogram ': ' килограмм ',
      ' miles per hour ': ' миль в час ',
      ' kilometers per hour ': ' километров в час ',
      ' feet per second ': ' футов в секунду ',
      ' knots ': ' узлы ', ' knot ': ' узел ',
      ' nanometers ': ' нанометры ', ' nanometer ': ' нанометр ',
      ' angstroms ': ' ангстремы ', ' angstrom ': ' ангстрем ',
      ' fathoms ': ' морские сажени ', ' fathom ': ' морская сажень ',
      ' light years ': ' световые годы ', ' light year ': ' световой год ',
      ' carats ': ' караты ', ' carat ': ' карат ',
      ' grains ': ' граны ', ' grain ': ' гран ',
      ' stones ': ' стоуны ', ' stone ': ' стоун ',
      ' metric tons ': ' метрические тонны ',
      ' US tons ': ' американские тонны ',
      ' US gallons ': ' американские галлоны ',
      ' US dollars ': ' доллары США ',
      ' British pounds ': ' британские фунты ',
      ' Japanese yen ': ' японские иены ',
      ' Chinese yuan ': ' китайские юани ',
      ' Euros ': ' евро ',
      ' millimeters of mercury ': ' миллиметры ртутного столба ',
      ' square ': ' квадратные ',
      ' cubic ': ' кубические ',
    },
    boilerplate: [
      [/Accurate fast and reliable unit conversion tool/gi, 'Точный, быстрый и надежный инструмент конвертации единиц измерения'],
      [/Accurate fast and reliable/gi, 'Точный, быстрый и надежный'],
      [/Quick accurate and easy to use/gi, 'Быстрый, точный и простой в использовании'],
      [/Perfect for students travelers engineers and professionals/gi, 'Идеально подходит для студентов, путешественников, инженеров и профессионалов'],
      [/Bookmark for quick access/gi, 'Добавьте в закладки для быстрого доступа'],
      [/Simplify \w+ calculations for daily life/gi, m => m.replace(/calculations for daily life/i, 'расчеты для повседневной жизни').replace(/Simplify/i, 'Упростите')],
      [/supporting multiple units and decimal precision/gi, 'с поддержкой множества единиц и десятичной точности'],
      [/for atomic scales/gi, 'для атомных масштабов'],
      [/for gemstones/gi, 'для драгоценных камней'],
      [/for natural gas/gi, 'для природного газа'],
      [/for nautical depth/gi, 'для морской глубины'],
      [/with live rates/gi, 'с актуальными курсами'],
      [/for illuminance/gi, 'для освещенности'],
      [/pressure units/gi, 'единицы давления'],
      [/Master \w+ concepts with step-by-step solutions/gi, m => 'Освойте концепции ' + (m.match(/Master (\w+)/i)?.[1] || '') + ' с пошаговыми решениями'],
      [/(Solve|Calculate|Find|Determine) [\w\s]+ problems step by step/gi, m => m.replace(/\b(Solve|Calculate|Find|Determine)\b/i, w => ({Solve:'Решите',Calculate:'Рассчитайте',Find:'Найдите',Determine:'Определите'})[w] || w).replace(/step by step/i, 'шаг за шагом')],
      [/with interactive [\w\s]+ and instant feedback/gi, m => m.replace(/with interactive/i, 'с интерактивными').replace(/and instant feedback/i, 'и мгновенной обратной связью')],
      [/Perfect for students(?:,)? teachers(?:,)? and professionals/gi, 'Идеально подходит для студентов, преподавателей и профессионалов'],
      [/Perfect for students and teachers/gi, 'Идеально подходит для студентов и преподавателей'],
      [/\bPerfect for\b/gi, 'Идеально подходит для'],
      [/\bstep by step\b/gi, 'шаг за шагом'],
      [/\binteractive\b/gi, 'интерактивный'],
    ],
  },

  hi: {
    verbPatterns: [
      [/Convert\s+([\w\s\/²³°-]+?)\s+to\s+([\w\s\/²³°-]+?)(?=[,.]|\s+के\s+लिए|\s+और|\s+तुरंत)/gi,
       (_, u1, u2) => `${u1.trim()} को ${u2.trim()} में बदलें`],
      [/Convert\s+between\s+(.+?)\s+and\s+(.+?)(?=[,.]|\s+के\s+लिए)/gi,
       (_, u1, u2) => `${u1.trim()} और ${u2.trim()} के बीच बदलें`],
      [/\bConvert\b/gi, 'बदलें'],
      [/Calculate\s+/gi, 'गणना करें '],
      [/\bSolve\s+/gi, 'हल करें '],
      [/\bMaster\s+/gi, 'मास्टर बनें '],
      [/\bPlan\s+/gi, 'योजना बनाएं '],
      [/\bTrack\s+/gi, 'ट्रैक करें '],
      [/\bBudget\s+/gi, 'बजट बनाएं '],
    ],
    unitMap: {
      ' inches ': ' इंच ', ' inch ': ' इंच ',
      ' feet ': ' फीट ', ' foot ': ' फीट ',
      ' meters ': ' मीटर ', ' meter ': ' मीटर ',
      ' centimeters ': ' सेंटीमीटर ', ' centimeter ': ' सेंटीमीटर ',
      ' miles ': ' मील ', ' mile ': ' मील ',
      ' kilometers ': ' किलोमीटर ', ' kilometer ': ' किलोमीटर ',
      ' yards ': ' गज ', ' yard ': ' गज ',
      ' pounds ': ' पाउंड ', ' pound ': ' पाउंड ',
      ' ounces ': ' औंस ', ' ounce ': ' औंस ',
      ' gallons ': ' गैलन ', ' gallon ': ' गैलन ',
      ' liters ': ' लीटर ', ' liter ': ' लीटर ',
      ' millimeters ': ' मिलीमीटर ', ' millimeter ': ' मिलीमीटर ',
      ' tonnes ': ' टन ', ' tonne ': ' टन ',
      ' grams ': ' ग्राम ', ' gram ': ' ग्राम ',
      ' kilograms ': ' किलोग्राम ', ' kilogram ': ' किलोग्राम ',
      ' miles per hour ': ' मील प्रति घंटा ',
      ' kilometers per hour ': ' किलोमीटर प्रति घंटा ',
      ' feet per second ': ' फीट प्रति सेकंड ',
      ' knots ': ' नॉट्स ', ' knot ': ' नॉट ',
      ' nanometers ': ' नैनोमीटर ', ' nanometer ': ' नैनोमीटर ',
      ' angstroms ': ' एंगस्ट्रॉम ', ' angstrom ': ' एंगस्ट्रॉम ',
      ' fathoms ': ' फैदम ', ' fathom ': ' फैदम ',
      ' light years ': ' प्रकाश-वर्ष ', ' light year ': ' प्रकाश-वर्ष ',
      ' carats ': ' कैरेट ', ' carat ': ' कैरेट ',
      ' grains ': ' ग्रेन ', ' grain ': ' ग्रेन ',
      ' stones ': ' स्टोन ', ' stone ': ' स्टोन ',
      ' metric tons ': ' मीट्रिक टन ',
      ' US tons ': ' अमेरिकी टन ',
      ' US gallons ': ' अमेरिकी गैलन ',
      ' US dollars ': ' अमेरिकी डॉलर ',
      ' British pounds ': ' ब्रिटिश पाउंड ',
      ' Japanese yen ': ' जापानी येन ',
      ' Chinese yuan ': ' चीनी युआन ',
      ' Euros ': ' यूरो ',
      ' millimeters of mercury ': ' मिलीमीटर पारा ',
      ' square ': ' वर्ग ',
      ' cubic ': ' घन ',
    },
    boilerplate: [
      [/Accurate fast and reliable unit conversion tool/gi, 'सटीक, तेज़ और विश्वसनीय यूनिट कनवर्टर टूल'],
      [/Accurate fast and reliable/gi, 'सटीक, तेज़ और विश्वसनीय'],
      [/Quick accurate and easy to use/gi, 'त्वरित, सटीक और उपयोग में आसान'],
      [/Perfect for students travelers engineers and professionals/gi, 'छात्रों, यात्रियों, इंजीनियरों और पेशेवरों के लिए आदर्श'],
      [/Bookmark for quick access/gi, 'त्वरित पहुंच के लिए बुकमार्क करें'],
      [/supporting multiple units and decimal precision/gi, 'जो कई यूनिट्स और दशमलव सटीकता का समर्थन करता है'],
      [/\bConverter\b/gi, 'कनवर्टर'],
      [/\bCalculator\b/gi, 'कैलकुलेटर'],
      [/^Free /i, 'मुफ्त '],
      [/with live rates/gi, 'लाइव दरों के साथ'],
      [/for atomic scales/gi, 'परमाणु स्तर के लिए'],
      [/for gemstones/gi, 'रत्नों के लिए'],
      [/for natural gas/gi, 'प्राकृतिक गैस के लिए'],
      [/for nautical depth/gi, 'नौसंचालन गहराई के लिए'],
      [/for illuminance/gi, 'रोशनी के लिए'],
      [/pressure units/gi, 'दबाव इकाई'],
      [/user interface/gi, 'उपयोगकर्ता इंटरफ़ेस'],
      [/interface/gi, 'इंटरफ़ेस'],
      [/interactive/gi, 'इंटरैक्टिव'],
      [/step by step/gi, 'चरण दर चरण'],
      [/problems?/gi, 'समस्याएं'],
      [/with practical results you can apply immediately/gi, 'व्यावहारिक परिणामों के साथ जिन्हें आप तुरंत लागू कर सकते हैं'],
      [/for household budgeting shopping meal planning and lifestyle management/gi, 'घरेलू बजट, खरीदारी, भोजन योजना और जीवनशैली प्रबंधन के लिए'],
      [/Master \w+ concepts with step-by-step solutions/gi, m => m.replace(/Master/i, 'मास्टर बनें').replace(/with step-by-step solutions/i, 'चरण-दर-चरण समाधान के साथ')],
      [/(Solve|Calculate|Find|Determine) [\w\s]+ problems step by step/gi, m => {
        const verbMap = {Solve:'हल करें',Calculate:'गणना करें',Find:'खोजें',Determine:'निर्धारित करें'};
        return m.replace(/\b(Solve|Calculate|Find|Determine)\b/i, w => verbMap[w] || w).replace(/step by step/i, 'चरण दर चरण');
      }],
      [/with interactive [\w\s]+ and instant feedback/gi, m => m.replace(/with interactive/i, 'इंटरैक्टिव').replace(/and instant feedback/i, 'और तत्काल प्रतिक्रिया के साथ')],
      [/Perfect for students(?:,)? teachers(?:,)? and professionals/gi, 'छात्रों, शिक्षकों और पेशेवरों के लिए आदर्श'],
      [/Perfect for students and teachers/gi, 'छात्रों और शिक्षकों के लिए आदर्श'],
      [/\bPerfect for\b/gi, 'इसके लिए आदर्श'],
      [/\bstep by step\b/gi, 'चरण दर चरण'],
      [/\binteractive\b/gi, 'इंटरैक्टिव'],
    ],
  },
};

function applyUnitReplacements(text, unitMap) {
  const entries = Object.entries(unitMap).sort((a, b) => b[0].length - a[0].length);
  for (const [eng, loc] of entries) {
    const word = eng.trim();
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp('\\b' + escaped + '\\b', 'gi');
    text = text.replace(regex, loc.trim());
  }
  return text;
}

function applyBoilerplate(text, rules) {
  for (const [pattern, replacement] of rules.boilerplate) {
    text = text.replace(pattern, replacement);
  }
  return text;
}

function applyVerbPatterns(text, rules) {
  for (const [pattern, replacement] of rules.verbPatterns) {
    text = text.replace(pattern, replacement);
  }
  return text;
}

function replaceEnglishTitleInDesc(description, enTitle, localeTitle) {
  if (!enTitle || !localeTitle || enTitle === localeTitle) return description;
  if (description.includes(enTitle) && !description.includes(localeTitle)) {
    return description.replace(enTitle, localeTitle);
  }
  return description;
}

function processLocale(locale) {
  const filePath = path.join(OVERRIDE_DIR, `${locale}.json`);
  const bakPath = path.join(OVERRIDE_DIR, `${locale}.json.bak`);

  // Backup (only if not already backed up)
  if (!fs.existsSync(bakPath)) {
    fs.copyFileSync(filePath, bakPath);
    console.log(`  ✓ Backup created: ${locale}.json.bak`);
  }

  const data = readJSON(filePath);
  const rules = RULES[locale];
  let changedCount = 0;
  const samples = [];

  for (const [slug, entry] of Object.entries(data)) {
    if (!entry.description) continue;

    const original = entry.description;
    let desc = original;

    // Step 1: Replace English title in description with locale's own title
    if (en[slug]?.title) {
      desc = replaceEnglishTitleInDesc(desc, en[slug].title, entry.title);
    }

    // Step 2: Apply verb patterns (Convert/Calculate/... → locale)
    desc = applyVerbPatterns(desc, rules);

    // Step 3: Apply unit name replacements (word-boundary regex)
    desc = applyUnitReplacements(desc, rules.unitMap);

    // Step 4: Apply boilerplate translations
    desc = applyBoilerplate(desc, rules);

    if (desc !== original) {
      entry.description = desc;
      changedCount++;
      if (samples.length < 3) {
        samples.push({ slug, before: original.substring(0, 120), after: desc.substring(0, 120) });
      }
    }
  }

  // Validate JSON
  let jsonValid = true;
  let jsonError = '';
  try {
    JSON.stringify(data);
  } catch (e) {
    jsonValid = false;
    jsonError = e.message;
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');

  return { locale, changedCount, samples, jsonValid, jsonError };
}

// ===== Main =====
console.log('=== Calculator Override Description Cleanup v2 ===\n');

const results = [];
for (const locale of LOCALES) {
  console.log(`--- ${locale.toUpperCase()} ---`);
  try {
    const result = processLocale(locale);
    results.push(result);
    console.log(`  Entries changed: ${result.changedCount}`);
    console.log(`  JSON valid: ${result.jsonValid}`);
    if (result.samples.length > 0) {
      for (const s of result.samples) {
        console.log(`  [${s.slug}]`);
        console.log(`    BEFORE: ${s.before}`);
        console.log(`    AFTER:  ${s.after}`);
      }
    }
  } catch (e) {
    console.error(`  ERROR: ${e.message}`);
    results.push({ locale, error: e.message });
  }
  console.log('');
}

console.log('=== SUMMARY ===');
let totalChanged = 0;
for (const r of results) {
  if (r.error) {
    console.log(`  ${r.locale}: ERROR - ${r.error}`);
  } else {
    console.log(`  ${r.locale}: ${r.changedCount} descriptions changed, JSON valid: ${r.jsonValid}`);
    totalChanged += r.changedCount;
  }
}
console.log(`\nTotal descriptions modified: ${totalChanged}`);
