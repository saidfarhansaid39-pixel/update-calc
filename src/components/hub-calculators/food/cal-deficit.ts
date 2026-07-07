import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const activityLevels = [{ label: 'Sedentary', value: '1.2' }, { label: 'Light', value: '1.375' }, { label: 'Moderate', value: '1.55' }, { label: 'Active', value: '1.725' }, { label: 'Very Active', value: '1.9' }]

const calcDef: CalcDef = {
    fields: [
      { name: 'weight', label: 'Weight', type: 'number', unit: 'kg', units: [{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }], defaultUnit: 'kg', min: 20, step: '0.1' },
      { name: 'height', label: 'Height', type: 'number', unit: 'cm', units: [{ value: 'cm', label: 'cm' }, { value: 'in', label: 'in' }], defaultUnit: 'cm', min: 50, step: '0.1' },
      { name: 'age', label: 'Age', type: 'number', unit: 'years', min: 10, step: '1' },
      { name: 'activity', label: 'Activity Level', type: 'select', options: Object.entries(activityLevels).map(([k, v]) => ({ label: k.charAt(0).toUpperCase() + k.slice(1), value: String(v) })) },
      { name: 'deficit', label: 'Daily Deficit', type: 'select', options: [{ label: 'Mild (250 kcal)', value: '250' }, { label: 'Moderate (500 kcal)', value: '500' }, { label: 'Aggressive (750 kcal)', value: '750' }, { label: 'Maximum (1000 kcal)', value: '1000' }] },
      { name: 'gender', label: 'Sex', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
    ],
    compute: (v) => { const bmr = 10 * v.weight + 6.25 * v.height - 5 * v.age + (v.gender === 'female' ? -161 : 5); const tdee = bmr * (v.activity || 1.55); const def = Number(v.deficit) || 500; const target = tdee - def; const weeklyLoss = def * 7 / 7700; return { result: target, label: 'Weight Loss Calories', unit: 'kcal/day', steps: [
      { label: 'BMR', value: `${bmr.toFixed(0)} kcal/day` },
      { label: 'TDEE', value: `${tdee.toFixed(0)} kcal/day` },
      { label: 'Deficit', value: `${def} kcal/day` },
      { label: 'Target intake', value: `${target.toFixed(0)} kcal/day` },
      { label: 'Estimated weekly loss', value: `${weeklyLoss.toFixed(2)} kg (${(weeklyLoss * 2.20462).toFixed(1)} lbs)` },
    ]} },
    description: 'Calculate calorie intake for weight loss by applying a deficit to your TDEE. A 500 kcal/day deficit yields ~0.5 kg (1 lb) loss per week — safe and sustainable.',
    example: { label: '70kg, 175cm, 30yr, moderate, 500 deficit', value: '~1,950 kcal/day' }
}

export default calcDef
