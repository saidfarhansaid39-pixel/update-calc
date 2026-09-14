import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OVERRIDES_DIR = join(__dirname, '..', 'src', 'i18n', 'calculator-overrides')

const LOCALES = ['zh-CN', 'ja', 'hi']

const TRANSLATION_DICT = {
  'zh-CN': {
    'Mean': '平均值', 'Median': '中位数', 'Mode': '众数', 'Range': '极差',
    'Variance': '方差', 'Standard Deviation': '标准差', 'Standard Error': '标准误差',
    'Z-Score': 'Z分数', 'T-Statistic': 'T统计量', 'P-Value': 'P值',
    'Confidence Interval': '置信区间', 'Margin of Error': '误差范围',
    'Correlation': '相关', 'Coefficient': '系数', 'Regression': '回归',
    'Linear': '线性', 'Multiple': '多元', 'Polynomial': '多项式',
    'Simple': '简单', 'Sample': '样本', 'Population': '总体',
    'Size': '大小', 'Proportion': '比例', 'Rate': '率',
    'Test': '检验', 'Score': '分数', 'Index': '指数',
    'Calculator': '计算器', 'Converter': '转换器',
    'Inches to CM': '英寸到厘米', 'CM to Inches': '厘米到英寸',
    'Feet to Meters': '英尺到米', 'Meters to Feet': '米到英尺',
    'Miles to KM': '英里到公里', 'KM to Miles': '公里到英里',
    'Pounds to KG': '磅到公斤', 'KG to Pounds': '公斤到磅',
    'Ounces to Grams': '盎司到克', 'Grams to Ounces': '克到盎司',
    'Gallons to Liters': '加仑到升', 'Liters to Gallons': '升到加仑',
    'Fahrenheit to Celsius': '华氏度到摄氏度', 'Celsius to Fahrenheit': '摄氏度到华氏度',
    'Square Feet': '平方英尺', 'Square Meters': '平方米',
    'Acres to Hectares': '英亩到公顷', 'Hectares to Acres': '公顷到英亩',
    'MPH to KMH': '英里每小时到公里每小时', 'KMH to MPH': '公里每小时到英里每小时',
    'Knots to MPH': '节到英里每小时', 'MPH to Knots': '英里每小时到节',
    'Meters to Yards': '米到码', 'Yards to Meters': '码到米',
    'BTU to Joules': 'BTU到焦耳', 'Joules to BTU': '焦耳到BTU',
    'Calories to Joules': '卡路里到焦耳', 'Joules to Calories': '焦耳到卡路里',
    'KW to HP': '千瓦到马力', 'HP to KW': '马力到千瓦',
    'MM to Inches': '毫米到英寸', 'Inches to MM': '英寸到毫米',
    'CM to Feet': '厘米到英尺', 'Feet to CM': '英尺到厘米',
    'Meters to KM': '米到公里', 'KM to Meters': '公里到米',
    'Miles to Yards': '英里到码', 'Yards to Miles': '码到英里',
    'Miles to Meters': '英里到米', 'Meters to Miles': '米到英里',
    'Pounds to Ounces': '磅到盎司', 'Ounces to Pounds': '盎司到磅',
    'KG to Grams': '公斤到克', 'Grams to KG': '克到公斤',
    'Stones to KG': '英石到公斤', 'KG to Stones': '公斤到英石',
    'Cups to ML': '杯到毫升', 'ML to Cups': '毫升到杯',
    'Tablespoons to ML': '汤匙到毫升', 'ML to Tablespoons': '毫升到汤匙',
    'Teaspoons to ML': '茶匙到毫升', 'ML to Teaspoons': '毫升到茶匙',
    'Pints to Liters': '品脱到升', 'Liters to Pints': '升到品脱',
    'Quarts to Liters': '夸脱到升', 'Liters to Quarts': '升到夸脱',
    'Fluid Ounces to ML': '液量盎司到毫升', 'ML to Fluid Ounces': '毫升到液量盎司',
    'Prime Number': '质数', 'Checker': '检查器',
    'Calories Burned by Activity': '按活动消耗的卡路里',
    'Salary to Hourly': '年薪到时薪', 'Hourly to Salary': '时薪到年薪',
    'Bill Splitting': '账单分摊', 'Human Age in Dog Years': '人类年龄换算狗年',
    'Steps to Miles': '步数到英里', 'Steps to KM': '步数到公里',
    'Standing Desk Height': '站立办公桌高度', 'Projector Screen Size': '投影仪屏幕尺寸',
    'Furniture Arrangement': '家具布局', 'Mortgage': '抵押贷款',
    'Affordability': '负担能力', 'Amortization': '摊销',
    'Loan': '贷款', 'Savings': '储蓄', 'Investment': '投资',
    'Retirement': '退休', 'Budget': '预算', 'Tax': '税务',
    'Interest': '利息', 'Payment': '付款', 'Debt': '债务',
    'Equity': '权益', 'Bond': '债券', 'Return': '回报',
    'Risk': '风险', 'Portfolio': '投资组合', 'Annual': '年度',
    'Monthly': '每月', 'Compound': '复利', 'Discount': '折扣',
    'Present Value': '现值', 'Future Value': '未来值',
    'Net Present Value': '净现值', 'Internal Rate of Return': '内部收益率',
    'Break-Even': '盈亏平衡', 'Analysis': '分析', 'Ratio': '比率',
    'Percentage': '百分比', 'Growth': '增长', 'Yield': '收益率',
    'Dividend': '股息', 'Payout': '支付', 'Coverage': '覆盖率',
    'Earnings Per Share': '每股收益', 'Price to Earnings': '市盈率',
    'Debt to Equity': '资产负债率', 'Current Ratio': '流动比率',
    'Quick Ratio': '速动比率', 'Profit Margin': '利润率',
    'Gross Margin': '毛利率', 'Operating Margin': '营业利润率',
    'Return on Assets': '资产回报率', 'Return on Equity': '净资产收益率',
    'Return on Investment': '投资回报率', 'Working Capital': '营运资金',
    'Cash Flow': '现金流', 'Free Cash Flow': '自由现金流',
    'Book Value': '账面价值', 'Market Value': '市场价值',
    'Weighted Average Cost of Capital': '加权平均资本成本',
    'Capital Asset Pricing Model': '资本资产定价模型',
    'Body Mass Index': '身体质量指数', 'BMI': '身体质量指数',
    'Calorie': '卡路里', 'Macro': '宏量营养素',
    'Protein': '蛋白质', 'Carbohydrate': '碳水化合物', 'Fat': '脂肪',
    'Fiber': '纤维', 'Sugar': '糖', 'Sodium': '钠',
    'Cholesterol': '胆固醇', 'Vitamin': '维生素', 'Mineral': '矿物质',
    'Ideal Weight': '理想体重', 'Body Fat': '体脂', 'Lean Mass': '瘦体重',
    'Basal Metabolic Rate': '基础代谢率', 'TDEE': '每日总能量消耗',
    'Heart Rate': '心率', 'Blood Pressure': '血压',
    'Blood Sugar': '血糖', 'Diabetes': '糖尿病',
    'Pregnancy': '怀孕', 'Due Date': '预产期', 'Ovulation': '排卵期',
    'Fertility': '生育能力', 'Conception': '受孕', 'Baby': '婴儿',
    'Growth Chart': '生长图表', 'Percentile': '百分位数',
    'Dosage': '剂量', 'Medication': '药物', 'Prescription': '处方',
    'Dental': '牙齿', 'Vision': '视力', 'Hearing': '听力',
    'Sleep': '睡眠', 'Stress': '压力', 'Anxiety': '焦虑',
    'Depression': '抑郁', 'Mood': '情绪', 'Wellness': '健康',
    'Fitness': '健身', 'Strength': '力量', 'Endurance': '耐力',
    'Flexibility': '柔韧性', 'Cardio': '有氧', 'HIIT': '高强度间歇训练',
    'Weight Loss': '减肥', 'Weight Gain': '增重', 'Muscle': '肌肉',
    'Pace': '配速', 'Distance': '距离', 'Speed': '速度',
    'Calories Burned': '消耗卡路里', 'VO2 Max': '最大摄氧量',
    'One Rep Max': '最大重复次数', '1RM': '1RM',
    'Wilks': '威尔克斯', 'Coefficient': '系数',
    'Swim': '游泳', 'Stroke': '泳姿', 'Cycling': '骑行',
    'Power': '功率', 'Cadence': '踏频',
    'Push-Up': '俯卧撑', 'Sit-Up': '仰卧起坐',
    'Cooper Test': '库珀测试', 'Beep Test': '蜂鸣测试',
    'Vertical Jump': '垂直跳跃', 'Sprint': '冲刺',
    'Agility': '敏捷性', 'Recovery': '恢复',
    '10K': '10公里', '5K': '5公里', 'Half Marathon': '半程马拉松',
    'Marathon': '马拉松', 'Race Time': '比赛时间',
    'TDEE': '每日总能量消耗', 'BMR': '基础代谢率',
    'Body Fat': '体脂率', 'Waist to Hip': '腰臀比',
    'Waist to Height': '腰高比', 'Ideal Weight': '理想体重',
    'Macro Ratio': '宏量营养素比例', 'Calorie Deficit': '热量缺口',
    'Calorie Surplus': '热量盈余', 'Meal Plan': '饮食计划',
    'Water Intake': '饮水量', 'Hydration': '补水',
    'Caffeine': '咖啡因', 'Alcohol': '酒精', 'Detox': '排毒',
    'Alkaline': '碱性', 'pH': 'pH值',
    'Serving Size': '份量', 'Recipe': '食谱',
    'Nutrition Facts': '营养成分', 'Food Label': '食品标签',
    'BMI Calculator': '身体质量指数计算器',
    'Calorie Calculator': '卡路里计算器',
    'Basal Metabolic Rate Calculator': '基础代谢率计算器',
    'Body Fat Calculator': '体脂率计算器',
    'Ideal Weight Calculator': '理想体重计算器',
    'Pace Calculator': '配速计算器',
    'One-Rep Max Calculator': '最大重复次数计算器',
    'TDEE Calculator': '每日总能量消耗计算器',
    'Heart Rate Calculator': '心率计算器',
    'Blood Pressure Calculator': '血压计算器',
    'Ovulation Calculator': '排卵期计算器',
    'Pregnancy Calculator': '怀孕计算器',
    'Due Date Calculator': '预产期计算器',
    'Macro Calculator': '宏量营养素计算器',
    'Carb Calculator': '碳水化合物计算器',
    'Protein Calculator': '蛋白质计算器',
    'Fat Calculator': '脂肪计算器',
    'Mortgage Calculator': '抵押贷款计算器',
    'Loan Calculator': '贷款计算器',
    'Savings Calculator': '储蓄计算器',
    'Investment Calculator': '投资计算器',
    'Retirement Calculator': '退休计算器',
    'Compound Interest Calculator': '复利计算器',
    'Simple Interest Calculator': '单利计算器',
    'Amortization Calculator': '摊销计算器',
    'Budget Calculator': '预算计算器',
    'Tax Calculator': '税务计算器',
    'Currency Converter': '货币转换器',
    'Sales Tax Calculator': '销售税计算器',
    'Tip Calculator': '小费计算器',
    'Discount Calculator': '折扣计算器',
    'Percentage Calculator': '百分比计算器',
    'Grade Calculator': '成绩计算器',
    'GPA Calculator': 'GPA计算器',
    'Final Grade Calculator': '期末成绩计算器',
    'Scientific Notation': '科学计数法',
    'Fraction Calculator': '分数计算器',
    'Decimal Calculator': '小数计算器',
    'Ratio Calculator': '比率计算器',
    'Proportion Calculator': '比例计算器',
    'Square Root Calculator': '平方根计算器',
    'Exponent Calculator': '指数计算器',
    'Logarithm Calculator': '对数计算器',
    'Trigonometry Calculator': '三角函数计算器',
    'Geometry Calculator': '几何计算器',
    'Area Calculator': '面积计算器',
    'Volume Calculator': '体积计算器',
    'Perimeter Calculator': '周长计算器',
  },
  'ja': {
    'Mean': '平均', 'Median': '中央値', 'Mode': '最頻値', 'Range': '範囲',
    'Variance': '分散', 'Standard Deviation': '標準偏差', 'Standard Error': '標準誤差',
    'Z-Score': 'Zスコア', 'T-Statistic': 'T統計量', 'P-Value': 'P値',
    'Confidence Interval': '信頼区間', 'Margin of Error': '誤差範囲',
    'Correlation': '相関', 'Coefficient': '係数', 'Regression': '回帰',
    'Linear': '線形', 'Multiple': '重回帰', 'Polynomial': '多項式',
    'Calculator': '計算機', 'Converter': 'コンバーター',
    'Prime Number': '素数', 'Checker': 'チェッカー',
    'Inches to CM': 'インチ→センチ', 'CM to Inches': 'センチ→インチ',
    'Feet to Meters': 'フィート→メートル', 'Meters to Feet': 'メートル→フィート',
    'Miles to KM': 'マイル→キロ', 'KM to Miles': 'キロ→マイル',
    'Pounds to KG': 'ポンド→キロ', 'KG to Pounds': 'キロ→ポンド',
    'Ounces to Grams': 'オンス→グラム', 'Grams to Ounces': 'グラム→オンス',
    'Gallons to Liters': 'ガロン→リットル', 'Liters to Gallons': 'リットル→ガロン',
    'Fahrenheit to Celsius': '華氏→摂氏', 'Celsius to Fahrenheit': '摂氏→華氏',
    'Square Feet': '平方フィート', 'Square Meters': '平方メートル',
    'Acres to Hectares': 'エーカー→ヘクタール', 'Hectares to Acres': 'ヘクタール→エーカー',
    'MPH to KMH': 'マイル毎時→キロ毎時', 'KMH to MPH': 'キロ毎時→マイル毎時',
    'Knots to MPH': 'ノット→マイル毎時', 'MPH to Knots': 'マイル毎時→ノット',
    'Meters to Yards': 'メートル→ヤード', 'Yards to Meters': 'ヤード→メートル',
    'BTU to Joules': 'BTU→ジュール', 'Joules to BTU': 'ジュール→BTU',
    'Calories to Joules': 'カロリー→ジュール', 'Joules to Calories': 'ジュール→カロリー',
    'MM to Inches': 'ミリ→インチ', 'Inches to MM': 'インチ→ミリ',
    'CM to Feet': 'センチ→フィート', 'Feet to CM': 'フィート→センチ',
    'Calories Burned by Activity': '活動別消費カロリー',
    'Salary to Hourly': '年収→時給', 'Hourly to Salary': '時給→年収',
    'Bill Splitting': '割り勘計算', 'Human Age in Dog Years': '人間年齢→犬年齢',
    'Steps to Miles': '歩数→マイル', 'Steps to KM': '歩数→キロ',
    'Standing Desk Height': 'スタンディングデスク高さ',
    'Mortgage': '住宅ローン', 'Affordability': '購入可能額',
    'Amortization': '償却', 'Loan': 'ローン', 'Savings': '貯蓄',
    'Investment': '投資', 'Retirement': '退職', 'Budget': '予算',
    'Tax': '税金', 'Interest': '金利', 'Payment': '支払い',
    'Debt': '負債', 'Compound': '複利', 'Return': '収益',
    'Body Mass Index': '体格指数', 'BMI': 'BMI',
    'Calorie': 'カロリー', 'Protein': 'タンパク質',
    'Carbohydrate': '炭水化物', 'Fat': '脂質',
    'Fitness': 'フィットネス', 'Pace': 'ペース',
    'Distance': '距離', 'Speed': '速度',
    'Calories Burned': '消費カロリー', 'Heart Rate': '心拍数',
    'Blood Pressure': '血圧', 'Blood Sugar': '血糖値',
    'Weight Loss': '減量', 'Weight Gain': '増量',
    'Muscle': '筋肉', 'Strength': '筋力',
    'Body Fat': '体脂肪率', 'Ideal Weight': '理想体重',
    'Basal Metabolic Rate': '基礎代謝率', 'TDEE': '総エネルギー消費量',
    'One Rep Max': '最大挙上重量', 'Macro': 'マクロ栄養素',
    'Ovulation': '排卵日', 'Pregnancy': '妊娠',
    'Due Date': '出産予定日', 'Sleep': '睡眠',
    'Pace Calculator': 'ペース計算機',
    'BMI Calculator': 'BMI計算機',
    'Calorie Calculator': 'カロリー計算機',
    'Mortgage Calculator': '住宅ローン計算機',
    'Loan Calculator': 'ローン計算機',
    'Savings Calculator': '貯蓄計算機',
    'Investment Calculator': '投資計算機',
    'Retirement Calculator': '退職計算機',
    'Compound Interest Calculator': '複利計算機',
    'Tax Calculator': '税金計算機',
    'Percentage Calculator': '百分率計算機',
    'Fraction Calculator': '分数計算機',
    'Area Calculator': '面積計算機',
    'Volume Calculator': '体積計算機',
    'Currency Converter': '通貨コンバーター',
    'Discount Calculator': '割引計算機',
    'Tip Calculator': 'チップ計算機',
    'Grade Calculator': '成績計算機',
    'Ideal Weight Calculator': '理想体重計算機',
    'Body Fat Calculator': '体脂肪率計算機',
    'TDEE Calculator': '総エネルギー消費量計算機',
    'Heart Rate Calculator': '心拍数計算機',
    'Ovulation Calculator': '排卵日計算機',
    'Due Date Calculator': '出産予定日計算機',
  },
  'hi': {
    'Mean': 'माध्य', 'Median': 'माध्यिका', 'Mode': 'बहुलक',
    'Range': 'परिसर', 'Variance': 'प्रसरण', 'Standard Deviation': 'मानक विचलन',
    'Standard Error': 'मानक त्रुटि', 'Z-Score': 'Z-स्कोर',
    'T-Statistic': 'T-सांख्यिकी', 'P-Value': 'P-मान',
    'Confidence Interval': 'विश्वास अंतराल', 'Margin of Error': 'त्रुटि सीमा',
    'Correlation': 'सहसंबंध', 'Coefficient': 'गुणांक', 'Regression': 'प्रतिगमन',
    'Calculator': 'कैलकुलेटर', 'Converter': 'कनवर्टर',
    'Prime Number': 'अभाज्य संख्या', 'Checker': 'जाँचकर्ता',
    'Inches to CM': 'इंच से सेंटीमीटर', 'CM to Inches': 'सेंटीमीटर से इंच',
    'Feet to Meters': 'फीट से मीटर', 'Meters to Feet': 'मीटर से फीट',
    'Miles to KM': 'मील से किलोमीटर', 'KM to Miles': 'किलोमीटर से मील',
    'Pounds to KG': 'पाउंड से किलोग्राम', 'KG to Pounds': 'किलोग्राम से पाउंड',
    'Ounces to Grams': 'औंस से ग्राम', 'Grams to Ounces': 'ग्राम से औंस',
    'Gallons to Liters': 'गैलन से लीटर', 'Liters to Gallons': 'लीटर से गैलन',
    'Fahrenheit to Celsius': 'फ़ारेनहाइट से सेल्सियस', 'Celsius to Fahrenheit': 'सेल्सियस से फ़ारेनहाइट',
    'Square Feet': 'वर्ग फीट', 'Square Meters': 'वर्ग मीटर',
    'Acres to Hectares': 'एकड़ से हेक्टेयर', 'Hectares to Acres': 'हेक्टेयर से एकड़',
    'MPH to KMH': 'मील प्रति घंटा से किमी प्रति घंटा', 'KMH to MPH': 'किमी प्रति घंटा से मील प्रति घंटा',
    'Calories Burned by Activity': 'गतिविधि द्वारा जली कैलोरी',
    'Salary to Hourly': 'वार्षिक वेतन से प्रति घंटा', 'Hourly to Salary': 'प्रति घंटा से वार्षिक वेतन',
    'Bill Splitting': 'बिल विभाजन', 'Human Age in Dog Years': 'मानव आयु कुत्ते वर्षों में',
    'Steps to Miles': 'कदम से मील', 'Steps to KM': 'कदम से किलोमीटर',
    'Standing Desk Height': 'खड़े डेस्क की ऊंचाई',
    'Mortgage': 'बंधक', 'Loan': 'ऋण', 'Savings': 'बचत',
    'Investment': 'निवेश', 'Retirement': 'सेवानिवृत्ति',
    'Budget': 'बजट', 'Tax': 'कर', 'Interest': 'ब्याज',
    'Payment': 'भुगतान', 'Debt': 'ऋण',
    'Body Mass Index': 'बॉडी मास इंडेक्स', 'BMI': 'बीएमआई',
    'Calorie': 'कैलोरी', 'Protein': 'प्रोटीन',
    'Carbohydrate': 'कार्बोहाइड्रेट', 'Fat': 'वसा',
    'Heart Rate': 'हृदय गति', 'Blood Pressure': 'रक्तचाप',
    'Blood Sugar': 'रक्त शर्करा', 'Weight Loss': 'वजन घटाना',
    'Weight Gain': 'वजन बढ़ाना', 'Body Fat': 'शरीर में वसा',
    'Ideal Weight': 'आदर्श वजन',
    'Basal Metabolic Rate': 'बेसल मेटाबोलिक दर', 'TDEE': 'कुल दैनिक ऊर्जा व्यय',
    'Pace': 'गति', 'Distance': 'दूरी', 'Speed': 'गति',
    'Calories Burned': 'जली कैलोरी', 'Fitness': 'फिटनेस',
    'Strength': 'शक्ति', 'Muscle': 'मांसपेशी',
    'Ovulation': 'ओवुलेशन', 'Pregnancy': 'गर्भावस्था',
    'Due Date': 'नियत तिथि', 'Sleep': 'नींद',
    'BMI Calculator': 'बीएमआई कैलकुलेटर',
    'Calorie Calculator': 'कैलोरी कैलकुलेटर',
    'Mortgage Calculator': 'बंधक कैलकुलेटर',
    'Loan Calculator': 'ऋण कैलकुलेटर',
    'Savings Calculator': 'बचत कैलकुलेटर',
    'Investment Calculator': 'निवेश कैलकुलेटर',
    'Retirement Calculator': 'सेवानिवृत्ति कैलकुलेटर',
    'Compound Interest Calculator': 'चक्रवृद्धि ब्याज कैलकुलेटर',
    'Tax Calculator': 'कर कैलकुलेटर',
    'Percentage Calculator': 'प्रतिशत कैलकुलेटर',
    'Fraction Calculator': 'भिन्न कैलकुलेटर',
    'Area Calculator': 'क्षेत्रफल कैलकुलेटर',
    'Volume Calculator': 'आयतन कैलकुलेटर',
    'Currency Converter': 'मुद्रा कनवर्टर',
    'Discount Calculator': 'छूट कैलकुलेटर',
    'Tip Calculator': 'टिप कैलकुलेटर',
    'Grade Calculator': 'ग्रेड कैलकुलेटर',
    'Ideal Weight Calculator': 'आदर्श वजन कैलकुलेटर',
    'Body Fat Calculator': 'शरीर में वसा कैलकुलेटर',
    'TDEE Calculator': 'कुल दैनिक ऊर्जा व्यय कैलकुलेटर',
    'Heart Rate Calculator': 'हृदय गति कैलकुलेटर',
    'Ovulation Calculator': 'ओवुलेशन कैलकुलेटर',
    'Due Date Calculator': 'नियमित तिथि कैलकुलेटर',
    'Pace Calculator': 'गति कैलकुलेटर',
  }
}

