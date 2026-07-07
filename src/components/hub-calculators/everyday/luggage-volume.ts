import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), height: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), unit: z.string().min(1) }),
  fields: [
    { name: 'length', label: 'Length', type: 'number', min: 1, step: '1' },
    { name: 'width', label: 'Width', type: 'number', min: 1, step: '1' },
    { name: 'height', label: 'Height', type: 'number', min: 1, step: '1' },
    { name: 'unit', label: 'Unit', type: 'select', options: [{ label: 'Inches', value: 'in' }, { label: 'Centimeters', value: 'cm' }] },
  ],
  compute: (v) => {
    let volLiters: number
    if (v.unit === 'in') {
      const cuIn = v.length * v.width * v.height
      volLiters = cuIn * 0.0163871
    } else {
      const cuCm = v.length * v.width * v.height
      volLiters = cuCm / 1000
    }
    const carryOnLimit = 45
    const checkedLimit = 158
    return { result: volLiters, label: 'Luggage Volume', unit: 'L', steps: [{ label: 'Volume', value: `${volLiters.toFixed(1)} L` }, { label: 'Carry-On Status', value: volLiters <= carryOnLimit ? 'Fits carry-on (≤45L)' : 'Check-in required' }, { label: 'Checked Limit Status', value: volLiters <= checkedLimit ? 'Within checked limit (≤158L)' : 'Exceeds checked limit' }] }
  },
  description: 'Calculate luggage volume in liters and check if it meets airline carry-on and checked baggage size limits.',
  formula: 'Volume(L) = (L×W×H in inches) × 0.016387 or (L×W×H in cm) / 1000',
  interpretation: 'Carry-on limit: ~45L (22×14×9 in). Checked limit: ~158L (62 linear inches). Most airlines enforce linear inches (L+W+H) not just volume.'
}

export default calcDef
