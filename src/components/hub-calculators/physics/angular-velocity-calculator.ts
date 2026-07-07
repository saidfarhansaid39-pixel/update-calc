import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ angle: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), time: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'angle', label: 'Angular Displacement', type: 'number', unit: 'rad', min: 0.001, step: '0.001' }, { name: 'time', label: 'Time', type: 'number', unit: 's', min: 0.001, step: '0.001' }],
  compute: (v) => ({ result: v.angle / v.time, label: 'Angular Velocity', unit: 'rad/s', steps: [{ label: 'Formula', value: 'ω = Δθ/Δt' }, { label: 'Substitute', value: `${v.angle} / ${v.time}` }, { label: 'Result', value: `${(v.angle / v.time).toFixed(4)} rad/s` }] }),
  description: 'Angular velocity is the rate of change of angular displacement. ω = Δθ/Δt.',
  formula: 'ω = Δθ / Δt',
  interpretation: 'Angular velocity is a vector quantity. 2pi rad/s = 1 revolution per second. Linear velocity v = ωr.'
}

export default calcDef
