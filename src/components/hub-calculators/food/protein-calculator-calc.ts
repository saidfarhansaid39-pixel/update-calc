import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', units: [{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }], defaultUnit: 'kg', min: 20, step: '0.1' },
      { name: 'activity', label: 'Activity Level', type: 'select', options: [{ label: 'Sedentary (0.8)', value: '0.8' }, { label: 'Light (1.0)', value: '1' }, { label: 'Moderate (1.2)', value: '1.2' }, { label: 'Active (1.6)', value: '1.6' }, { label: 'Athlete (2.0)', value: '2' }] },
      { name: 'goal', label: 'Goal', type: 'select', options: [{ label: 'Maintain', value: '1' }, { label: 'Muscle gain', value: '1.1' }, { label: 'Lose weight', value: '0.9' }] }
    ],
    compute: (v) => {
      const f = parseFloat(v.activity) || 1.2; const g = parseFloat(v.goal) || 1; const r = v.weight * f * g; return { result: r, label: 'Daily Protein', unit: 'g', steps: [{ label: 'Weight', value: v.weight + ' kg' }, { label: 'Activity factor', value: f + ' g/kg' }, { label: 'Goal adjustment', value: g + 'x' }, { label: 'Recommended', value: r.toFixed(0) + ' g/day' }] }
    },
    description: 'Calculate daily protein needs based on body weight, activity level, and fitness goals. Protein supports muscle repair, immune function, and overall health.',
    example: { label: '70kg, active, muscle gain', value: '~123g protein/day' }
}

export default calcDef
