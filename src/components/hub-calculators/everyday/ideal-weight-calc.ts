import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ heightInches: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gender: z.string().min(1).refine(v => v === 'male' || v === 'female', 'male/female') }),
  fields: [
    { name: 'heightInches', label: 'Height (inches)', type: 'number', min: 36, max: 96, step: '1' },
    { name: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
  ],
  compute: (v) => { const h = parseFloat(v.heightInches)||0; const isMale = v.gender === 'male'; const base = h > 60 ? (h - 60) * (isMale ? 6 : 5) : 0; const devine = isMale ? 110 + base : 100 + base; const robinson = isMale ? 114 + base : 105 + base; const miller = isMale ? 112 + base : 105 + base; const hamwi = isMale ? 106 + base : 100 + base; const avg = (devine + robinson + miller + hamwi) / 4; return { result: avg, label: 'Average Ideal Weight', unit: 'lb', steps: [{ label: 'Devine Formula', value: `${devine.toFixed(0)} lb` }, { label: 'Robinson Formula', value: `${robinson.toFixed(0)} lb` }, { label: 'Miller Formula', value: `${miller.toFixed(0)} lb` }, { label: 'Hamwi Formula', value: `${hamwi.toFixed(0)} lb` }, { label: 'Average', value: `${avg.toFixed(0)} lb` }] } },
  description: 'Calculate ideal body weight using four standard medical formulas (Devine, Robinson, Miller, Hamwi). For adults over 18.',
  formula: 'Devine: Male=110 lb + 6 lb/in over 5ft, Female=100 lb + 5 lb/in over 5ft',
  interpretation: 'Ideal weight is a screening tool, not a health diagnosis. BMI, body composition, waist circumference, and muscle mass give a complete picture. These formulas were developed for medication dosing.'
}

export default calcDef
