import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ thrust: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'thrust', label: 'Thrust F', type: 'number', unit: 'N', min: 1, step: '1' }, { name: 'mass', label: 'Vehicle Mass', type: 'number', unit: 'kg', min: 0.1, step: '0.1' }],
  compute: (v) => { const g0 = 9.81; const TW = v.thrust / (v.mass * g0); return { result: TW, label: 'Thrust-to-Weight Ratio', unit: '', steps: [{ label: 'Formula', value: 'T/W = F/(m·g₀)' }, { label: 'Substitute', value: `${v.thrust} / (${v.mass} × 9.81)` }, { label: 'Result', value: `${TW.toFixed(3)}:1` }] } },
  description: 'Thrust-to-weight ratio determines if a vehicle can lift off. T/W > 1 is required for vertical ascent.',
  formula: 'T/W = F/(m·g₀)',
  interpretation: 'Saturn V first stage had T/W ≈ 1.15. SpaceX Falcon 9 has T/W ≈ 1.3. Higher T/W means more acceleration. T/W < 1 means the vehicle cannot lift off the ground. Aircraft need lower T/W as wings provide lift.'
}

export default calcDef
