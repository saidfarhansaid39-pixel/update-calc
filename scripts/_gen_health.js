/**
 * Script to add 3-site-skinfold and 7-site-skinfold calculator entries
 * to GenericHealthCalculator.tsx with Jackson-Pollock formulas.
 */
const fs = require('fs')
const path = require('path')

const filePath = path.resolve(__dirname, '..', 'src/components/hub-calculators/GenericHealthCalculator.tsx')
let src = fs.readFileSync(filePath, 'utf-8')

// 1. Update CalcType union — add types after 'body-fat-caliper'
src = src.replace(
  `  | 'body-fat-caliper' | 'navy-body-fat'`,
  `  | 'body-fat-caliper' | '3-site-skinfold' | '7-site-skinfold' | 'navy-body-fat'`
)

// 2. Change calcTypeMap — point to own types instead of 'body-fat'
src = src.replace(
  `  '3-site-skinfold': 'body-fat',`,
  `  '3-site-skinfold': '3-site-skinfold',`
)
src = src.replace(
  `  '7-site-skinfold': 'body-fat',`,
  `  '7-site-skinfold': '7-site-skinfold',`
)

// 3. Add Zod schemas after bodyFatCaliperSchema
const schemaBlock = `
const skinfold3SiteSchema = z.object({
  chest: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 2 && parseFloat(v) <= 60, '2-60mm'),
  abdomen: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 2 && parseFloat(v) <= 60, '2-60mm'),
  thigh: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 2 && parseFloat(v) <= 60, '2-60mm'),
  triceps: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 2 && parseFloat(v) <= 60, '2-60mm'),
  suprailiac: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 2 && parseFloat(v) <= 60, '2-60mm'),
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 18 && parseFloat(v) <= 100, '18-100'),
  gender: z.enum(['male', 'female']),
})

const skinfold7SiteSchema = z.object({
  chest: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 2 && parseFloat(v) <= 60, '2-60mm'),
  abdomen: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 2 && parseFloat(v) <= 60, '2-60mm'),
  thigh: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 2 && parseFloat(v) <= 60, '2-60mm'),
  triceps: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 2 && parseFloat(v) <= 60, '2-60mm'),
  subscapular: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 2 && parseFloat(v) <= 60, '2-60mm'),
  suprailiac: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 2 && parseFloat(v) <= 60, '2-60mm'),
  midaxillary: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 2 && parseFloat(v) <= 60, '2-60mm'),
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 18 && parseFloat(v) <= 100, '18-100'),
  gender: z.enum(['male', 'female']),
})
`
src = src.replace(
  'const navyBodyFatSchema = z.object({',
  schemaBlock + '\nconst navyBodyFatSchema = z.object({'
)

// 4. Add to getSchemaForType
src = src.replace(
  `    'body-fat': bodyFatSchema, 'army-bf': armyBfSchema, 'heart-rate': heartRateSchema,`,
  `    'body-fat': bodyFatSchema, '3-site-skinfold': skinfold3SiteSchema, '7-site-skinfold': skinfold7SiteSchema, 'army-bf': armyBfSchema, 'heart-rate': heartRateSchema,`
)

