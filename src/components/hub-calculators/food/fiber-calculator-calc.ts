import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, step: '1' },
      { name: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
      { name: 'calories', label: 'Daily Calories', type: 'number', min: 500, step: '50' }
    ],
    compute: (v) => {
      const b = v.gender === 'male' ? 30 : 25; const r = Math.max(b, v.calories / 1000 * 14); return { result: r, label: 'Daily Fiber', unit: 'g', steps: [{ label: 'Base', value: b + ' g (' + v.gender + ')' }, { label: 'Calorie-based (14g/1000 kcal)', value: (v.calories / 1000 * 14).toFixed(0) + ' g' }, { label: 'Recommended', value: r.toFixed(0) + ' g/day' }] }
    },
    description: 'Daily fiber needs based on age, gender, and caloric intake. Adequate fiber promotes digestive health and reduces disease risk.',
    example: { label: 'Male, 2200 kcal', value: '31g fiber/day' }
}

export default calcDef
