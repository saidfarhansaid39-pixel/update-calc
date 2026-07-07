import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ timeDilation: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => { const n = parseFloat(v); return n > 0 && n < 299792458 }, '0-c') }),
  fields: [{ name: 'timeDilation', label: 'Proper Time', type: 'number', unit: 's', min: 0.01, step: '0.01' }, { name: 'velocity', label: 'Velocity', type: 'number', unit: 'm/s', min: 1, step: '1' }],
  compute: (v) => { const c = 299792458; const gamma = 1 / Math.sqrt(1 - (v.velocity * v.velocity) / (c * c)); const dilated = v.timeDilation * gamma; return { result: dilated, label: 'Dilated Time', unit: 's', steps: [{ label: 'Formula', value: 'Δt = γ·Δt0, γ = 1/sqrt(1-v^2/c^2)' }, { label: 'Lorentz factor', value: `γ = ${gamma.toFixed(6)}` }, { label: 'Result', value: `${dilated.toFixed(4)} s` }] } },
  description: 'Special relativity: moving clocks run slow relative to a stationary observer. Time dilation increases as velocity approaches light speed.',
  formula: 'Δt = Δt0 / sqrt(1 - v^2/c^2)',
  interpretation: 'At 50% of light speed, γ = 1.155. At 99% of light speed, γ = 7.09. Time dilation is confirmed in particle physics and GPS satellites.'
}

export default calcDef
