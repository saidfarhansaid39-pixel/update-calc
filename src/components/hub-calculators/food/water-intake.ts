import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', units: [{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }], defaultUnit: 'kg', min: 20, step: '0.1' },
      { name: 'exercise', label: 'Exercise Minutes Per Day', type: 'number', min: 0, step: '5' },
    ],
    compute: (v) => {
      const base = v.weight * 0.033; const extra = v.exercise * 0.012; const total = base + extra
      return { result: total, label: 'Daily Water Goal', unit: 'L', steps: [
        { label: 'Base intake (33 mL/kg)', value: `${base.toFixed(2)} L` },
        { label: 'Exercise adjustment', value: `+${extra.toFixed(2)} L (${v.exercise} min)` },
        { label: 'Total water goal', value: `${total.toFixed(2)} L (${(total * 4.227).toFixed(1)} cups)` },
        { label: 'Hydration tip', value: 'Drink steadily throughout the day — don\'t chug! Your body absorbs water better in small, frequent sips.' },
      ]}
    },
    description: 'Simple daily water intake goal based on body weight and exercise. Base recommendation is 33 mL per kg of body weight plus 12 mL per minute of exercise.',
    example: { label: '70kg, 30 min exercise', value: '~2.7 L/day (11.4 cups)' }
}

export default calcDef