// 5. Add result components for skinfold calculators (before LeanMassResults)
const resultComponents = `
function SkinFold3SiteResults({ chest, abdomen, thigh, triceps, suprailiac, age, gender }: { chest: number; abdomen: number; thigh: number; triceps: number; suprailiac: number; age: number; gender: string }) {
  const sum3 = gender === 'male' ? chest + abdomen + thigh : triceps + thigh + suprailiac
  const density = gender === 'male'
    ? 1.10938 - 0.0008267 * sum3 + 0.0000016 * sum3 * sum3 - 0.0002574 * age
    : 1.099421 - 0.0009929 * sum3 + 0.0000023 * sum3 * sum3 - 0.0001392 * age
  const bf = Math.max(2, Math.min(60, 495 / density - 450))
  const fatMass = 0; const lbm = 0
  const cat = bf < 10 ? 'Essential' : bf < 18 ? 'Athletic' : bf < 25 ? 'Fit' : bf < 32 ? 'Average' : 'Overweight'
  return (
    <div className="text-center space-y-4">
      <div><p className="text-sm text-gray-500">Jackson-Pollock 3-Site Body Fat</p><p className="text-3xl font-bold text-[#1a759f]">{bf.toFixed(1)}%</p></div>
      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-xs"><p className="text-gray-400">Category: <span className="font-bold text-gray-900 dark:text-white">{cat}</span></p></div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">Sum of Sites</p><p className="text-lg font-bold">{sum3.toFixed(1)} mm</p></div>
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">Body Density</p><p className="text-lg font-bold">{density.toFixed(4)} g/cm³</p></div>
      </div>
    </div>
  )
}

function SkinFold7SiteResults({ chest, abdomen, thigh, triceps, subscapular, suprailiac, midaxillary, age, gender }: { chest: number; abdomen: number; thigh: number; triceps: number; subscapular: number; suprailiac: number; midaxillary: number; age: number; gender: string }) {
  const sum7 = chest + abdomen + thigh + triceps + subscapular + suprailiac + midaxillary
  const density = gender === 'male'
    ? 1.112 - 0.00043499 * sum7 + 0.00000055 * sum7 * sum7 - 0.00028826 * age
    : 1.097 - 0.00046971 * sum7 + 0.00000056 * sum7 * sum7 - 0.00012828 * age
  const bf = Math.max(2, Math.min(60, 495 / density - 450))
  const cat = bf < 10 ? 'Essential' : bf < 18 ? 'Athletic' : bf < 25 ? 'Fit' : bf < 32 ? 'Average' : 'Overweight'
  return (
    <div className="text-center space-y-4">
      <div><p className="text-sm text-gray-500">Jackson-Pollock 7-Site Body Fat</p><p className="text-3xl font-bold text-[#1a759f]">{bf.toFixed(1)}%</p></div>
      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-xs"><p className="text-gray-400">Category: <span className="font-bold text-gray-900 dark:text-white">{cat}</span></p></div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">Sum of 7 Sites</p><p className="text-lg font-bold">{sum7.toFixed(1)} mm</p></div>
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">Body Density</p><p className="text-lg font-bold">{density.toFixed(4)} g/cm³</p></div>
      </div>
    </div>
  )
}
`
src = src.replace(
  'function LeanMassResults({ weight, height, gender, bodyFatPct }: { weight: number; height: number; gender: string; bodyFatPct: number }) {',
  resultComponents + '\nfunction LeanMassResults({ weight, height, gender, bodyFatPct }: { weight: number; height: number; gender: string; bodyFatPct: number }) {'
)

// 6. Add to getResultComponent
src = src.replace(
  `    bp: BPResults, 'army-bf': ArmyBfResults, 'lean-mass': LeanMassResults,`,
  `    bp: BPResults, 'army-bf': ArmyBfResults, '3-site-skinfold': SkinFold3SiteResults, '7-site-skinfold': SkinFold7SiteResults, 'lean-mass': LeanMassResults,`
)

// 7. Add to healthMeta
src = src.replace(
  `  'body-fat': { mainLabel: 'Body Fat', unit: '%' }, 'army-bf': { mainLabel: 'Body Fat', unit: '%' },`,
  `  'body-fat': { mainLabel: 'Body Fat', unit: '%' }, '3-site-skinfold': { mainLabel: 'Body Fat', unit: '%' }, '7-site-skinfold': { mainLabel: 'Body Fat', unit: '%' }, 'army-bf': { mainLabel: 'Body Fat', unit: '%' },`
)

// 8. Add to mainValue — insert before the 'whr' case
const mainValCases = `    case '3-site-skinfold': { const ch=n(values.chest), ab=n(values.abdomen), th=n(values.thigh), tr=n(values.triceps), su=n(values.suprailiac), ag=n(values.age); const sum3=values.gender==='male'?ch+ab+th:tr+th+su; const d=values.gender==='male'?1.10938-0.0008267*sum3+0.0000016*sum3*sum3-0.0002574*ag:1.099421-0.0009929*sum3+0.0000023*sum3*sum3-0.0001392*ag; return Math.max(2,Math.min(60,495/d-450)) }
    case '7-site-skinfold': { const ch=n(values.chest), ab=n(values.abdomen), th=n(values.thigh), tr=n(values.triceps), sb=n(values.subscapular), su=n(values.suprailiac), ma=n(values.midaxillary), ag=n(values.age); const sum7=ch+ab+th+tr+sb+su+ma; const d=values.gender==='male'?1.112-0.00043499*sum7+0.00000055*sum7*sum7-0.00028826*ag:1.097-0.00046971*sum7+0.00000056*sum7*sum7-0.00012828*ag; return Math.max(2,Math.min(60,495/d-450)) }
    case 'whr': return n(values.waist) / (n(values.hip) || 1)`
src = src.replace(
  `    case 'whr': return n(values.waist) / (n(values.hip) || 1)`,
  mainValCases
)

