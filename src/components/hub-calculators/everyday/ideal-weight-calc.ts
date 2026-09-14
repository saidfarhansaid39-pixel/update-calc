import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ heightInches: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gender: z.string().min(1).refine(v => v === 'male' || v === 'female', 'male/female') }),
  fields: [
    { name: 'heightInches', label: 'Height (inches)', type: 'number', min: 36, max: 96, step: '1' },
    { name: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
  ],
  defaults: { heightInches: "68", gender: "male" },
  presets: [
    { label: "5'4\" Female", values: { heightInches: "64", gender: "female" } },
    { label: "5'8\" Female", values: { heightInches: "68", gender: "female" } },
    { label: "5'10\" Male", values: { heightInches: "70", gender: "male" } },
    { label: "6'2\" Male", values: { heightInches: "74", gender: "male" } },
  ],
  compute: (v) => { const h = parseFloat(v.heightInches)||0; const isMale = v.gender === 'male'; const base = h > 60 ? (h - 60) * (isMale ? 6 : 5) : 0; const devine = isMale ? 110 + base : 100 + base; const robinson = isMale ? 114 + base : 105 + base; const miller = isMale ? 112 + base : 105 + base; const hamwi = isMale ? 106 + base : 100 + base; const avg = (devine + robinson + miller + hamwi) / 4; const bmi23Weight = h * h * 23 / 703; const bmi25Weight = h * h * 25 / 703; const rangeLow = avg * 0.9; const rangeHigh = avg * 1.1; const ft = Math.floor(h / 12); const inches = h % 12; return { result: avg, label: 'Average Ideal Weight', unit: 'lb', steps: [{ label: 'Height', value: `${ft}'${inches}" (${h} in)` }, { label: 'Gender', value: isMale ? 'Male' : 'Female' }, { label: 'Devine Formula', value: `${devine.toFixed(0)} lb (developed for medication dosing)` }, { label: 'Robinson Formula', value: `${robinson.toFixed(0)} lb` }, { label: 'Miller Formula', value: `${miller.toFixed(0)} lb` }, { label: 'Hamwi Formula', value: `${hamwi.toFixed(0)} lb` }, { label: 'Average of All 4', value: `${avg.toFixed(0)} lb` }, { label: 'Healthy BMI Range', value: `${bmi23Weight.toFixed(0)} - ${bmi25Weight.toFixed(0)} lb (BMI 23-25)` }] ,
    extras: [
      { label: "Origin of These Formulas", value: "Devine (1974): developed for gentamicin dosing | Robinson (1983): revised from Devine | Miller (1983): alternative adjustment | Hamwi (1964): original rule of thumb. None were developed for weight assessment — they are medication dosing tools." },
      { label: "Why BMI Still Matters", value: "BMI 18.5-24.9 = normal weight | 25-29.9 = overweight | 30+ = obese. However, BMI doesn't distinguish muscle from fat. An athlete may have BMI >25 with very low body fat. Waist circumference and body fat % give better health assessment." },
      { label: "Body Composition > Scale Weight", value: "Two people at the same height and weight can have very different health profiles based on muscle mass vs fat mass. Healthy body fat: men 10-20%, women 20-30%. Use calipers or DEXA scan for accurate measurement." },
      { label: "Waist Circumference Risk", value: "Waist >40 in (men) or >35 in (women) indicates increased risk for metabolic syndrome, type 2 diabetes, and cardiovascular disease regardless of total body weight." },
      { label: "Muscle Mass Consideration", value: "These formulas underestimate ideal weight for muscular individuals by 10-20+ lb. A bodybuilder at 5'10\" may weigh 200 lb with 10% body fat — well above any formula but perfectly healthy." },
      { label: "Age-Related Changes", value: "Muscle mass naturally declines ~3-5% per decade after age 30 (sarcopenia). Ideal weight ranges should be adjusted downward slightly for older adults, but weight stability is more important than hitting a specific number." },
      { label: "Weight Loss Realistic Goals", value: "Aim for 1-2 lb/week loss maximum. Sustainable weight loss: 5-10% of body weight over 6 months. Even 5% loss significantly improves blood pressure, cholesterol, and blood sugar." },
      { label: "Health at Every Size", value: "Focus on health behaviors (balanced diet, regular exercise, adequate sleep, stress management) rather than a number on the scale. Many people are metabolically healthy at weights above these ideal ranges." },
    ]} },
  description: 'Calculate ideal body weight using four standard medical formulas (Devine, Robinson, Miller, Hamwi) plus a healthy BMI range. Important: these formulas were created for medication dosing, not health assessment.',
  formula: 'Devine: Male = 110 lb + 6 lb × (in over 5 ft), Female = 100 lb + 5 lb × (in over 5 ft) | Each formula adjusts the base and/or per-inch increment slightly',
  interpretation: 'The "ideal weight" formulas commonly used in medicine were developed for calculating drug dosages, not for determining your healthiest weight. They provide a narrow reference range that doesn\'t account for muscle mass, bone density, or body composition. A more meaningful health assessment combines BMI (18.5-24.9), waist circumference (under 40 in men / 35 in women), and body fat percentage. Rather than fixating on an "ideal weight," focus on sustainable health habits: eating well, moving regularly, sleeping adequately, and managing stress. The healthiest weight for you is one where you feel energetic and are free from weight-related health issues.'
}

export default calcDef
