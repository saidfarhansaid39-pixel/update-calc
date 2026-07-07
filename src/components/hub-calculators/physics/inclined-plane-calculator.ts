import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), angle: z.string().min(1).refine(v => { const n = parseFloat(v); return n > 0 && n < 90 }, '0-90') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'angle', label: 'Angle', type: 'number', unit: 'degrees', min: 1, max: 89, step: '1' }],
  compute: (v) => { const rad = v.angle * Math.PI / 180; const grav = v.mass * 9.81; const parallel = grav * Math.sin(rad); const normal = grav * Math.cos(rad); return { result: parallel, label: 'Parallel Force', unit: 'N', steps: [{ label: 'Weight', value: `${grav.toFixed(1)} N` }, { label: 'Parallel', value: `${parallel.toFixed(2)} N` }, { label: 'Normal', value: `${normal.toFixed(2)} N` }] } },
  description: 'An inclined plane reduces the force needed to lift an object. The parallel component of weight pulls it down the slope.',
  formula: 'F∥ = mg·sin(θ), F⊥ = mg·cos(θ)',
  interpretation: 'The steeper the incline, the greater the parallel force. At 90°, the full weight acts parallel. At 0°, all force is normal.'
}

export default calcDef
