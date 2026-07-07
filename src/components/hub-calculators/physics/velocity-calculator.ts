import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ displacement: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), time: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'displacement', label: 'Displacement', type: 'number', unit: 'm', min: 0.001, step: '0.001' }, { name: 'time', label: 'Time', type: 'number', unit: 's', min: 0.001, step: '0.001' }],
  compute: (v) => ({ result: v.displacement / v.time, label: 'Velocity', unit: 'm/s', steps: [{ label: 'Formula', value: 'v = Δd/t' }, { label: 'Substitute', value: `${v.displacement} / ${v.time}` }, { label: 'Result', value: `${(v.displacement / v.time).toFixed(3)} m/s` }] }),
  description: 'Velocity is the rate of change of displacement with time. Calculated as displacement divided by time.',
  formula: 'v = Δx / Δt',
  interpretation: 'Velocity is a vector quantity that describes both speed and direction. Average velocity equals total displacement divided by total time.'
}

export default calcDef
