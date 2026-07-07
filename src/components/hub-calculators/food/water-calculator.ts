import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', units: [{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }], defaultUnit: 'kg', min: 20, step: '0.1' },
      { name: 'activity', label: 'Activity', type: 'select', options: [{ label: 'Sedentary', value: '1' }, { label: 'Lightly active', value: '1.2' }, { label: 'Active', value: '1.4' }, { label: 'Very active', value: '1.6' }] },
      { name: 'climate', label: 'Climate', type: 'select', options: [{ label: 'Cool', value: '1' }, { label: 'Temperate', value: '1.1' }, { label: 'Hot', value: '1.3' }] }
    ],
    compute: (v) => {
      const b = v.weight * 0.033; const r = b * v.activity * v.climate; return { result: r, label: 'Daily Water', unit: 'L', steps: [{ label: 'Base (33 mL/kg)', value: b.toFixed(2) + ' L' }, { label: 'Activity', value: v.activity + 'x' }, { label: 'Climate', value: v.climate + 'x' }, { label: 'Total', value: r.toFixed(2) + ' L (' + (r * 4.227).toFixed(1) + ' cups)' }] }
    },
    description: 'Daily water needs based on weight, activity, and climate. Proper hydration supports energy and health.',
    example: { label: '70kg, active, hot climate', value: '~3.9 L/day' }
}

export default calcDef
