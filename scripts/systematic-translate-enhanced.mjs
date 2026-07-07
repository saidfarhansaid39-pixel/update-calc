import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LOCALES = ['es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi', 'ja', 'zh-CN']
const OVERRIDES_DIR = join(__dirname, '..', 'src', 'i18n', 'calculator-overrides')

const CATEGORY_TERMS = {
  'bmi': { es: 'IMC', fr: 'IMC', de: 'BMI', pt: 'IMC', ru: 'ИМТ', ar: 'مؤشر كتلة الجسم', hi: 'बीएमआई', ja: 'BMI', 'zh-CN': 'BMI' },
  'bmr': { es: 'TMB', fr: 'MB', de: 'GGR', pt: 'TMB', ru: 'BMR', ar: 'معدل الأيض الأساسي', hi: 'BMR', ja: 'BMR', 'zh-CN': 'BMR' },
  'tdee': { es: 'TDEE', fr: 'TDEE', de: 'TDEE', pt: 'TDEE', ru: 'TDEE', ar: 'إجمالي استهلاك الطاقة', hi: 'TDEE', ja: 'TDEE', 'zh-CN': 'TDEE' },
  'salary': { es: 'Salario', fr: 'Salaire', de: 'Gehalt', pt: 'Salário', ru: 'Зарплата', ar: 'راتب', hi: 'वेतन', ja: '給与', 'zh-CN': '薪资' },
  'mortgage': { es: 'Hipoteca', fr: 'Hypothèque', de: 'Hypothek', pt: 'Hipoteca', ru: 'Ипотека', ar: 'رهن', hi: 'बंधक', ja: '住宅ローン', 'zh-CN': '按揭' },
  'loan': { es: 'Préstamo', fr: 'Prêt', de: 'Darlehen', pt: 'Empréstimo', ru: 'Кредит', ar: 'قرض', hi: 'ऋण', ja: 'ローン', 'zh-CN': '贷款' },
  'investment': { es: 'Inversión', fr: 'Investissement', de: 'Investition', pt: 'Investimento', ru: 'Инвестиции', ar: 'استثمار', hi: 'निवेश', ja: '投資', 'zh-CN': '投资' },
  'retirement': { es: 'Jubilación', fr: 'Retraite', de: 'Ruhestand', pt: 'Aposentadoria', ru: 'Пенсия', ar: 'تقاعد', hi: 'सेवानिवृत्ति', ja: '退職', 'zh-CN': '退休' },
  'tax': { es: 'Impuesto', fr: 'Impôt', de: 'Steuer', pt: 'Imposto', ru: 'Налог', ar: 'ضريبة', hi: 'कर', ja: '税金', 'zh-CN': '税务' },
  'interest': { es: 'Interés', fr: 'Intérêt', de: 'Zins', pt: 'Juros', ru: 'Процент', ar: 'فائدة', hi: 'ब्याज', ja: '利息', 'zh-CN': '利息' },
  'amortization': { es: 'Amortización', fr: 'Amortissement', de: 'Amortisation', pt: 'Amortização', ru: 'Амортизация', ar: 'إطفاء', hi: 'परिशोधन', ja: '償却', 'zh-CN': '摊销' },
  'savings': { es: 'Ahorro', fr: 'Épargne', de: 'Ersparnis', pt: 'Poupança', ru: 'Сбережения', ar: 'مدخرات', hi: 'बचत', ja: '貯蓄', 'zh-CN': '储蓄' },
  'budget': { es: 'Presupuesto', fr: 'Budget', de: 'Budget', pt: 'Orçamento', ru: 'Бюджет', ar: 'ميزانية', hi: 'बजट', ja: '予算', 'zh-CN': '预算' },
  'debt': { es: 'Deuda', fr: 'Dette', de: 'Schulden', pt: 'Dívida', ru: 'Долг', ar: 'دين', hi: 'ऋण', ja: '負債', 'zh-CN': '债务' },
  'credit': { es: 'Crédito', fr: 'Crédit', de: 'Kredit', pt: 'Crédito', ru: 'Кредит', ar: 'ائتمان', hi: 'क्रेडिट', ja: 'クレジット', 'zh-CN': '信用' },
  'savings': { es: 'Ahorro', fr: 'Épargne', de: 'Ersparnis', pt: 'Poupança', ru: 'Сбережения', ar: 'مدخرات', hi: 'बचत', ja: '貯蓄', 'zh-CN': '储蓄' },
  'bond': { es: 'Bono', fr: 'Obligation', de: 'Anleihe', pt: 'Título', ru: 'Облигация', ar: 'سند', hi: 'बांड', ja: '債券', 'zh-CN': '债券' },
  'inflation': { es: 'Inflación', fr: 'Inflation', de: 'Inflation', pt: 'Inflação', ru: 'Инфляция', ar: 'تضخم', hi: 'मुद्रास्फीति', ja: 'インフレ', 'zh-CN': '通胀' },
  'retirement': { es: 'Jubilación', fr: 'Retraite', de: 'Ruhestand', pt: 'Aposentadoria', ru: 'Пенсия', ar: 'تقاعد', hi: 'सेवानिवृत्ति', ja: '退職', 'zh-CN': '退休' },
  'dividend': { es: 'Dividendo', fr: 'Dividende', de: 'Dividende', pt: 'Dividendo', ru: 'Дивиденд', ar: 'أرباح', hi: 'लाभांश', ja: '配当', 'zh-CN': '股息' },
  'annuity': { es: 'Anualidad', fr: 'Rente', de: 'Rente', pt: 'Anuidade', ru: 'Аннуитет', ar: 'راتب تقاعدي', hi: 'वार्षिकी', ja: '年金', 'zh-CN': '年金' },
  'deposit': { es: 'Depósito', fr: 'Dépôt', de: 'Einzahlung', pt: 'Depósito', ru: 'Депозит', ar: 'وديعة', hi: 'जमा', ja: '預金', 'zh-CN': '存款' },
  'margin': { es: 'Margen', fr: 'Marge', de: 'Marge', pt: 'Margem', ru: 'Маржа', ar: 'هامش', hi: 'मार्जिन', ja: 'マージン', 'zh-CN': '保证金' },
  'fee': { es: 'Tarifa', fr: 'Frais', de: 'Gebühr', pt: 'Taxa', ru: 'Сбор', ar: 'رسوم', hi: 'शुल्क', ja: '手数料', 'zh-CN': '费用' },
  'acceleration': { es: 'Aceleración', fr: 'Accélération', de: 'Beschleunigung', pt: 'Aceleração', ru: 'Ускорение', ar: 'تسارع', hi: 'त्वरण', ja: '加速度', 'zh-CN': '加速度' },
  'velocity': { es: 'Velocidad', fr: 'Vitesse', de: 'Geschwindigkeit', pt: 'Velocidade', ru: 'Скорость', ar: 'سرعة', hi: 'वेग', ja: '速度', 'zh-CN': '速度' },
  'force': { es: 'Fuerza', fr: 'Force', de: 'Kraft', pt: 'Força', ru: 'Сила', ar: 'قوة', hi: 'बल', ja: '力', 'zh-CN': '力' },
  'mass': { es: 'Masa', fr: 'Masse', de: 'Masse', pt: 'Massa', ru: 'Масса', ar: 'كتلة', hi: 'द्रव्यमान', ja: '質量', 'zh-CN': '质量' },
  'weight': { es: 'Peso', fr: 'Poids', de: 'Gewicht', pt: 'Peso', ru: 'Вес', ar: 'وزن', hi: 'वज़न', ja: '体重', 'zh-CN': '体重' },
  'volume': { es: 'Volumen', fr: 'Volume', de: 'Volumen', pt: 'Volume', ru: 'Объем', ar: 'حجم', hi: 'आयतन', ja: '体積', 'zh-CN': '体积' },
  'area': { es: 'Área', fr: 'Superficie', de: 'Fläche', pt: 'Área', ru: 'Площадь', ar: 'مساحة', hi: 'क्षेत्रफल', ja: '面積', 'zh-CN': '面积' },
  'density': { es: 'Densidad', fr: 'Densité', de: 'Dichte', pt: 'Densidade', ru: 'Плотность', ar: 'كثافة', hi: 'घनत्व', ja: '密度', 'zh-CN': '密度' },
  'pressure': { es: 'Presión', fr: 'Pression', de: 'Druck', pt: 'Pressão', ru: 'Давление', ar: 'ضغط', hi: 'दबाव', ja: '圧力', 'zh-CN': '压力' },
  'energy': { es: 'Energía', fr: 'Énergie', de: 'Energie', pt: 'Energia', ru: 'Энергия', ar: 'طاقة', hi: 'ऊर्जा', ja: 'エネルギー', 'zh-CN': '能量' },
  'power': { es: 'Potencia', fr: 'Puissance', de: 'Leistung', pt: 'Potência', ru: 'Мощность', ar: 'قدرة', hi: 'शक्ति', ja: '電力', 'zh-CN': '功率' },
  'frequency': { es: 'Frecuencia', fr: 'Fréquence', de: 'Frequenz', pt: 'Frequência', ru: 'Частота', ar: 'تردد', hi: 'आवृत्ति', ja: '周波数', 'zh-CN': '频率' },
  'wavelength': { es: 'Longitud de onda', fr: 'Longueur d\'onde', de: 'Wellenlänge', pt: 'Comprimento de onda', ru: 'Длина волны', ar: 'طول موجي', hi: 'तरंगदैर्ध्य', ja: '波長', 'zh-CN': '波长' },
  'grade': { es: 'Calificación', fr: 'Note', de: 'Note', pt: 'Nota', ru: 'Оценка', ar: 'درجة', hi: 'ग्रेड', ja: '成績', 'zh-CN': '成绩' },
  'gpa': { es: 'Promedio', fr: 'Moyenne', de: 'Notendurchschnitt', pt: 'Média', ru: 'Средний балл', ar: 'المعدل التراكمي', hi: 'जीपीए', ja: 'GPA', 'zh-CN': 'GPA' },
  'calorie': { es: 'Caloría', fr: 'Calorie', de: 'Kalorie', pt: 'Caloria', ru: 'Калория', ar: 'سعرة حرارية', hi: 'कैलोरी', ja: 'カロリー', 'zh-CN': '卡路里' },
  'protein': { es: 'Proteína', fr: 'Protéine', de: 'Protein', pt: 'Proteína', ru: 'Белок', ar: 'بروتين', hi: 'प्रोटीन', ja: 'タンパク質', 'zh-CN': '蛋白质' },
  'vitamin': { es: 'Vitamina', fr: 'Vitamine', de: 'Vitamin', pt: 'Vitamina', ru: 'Витамин', ar: 'فيتامين', hi: 'विटामिन', ja: 'ビタミン', 'zh-CN': '维生素' },
  'cholesterol': { es: 'Colesterol', fr: 'Cholestérol', de: 'Cholesterin', pt: 'Colesterol', ru: 'Холестерин', ar: 'كوليسترول', hi: 'कोलेस्ट्रॉल', ja: 'コレステロール', 'zh-CN': '胆固醇' },
  'glucose': { es: 'Glucosa', fr: 'Glucose', de: 'Glukose', pt: 'Glicose', ru: 'Глюкоза', ar: 'جلوكوز', hi: 'ग्लूकोज', ja: 'グルコース', 'zh-CN': '葡萄糖' },
  'heart': { es: 'Cardíaco', fr: 'Cardiaque', de: 'Herz', pt: 'Cardíaco', ru: 'Сердечный', ar: 'قلب', hi: 'हृदय', ja: '心臓', 'zh-CN': '心脏' },
  'pregnancy': { es: 'Embarazo', fr: 'Grossesse', de: 'Schwangerschaft', pt: 'Gravidez', ru: 'Беременность', ar: 'حمل', hi: 'गर्भावस्था', ja: '妊娠', 'zh-CN': '怀孕' },
  'fertility': { es: 'Fertilidad', fr: 'Fertilité', de: 'Fruchtbarkeit', pt: 'Fertilidade', ru: 'Фертильность', ar: 'خصوبة', hi: 'प्रजनन', ja: '妊活', 'zh-CN': '生育' },
  'ovulation': { es: 'Ovulación', fr: 'Ovulation', de: 'Eisprung', pt: 'Ovulação', ru: 'Овуляция', ar: 'إباضة', hi: 'ओव्यूलेशन', ja: '排卵', 'zh-CN': '排卵' },
  'body': { es: 'Corporal', fr: 'Corporel', de: 'Körper', pt: 'Corporal', ru: 'Тела', ar: 'جسمي', hi: 'शारीरिक', ja: '体', 'zh-CN': '身体' },
  'blood': { es: 'Sangre', fr: 'Sang', de: 'Blut', pt: 'Sangue', ru: 'Кровь', ar: 'دم', hi: 'रक्त', ja: '血液', 'zh-CN': '血液' },
  'age': { es: 'Edad', fr: 'Âge', de: 'Alter', pt: 'Idade', ru: 'Возраст', ar: 'عمر', hi: 'आयु', ja: '年齢', 'zh-CN': '年龄' },
  'date': { es: 'Fecha', fr: 'Date', de: 'Datum', pt: 'Data', ru: 'Дата', ar: 'تاريخ', hi: 'तिथि', ja: '日付', 'zh-CN': '日期' },
  'time': { es: 'Tiempo', fr: 'Temps', de: 'Zeit', pt: 'Tempo', ru: 'Время', ar: 'وقت', hi: 'समय', ja: '時間', 'zh-CN': '时间' },
  'angle': { es: 'Ángulo', fr: 'Angle', de: 'Winkel', pt: 'Ângulo', ru: 'Угол', ar: 'زاوية', hi: 'कोण', ja: '角度', 'zh-CN': '角度' },
  'length': { es: 'Longitud', fr: 'Longueur', de: 'Länge', pt: 'Comprimento', ru: 'Длина', ar: 'طول', hi: 'लंबाई', ja: '長さ', 'zh-CN': '长度' },
  'distance': { es: 'Distancia', fr: 'Distance', de: 'Entfernung', pt: 'Distância', ru: 'Расстояние', ar: 'مسافة', hi: 'दूरी', ja: '距離', 'zh-CN': '距离' },
  'speed': { es: 'Velocidad', fr: 'Vitesse', de: 'Geschwindigkeit', pt: 'Velocidade', ru: 'Скорость', ar: 'سرعة', hi: 'गति', ja: '速度', 'zh-CN': '速度' },
  'temperature': { es: 'Temperatura', fr: 'Température', de: 'Temperatur', pt: 'Temperatura', ru: 'Температура', ar: 'Температура', hi: 'तापमान', ja: '温度', 'zh-CN': '温度' },
  'electric': { es: 'Eléctrico', fr: 'Électrique', de: 'Elektrisch', pt: 'Elétrico', ru: 'Электрический', ar: 'كهربائي', hi: 'विद्युत', ja: '電気', 'zh-CN': '电' },
  'current': { es: 'Corriente', fr: 'Courant', de: 'Strom', pt: 'Corrente', ru: 'Ток', ar: 'تيار', hi: 'धारा', ja: '電流', 'zh-CN': '电流' },
  'voltage': { es: 'Voltaje', fr: 'Tension', de: 'Spannung', pt: 'Tensão', ru: 'Напряжение', ar: 'جهد', hi: 'वोल्टेज', ja: '電圧', 'zh-CN': '电压' },
  'resistance': { es: 'Resistencia', fr: 'Résistance', de: 'Widerstand', pt: 'Resistência', ru: 'Сопротивление', ar: 'مقاومة', hi: 'प्रतिरोध', ja: '抵抗', 'zh-CN': '电阻' },
  'capacitance': { es: 'Capacitancia', fr: 'Capacité', de: 'Kapazität', pt: 'Capacitância', ru: 'Емкость', ar: 'سعة', hi: 'धारिता', ja: '静電容量', 'zh-CN': '电容' },
  'inductance': { es: 'Inductancia', fr: 'Inductance', de: 'Induktivität', pt: 'Indutância', ru: 'Индуктивность', ar: 'محاثة', hi: 'प्रेरकत्व', ja: 'インダクタンス', 'zh-CN': '电感' },
  'impedance': { es: 'Impedancia', fr: 'Impédance', de: 'Impedanz', pt: 'Impedância', ru: 'Импеданс', ar: 'ممانعة', hi: 'प्रतिबाधा', ja: 'インピーダンス', 'zh-CN': '阻抗' },
  'torque': { es: 'Torque', fr: 'Couple', de: 'Drehmoment', pt: 'Torque', ru: 'Крутящий момент', ar: 'عزم', hi: 'बलाघूर्ण', ja: 'トルク', 'zh-CN': '扭矩' },
  'fuel': { es: 'Combustible', fr: 'Carburant', de: 'Kraftstoff', pt: 'Combustível', ru: 'Топливо', ar: 'وقود', hi: 'ईंधन', ja: '燃料', 'zh-CN': '燃料' },
  'consumption': { es: 'Consumo', fr: 'Consommation', de: 'Verbrauch', pt: 'Consumo', ru: 'Расход', ar: 'استهلاك', hi: 'खपत', ja: '消費', 'zh-CN': '消耗' },
  'fraction': { es: 'Fracción', fr: 'Fraction', de: 'Bruch', pt: 'Fração', ru: 'Дробь', ar: 'كسر', hi: 'भिन्न', ja: '分数', 'zh-CN': '分数' },
  'decimal': { es: 'Decimal', fr: 'Décimal', de: 'Dezimal', pt: 'Decimal', ru: 'Десятичный', ar: 'عشري', hi: 'दशमलव', ja: '十進数', 'zh-CN': '十进制' },
  'percentage': { es: 'Porcentaje', fr: 'Pourcentage', de: 'Prozentsatz', pt: 'Porcentagem', ru: 'Процент', ar: 'نسبة مئوية', hi: 'प्रतिशत', ja: 'パーセンテージ', 'zh-CN': '百分比' },
  'probability': { es: 'Probabilidad', fr: 'Probabilité', de: 'Wahrscheinlichkeit', pt: 'Probabilidade', ru: 'Вероятность', ar: 'احتمال', hi: 'प्रायिकता', ja: '確率', 'zh-CN': '概率' },
  'statistics': { es: 'Estadística', fr: 'Statistique', de: 'Statistik', pt: 'Estatística', ru: 'Статистика', ar: 'إحصاءات', hi: 'सांख्यिकी', ja: '統計', 'zh-CN': '统计' },
  'standard': { es: 'Estándar', fr: 'Standard', de: 'Standard', pt: 'Padrão', ru: 'Стандартное', ar: 'قياسي', hi: 'मानक', ja: '標準', 'zh-CN': '标准' },
  'mean': { es: 'Media', fr: 'Moyenne', de: 'Mittelwert', pt: 'Média', ru: 'Среднее', ar: 'متوسط', hi: 'माध्य', ja: '平均', 'zh-CN': '平均' },
  'median': { es: 'Mediana', fr: 'Médiane', de: 'Median', pt: 'Mediana', ru: 'Медиана', ar: 'وسيط', hi: 'माध्यिका', ja: '中央値', 'zh-CN': '中位数' },
  'mode': { es: 'Moda', fr: 'Mode', de: 'Modalwert', pt: 'Moda', ru: 'Мода', ar: 'منوال', hi: 'बहुलक', ja: '最頻値', 'zh-CN': '众数' },
  'range': { es: 'Rango', fr: 'Étendue', de: 'Spannweite', pt: 'Amplitude', ru: 'Размах', ar: 'مدى', hi: 'परास', ja: '範囲', 'zh-CN': '极差' },
  'variance': { es: 'Varianza', fr: 'Variance', de: 'Varianz', pt: 'Variância', ru: 'Дисперсия', ar: 'تباين', hi: 'प्रसरण', ja: '分散', 'zh-CN': '方差' },
  'quartile': { es: 'Cuartil', fr: 'Quartile', de: 'Quartil', pt: 'Quartil', ru: 'Квартиль', ar: 'ربيع', hi: 'चतुर्थक', ja: '四分位数', 'zh-CN': '四分位数' },
  'percentile': { es: 'Percentil', fr: 'Centile', de: 'Perzentil', pt: 'Percentil', ru: 'Процентиль', ar: 'مئين', hi: 'प्रतिशतक', ja: '百分位数', 'zh-CN': '百分位数' },
  'skewness': { es: 'Asimetría', fr: 'Asymétrie', de: 'Schiefe', pt: 'Assimetria', ru: 'Асимметрия', ar: 'التواء', hi: 'विषमता', ja: '歪度', 'zh-CN': '偏度' },
  'kurtosis': { es: 'Curtosis', fr: 'Kurtosis', de: 'Kurtosis', pt: 'Curtose', ru: 'Эксцесс', ar: 'تفلطح', hi: 'कुर्टोसिस', ja: '尖度', 'zh-CN': '峰度' },
  'payment': { es: 'Pago', fr: 'Paiement', de: 'Zahlung', pt: 'Pagamento', ru: 'Платеж', ar: 'دفع', hi: 'भुगतान', ja: '支払い', 'zh-CN': '付款' },
  'return': { es: 'Rendimiento', fr: 'Rendement', de: 'Rendite', pt: 'Retorno', ru: 'Доходность', ar: 'عائد', hi: 'प्रतिफल', ja: 'リターン', 'zh-CN': '回报' },
  'yield': { es: 'Rendimiento', fr: 'Rendement', de: 'Rendite', pt: 'Rendimento', ru: 'Доходность', ar: 'عائد', hi: 'प्रतिफल', ja: '利回り', 'zh-CN': '收益率' },
  'rate': { es: 'Tasa', fr: 'Taux', de: 'Satz', pt: 'Taxa', ru: 'Ставка', ar: 'معدل', hi: 'दर', ja: 'レート', 'zh-CN': '率' },
  'ratio': { es: 'Relación', fr: 'Rapport', de: 'Verhältnis', pt: 'Razão', ru: 'Коэффициент', ar: 'نسبة', hi: 'अनुपात', ja: '比率', 'zh-CN': '比率' },
  'growth': { es: 'Crecimiento', fr: 'Croissance', de: 'Wachstum', pt: 'Crescimento', ru: 'Рост', ar: 'نمو', hi: 'वृद्धि', ja: '成長', 'zh-CN': '增长' },
  'value': { es: 'Valor', fr: 'Valeur', de: 'Wert', pt: 'Valor', ru: 'Стоимость', ar: 'قيمة', hi: 'मूल्य', ja: '価値', 'zh-CN': '价值' },
  'present': { es: 'Presente', fr: 'Actuel', de: 'Barwert', pt: 'Presente', ru: 'Текущая', ar: 'حالي', hi: 'वर्तमान', ja: '現在', 'zh-CN': '现值' },
  'future': { es: 'Futuro', fr: 'Futur', de: 'Zukunft', pt: 'Futuro', ru: 'Будущая', ar: 'مستقبلي', hi: 'भविष्य', ja: '将来', 'zh-CN': '未来' },
  'payment': { es: 'Pago', fr: 'Paiement', de: 'Zahlung', pt: 'Pagamento', ru: 'Платеж', ar: 'دفع', hi: 'भुगतान', ja: '支払い', 'zh-CN': '付款' },
  'pension': { es: 'Pensión', fr: 'Pension', de: 'Rente', pt: 'Pensão', ru: 'Пенсия', ar: 'معاش', hi: 'पेंशन', ja: '年金', 'zh-CN': '养老金' },
  'depreciation': { es: 'Depreciación', fr: 'Dépréciation', de: 'Abschreibung', pt: 'Depreciação', ru: 'Амортизация', ar: 'إهلاك', hi: 'मूल्यह्रास', ja: '減価償却', 'zh-CN': '折旧' },
  'probability': { es: 'Probabilidad', fr: 'Probabilité', de: 'Wahrscheinlichkeit', pt: 'Probabilidade', ru: 'Вероятность', ar: 'احتمال', hi: 'प्रायिकता', ja: '確率', 'zh-CN': '概率' },
  'permutation': { es: 'Permutación', fr: 'Permutation', de: 'Permutation', pt: 'Permutação', ru: 'Перестановка', ar: 'تبديل', hi: 'क्रमचय', ja: '順列', 'zh-CN': '排列' },
  'combination': { es: 'Combinación', fr: 'Combinaison', de: 'Kombination', pt: 'Combinação', ru: 'Сочетание', ar: 'توفيق', hi: 'संचय', ja: '組み合わせ', 'zh-CN': '组合' },
  'trigonometry': { es: 'Trigonometría', fr: 'Trigonométrie', de: 'Trigonometrie', pt: 'Trigonometria', ru: 'Тригонометрия', ar: 'حساب المثلثات', hi: 'त्रिकोणमिति', ja: '三角法', 'zh-CN': '三角学' },
  'logarithm': { es: 'Logaritmo', fr: 'Logarithme', de: 'Logarithmus', pt: 'Logaritmo', ru: 'Логарифм', ar: 'لوغاريتم', hi: 'लघुगणक', ja: '対数', 'zh-CN': '对数' },
  'exponent': { es: 'Exponente', fr: 'Exposant', de: 'Exponent', pt: 'Expoente', ru: 'Показатель', ar: 'أس', hi: 'घातांक', ja: '指数', 'zh-CN': '指数' },
  'square root': { es: 'Raíz cuadrada', fr: 'Racine carrée', de: 'Quadratwurzel', pt: 'Raiz quadrada', ru: 'Квадратный корень', ar: 'جذر تربيعي', hi: 'वर्गमूल', ja: '平方根', 'zh-CN': '平方根' },
  'pythagorean': { es: 'Pitagórico', fr: 'Pythagoricien', de: 'Pythagoreisch', pt: 'Pitagórico', ru: 'Пифагора', ar: 'فيثاغورس', hi: 'पाइथागोरस', ja: 'ピタゴラス', 'zh-CN': '勾股' },
  'triangle': { es: 'Triángulo', fr: 'Triangle', de: 'Dreieck', pt: 'Triângulo', ru: 'Треугольник', ar: 'مثلث', hi: 'त्रिभुज', ja: '三角形', 'zh-CN': '三角形' },
  'circle': { es: 'Círculo', fr: 'Cercle', de: 'Kreis', pt: 'Círculo', ru: 'Круг', ar: 'دائرة', hi: 'वृत्त', ja: '円', 'zh-CN': '圆形' },
  'area': { es: 'Área', fr: 'Aire', de: 'Fläche', pt: 'Área', ru: 'Площадь', ar: 'مساحة', hi: 'क्षेत्रफल', ja: '面積', 'zh-CN': '面积' },
  'perimeter': { es: 'Perímetro', fr: 'Périmètre', de: 'Umfang', pt: 'Perímetro', ru: 'Периметр', ar: 'محيط', hi: 'परिमाप', ja: '周囲', 'zh-CN': '周长' },
  'midpoint': { es: 'Punto medio', fr: 'Milieu', de: 'Mittelpunkt', pt: 'Ponto médio', ru: 'Середина', ar: 'منتصف', hi: 'मध्यबिंदु', ja: '中点', 'zh-CN': '中点' },
  'slope': { es: 'Pendiente', fr: 'Pente', de: 'Steigung', pt: 'Inclinação', ru: 'Наклон', ar: 'ميل', hi: 'ढलान', ja: '傾き', 'zh-CN': '斜率' },
  'regression': { es: 'Regresión', fr: 'Régression', de: 'Regression', pt: 'Regressão', ru: 'Регрессия', ar: 'انحدار', hi: 'प्रतिगमन', ja: '回帰', 'zh-CN': '回归' },
  'correlation': { es: 'Correlación', fr: 'Corrélation', de: 'Korrelation', pt: 'Correlação', ru: 'Корреляция', ar: 'ارتباط', hi: 'सहसंबंध', ja: '相関', 'zh-CN': '相关' },
  'hypotenuse': { es: 'Hipotenusa', fr: 'Hypoténuse', de: 'Hypotenuse', pt: 'Hipotenusa', ru: 'Гипотенуза', ar: 'وتر', hi: 'कर्ण', ja: '斜辺', 'zh-CN': '斜边' },
  'cooking': { es: 'Cocina', fr: 'Cuisine', de: 'Kochen', pt: 'Culinária', ru: 'Кулинария', ar: 'طهي', hi: 'खाना पकाना', ja: '料理', 'zh-CN': '烹饪' },
  'recipe': { es: 'Receta', fr: 'Recette', de: 'Rezept', pt: 'Receita', ru: 'Рецепт', ar: 'وصفة', hi: 'रेसिपी', ja: 'レシピ', 'zh-CN': '食谱' },
  'sleep': { es: 'Sueño', fr: 'Sommeil', de: 'Schlaf', pt: 'Sono', ru: 'Сон', ar: 'نوم', hi: 'नींद', ja: '睡眠', 'zh-CN': '睡眠' },
  'water': { es: 'Agua', fr: 'Eau', de: 'Wasser', pt: 'Água', ru: 'Вода', ar: 'ماء', hi: 'पानी', ja: '水', 'zh-CN': '水' },
  'coffee': { es: 'Café', fr: 'Café', de: 'Kaffee', pt: 'Café', ru: 'Кофе', ar: 'قهوة', hi: 'कॉफ़ी', ja: 'コーヒー', 'zh-CN': '咖啡' },
  'wine': { es: 'Vino', fr: 'Vin', de: 'Wein', pt: 'Vinho', ru: 'Вино', ar: 'نبيذ', hi: 'शराब', ja: 'ワイン', 'zh-CN': '葡萄酒' },
  'beer': { es: 'Cerveza', fr: 'Bière', de: 'Bier', pt: 'Cerveja', ru: 'Пиво', ar: 'بيرة', hi: 'बीयर', ja: 'ビール', 'zh-CN': '啤酒' },
  'password': { es: 'Contraseña', fr: 'Mot de passe', de: 'Passwort', pt: 'Senha', ru: 'Пароль', ar: 'كلمة مرور', hi: 'पासवर्ड', ja: 'パスワード', 'zh-CN': '密码' },
  'random': { es: 'Aleatorio', fr: 'Aléatoire', de: 'Zufall', pt: 'Aleatório', ru: 'Случайный', ar: 'عشوائي', hi: 'यादृच्छिक', ja: 'ランダム', 'zh-CN': '随机' },
  'generator': { es: 'Generador', fr: 'Générateur', de: 'Generator', pt: 'Gerador', ru: 'Генератор', ar: 'مولد', hi: 'जनरेटर', ja: '生成器', 'zh-CN': '生成器' },
}