function translateTitle(title, locale) {
  const dict = TRANSLATION_DICT[locale]

  if (dict[title]) return dict[title]

  const xToYConverter = title.match(/^(.+)\s+Converter$/)
  if (xToYConverter) {
    const noun = xToYConverter[1].trim()
    const translatedNoun = dict[noun] || noun
    const suffixes = {
      'zh-CN': `${translatedNoun}转换器`,
      'ja': `${translatedNoun}コンバーター`,
      'hi': `${translatedNoun} कनवर्टर`,
    }
    return suffixes[locale]
  }

  const xToYMatch = title.match(/^(.+)\s+to\s+(.+)$/)
  if (xToYMatch) {
    const p1 = xToYMatch[1].trim()
    const p2 = xToYMatch[2].trim()
    const tp1 = dict[p1] || p1
    const tp2 = dict[p2] || p2
    const separators = {
      'zh-CN': `${tp1}到${tp2}`,
      'ja': `${tp1}→${tp2}`,
      'hi': `${tp1} से ${tp2}`,
    }
    return separators[locale]
  }

  const xCalculator = title.match(/^(.+)\s+Calculator$/)
  if (xCalculator) {
    const noun = xCalculator[1].trim()
    const translatedNoun = dict[noun] || noun
    const suffixes = {
      'zh-CN': `${translatedNoun}计算器`,
      'ja': `${translatedNoun}計算機`,
      'hi': `${translatedNoun} कैलकुलेटर`,
    }
    return suffixes[locale]
  }

  const xTest = title.match(/^(.+)\s+Test$/)
  if (xTest) {
    const noun = xTest[1].trim()
    const translatedNoun = dict[noun] || noun
    const suffixes = {
      'zh-CN': `${translatedNoun}检验`,
      'ja': `${translatedNoun}検定`,
      'hi': `${translatedNoun} परीक्षण`,
    }
    return suffixes[locale]
  }

  const xScore = title.match(/^(.+)\s+Score$/)
  if (xScore) {
    const noun = xScore[1].trim()
    const translatedNoun = dict[noun] || noun
    const suffixes = {
      'zh-CN': `${translatedNoun}分数`,
      'ja': `${translatedNoun}スコア`,
      'hi': `${translatedNoun} स्कोर`,
    }
    return suffixes[locale]
  }

  const xIndex = title.match(/^(.+)\s+Index$/)
  if (xIndex) {
    const noun = xIndex[1].trim()
    const translatedNoun = dict[noun] || noun
    const suffixes = {
      'zh-CN': `${translatedNoun}指数`,
      'ja': `${translatedNoun}指数`,
      'hi': `${translatedNoun} सूचकांक`,
    }
    return suffixes[locale]
  }

  const xRate = title.match(/^(.+)\s+Rate$/)
  if (xRate) {
    const noun = xRate[1].trim()
    const translatedNoun = dict[noun] || noun
    const suffixes = {
      'zh-CN': `${translatedNoun}率`,
      'ja': `${translatedNoun}率`,
      'hi': `${translatedNoun} दर`,
    }
    return suffixes[locale]
  }

  const xSize = title.match(/^(.+)\s+Size$/)
  if (xSize) {
    const noun = xSize[1].trim()
    const translatedNoun = dict[noun] || noun
    const suffixes = {
      'zh-CN': `${translatedNoun}尺寸`,
      'ja': `${translatedNoun}サイズ`,
      'hi': `${translatedNoun} आकार`,
    }
    return suffixes[locale]
  }

  const xByY = title.match(/^(.+)\s+by\s+(.+)$/)
  if (xByY) {
    const p1 = xByY[1].trim()
    const p2 = xByY[2].trim()
    const tp1 = dict[p1] || p1
    const tp2 = dict[p2] || p2
    const suffixes = {
      'zh-CN': `${tp1}按${tp2}`,
      'ja': `${tp1}×${tp2}`,
      'hi': `${tp1} द्वारा ${tp2}`,
    }
    return suffixes[locale]
  }

  const xVsY = title.match(/^(.+)\s+vs\.?\s+(.+)$/i)
  if (xVsY) {
    const p1 = xVsY[1].trim()
    const p2 = xVsY[2].trim()
    const tp1 = dict[p1] || p1
    const tp2 = dict[p2] || p2
    const separators = {
      'zh-CN': `${tp1}对比${tp2}`,
      'ja': `${tp1}対${tp2}`,
      'hi': `${tp1} बनाम ${tp2}`,
    }
    return separators[locale]
  }

  const xForY = title.match(/^(.+)\s+for\s+(.+)$/i)
  if (xForY) {
    const p1 = xForY[1].trim()
    const p2 = xForY[2].trim()
    const tp1 = dict[p1] || p1
    const tp2 = dict[p2] || p2
    const patterns = {
      'zh-CN': `${tp2}${tp1}`,
      'ja': `${tp2}用${tp1}`,
      'hi': `${tp2} के लिए ${tp1}`,
    }
    return patterns[locale]
  }

  return null
}

