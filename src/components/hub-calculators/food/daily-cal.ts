import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const activityLevels = [{ label: 'Sedentary', value: '1.2' }, { label: 'Light', value: '1.375' }, { label: 'Moderate', value: '1.55' }, { label: 'Active', value: '1.725' }, { label: 'Very Active', value: '1.9' }]

const calcDef: CalcDef = {
    fields: [
      { name: 'weight', label: 'Weight', type: 'number', unit: 'kg', units: [{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }], defaultUnit: 'kg', min: 20, step: '0.1' },
      { name: 'height', label: 'Height', type: 'number', unit: 'cm', units: [{ value: 'cm', label: 'cm' }, { value: 'in', label: 'in' }], defaultUnit: 'cm', min: 50, step: '0.1' },
      { name: 'age', label: 'Age', type: 'number', unit: 'years', min: 10, step: '1' },
      { name: 'activity', label: 'Activity Level', type: 'select', options: Object.entries(activityLevels).map(([k, v]) => ({ label: k.charAt(0).toUpperCase() + k.slice(1), value: String(v) })) },
      { name: 'gender', label: 'Sex', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
    ],
    compute: (v) => { const bmr = 10 * v.weight + 6.25 * v.height - 5 * v.age + (v.gender === 'female' ? -161 : 5); const tdee = bmr * (v.activity || 1.55); return { result: tdee, label: 'Daily Calorie Needs', unit: 'kcal/day', steps: [
      { label: 'BMR (Mifflin-St Jeor)', value: `${bmr.toFixed(0)} kcal/day` },
      { label: 'Activity multiplier', value: `${(Number(v.activity) || 1.55).toFixed(2)}×` },
      { label: 'TDEE (maintenance)', value: `${tdee.toFixed(0)} kcal/day` },
    ]} },
    description: 'Daily calorie needs based on the Mifflin-St Jeor equation, adjusted for activity level. This is your Total Daily Energy Expenditure (TDEE) for weight maintenance.',
    example: { label: '70kg, 175cm, 30yr, moderate', value: '~2,450 kcal/day' }
}

export default calcDef