const LATIN_LOCALES = ['es', 'fr', 'de', 'pt']
const UNIT_MAP = {
  inches: { es: 'Pulgadas', fr: 'Pouces', de: 'Zoll', pt: 'Polegadas', ru: 'Дюймов', ar: 'بوصة', hi: 'इंच', ja: 'インチ', 'zh-CN': '英寸' },
  inch: { es: 'Pulgada', fr: 'Pouce', de: 'Zoll', pt: 'Polegada', ru: 'Дюйм', ar: 'بوصة', hi: 'इंच', ja: 'インチ', 'zh-CN': '英寸' },
  feet: { es: 'Pies', fr: 'Pieds', de: 'Fuß', pt: 'Pés', ru: 'Футов', ar: 'قدم', hi: 'फीट', ja: 'フィート', 'zh-CN': '英尺' },
  foot: { es: 'Pie', fr: 'Pied', de: 'Fuß', pt: 'Pé', ru: 'Фут', ar: 'قدم', hi: 'फुट', ja: 'フィート', 'zh-CN': '英尺' },
  meters: { es: 'Metros', fr: 'Mètres', de: 'Meter', pt: 'Metros', ru: 'Метров', ar: 'متر', hi: 'मीटर', ja: 'メートル', 'zh-CN': '米' },
  meter: { es: 'Metro', fr: 'Mètre', de: 'Meter', pt: 'Metro', ru: 'Метр', ar: 'متر', hi: 'मीटर', ja: 'メートル', 'zh-CN': '米' },
  miles: { es: 'Millas', fr: 'Milles', de: 'Meilen', pt: 'Milhas', ru: 'Миль', ar: 'ميل', hi: 'मील', ja: 'マイル', 'zh-CN': '英里' },
  mile: { es: 'Milla', fr: 'Mille', de: 'Meile', pt: 'Milha', ru: 'Миля', ar: 'ميل', hi: 'मील', ja: 'マイル', 'zh-CN': '英里' },
  yards: { es: 'Yardas', fr: 'Yards', de: 'Yards', pt: 'Jardas', ru: 'Ярдов', ar: 'يارد', hi: 'गज', ja: 'ヤード', 'zh-CN': '码' },
  yard: { es: 'Yarda', fr: 'Yard', de: 'Yard', pt: 'Jarda', ru: 'Ярд', ar: 'يارد', hi: 'गज', ja: 'ヤード', 'zh-CN': '码' },
  kilograms: { es: 'Kilogramos', fr: 'Kilogrammes', de: 'Kilogramm', pt: 'Quilogramas', ru: 'Килограммов', ar: 'كيلوجرام', hi: 'किलोग्राम', ja: 'キログラム', 'zh-CN': '千克' },
  kilogram: { es: 'Kilogramo', fr: 'Kilogramme', de: 'Kilogramm', pt: 'Quilograma', ru: 'Килограмм', ar: 'كيلوجرام', hi: 'किलोग्राम', ja: 'キログラム', 'zh-CN': '千克' },
  grams: { es: 'Gramos', fr: 'Grammes', de: 'Gramm', pt: 'Gramas', ru: 'Граммов', ar: 'جرام', hi: 'ग्राम', ja: 'グラム', 'zh-CN': '克' },
  gram: { es: 'Gramo', fr: 'Gramme', de: 'Gramm', pt: 'Grama', ru: 'Грамм', ar: 'جرام', hi: 'ग्राम', ja: 'グラム', 'zh-CN': '克' },
  pounds: { es: 'Libras', fr: 'Livres', de: 'Pfund', pt: 'Libras', ru: 'Фунтов', ar: 'رطل', hi: 'पाउंड', ja: 'ポンド', 'zh-CN': '磅' },
  pound: { es: 'Libra', fr: 'Livre', de: 'Pfund', pt: 'Libra', ru: 'Фунт', ar: 'رطل', hi: 'पाउंड', ja: 'ポンド', 'zh-CN': '磅' },
  liters: { es: 'Litros', fr: 'Litres', de: 'Liter', pt: 'Litros', ru: 'Литров', ar: 'لتر', hi: 'लीटर', ja: 'リットル', 'zh-CN': '升' },
  liter: { es: 'Litro', fr: 'Litre', de: 'Liter', pt: 'Litro', ru: 'Литр', ar: 'لتر', hi: 'लीटर', ja: 'リットル', 'zh-CN': '升' },
  gallons: { es: 'Galones', fr: 'Gallons', de: 'Gallonen', pt: 'Galões', ru: 'Галлонов', ar: 'غالون', hi: 'गैलन', ja: 'ガロン', 'zh-CN': '加仑' },
  gallon: { es: 'Galón', fr: 'Gallon', de: 'Gallone', pt: 'Galão', ru: 'Галлон', ar: 'غالون', hi: 'गैलन', ja: 'ガロン', 'zh-CN': '加仑' },
  celsius: { es: 'Celsius', fr: 'Celsius', de: 'Celsius', pt: 'Celsius', ru: 'Цельсия', ar: 'مئوية', hi: 'सेल्सियस', ja: '摂氏', 'zh-CN': '摄氏度' },
  fahrenheit: { es: 'Fahrenheit', fr: 'Fahrenheit', de: 'Fahrenheit', pt: 'Fahrenheit', ru: 'Фаренгейта', ar: 'فهرنهايت', hi: 'फ़ारेनहाइट', ja: '華氏', 'zh-CN': '华氏度' },
}

