import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const genderOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]

const calcDef: CalcDef = {
  schema: z.object({
    age: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 1 && n <= 120 }, '1-120'),
    weight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    height: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    gender: z.string()
}),
  fields: [
    { name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, max: 120, step: '1' },
    { name: 'weight', label: 'Weight', type: 'number', unit: 'kg', min: 1, step: '0.1' },
    { name: 'height', label: 'Height', type: 'number', unit: 'cm', min: 1, step: '0.1' },
    { name: 'gender', label: 'Gender', type: 'select', options: genderOptions },
  ],
  compute: (v) => {
    const bmr = v.gender === 'male' ? 10 * v.weight + 6.25 * v.height - 5 * v.age + 5 : 10 * v.weight + 6.25 * v.height - 5 * v.age - 161
    return {
      result: bmr, label: 'BMR', unit: 'cal/day',
      steps: [
        { label: 'Weight', value: `${v.weight} kg` },
        { label: 'Height', value: `${v.height} cm` },
        { label: 'Age', value: `${v.age} years` },
        { label: 'BMR (Mifflin-St Jeor)', value: `${bmr.toFixed(0)} cal/day` },
        { label: 'Sedentary TDEE', value: `${(bmr * 1.2).toFixed(0)} cal/day` },
        { label: 'Light TDEE', value: `${(bmr * 1.375).toFixed(0)} cal/day` },
        { label: 'Moderate TDEE', value: `${(bmr * 1.55).toFixed(0)} cal/day` },
        { label: 'Active TDEE', value: `${(bmr * 1.725).toFixed(0)} cal/day` },
      ]
}
  },
  description: 'Basal Metabolic Rate (BMR) is the calories your body burns at complete rest. Use the Mifflin-St Jeor equation to estimate your daily energy needs.',
  formula: 'Male: BMR = 10×w + 6.25×h – 5×a + 5 | Female: BMR = 10×w + 6.25×h – 5×a – 161',
  interpretation: 'BMR accounts for ~60-75% of daily energy expenditure. Total Daily Energy Expenditure (TDEE) = BMR × activity factor.'
}

export default calcDef
