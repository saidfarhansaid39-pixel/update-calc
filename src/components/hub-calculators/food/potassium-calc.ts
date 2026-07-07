import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', units: [{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }], defaultUnit: 'kg', min: 20, step: '0.1' },
      { name: 'activity', label: 'Activity', type: 'select', options: [{ label: 'Sedentary', value: '1' }, { label: 'Moderate', value: '1.2' }, { label: 'Active', value: '1.4' }, { label: 'Athlete', value: '1.6' }] }
    ],
    compute: (v) => {
      const r = Math.min(4700, v.weight * 35 * v.activity); return { result: r, label: 'Daily Potassium', unit: 'mg', steps: [{ label: 'Weight', value: v.weight + ' kg' }, { label: 'Base (35 mg/kg)', value: (v.weight * 35).toFixed(0) + ' mg' }, { label: 'Activity multiplier', value: v.activity + 'x' }, { label: 'Recommended', value: r.toFixed(0) + ' mg (max: 4700)' }] }
    },
    description: 'Daily potassium needs based on body weight and activity. Potassium supports heart function, muscle contractions, and fluid balance.',
    example: { label: '70kg, moderate', value: '~2,940 mg/day' }
}

export default calcDef
