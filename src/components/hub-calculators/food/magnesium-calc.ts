import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, step: '1' },
      { name: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
      { name: 'activity', label: 'Activity', type: 'select', options: [{ label: 'Sedentary', value: '1' }, { label: 'Moderate', value: '1.1' }, { label: 'Athlete', value: '1.2' }] }
    ],
    compute: (v) => {
      const rda = v.gender === 'male' ? 400 : 310; const r = Math.min(420, rda * v.activity); return { result: r, label: 'Daily Magnesium', unit: 'mg', steps: [{ label: 'Gender RDA', value: rda + ' mg' }, { label: 'Activity factor', value: v.activity + 'x' }, { label: 'Recommended', value: r.toFixed(0) + ' mg (max: 420)' }] }
    },
    description: 'Daily magnesium needs based on age, gender, and activity. Magnesium supports muscle function, energy production, and bone health.',
    example: { label: '30yr male, active', value: '~420 mg/day' }
}

export default calcDef