function translateDescription(title, locale) {
  const dict = TRANSLATION_DICT[locale]
  if (!dict[title]) return null
  const translatedTitle = dict[title]
  const tpl = {
    'zh-CN': `免费的${translatedTitle} — 快速准确在线计算。立即使用我们的${translatedTitle}工具获取精确结果。`,
    'ja': `無料の${translatedTitle} — 迅速かつ正確なオンライン計算。${translatedTitle}ツールで正確な結果をすぐに入手できます。`,
    'hi': `मुफ्त ${translatedTitle} — तेज़ और सटीक ऑनलाइन गणना। सटीक परिणामों के लिए हमारे ${translatedTitle} टूल का उपयोग करें।`,
  }
  return tpl[locale]
}

async function main() {
  const { calculatorRegistry } = await import('@calcuniverse/calculator-registry')
  console.log(`📖 Read ${calculatorRegistry.length} entries from registry`)

  for (const locale of LOCALES) {
    const existing = readExistingOverrides(locale)
    let translated = 0
    let skipped = 0
    let patternMatch = 0
    let dictMatch = 0

    for (const entry of calculatorRegistry) {
      const ov = existing[entry.slug]
      if (!ov) continue
      const isEnglish = /^[A-Za-z0-9\s\-'(),.:!?/]+$/.test(ov.title)
      if (!isEnglish) {
        skipped++
        continue
      }

      const newTitle = translateTitle(ov.title, locale)
      if (newTitle) {
        const newDesc = translateDescription(ov.title, locale)
        existing[entry.slug] = {
          title: newTitle,
          description: newDesc || ov.description,
        }
        translated++
        if (dictMatch === 0 && !/^(Calculator|Converter|to|Test|Score|Index|Rate|Size|by|vs)$/i.test(ov.title.split(/\s+/)[0])) {
          dictMatch++
        }
        if (TRANSLATION_DICT[locale][ov.title]) dictMatch++; else patternMatch++
      }
    }

    writeOverrides(locale, existing)
    const total = Object.keys(existing).length
    console.log(`\n${locale}:`)
    console.log(`  Total entries: ${total}`)
    console.log(`  Translated: ${translated} (${patternMatch} pattern-based, ${dictMatch} dictionary)`)
    console.log(`  Already translated: ${skipped}`)
    console.log(`  Remaining English (estimated): ${total - translated - skipped}`)
  }

  console.log('\n📊 Summary:')
  for (const locale of LOCALES) {
    const existing = readExistingOverrides(locale)
    const english = Object.entries(existing).filter(([k, v]) =>
      /^[A-Za-z0-9\s\-'(),.:!?/]+$/.test(v.title)
    ).length
    console.log(`  ${locale}: ${Object.keys(existing).length} total, ${english} English remaining`)
  }
}

function readExistingOverrides(locale) {
  const path = join(OVERRIDES_DIR, `${locale}.json`)
  if (!existsSync(path)) return {}
  try { return JSON.parse(readFileSync(path, 'utf-8')) } catch { return {} }
}

function writeOverrides(locale, data) {
  const path = join(OVERRIDES_DIR, `${locale}.json`)
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

main().catch(err => { console.error(err); process.exit(1) })
