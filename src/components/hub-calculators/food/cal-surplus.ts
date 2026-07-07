import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const activityLevels = [{ label: 'Sedentary', value: '1.2' }, { label: 'Light', value: '1.375' }, { label: 'Moderate', value: '1.55' }, { label: 'Active', value: '1.725' }, { label: 'Very Active', value: '1.9' }]

const calcDef: CalcDef = {
    fields: [
      { name: 'weight', label: 'Weight', type: 'number', unit: 'kg', units: [{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }], defaultUnit: 'kg', min: 20, step: '0.1' },
      { name: 'height', label: 'Height', type: 'number', unit: 'cm', units: [{ value: 'cm', label: 'cm' }, { value: 'in', label: 'in' }], defaultUnit: 'cm', min: 50, step: '0.1' },
      { name: 'age', label: 'Age', type: 'number', unit: 'years', min: 10, step: '1' },
      { name: 'activity', label: 'Activity Level', type: 'select', options: Object.entries(activityLevels).map(([k, v]) => ({ label: k.charAt(0).toUpperCase() + k.slice(1), value: String(v) })) },
      { name: 'surplus', label: 'Daily Surplus', type: 'select', options: [{ label: 'Mild gain (250 kcal)', value: '250' }, { label: 'Moderate gain (500 kcal)', value: '500' }, { label: 'Aggressive bulk (750 kcal)', value: '750' }, { label: 'Max bulk (1000 kcal)', value: '1000' }] },
      { name: 'gender', label: 'Sex', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
    ],
    compute: (v) => { const bmr = 10 * v.weight + 6.25 * v.height - 5 * v.age + (v.gender === 'female' ? -161 : 5); const tdee = bmr * (v.activity || 1.55); const sur = Number(v.surplus) || 500; const target = tdee + sur; const weeklyGain = sur * 7 / 7700; return { result: target, label: 'Weight Gain Calories', unit: 'kcal/day', steps: [
      { label: 'BMR', value: `${bmr.toFixed(0)} kcal/day` },
      { label: 'TDEE', value: `${tdee.toFixed(0)} kcal/day` },
      { label: 'Surplus', value: `+${sur} kcal/day` },
      { label: 'Target intake', value: `${target.toFixed(0)} kcal/day` },
      { label: 'Estimated weekly gain', value: `${weeklyGain.toFixed(2)} kg (${(weeklyGain * 2.20462).toFixed(1)} lbs)` },
    ]} },
    description: 'Calculate calorie intake for weight gain / muscle building by adding a surplus to your TDEE. A 500 kcal/day surplus yields ~0.5 kg per week of gain.',
    example: { label: '70kg, 175cm, 30yr, moderate, 500 surplus', value: '~2,950 kcal/day' }
}

export default calcDef
