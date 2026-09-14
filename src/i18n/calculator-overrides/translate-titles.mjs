import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = __dirname;

const en = JSON.parse(readFileSync(join(BASE, 'en.json'), 'utf-8'));

// === WORD-LEVEL MAPPINGS ===
const wordMap = {
  es: {
    "Running Pace":"Ritmo de Carrera","Half Marathon Pace":"Ritmo de Medio Maratón",
    "Marathon Pace":"Ritmo de Maratón","5K Pace":"Ritmo 5K","10K Pace":"Ritmo 10K",
    "BMI":"IMC","VO2max":"VO2máx","Heart Rate":"Frecuencia Cardíaca",
    "Blood Pressure":"Presión Arterial","Body Fat":"Grasa Corporal",
    "Calorie":"Caloría","Protein":"Proteína","Debt to Income":"Deuda a Ingreso",
    "Loan":"Préstamo","Mortgage":"Hipoteca","Savings":"Ahorros",
    "Investment":"Inversión","Retirement":"Jubilación","Tax":"Impuesto",
    "Interest":"Interés","Amortization":"Amortización","Compound":"Compuesto",
    "and":"y","vs":"vs","to":"a","Ratio":"Relación","Rate":"Tasa",
    "Score":"Puntuación","Index":"Índice","Level":"Nivel",
    "Budget":"Presupuesto","Cost":"Costo","Fee":"Tarifa","Weight":"Peso",
    "Purity":"Pureza","Length":"Longitud","Size":"Tamaño","Grade":"Calificación",
    "Test":"Prueba","Exam":"Examen","Plan":"Plan","Check":"Verificación",
    "Timer":"Temporizador","Tool":"Herramienta","Simulator":"Simulador",
    "Roller":"Lanzador","Odds":"Probabilidades","Calculator":"Calculadora",
    "Converter":"Convertidor","Analysis":"Análisis","Value":"Valor",
    "Average":"Promedio","Total":"Total","Difference":"Diferencia",
    "Change":"Cambio","Age":"Edad","Time":"Tiempo","Date":"Fecha",
    "Number":"Número","Speed":"Velocidad","Distance":"Distancia",
    "Force":"Fuerza","Pressure":"Presión","Energy":"Energía","Power":"Potencia",
    "Frequency":"Frecuencia","Temperature":"Temperatura","Density":"Densidad",
    "Volume":"Volumen","Area":"Área","Mass":"Masa","Height":"Altura",
    "Width":"Ancho","Depth":"Profundidad","Thickness":"Grosor",
    "Diameter":"Diámetro","Radius":"Radio",
  },
  fr: {
    "Running Pace":"Allure de Course","BMI":"IMC",
    "Heart Rate":"Fréquence Cardiaque","Blood Pressure":"Tension Artérielle",
    "Body Fat":"Masse Grasse","Calorie":"Calorie",
    "Debt to Income":"Endettement","Loan":"Prêt","Mortgage":"Hypothèque",
    "Savings":"Épargne","Investment":"Investissement","Retirement":"Retraite",
    "Tax":"Impôt","Interest":"Intérêt","and":"et","vs":"vs",
    "to":"en","Ratio":"Rapport","Rate":"Taux","Score":"Score",
    "Index":"Indice","Level":"Niveau","Budget":"Budget","Cost":"Coût",
    "Fee":"Frais","Weight":"Poids","Purity":"Pureté","Length":"Longueur",
    "Size":"Taille","Grade":"Note","Test":"Test","Exam":"Examen",
    "Plan":"Plan","Check":"Vérification","Timer":"Minuteur","Tool":"Outil",
    "Simulator":"Simulateur","Roller":"Lanceur","Odds":"Cotes",
    "Calculator":"Calculateur","Converter":"Convertisseur",
    "Analysis":"Analyse","Value":"Valeur","Average":"Moyenne",
    "Age":"Âge","Time":"Temps","Date":"Date","Number":"Nombre",
    "Speed":"Vitesse","Distance":"Distance","Force":"Force",
    "Pressure":"Pression","Energy":"Énergie","Power":"Puissance",
    "Frequency":"Fréquence","Temperature":"Température","Density":"Densité",
    "Volume":"Volume","Area":"Surface","Mass":"Masse","Height":"Hauteur",
    "Width":"Largeur","Depth":"Profondeur","Thickness":"Épaisseur",
    "Diameter":"Diamètre","Radius":"Rayon",
  },
  de: {
    "Running Pace":"Lauftempo","BMI":"BMI","Heart Rate":"Herzfrequenz",
    "Blood Pressure":"Blutdruck","Body Fat":"Körperfett","Loan":"Darlehen",
    "Mortgage":"Hypothek","Savings":"Ersparnisse","Investment":"Investition",
    "Retirement":"Ruhestand","Tax":"Steuer","Interest":"Zinsen",
    "and":"und","vs":"vs","to":"zu","Ratio":"Verhältnis","Rate":"Rate",
    "Score":"Punktzahl","Index":"Index","Level":"Niveau","Budget":"Budget",
    "Cost":"Kosten","Fee":"Gebühr","Weight":"Gewicht","Purity":"Reinheit",
    "Length":"Länge","Size":"Größe","Grade":"Note","Test":"Test",
    "Exam":"Prüfung","Plan":"Plan","Check":"Prüfung","Timer":"Timer",
    "Tool":"Werkzeug","Simulator":"Simulator","Roller":"Rolle",
    "Odds":"Quoten","Calculator":"Rechner","Converter":"Konverter",
  },
  pt: {
    "Running Pace":"Ritmo de Corrida","BMI":"IMC",
    "Heart Rate":"Frequência Cardíaca","Blood Pressure":"Pressão Arterial",
    "Loan":"Empréstimo","Mortgage":"Hipoteca","Savings":"Poupança",
    "Investment":"Investimento","Retirement":"Aposentadoria","Tax":"Imposto",
    "Interest":"Juros","and":"e","vs":"vs","to":"para",
    "Ratio":"Relação","Rate":"Taxa","Score":"Pontuação","Index":"Índice",
    "Level":"Nível","Budget":"Orçamento","Cost":"Custo","Fee":"Taxa",
    "Weight":"Peso","Purity":"Pureza","Length":"Comprimento","Size":"Tamanho",
    "Grade":"Nota","Test":"Teste","Exam":"Exame","Plan":"Plano",
    "Check":"Verificação","Timer":"Temporizador","Tool":"Ferramenta",
    "Simulator":"Simulador","Roller":"Rolador","Odds":"Probabilidades",
    "Calculator":"Calculadora","Converter":"Conversor",
  },
  ru: {
    "and":"и","vs":"против","to":"в","Calculator":"Калькулятор",
    "Converter":"Конвертер","Ratio":"Соотношение","Score":"Оценка",
    "Index":"Индекс","Level":"Уровень","Test":"Тест","Exam":"Экзамен",
    "Plan":"План","Check":"Проверка","Grade":"Оценка",
    "Tool":"Инструмент","Timer":"Таймер","Simulator":"Симулятор",
    "Roller":"Бросатель","Odds":"Шансы",
  },
  ar: {
    "Running Pace":"وتيرة الجري","Heart Rate":"معدل ضربات القلب",
    "Blood Pressure":"ضغط الدم","Loan":"قرض","Mortgage":"رهن عقاري",
    "Tax":"ضريبة","and":"و","vs":"مقابل","to":"إلى",
    "Ratio":"نسبة","Rate":"معدل","Score":"درجة","Index":"مؤشر",
    "Level":"مستوى","Budget":"ميزانية","Cost":"تكلفة","Fee":"رسوم",
    "Weight":"وزن","Purity":"نقاء","Length":"طول","Size":"حجم",
    "Grade":"درجة","Test":"اختبار","Plan":"خطة","Check":"تحقق",
    "Timer":"مؤقت","Tool":"أداة","Simulator":"محاكي","Roller":"قاذف",
    "Odds":"احتمالات","Calculator":"حاسبة","Converter":"محول",
  },
  hi: {
    "and":"और","vs":"बनाम","to":"से",
    "Ratio":"अनुपात","Rate":"दर","Score":"स्कोर","Index":"सूचकांक",
    "Level":"स्तर","Budget":"बजट","Cost":"लागत","Fee":"शुल्क",
    "Weight":"वजन","Length":"लंबाई","Size":"आकार","Grade":"ग्रेड",
    "Test":"परीक्षण","Plan":"योजना","Check":"जांच","Timer":"टाइमर",
    "Tool":"उपकरण","Simulator":"सिम्युलेटर","Roller":"रोलर",
    "Odds":"संभावनाएं","Calculator":"कैलकुलेटर","Converter":"कनवर्टर",
  },
  ja: {
    "and":"と","vs":"対","to":"→",
    "Ratio":"比率","Rate":"率","Score":"スコア","Index":"指数",
    "Level":"レベル","Budget":"予算","Cost":"コスト","Fee":"料金",
    "Weight":"重量","Length":"長さ","Size":"サイズ","Grade":"成績",
    "Test":"テスト","Plan":"計画","Check":"チェック","Timer":"タイマー",
    "Tool":"ツール","Simulator":"シミュレーター","Roller":"ローラー",
    "Odds":"オッズ","Calculator":"計算機","Converter":"変換",
  },
  "zh-CN": {
    "Running Pace":"跑步配速","Heart Rate":"心率","Blood Pressure":"血压",
    "Loan":"贷款","Mortgage":"抵押贷款","Savings":"储蓄",
    "Investment":"投资","Tax":"税费","Interest":"利息",
    "and":"与","vs":"对比","to":"到",
    "Ratio":"比率","Rate":"率","Score":"分数","Index":"指数",
    "Level":"水平","Budget":"预算","Cost":"成本","Fee":"费用",
    "Weight":"重量","Length":"长度","Size":"尺寸","Grade":"成绩",
    "Test":"测试","Plan":"计划","Check":"检查","Timer":"计时器",
    "Tool":"工具","Simulator":"模拟器","Roller":"投掷器",
    "Odds":"赔率","Calculator":"计算器","Converter":"转换器",
  },
};