const CALCULATOR_PATTERNS = {
  es: { calc: 'Calculadora de', converter: 'Convertidor de', to: 'a' },
  fr: { calc: 'Calculatrice', converter: 'Convertisseur de', to: 'en' },
  de: { calc: '-Rechner', converter: '-Konverter', to: 'zu' },
  pt: { calc: 'Calculadora de', converter: 'Conversor de', to: 'para' },
  ru: { calc: 'Калькулятор', converter: 'Конвертер', to: 'в' },
  ar: { calc: 'حاسبة', converter: 'محول', to: 'إلى' },
  hi: { calc: 'कैलकुलेटर', converter: 'कनवर्टर', to: 'से' },
  ja: { calc: '計算機', converter: 'コンバーター', to: '→' },
  'zh-CN': { calc: '计算器', converter: '转换器', to: '到' },
}

function readOverrides(locale) {
  const path = join(OVERRIDES_DIR, `${locale}.json`)
  if (!existsSync(path)) return {}
  try { return JSON.parse(readFileSync(path, 'utf-8')) } catch { return {} }
}

function writeOverrides(locale, data) {
  const path = join(OVERRIDES_DIR, `${locale}.json`)
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

function translateUnitWord(word, locale) {
  const lower = word.toLowerCase()
  if (UNIT_MAP[lower]) return UNIT_MAP[lower][locale] || null
  return null
}

function translateUnitsInPhrase(phrase, locale) {
  let result = phrase
  const words = result.split(/(\s+)/)
  const translated = words.map(w => {
    if (w.trim().length === 0) return w
    const transl = translateUnitWord(w, locale)
    if (transl) return transl
    return w
  })
  return translated.join('')
}

const TOOL_SUFFIXES = 'Calculator|calculator|Converter|converter|Checker|checker|Solver|solver|Analyzer|analyzer|Estimator|estimator|Finder|finder|Simplifier|simplifier|Generator|generator|Maker|maker|Splitter|splitter|Tester|tester|Predictor|predictor|Counter|counter|Designer|designer|Planner|planner|Tracker|tracker|Monitor|monitor|Manager|manager|Builder|builder'

function lookupCategoryTerm(slug, locale) {
  const slugLower = slug.toLowerCase().replace(/-/g, ' ')
  // Try exact slug match first
  if (CATEGORY_TERMS[slugLower] && CATEGORY_TERMS[slugLower][locale]) {
    return CATEGORY_TERMS[slugLower][locale]
  }
  // Try partial match — longest key first for better precision
  const sorted = Object.entries(CATEGORY_TERMS).sort((a, b) => b[0].length - a[0].length)
  for (const [key, terms] of sorted) {
    if (slugLower.includes(key) && terms[locale]) {
      return terms[locale]
    }
  }
  return null
}

function applyToolPattern(noun, locale, toolType) {
  const isCalc = toolType === 'calc'
  const isGerman = locale === 'de'
  const patterns = CALCULATOR_PATTERNS[locale]
  const tnoun = translateUnitsInPhrase(noun, locale)
  let nativeNoun = tnoun

  // Only use category dict for actual calculators, not generic nouns
  // This prevents "Checker" + "weight" lookup for something unrelated
  if (isCalc) {
    // Category lookup is fine for calculator-type tools
  }

  if (isGerman) return `${nativeNoun}-Rechner`
  if (LATIN_LOCALES.includes(locale)) return `${patterns.calc} ${nativeNoun}`
  if (locale === 'ru') return `Калькулятор ${nativeNoun}`
  if (locale === 'ar') return `حاسبة ${nativeNoun}`
  if (locale === 'hi') return `${nativeNoun} ${patterns.calc}`
  if (locale === 'ja') return `${nativeNoun}${patterns.calc}`
  if (locale === 'zh-CN') return `${nativeNoun}${patterns.calc}`
  return `${nativeNoun} ${toolType}`
}

function buildTitle(entry, locale) {
  const patterns = CALCULATOR_PATTERNS[locale]
  if (!patterns) return entry.title

  const isGerman = locale === 'de'
  const slugLower = entry.slug.toLowerCase().replace(/-/g, ' ')

  // 1) X to Y Converter/Calculator
  const converterMatch = entry.title.match(new RegExp(`^(.+?)\\s+to\\s+(.+?)\\s+(${TOOL_SUFFIXES})$`, 'i'))
  if (converterMatch) {
    const xPart = converterMatch[1].trim()
    const yPart = converterMatch[2].trim()
    const tx = translateUnitsInPhrase(xPart, locale)
    const ty = translateUnitsInPhrase(yPart, locale)

    if (isGerman) return `${tx}-zu-${ty}-Konverter`
    if (LATIN_LOCALES.includes(locale)) return `${patterns.converter} ${tx} ${patterns.to} ${ty}`
    if (locale === 'ru') return `Конвертер ${tx} в ${ty}`
    if (locale === 'ar') return `محول ${tx} إلى ${ty}`
    if (locale === 'hi') return `${tx} ${patterns.to} ${ty} ${patterns.converter}`
    if (locale === 'ja') return `${tx}${patterns.to}${ty}${patterns.converter}`
    if (locale === 'zh-CN') return `${tx}${patterns.to}${ty}${patterns.converter}`
  }

  // 2) X Calculator / Checker / Solver / etc.
  const toolMatch = entry.title.match(new RegExp(`^(.+?)\\s+(${TOOL_SUFFIXES})$`, 'i'))
  if (toolMatch) {
    const noun = toolMatch[1].trim()
    const toolType = toolMatch[2]
    const tnoun = translateUnitsInPhrase(noun, locale)
    let nativeNoun = tnoun

    // Try category dictionary for the noun
    const dictTerm = lookupCategoryTerm(entry.slug, locale)
    if (dictTerm && !/^(the|a|an|and|or|for|of|in|to|by)$/i.test(dictTerm)) {
      nativeNoun = dictTerm
    }

    return applyToolPattern(nativeNoun, locale, toolType)
  }

  return entry.title
}

function buildDescription(entry, locale) {
  const desc = entry.description || ''
  const cleanDesc = desc.replace(/^Free\s+/, '').replace(/^[—–-]\s*/, '')
  const patterns = CALCULATOR_PATTERNS[locale]

  const FREE_WORDS = {
    es: 'Gratis', fr: 'Gratuit', de: 'Kostenlos', pt: 'Grátis',
    ru: 'Бесплатный', ar: 'مجاني', hi: 'मुफ्त', ja: '無料', 'zh-CN': '免费'
  }

  const freeWord = FREE_WORDS[locale] || 'Free'

  if (LATIN_LOCALES.includes(locale)) {
    return `${freeWord} ${cleanDesc}`
  }

  // For non-Latin: prefix with native "Free" but keep rest largely in English
  // This gives at least the "Free" keyword in the right language for SEO
  return `${freeWord} ${cleanDesc}`
}

async function main() {
  const { calculatorRegistry: allEntries } = await import('@calcuniverse/calculator-registry')
  console.log(`📖 Read ${allEntries.length} entries from registry`)

  for (const locale of LOCALES) {
    const overrides = {}
    let titleChanged = 0
    let descChanged = 0

    for (const entry of allEntries) {
      const newTitle = buildTitle(entry, locale)
      const newDesc = buildDescription(entry, locale)
      overrides[entry.slug] = { title: newTitle, description: newDesc }

      if (newTitle !== entry.title) titleChanged++
      if (newDesc !== entry.description) descChanged++
    }

    writeOverrides(locale, overrides)
    console.log(`  ${locale}: ${Object.keys(overrides).length}/${allEntries.length} entries — ${titleChanged} titles translated, ${descChanged} descriptions updated`)
  }

  console.log('\n📊 Sample translations:')
  for (const locale of LOCALES) {
    const data = readOverrides(locale)
    for (const slug of ['bmi-calculator', 'inches-to-cm', 'mortgage-calculator', 'salary-calculator', 'gpa-calculator']) {
      if (data[slug]) {
        console.log(`  ${locale} ${slug}: ${data[slug].title}`)
      }
    }
  }
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err)
  process.exit(1)
})
