import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const genderOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]
const activityLevelOptions = [{ label: 'Sedentary', value: '1.2' }, { label: 'Light', value: '1.375' }, { label: 'Moderate', value: '1.55' }, { label: 'Active', value: '1.725' }, { label: 'Very Active', value: '1.9' }]

const calcDef: CalcDef = {
  schema: z.object({
    age: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 1 && n <= 120 }, '1-120'),
    weight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    height: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    gender: z.string(),
    activity: z.string()
}),
  fields: [
    { name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, max: 120, step: '1' },
    { name: 'weight', label: 'Weight', type: 'number', unit: 'kg', min: 1, step: '0.1' },
    { name: 'height', label: 'Height', type: 'number', unit: 'cm', min: 1, step: '0.1' },
    { name: 'gender', label: 'Gender', type: 'select', options: genderOptions },
    { name: 'activity', label: 'Activity Level', type: 'select', options: activityLevelOptions },
  ],
  compute: (v) => {
    const bmr = v.gender === 'male' ? 10 * v.weight + 6.25 * v.height - 5 * v.age + 5 : 10 * v.weight + 6.25 * v.height - 5 * v.age - 161
    const act = parseFloat(v.activity) || 1.2
    const tdee = bmr * act
    return {
      result: tdee, label: 'Total Daily Energy Expenditure', unit: 'cal/day',
      steps: [
        { label: 'Weight', value: `${v.weight} kg` },
        { label: 'Height', value: `${v.height} cm` },
        { label: 'Age', value: `${v.age} years` },
        { label: 'BMR', value: `${bmr.toFixed(0)} cal/day` },
        { label: 'Activity multiplier', value: `${v.activity}` },
        { label: 'TDEE', value: `${tdee.toFixed(0)} cal/day` },
      ]
}
  },
  description: 'Total Daily Energy Expenditure (TDEE) estimates total calories burned daily including activity. Use this to plan calorie intake for weight maintenance, loss, or gain.',
  formula: 'TDEE = BMR × Activity Factor | BMR via Mifflin-St Jeor',
  interpretation: 'TDEE includes BMR (60-75%), thermic effect of food (10%), and activity (15-30%). A 500 cal/day deficit yields ~0.5 kg/week weight loss.'
}

export default calcDef
