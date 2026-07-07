import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ charge: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'charge', label: 'Charge', type: 'number', unit: 'C', min: 1e-9, step: '1e-9' }, { name: 'distance', label: 'Distance', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  compute: (v) => { const k = 8.988e9; const V = k * v.charge / v.distance; return { result: V, label: 'Electric Potential', unit: 'V', steps: [{ label: 'Formula', value: 'V = kq/r' }, { label: 'Substitute', value: `k × ${v.charge} / ${v.distance}` }, { label: 'Result', value: `${V.toExponential(4)} V` }] } },
  description: 'Electric potential (voltage) at a distance from a point charge is the work per unit charge to bring a test charge from infinity.',
  formula: 'V = k·q / r',
  interpretation: 'Potential is a scalar quantity. 1 V = 1 J/C. Potential decreases with distance from a positive charge.'
}

export default calcDef
