import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', units: [{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }], defaultUnit: 'kg', min: 20, step: '0.1' },
      { name: 'activity', label: 'Activity Level', type: 'select', options: [
        { label: 'Sedentary', value: '1' }, { label: 'Lightly active', value: '1.2' },
        { label: 'Moderately active', value: '1.4' }, { label: 'Very active', value: '1.6' },
        { label: 'Extremely active', value: '1.8' },
      ] },
      { name: 'climate', label: 'Climate', type: 'select', options: [
        { label: 'Cool/moderate', value: '1' }, { label: 'Hot/humid', value: '1.3' },
      ] },
    ],
    compute: (v) => {
      const base = v.weight * 0.033; const total = base * v.activity * v.climate
      return { result: total, label: 'Daily Water Intake', unit: 'L', steps: [
        { label: 'Base (33 mL per kg)', value: `${base.toFixed(2)} L` },
        { label: 'Activity multiplier', value: `${v.activity}×` },
        { label: 'Climate multiplier', value: `${v.climate}×` },
        { label: 'Recommended intake', value: `${total.toFixed(2)} L (${(total * 4.227).toFixed(1)} cups)` },
      ]}
    },
    description: 'Daily water needs based on body weight, activity level, and climate. The base recommendation is 33 mL per kg of body weight, adjusted for exercise and heat.',
    example: { label: '70kg, moderately active, cool climate', value: '~3.2L/day (13.5 cups)' }
}

export default calcDef