// 9. Add to calcDefaults
src = src.replace(
  `    'pal-calc': { sleep: '8', sedentary: '8', light: '4', moderate: '3', vigorous: '1' },`,
  `    '3-site-skinfold': { chest: '12', abdomen: '18', thigh: '16', triceps: '14', suprailiac: '10', age: '30', gender: 'male' },
    '7-site-skinfold': { chest: '12', abdomen: '18', thigh: '16', triceps: '14', subscapular: '13', suprailiac: '10', midaxillary: '11', age: '30', gender: 'male' },
    'pal-calc': { sleep: '8', sedentary: '8', light: '4', moderate: '3', vigorous: '1' },`
)

// 10. Add to healthPresetsData
src = src.replace(
  `  'pal-calc': [{ label: 'Office Worker', values: { sleep: '8', sedentary: '9', light: '4', moderate: '2', vigorous: '1' } }, { label: 'Active', values: { sleep: '7', sedentary: '6', light: '6', moderate: '3', vigorous: '2' } }],`,
  `  '3-site-skinfold': [{ label: 'Average Male', values: { chest: '12', abdomen: '18', thigh: '16', triceps: '14', suprailiac: '10', age: '30', gender: 'male' } }, { label: 'Average Female', values: { chest: '10', abdomen: '15', thigh: '18', triceps: '16', suprailiac: '12', age: '30', gender: 'female' } }],
  '7-site-skinfold': [{ label: 'Average Male', values: { chest: '12', abdomen: '18', thigh: '16', triceps: '14', subscapular: '13', suprailiac: '10', midaxillary: '11', age: '30', gender: 'male' } }, { label: 'Average Female', values: { chest: '10', abdomen: '15', thigh: '18', triceps: '16', subscapular: '14', suprailiac: '12', midaxillary: '11', age: '30', gender: 'female' } }],
  'pal-calc': [{ label: 'Office Worker', values: { sleep: '8', sedentary: '9', light: '4', moderate: '2', vigorous: '1' } }, { label: 'Active', values: { sleep: '7', sedentary: '6', light: '6', moderate: '3', vigorous: '2' } }],`
)

// 11. Add to healthFormulas
src = src.replace(
  `  'pal-calc': 'PAL = Σ(activity_hours × MET) / 24',`,
  `  '3-site-skinfold': 'BF% = (495/(1.10938 - 0.0008267×sum3 + 0.0000016×sum3² - 0.0002574×age)) - 450 (male)',
  '7-site-skinfold': 'BF% = (495/(1.112 - 0.00043499×sum7 + 0.00000055×sum7² - 0.00028826×age)) - 450 (male)',
  'pal-calc': 'PAL = Σ(activity_hours × MET) / 24',`
)

// 12. Add to formContent (after body-fat-caliper case)
src = src.replace(
  `      case 'body-fat-caliper':
        return <>{renderField('chest', 'Chest Skinfold (mm)', 'number')}{renderField('abdomen', 'Abdominal Skinfold (mm)', 'number')}{renderField('thigh', 'Thigh Skinfold (mm)', 'number')}{renderField('age', 'Age', 'number')}{renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}</>`,
  `      case 'body-fat-caliper':
        return <>{renderField('chest', 'Chest Skinfold (mm)', 'number')}{renderField('abdomen', 'Abdominal Skinfold (mm)', 'number')}{renderField('thigh', 'Thigh Skinfold (mm)', 'number')}{renderField('age', 'Age', 'number')}{renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}</>
      case '3-site-skinfold':
        return <>{renderField('chest', 'Chest Skinfold (mm)', 'number')}{renderField('abdomen', 'Abdominal Skinfold (mm)', 'number')}{renderField('thigh', 'Thigh Skinfold (mm)', 'number')}{renderField('triceps', 'Triceps Skinfold (mm)', 'number')}{renderField('suprailiac', 'Suprailiac Skinfold (mm)', 'number')}{renderField('age', 'Age', 'number')}{renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}</>
      case '7-site-skinfold':
        return <>{renderField('chest', 'Chest Skinfold (mm)', 'number')}{renderField('abdomen', 'Abdominal Skinfold (mm)', 'number')}{renderField('thigh', 'Thigh Skinfold (mm)', 'number')}{renderField('triceps', 'Triceps Skinfold (mm)', 'number')}{renderField('subscapular', 'Subscapular Skinfold (mm)', 'number')}{renderField('suprailiac', 'Suprailiac Skinfold (mm)', 'number')}{renderField('midaxillary', 'Midaxillary Skinfold (mm)', 'number')}{renderField('age', 'Age', 'number')}{renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}</>`
)

// 13. Add to result display section (the big ternary for result display)
// The skinfold calculators should show the result component below the main value
// Currently line 1976: {t !== 'bp' && <ResultComp {...values} />}
// Since the skinfold types are not 'bp', they'll automatically get their ResultComp shown

fs.writeFileSync(filePath, src, 'utf8')
console.log('✅ GenericHealthCalculator.tsx updated successfully')
