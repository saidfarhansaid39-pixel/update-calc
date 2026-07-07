import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), angle: z.string().min(1).refine(v => { const n = parseFloat(v); return n > 0 && n < 90 }, '0-90') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'angle', label: 'Incline Angle', type: 'number', unit: 'degrees', min: 1, max: 89, step: '1' }],
  compute: (v) => { const rad = v.angle * Math.PI / 180; const weight = v.mass * 9.81; const parallel = weight * Math.sin(rad); const normal = weight * Math.cos(rad); return { result: parallel, label: 'Force Down the Plane', unit: 'N', steps: [{ label: 'Weight', value: `${weight.toFixed(2)} N` }, { label: 'Parallel Component', value: `${parallel.toFixed(2)} N` }, { label: 'Normal Component', value: `${normal.toFixed(2)} N` }] } },
  description: 'Force components on an inclined plane: weight resolves into parallel (down the slope) and perpendicular (normal) components.',
  formula: 'F∥ = mg·sin(θ), F⊥ = mg·cos(θ)',
  interpretation: 'The parallel component causes acceleration down the incline. The normal component determines the friction force. Steeper angles increase parallel force.'
}

export default calcDef