// === PHRASE-TRANSLATORS (pattern-based) ===
const phraseTranslators = {
  es: {
    patterns: [
      { re:/^(.+)\s+to\s+(.+)\s+Ratio\s+Calculator$/, fmt:(m)=>'Calculadora de relaci\u00f3n de '+applyWord(m[1],'es')+' a '+applyWord(m[2],'es') },
      { re:/^(.+)\s+to\s+(.+)\s+Ratio$/, fmt:(m)=>'Relaci\u00f3n de '+applyWord(m[1],'es')+' a '+applyWord(m[2],'es') },
      { re:/^(.+)\s+to\s+(.+)\s+Converter$/, fmt:(m)=>'Convertidor de '+applyWord(m[1],'es')+' a '+applyWord(m[2],'es') },
      { re:/^(.+)\s+to\s+(.+)$/, fmt:(m)=>applyWord(m[1],'es')+' a '+applyWord(m[2],'es') },
      { re:/^Free\s+(.+)\s+Calculator$/, fmt:(m)=>'Calculadora gratuita de '+applyWord(m[1],'es') },
      { re:/^Free\s+(.+)$/, fmt:(m)=>'Calculadora gratuita de '+applyWord(m[1],'es') },
      { re:/^(.+)\s+Calculator$/, fmt:(m)=>'Calculadora de '+applyWord(m[1],'es') },
      { re:/^(.+)\s+Converter$/, fmt:(m)=>'Convertidor de '+applyWord(m[1],'es') },
      { re:/^(.+)\s+Analysis$/, fmt:(m)=>'An\u00e1lisis de '+applyWord(m[1],'es') },
      { re:/^(.+)\s+Score$/, fmt:(m)=>'Puntuaci\u00f3n de '+applyWord(m[1],'es') },
      { re:/^(.+)\s+Index$/, fmt:(m)=>'\u00cdndice de '+applyWord(m[1],'es') },
      { re:/^(.+)\s+Rate$/, fmt:(m)=>'Tasa de '+applyWord(m[1],'es') },
      { re:/^(.+)\s+Ratio$/, fmt:(m)=>'Relaci\u00f3n de '+applyWord(m[1],'es') },
    ],
  },
  fr: {
    patterns: [
      { re:/^(.+)\s+to\s+(.+)\s+Converter$/, fmt:(m)=>'Convertisseur de '+applyWord(m[1],'fr')+' en '+applyWord(m[2],'fr') },
      { re:/^(.+)\s+to\s+(.+)\s+Ratio\s+Calculator$/, fmt:(m)=>'Calculateur de ratio '+applyWord(m[1],'fr')+'/'+applyWord(m[2],'fr') },
      { re:/^(.+)\s+to\s+(.+)$/, fmt:(m)=>applyWord(m[1],'fr')+' en '+applyWord(m[2],'fr') },
      { re:/^Free\s+(.+)\s+Calculator$/, fmt:(m)=>'Calculateur gratuit de '+applyWord(m[1],'fr') },
      { re:/^Free\s+(.+)$/, fmt:(m)=>'Calculateur gratuit de '+applyWord(m[1],'fr') },
      { re:/^(.+)\s+Calculator$/, fmt:(m)=>'Calculateur de '+applyWord(m[1],'fr') },
      { re:/^(.+)\s+Converter$/, fmt:(m)=>'Convertisseur de '+applyWord(m[1],'fr') },
    ],
  },
  de: {
    patterns: [
      { re:/^(.+)\s+to\s+(.+)\s+Converter$/, fmt:(m)=>applyWord(m[1],'de')+'-zu-'+applyWord(m[2],'de')+'-Konverter' },
      { re:/^(.+)\s+to\s+(.+)$/, fmt:(m)=>applyWord(m[1],'de')+' zu '+applyWord(m[2],'de') },
      { re:/^Free\s+(.+)\s+Calculator$/, fmt:(m)=>'Kostenloser '+applyWord(m[1],'de')+'-Rechner' },
      { re:/^Free\s+(.+)$/, fmt:(m)=>'Kostenloser '+applyWord(m[1],'de')+'-Rechner' },
      { re:/^(.+)\s+Calculator$/, fmt:(m)=>applyWord(m[1],'de')+'-Rechner' },
      { re:/^(.+)\s+Converter$/, fmt:(m)=>applyWord(m[1],'de')+'-Konverter' },
    ],
  },
  pt: {
    patterns: [
      { re:/^(.+)\s+to\s+(.+)\s+Converter$/, fmt:(m)=>'Conversor de '+applyWord(m[1],'pt')+' para '+applyWord(m[2],'pt') },
      { re:/^(.+)\s+to\s+(.+)$/, fmt:(m)=>applyWord(m[1],'pt')+' para '+applyWord(m[2],'pt') },
      { re:/^Free\s+(.+)\s+Calculator$/, fmt:(m)=>'Calculadora gratuita de '+applyWord(m[1],'pt') },
      { re:/^Free\s+(.+)$/, fmt:(m)=>'Calculadora gratuita de '+applyWord(m[1],'pt') },
      { re:/^(.+)\s+Calculator$/, fmt:(m)=>'Calculadora de '+applyWord(m[1],'pt') },
      { re:/^(.+)\s+Converter$/, fmt:(m)=>'Conversor de '+applyWord(m[1],'pt') },
    ],
  },
  ru: {
    patterns: [
      { re:/^(.+)\s+to\s+(.+)\s+Converter$/, fmt:(m)=>'\u041a\u043e\u043d\u0432\u0435\u0440\u0442\u0435\u0440 '+applyWord(m[1],'ru')+' \u0432 '+applyWord(m[2],'ru') },
      { re:/^(.+)\s+to\s+(.+)$/, fmt:(m)=>applyWord(m[1],'ru')+' \u0432 '+applyWord(m[2],'ru') },
      { re:/^Free\s+(.+)\s+Calculator$/, fmt:(m)=>'\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u044b\u0439 '+applyWord(m[1],'ru') },
      { re:/^Free\s+(.+)$/, fmt:(m)=>'\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u044b\u0439 '+applyWord(m[1],'ru') },
      { re:/^(.+)\s+Calculator$/, fmt:(m)=>'\u041a\u0430\u043b\u044c\u043a\u0443\u043b\u044f\u0442\u043e\u0440 '+applyWord(m[1],'ru') },
      { re:/^(.+)\s+Converter$/, fmt:(m)=>'\u041a\u043e\u043d\u0432\u0435\u0440\u0442\u0435\u0440 '+applyWord(m[1],'ru') },
    ],
  },
  ar: {
    patterns: [
      { re:/^(.+)\s+to\s+(.+)\s+Converter$/, fmt:(m)=>'\u0645\u062d\u0648\u0644 '+applyWord(m[1],'ar')+' \u0625\u0644\u0649 '+applyWord(m[2],'ar') },
      { re:/^(.+)\s+to\s+(.+)\s+Ratio$/, fmt:(m)=>'\u0646\u0633\u0628\u0629 '+applyWord(m[1],'ar')+' \u0625\u0644\u0649 '+applyWord(m[2],'ar') },
      { re:/^(.+)\s+to\s+(.+)$/, fmt:(m)=>applyWord(m[1],'ar')+' \u0625\u0644\u0649 '+applyWord(m[2],'ar') },
      { re:/^Free\s+(.+)\s+Calculator$/, fmt:(m)=>'\u062d\u0627\u0633\u0628\u0629 '+applyWord(m[1],'ar')+' \u0645\u062c\u0627\u0646\u064a\u0629' },
      { re:/^Free\s+(.+)$/, fmt:(m)=>'\u062d\u0627\u0633\u0628\u0629 '+applyWord(m[1],'ar')+' \u0645\u062c\u0627\u0646\u064a\u0629' },
      { re:/^(.+)\s+Calculator$/, fmt:(m)=>'\u062d\u0627\u0633\u0628\u0629 '+applyWord(m[1],'ar') },
      { re:/^(.+)\s+Converter$/, fmt:(m)=>'\u0645\u062d\u0648\u0644 '+applyWord(m[1],'ar') },
    ],
  },
  hi: {
    patterns: [
      { re:/^(.+)\s+to\s+(.+)\s+Converter$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0938\u0947 '+applyWord(m[2],'hi')+' \u0915\u0928\u0935\u0930\u094d\u091f\u0930' },
      { re:/^(.+)\s+to\s+(.+)$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0938\u0947 '+applyWord(m[2],'hi') },
      { re:/^Free\s+(.+)\s+Calculator$/, fmt:(m)=>'\u092e\u0941\u092b\u094d\u0924 '+applyWord(m[1],'hi')+' \u0915\u0948\u0932\u0915\u0941\u0932\u0947\u091f\u0930' },
      { re:/^Free\s+(.+)$/, fmt:(m)=>'\u092e\u0941\u092b\u094d\u0924 '+applyWord(m[1],'hi')+' \u0915\u0948\u0932\u0915\u0941\u0932\u0947\u091f\u0930' },
      { re:/^(.+)\s+Calculator$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0915\u0948\u0932\u0915\u0941\u0932\u0947\u091f\u0930' },
      { re:/^(.+)\s+Converter$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0915\u0928\u0935\u0930\u094d\u091f\u0930' },
    ],
  },
  ja: {
    patterns: [
      { re:/^(.+)\s+to\s+(.+)\s+Converter$/, fmt:(m)=>applyWord(m[1],'ja')+'\u2192'+applyWord(m[2],'ja')+'\u5909\u63db' },
      { re:/^(.+)\s+to\s+(.+)$/, fmt:(m)=>applyWord(m[1],'ja')+'\u2192'+applyWord(m[2],'ja') },
      { re:/^Free\s+(.+)\s+Calculator$/, fmt:(m)=>'\u7121\u6599\u306e'+applyWord(m[1],'ja')+'\u8a08\u7b97\u6a5f' },
      { re:/^Free\s+(.+)$/, fmt:(m)=>'\u7121\u6599\u306e'+applyWord(m[1],'ja')+'\u8a08\u7b97\u6a5f' },
      { re:/^(.+)\s+Calculator$/, fmt:(m)=>applyWord(m[1],'ja')+'\u8a08\u7b97\u6a5f' },
      { re:/^(.+)\s+Converter$/, fmt:(m)=>applyWord(m[1],'ja')+'\u5909\u63db' },
    ],
  },
  "zh-CN": {
    patterns: [
      { re:/^(.+)\s+to\s+(.+)\s+Converter$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u5230'+applyWord(m[2],'zh-CN')+'\u8f6c\u6362\u5668' },
      { re:/^(.+)\s+to\s+(.+)$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u5230'+applyWord(m[2],'zh-CN') },
      { re:/^Free\s+(.+)\s+Calculator$/, fmt:(m)=>'\u514d\u8d39'+applyWord(m[1],'zh-CN')+'\u8ba1\u7b97\u5668' },
      { re:/^Free\s+(.+)$/, fmt:(m)=>'\u514d\u8d39'+applyWord(m[1],'zh-CN')+'\u8ba1\u7b97\u5668' },
      { re:/^(.+)\s+Calculator$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u8ba1\u7b97\u5668' },
      { re:/^(.+)\s+Converter$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u8f6c\u6362\u5668' },
    ],
  },
};

// === EXACT PHRASE MAP ===
const exactPhrases = {
  es: {
    "Carat Weight":"Peso en Quilates","Gold Purity":"Pureza del Oro",
    "Silver Purity":"Pureza de la Plata","Fabric Yardage":"Metraje de Tela",
    "Yarn Weight":"Peso del Hilo","Thread Count":"N\u00famero de Hilos",
    "Candlepower":"Intensidad Luminosa","Decibel SPL":"Decibelios SPL",
    "Sone Loudness":"Sonoridad en Sones","Sample Rate":"Frecuencia de Muestreo",
    "Megapixel":"Megap\u00edxel","Aspect Ratio":"Relaci\u00f3n de Aspecto",
    "Focal Length Equivalent":"Distancia Focal Equivalente",
    "Coin Flip Simulator":"Simulador de Lanzamiento de Moneda",
    "Dice Roller":"Lanzador de Dados","Color Picker Tool":"Selector de Color",
    "Decision Maker Tool":"Generador de Decisiones",
    "Pro Material 3":"Material Pro 3","Industrial Civil 4":"Civil Industrial 4",
    "Premium Material 5":"Material Premium 5",
    "Pro Material 4":"Material Pro 4","Pro Material 5":"Material Pro 5",
    "Premium Material 3":"Material Premium 3","Premium Material 4":"Material Premium 4",
    "Industrial Civil 3":"Civil Industrial 3","Industrial Civil 5":"Civil Industrial 5",
  },
  fr: {
    "Carat Weight":"Poids en Carats","Gold Purity":"Puret\u00e9 de l'Or",
    "Silver Purity":"Puret\u00e9 de l'Argent","Fabric Yardage":"M\u00e9trage de Tissu",
    "Yarn Weight":"Poids du Fil","Thread Count":"Nombre de Fils",
    "Candlepower":"Intensit\u00e9 Lumineuse","Decibel SPL":"D\u00e9cibels SPL",
    "Sone Loudness":"Sonorit\u00e9 en Sones","Sample Rate":"Taux d'\u00c9chantillonnage",
    "Megapixel":"M\u00e9gapixel","Aspect Ratio":"Rapport d'Aspect",
    "Focal Length Equivalent":"Distance Focale \u00c9quivalente",
    "Coin Flip Simulator":"Simulateur de Pile ou Face",
    "Dice Roller":"Lanceur de D\u00e9s","Color Picker Tool":"S\u00e9lecteur de Couleur",
    "Decision Maker Tool":"G\u00e9n\u00e9rateur de D\u00e9cisions",
  },
  de: {
    "Carat Weight":"Karatgewicht","Gold Purity":"Goldreinheit",
    "Silver Purity":"Silberreinheit","Fabric Yardage":"Stoffmeter",
    "Yarn Weight":"Garngewicht","Thread Count":"Fadenzahl",
    "Candlepower":"Lichtst\u00e4rke","Decibel SPL":"Dezibel SPL",
    "Sone Loudness":"Lautheit in Sone","Sample Rate":"Abtastrate",
    "Megapixel":"Megapixel","Aspect Ratio":"Seitenverh\u00e4ltnis",
    "Focal Length Equivalent":"\u00c4quivalente Brennweite",
    "Coin Flip Simulator":"M\u00fcnzwurf-Simulator","Dice Roller":"W\u00fcrfelrolle",
    "Color Picker Tool":"Farbauswahlwerkzeug","Decision Maker Tool":"Entscheidungsgenerator",
  },
  pt: {
    "Carat Weight":"Peso em Quilates","Gold Purity":"Pureza do Ouro",
    "Silver Purity":"Pureza da Prata","Fabric Yardage":"Metragem de Tecido",
    "Yarn Weight":"Peso do Fio","Thread Count":"N\u00famero de Fios",
    "Candlepower":"Intensidade Luminosa","Decibel SPL":"Decib\u00e9is SPL",
    "Sone Loudness":"Sonoridade em Sones","Sample Rate":"Taxa de Amostragem",
    "Megapixel":"Megapixel","Aspect Ratio":"Propor\u00e7\u00e3o de Tela",
    "Focal Length Equivalent":"Dist\u00e2ncia Focal Equivalente",
    "Coin Flip Simulator":"Simulador de Cara ou Coroa","Dice Roller":"Rolador de Dados",
    "Color Picker Tool":"Seletor de Cores","Decision Maker Tool":"Gerador de Decis\u00f5es",
  },
  ru: {
    "Carat Weight":"\u0412\u0435\u0441 \u0432 \u041a\u0430\u0440\u0430\u0442\u0430\u0445",
    "Gold Purity":"\u0427\u0438\u0441\u0442\u043e\u0442\u0430 \u0417\u043e\u043b\u043e\u0442\u0430",
  },
  ar: {
    "Carat Weight":"\u0648\u0632\u0646 \u0627\u0644\u0642\u064a\u0631\u0627\u0637",
    "Gold Purity":"\u0646\u0642\u0627\u0621 \u0627\u0644\u0630\u0647\u0628",
  },
  hi: {
    "Carat Weight":"\u0915\u0948\u0930\u0947\u091f \u0935\u091c\u0928",
    "Gold Purity":"\u0938\u094b\u0928\u0947 \u0915\u0940 \u0936\u0941\u0926\u094d\u0927\u0924\u093e",
  },
  ja: {
    "Carat Weight":"\u30ab\u30e9\u30c3\u30c8\u91cd\u91cf",
    "Gold Purity":"\u91d1\u306e\u7d14\u5ea6",
  },
  "zh-CN": {
    "Carat Weight":"\u514b\u62c9\u91cd\u91cf",
    "Gold Purity":"\u9ec4\u91d1\u7eaf\u5ea6",
  },
};

function applyWord(text, locale) {
  const map = wordMap[locale] || {};
  const entries = Object.entries(map).sort((a,b)=>b[0].length-a[0].length);
  let result = text;
  for (const [enW, loc] of entries) {
    const re = new RegExp('\\b' + enW.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '\\b', 'g');
    result = result.replace(re, loc);
  }
  return result;
}

function translateExact(title, locale) {
  const map = exactPhrases[locale];
  return map ? (map[title] || null) : null;
}

function translateByPattern(title, locale) {
  const rules = phraseTranslators[locale];
  if (!rules) return null;
  for (const rule of rules.patterns) {
    const m = title.match(rule.re);
    if (m) return rule.fmt(m);
  }
  return null;
}

// Suffix patterns for common endings (Height, Size, Weight, Budget, Cost, etc.)
const suffixPatterns = {
  es: [
    { re:/^(.+)\s+Height$/, fmt:(m)=>'Altura de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Size$/, fmt:(m)=>'Tama\u00f1o de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Weight$/, fmt:(m)=>'Peso de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Length$/, fmt:(m)=>'Longitud de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Width$/, fmt:(m)=>'Ancho de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Depth$/, fmt:(m)=>'Profundidad de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Thickness$/, fmt:(m)=>'Grosor de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Budget$/, fmt:(m)=>'Presupuesto de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Cost$/, fmt:(m)=>'Costo de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Fee$/, fmt:(m)=>'Tarifa de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Count$/, fmt:(m)=>'N\u00famero de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Number$/, fmt:(m)=>'N\u00famero de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Time$/, fmt:(m)=>'Tiempo de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Age$/, fmt:(m)=>'Edad de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Speed$/, fmt:(m)=>'Velocidad de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Area$/, fmt:(m)=>'\u00c1rea de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Volume$/, fmt:(m)=>'Volumen de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Power$/, fmt:(m)=>'Potencia de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Pressure$/, fmt:(m)=>'Presi\u00f3n de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Force$/, fmt:(m)=>'Fuerza de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Density$/, fmt:(m)=>'Densidad de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Temperature$/, fmt:(m)=>'Temperatura de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Frequency$/, fmt:(m)=>'Frecuencia de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Distance$/, fmt:(m)=>'Distancia de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Mass$/, fmt:(m)=>'Masa de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Angle$/, fmt:(m)=>'\u00c1ngulo de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Grade$/, fmt:(m)=>'Calificaci\u00f3n de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Level$/, fmt:(m)=>'Nivel de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Diameter$/, fmt:(m)=>'Di\u00e1metro de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Radius$/, fmt:(m)=>'Radio de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Splitting$/, fmt:(m)=>'Divisi\u00f3n de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Arrangement$/, fmt:(m)=>'Disposici\u00f3n de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Estimate$/, fmt:(m)=>'Estimaci\u00f3n de '+applyWord(m[1],'es') },
    { re:/^(.+)\s+Payoff$/, fmt:(m)=>'Pago de '+applyWord(m[1],'es') },
  ],
  fr: [
    { re:/^(.+)\s+Height$/, fmt:(m)=>'Hauteur de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Size$/, fmt:(m)=>'Taille de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Weight$/, fmt:(m)=>'Poids de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Length$/, fmt:(m)=>'Longueur de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Width$/, fmt:(m)=>'Largeur de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Depth$/, fmt:(m)=>'Profondeur de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Budget$/, fmt:(m)=>'Budget de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Cost$/, fmt:(m)=>'Co\u00fbt de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Fee$/, fmt:(m)=>'Frais de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Count$/, fmt:(m)=>'Nombre de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Age$/, fmt:(m)=>'\u00c2ge de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Speed$/, fmt:(m)=>'Vitesse de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Pressure$/, fmt:(m)=>'Pression de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Volume$/, fmt:(m)=>'Volume de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Density$/, fmt:(m)=>'Densit\u00e9 de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Force$/, fmt:(m)=>'Force de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Power$/, fmt:(m)=>'Puissance de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Angle$/, fmt:(m)=>'Angle de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Grade$/, fmt:(m)=>'Note de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Level$/, fmt:(m)=>'Niveau de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Distance$/, fmt:(m)=>'Distance de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Time$/, fmt:(m)=>'Temps de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Area$/, fmt:(m)=>'Surface de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Temperature$/, fmt:(m)=>'Temp\u00e9rature de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Frequency$/, fmt:(m)=>'Fr\u00e9quence de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Mass$/, fmt:(m)=>'Masse de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Diameter$/, fmt:(m)=>'Diam\u00e8tre de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Radius$/, fmt:(m)=>'Rayon de '+applyWord(m[1],'fr') },
    { re:/^(.+)\s+Thickness$/, fmt:(m)=>'\u00c9paisseur de '+applyWord(m[1],'fr') },
  ],
  pt: [
    { re:/^(.+)\s+Height$/, fmt:(m)=>'Altura de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Size$/, fmt:(m)=>'Tamanho de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Weight$/, fmt:(m)=>'Peso de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Length$/, fmt:(m)=>'Comprimento de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Width$/, fmt:(m)=>'Largura de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Depth$/, fmt:(m)=>'Profundidade de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Budget$/, fmt:(m)=>'Or\u00e7amento de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Cost$/, fmt:(m)=>'Custo de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Fee$/, fmt:(m)=>'Taxa de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Count$/, fmt:(m)=>'N\u00famero de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Age$/, fmt:(m)=>'Idade de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Speed$/, fmt:(m)=>'Velocidade de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Pressure$/, fmt:(m)=>'Press\u00e3o de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Volume$/, fmt:(m)=>'Volume de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Power$/, fmt:(m)=>'Pot\u00eancia de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Force$/, fmt:(m)=>'For\u00e7a de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Density$/, fmt:(m)=>'Densidade de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Angle$/, fmt:(m)=>'\u00c2ngulo de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Level$/, fmt:(m)=>'N\u00edvel de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Distance$/, fmt:(m)=>'Dist\u00e2ncia de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Time$/, fmt:(m)=>'Tempo de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Area$/, fmt:(m)=>'\u00c1rea de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Temperature$/, fmt:(m)=>'Temperatura de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Mass$/, fmt:(m)=>'Massa de '+applyWord(m[1],'pt') },
    { re:/^(.+)\s+Thickness$/, fmt:(m)=>'Espessura de '+applyWord(m[1],'pt') },
  ],
  de: [
    { re:/^(.+)\s+Height$/, fmt:(m)=>applyWord(m[1],'de')+'-H\u00f6he' },
    { re:/^(.+)\s+Size$/, fmt:(m)=>applyWord(m[1],'de')+'-Gr\u00f6\u00dfe' },
    { re:/^(.+)\s+Weight$/, fmt:(m)=>applyWord(m[1],'de')+'-Gewicht' },
    { re:/^(.+)\s+Length$/, fmt:(m)=>applyWord(m[1],'de')+'-L\u00e4nge' },
    { re:/^(.+)\s+Width$/, fmt:(m)=>applyWord(m[1],'de')+'-Breite' },
    { re:/^(.+)\s+Depth$/, fmt:(m)=>applyWord(m[1],'de')+'-Tiefe' },
    { re:/^(.+)\s+Budget$/, fmt:(m)=>applyWord(m[1],'de')+'-Budget' },
    { re:/^(.+)\s+Cost$/, fmt:(m)=>applyWord(m[1],'de')+'-Kosten' },
    { re:/^(.+)\s+Fee$/, fmt:(m)=>applyWord(m[1],'de')+'-Geb\u00fchr' },
    { re:/^(.+)\s+Count$/, fmt:(m)=>applyWord(m[1],'de')+'-Anzahl' },
    { re:/^(.+)\s+Age$/, fmt:(m)=>applyWord(m[1],'de')+'-Alter' },
    { re:/^(.+)\s+Speed$/, fmt:(m)=>applyWord(m[1],'de')+'-Geschwindigkeit' },
    { re:/^(.+)\s+Pressure$/, fmt:(m)=>applyWord(m[1],'de')+'-Druck' },
    { re:/^(.+)\s+Volume$/, fmt:(m)=>applyWord(m[1],'de')+'-Volumen' },
    { re:/^(.+)\s+Power$/, fmt:(m)=>applyWord(m[1],'de')+'-Leistung' },
    { re:/^(.+)\s+Force$/, fmt:(m)=>applyWord(m[1],'de')+'-Kraft' },
    { re:/^(.+)\s+Density$/, fmt:(m)=>applyWord(m[1],'de')+'-Dichte' },
    { re:/^(.+)\s+Angle$/, fmt:(m)=>applyWord(m[1],'de')+'-Winkel' },
    { re:/^(.+)\s+Level$/, fmt:(m)=>applyWord(m[1],'de')+'-Niveau' },
    { re:/^(.+)\s+Distance$/, fmt:(m)=>applyWord(m[1],'de')+'-Entfernung' },
    { re:/^(.+)\s+Time$/, fmt:(m)=>applyWord(m[1],'de')+'-Zeit' },
    { re:/^(.+)\s+Area$/, fmt:(m)=>applyWord(m[1],'de')+'-Fl\u00e4che' },
    { re:/^(.+)\s+Temperature$/, fmt:(m)=>applyWord(m[1],'de')+'-Temperatur' },
    { re:/^(.+)\s+Mass$/, fmt:(m)=>applyWord(m[1],'de')+'-Masse' },
    { re:/^(.+)\s+Thickness$/, fmt:(m)=>applyWord(m[1],'de')+'-Dicke' },
    { re:/^(.+)\s+Diameter$/, fmt:(m)=>applyWord(m[1],'de')+'-Durchmesser' },
    { re:/^(.+)\s+Radius$/, fmt:(m)=>applyWord(m[1],'de')+'-Radius' },
  ],
  ru: [
    { re:/^(.+)\s+Height$/, fmt:(m)=>'\u0412\u044b\u0441\u043e\u0442\u0430 '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Size$/, fmt:(m)=>'\u0420\u0430\u0437\u043c\u0435\u0440 '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Weight$/, fmt:(m)=>'\u0412\u0435\u0441 '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Length$/, fmt:(m)=>'\u0414\u043b\u0438\u043d\u0430 '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Budget$/, fmt:(m)=>'\u0411\u044e\u0434\u0436\u0435\u0442 '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Cost$/, fmt:(m)=>'\u0421\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Age$/, fmt:(m)=>'\u0412\u043e\u0437\u0440\u0430\u0441\u0442 '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Time$/, fmt:(m)=>'\u0412\u0440\u0435\u043c\u044f '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Speed$/, fmt:(m)=>'\u0421\u043a\u043e\u0440\u043e\u0441\u0442\u044c '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Volume$/, fmt:(m)=>'\u041e\u0431\u044a\u0435\u043c '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Area$/, fmt:(m)=>'\u041f\u043b\u043e\u0449\u0430\u0434\u044c '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Power$/, fmt:(m)=>'\u041c\u043e\u0449\u043d\u043e\u0441\u0442\u044c '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Temperature$/, fmt:(m)=>'\u0422\u0435\u043c\u043f\u0435\u0440\u0430\u0442\u0443\u0440\u0430 '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Pressure$/, fmt:(m)=>'\u0414\u0430\u0432\u043b\u0435\u043d\u0438\u0435 '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Density$/, fmt:(m)=>'\u041f\u043b\u043e\u0442\u043d\u043e\u0441\u0442\u044c '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Mass$/, fmt:(m)=>'\u041c\u0430\u0441\u0441\u0430 '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Distance$/, fmt:(m)=>'\u0420\u0430\u0441\u0441\u0442\u043e\u044f\u043d\u0438\u0435 '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Force$/, fmt:(m)=>'\u0421\u0438\u043b\u0430 '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Frequency$/, fmt:(m)=>'\u0427\u0430\u0441\u0442\u043e\u0442\u0430 '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Grade$/, fmt:(m)=>'\u041e\u0446\u0435\u043d\u043a\u0430 '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Level$/, fmt:(m)=>'\u0423\u0440\u043e\u0432\u0435\u043d\u044c '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Angle$/, fmt:(m)=>'\u0423\u0433\u043e\u043b '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Count$/, fmt:(m)=>'\u041a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Number$/, fmt:(m)=>'\u0427\u0438\u0441\u043b\u043e '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Width$/, fmt:(m)=>'\u0428\u0438\u0440\u0438\u043d\u0430 '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Depth$/, fmt:(m)=>'\u0413\u043b\u0443\u0431\u0438\u043d\u0430 '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Thickness$/, fmt:(m)=>'\u0422\u043e\u043b\u0449\u0438\u043d\u0430 '+applyWord(m[1],'ru') },
    { re:/^(.+)\s+Diameter$/, fmt:(m)=>'\u0414\u0438\u0430\u043c\u0435\u0442\u0440 '+applyWord(m[1],'ru') },
  ],
  ar: [
    { re:/^(.+)\s+Height$/, fmt:(m)=>'\u0627\u0631\u062a\u0641\u0627\u0639 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Size$/, fmt:(m)=>'\u062d\u062c\u0645 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Weight$/, fmt:(m)=>'\u0648\u0632\u0646 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Length$/, fmt:(m)=>'\u0637\u0648\u0644 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Width$/, fmt:(m)=>'\u0639\u0631\u0636 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Depth$/, fmt:(m)=>'\u0639\u0645\u0642 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Budget$/, fmt:(m)=>'\u0645\u064a\u0632\u0627\u0646\u064a\u0629 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Cost$/, fmt:(m)=>'\u062a\u0643\u0644\u0641\u0629 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Age$/, fmt:(m)=>'\u0639\u0645\u0631 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Time$/, fmt:(m)=>'\u0648\u0642\u062a '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Speed$/, fmt:(m)=>'\u0633\u0631\u0639\u0629 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Volume$/, fmt:(m)=>'\u062d\u062c\u0645 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Area$/, fmt:(m)=>'\u0645\u0633\u0627\u062d\u0629 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Temperature$/, fmt:(m)=>'\u062f\u0631\u062c\u0629 \u062d\u0631\u0627\u0631\u0629 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Pressure$/, fmt:(m)=>'\u0636\u063a\u0637 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Density$/, fmt:(m)=>'\u0643\u062b\u0627\u0641\u0629 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Mass$/, fmt:(m)=>'\u0643\u062a\u0644\u0629 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Distance$/, fmt:(m)=>'\u0645\u0633\u0627\u0641\u0629 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Force$/, fmt:(m)=>'\u0642\u0648\u0629 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Power$/, fmt:(m)=>'\u0642\u062f\u0631\u0629 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Frequency$/, fmt:(m)=>'\u062a\u0631\u062f\u062f '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Grade$/, fmt:(m)=>'\u062f\u0631\u062c\u0629 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Level$/, fmt:(m)=>'\u0645\u0633\u062a\u0648\u0649 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Angle$/, fmt:(m)=>'\u0632\u0627\u0648\u064a\u0629 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Count$/, fmt:(m)=>'\u0639\u062f\u062f '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Thickness$/, fmt:(m)=>'\u0633\u0645\u0643 '+applyWord(m[1],'ar') },
    { re:/^(.+)\s+Diameter$/, fmt:(m)=>'\u0642\u0637\u0631 '+applyWord(m[1],'ar') },
  ],
  hi: [
    { re:/^(.+)\s+Height$/, fmt:(m)=>applyWord(m[1],'hi')+' \u090a\u0901\u091a\u093e\u0908' },
    { re:/^(.+)\s+Size$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0906\u0915\u093e\u0930' },
    { re:/^(.+)\s+Weight$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0935\u091c\u0928' },
    { re:/^(.+)\s+Length$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0932\u0902\u092c\u093e\u0908' },
    { re:/^(.+)\s+Budget$/, fmt:(m)=>applyWord(m[1],'hi')+' \u092c\u091c\u091f' },
    { re:/^(.+)\s+Cost$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0932\u093e\u0917\u0924' },
    { re:/^(.+)\s+Age$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0906\u092f\u0941' },
    { re:/^(.+)\s+Time$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0938\u092e\u092f' },
    { re:/^(.+)\s+Speed$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0917\u0924\u093f' },
    { re:/^(.+)\s+Volume$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0906\u092f\u0924\u0928' },
    { re:/^(.+)\s+Area$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0915\u094d\u0937\u0947\u0924\u094d\u0930\u092b\u0932' },
    { re:/^(.+)\s+Temperature$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0924\u093e\u092a\u092e\u093e\u0928' },
    { re:/^(.+)\s+Pressure$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0926\u092c\u093e\u0935' },
    { re:/^(.+)\s+Distance$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0926\u0942\u0930\u0940' },
    { re:/^(.+)\s+Force$/, fmt:(m)=>applyWord(m[1],'hi')+' \u092c\u0932' },
    { re:/^(.+)\s+Power$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0936\u0915\u094d\u0924\u093f' },
    { re:/^(.+)\s+Level$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0938\u094d\u0924\u0930' },
    { re:/^(.+)\s+Angle$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0915\u094b\u0923' },
    { re:/^(.+)\s+Width$/, fmt:(m)=>applyWord(m[1],'hi')+' \u091a\u094c\u0921\u093c\u093e\u0908' },
    { re:/^(.+)\s+Depth$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0917\u0939\u0930\u093e\u0908' },
    { re:/^(.+)\s+Thickness$/, fmt:(m)=>applyWord(m[1],'hi')+' \u092e\u094b\u091f\u093e\u0908' },
    { re:/^(.+)\s+Mass$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0926\u094d\u0930\u0935\u094d\u092f\u092e\u093e\u0928' },
    { re:/^(.+)\s+Frequency$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0906\u0935\u0943\u0924\u094d\u0924\u093f' },
    { re:/^(.+)\s+Grade$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0917\u094d\u0930\u0947\u0921' },
    { re:/^(.+)\s+Density$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0918\u0928\u0924\u094d\u0935' },
    { re:/^(.+)\s+Count$/, fmt:(m)=>applyWord(m[1],'hi')+' \u0917\u093f\u0928\u0924\u0940' },
  ],
  ja: [
    { re:/^(.+)\s+Height$/, fmt:(m)=>applyWord(m[1],'ja')+'\u9ad8\u3055' },
    { re:/^(.+)\s+Size$/, fmt:(m)=>applyWord(m[1],'ja')+'\u30b5\u30a4\u30ba' },
    { re:/^(.+)\s+Weight$/, fmt:(m)=>applyWord(m[1],'ja')+'\u91cd\u3055' },
    { re:/^(.+)\s+Length$/, fmt:(m)=>applyWord(m[1],'ja')+'\u9577\u3055' },
    { re:/^(.+)\s+Width$/, fmt:(m)=>applyWord(m[1],'ja')+'\u5e45' },
    { re:/^(.+)\s+Depth$/, fmt:(m)=>applyWord(m[1],'ja')+'\u6df1\u3055' },
    { re:/^(.+)\s+Budget$/, fmt:(m)=>applyWord(m[1],'ja')+'\u4e88\u7b97' },
    { re:/^(.+)\s+Cost$/, fmt:(m)=>applyWord(m[1],'ja')+'\u30b3\u30b9\u30c8' },
    { re:/^(.+)\s+Age$/, fmt:(m)=>applyWord(m[1],'ja')+'\u5e74\u9f62' },
    { re:/^(.+)\s+Time$/, fmt:(m)=>applyWord(m[1],'ja')+'\u6642\u9593' },
    { re:/^(.+)\s+Speed$/, fmt:(m)=>applyWord(m[1],'ja')+'\u901f\u5ea6' },
    { re:/^(.+)\s+Volume$/, fmt:(m)=>applyWord(m[1],'ja')+'\u5bb9\u7a4d' },
    { re:/^(.+)\s+Area$/, fmt:(m)=>applyWord(m[1],'ja')+'\u9762\u7a4d' },
    { re:/^(.+)\s+Temperature$/, fmt:(m)=>applyWord(m[1],'ja')+'\u6e29\u5ea6' },
    { re:/^(.+)\s+Pressure$/, fmt:(m)=>applyWord(m[1],'ja')+'\u5727\u529b' },
    { re:/^(.+)\s+Density$/, fmt:(m)=>applyWord(m[1],'ja')+'\u5bc6\u5ea6' },
    { re:/^(.+)\s+Mass$/, fmt:(m)=>applyWord(m[1],'ja')+'\u8cea\u91cf' },
    { re:/^(.+)\s+Distance$/, fmt:(m)=>applyWord(m[1],'ja')+'\u8ddd\u96e2' },
    { re:/^(.+)\s+Force$/, fmt:(m)=>applyWord(m[1],'ja')+'\u529b' },
    { re:/^(.+)\s+Power$/, fmt:(m)=>applyWord(m[1],'ja')+'\u529b\u5b66' },
    { re:/^(.+)\s+Frequency$/, fmt:(m)=>applyWord(m[1],'ja')+'\u5468\u6ce2\u6570' },
    { re:/^(.+)\s+Level$/, fmt:(m)=>applyWord(m[1],'ja')+'\u30ec\u30d9\u30eb' },
    { re:/^(.+)\s+Angle$/, fmt:(m)=>applyWord(m[1],'ja')+'\u89d2\u5ea6' },
    { re:/^(.+)\s+Thickness$/, fmt:(m)=>applyWord(m[1],'ja')+'\u539a\u3055' },
    { re:/^(.+)\s+Diameter$/, fmt:(m)=>applyWord(m[1],'ja')+'\u76f4\u5f84' },
    { re:/^(.+)\s+Grade$/, fmt:(m)=>applyWord(m[1],'ja')+'\u6210\u7e3e' },
    { re:/^(.+)\s+Count$/, fmt:(m)=>applyWord(m[1],'ja')+'\u6570' },
  ],
  "zh-CN": [
    { re:/^(.+)\s+Height$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u9ad8\u5ea6' },
    { re:/^(.+)\s+Size$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u5c3a\u5bf8' },
    { re:/^(.+)\s+Weight$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u91cd\u91cf' },
    { re:/^(.+)\s+Length$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u957f\u5ea6' },
    { re:/^(.+)\s+Width$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u5bbd\u5ea6' },
    { re:/^(.+)\s+Depth$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u6df1\u5ea6' },
    { re:/^(.+)\s+Budget$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u9884\u7b97' },
    { re:/^(.+)\s+Cost$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u6210\u672c' },
    { re:/^(.+)\s+Age$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u5e74\u9f84' },
    { re:/^(.+)\s+Time$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u65f6\u95f4' },
    { re:/^(.+)\s+Speed$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u901f\u5ea6' },
    { re:/^(.+)\s+Volume$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u4f53\u79ef' },
    { re:/^(.+)\s+Area$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u9762\u79ef' },
    { re:/^(.+)\s+Temperature$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u6e29\u5ea6' },
    { re:/^(.+)\s+Pressure$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u538b\u529b' },
    { re:/^(.+)\s+Density$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u5bc6\u5ea6' },
    { re:/^(.+)\s+Mass$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u8d28\u91cf' },
    { re:/^(.+)\s+Distance$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u8ddd\u79bb' },
    { re:/^(.+)\s+Force$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u529b' },
    { re:/^(.+)\s+Power$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u529f\u7387' },
    { re:/^(.+)\s+Frequency$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u9891\u7387' },
    { re:/^(.+)\s+Level$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u6c34\u5e73' },
    { re:/^(.+)\s+Angle$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u89d2\u5ea6' },
    { re:/^(.+)\s+Thickness$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u539a\u5ea6' },
    { re:/^(.+)\s+Diameter$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u76f4\u5f84' },
    { re:/^(.+)\s+Grade$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u6210\u7ee9' },
    { re:/^(.+)\s+Count$/, fmt:(m)=>applyWord(m[1],'zh-CN')+'\u6570\u91cf' },
  ],
};

function translateBySuffix(title, locale) {
  const rules = suffixPatterns[locale];
  if (!rules) return null;
  for (const rule of rules) {
    const m = title.match(rule.re);
    if (m) return rule.fmt(m);
  }
  return null;
}

// === MAIN ===
const locales = ['es','fr','de','pt','ru','ar','hi','ja','zh-CN'];

for (const locale of locales) {
  const fp = join(BASE, locale+'.json');
  const bp = join(BASE, locale+'.json.bak');
  if (!existsSync(bp)) copyFileSync(fp, bp);
  
  const data = JSON.parse(readFileSync(fp, 'utf-8'));
  let changed = 0;
  const samples = [];
  
  for (const key of Object.keys(en)) {
    if (!data[key]) continue;
    const enT = en[key].title;
    if (enT === data[key].title) {
      let t = translateExact(enT, locale);
      t = t || translateByPattern(enT, locale);
      t = t || translateBySuffix(enT, locale);
      if (t) {
        if (samples.length<5) samples.push({key, before: enT, after: t});
        data[key].title = t;
        changed++;
      }
    }
  }
  
  writeFileSync(fp, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log(locale+': changed='+changed);
  for (const s of samples) console.log('  '+s.key+': "'+s.before+'" \u2192 "'+s.after+'"');
}

console.log('\n=== VERIFY ===');
for (const loc of ['en',...locales]) {
  try {
    const d = JSON.parse(readFileSync(join(BASE, loc+'.json'), 'utf-8'));
    console.log(loc+'.json: OK ('+Object.keys(d).length+')');
  } catch(e) { console.log(loc+'.json: INVALID - '+e.message); }
}

console.log('\n=== REMAINING ENGLISH ===');
for (const locale of locales) {
  const data = JSON.parse(readFileSync(join(BASE, locale+'.json'), 'utf-8'));
  let n=0; const s=[];
  for (const k of Object.keys(en)) {
    if (data[k] && data[k].title === en[k].title) {
      if (n<5) s.push(en[k].title);
      n++;
    }
  }
  console.log(locale+': '+n+' remaining');
  if (s.length) console.log('  e.g.: '+s.join('; '));
}
