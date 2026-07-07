import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ properTime: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 0 && n < 299792458 }, '0-c') }),
  fields: [{ name: 'properTime', label: 'Proper Time Δt₀', type: 'number', unit: 's', min: 0.01, step: '0.01' }, { name: 'velocity', label: 'Velocity v', type: 'number', unit: 'm/s', min: 0, step: '1e7' }],
  compute: (v) => { const c = 299792458; const gamma = 1 / Math.sqrt(1 - (v.velocity * v.velocity) / (c * c)); const dilated = v.properTime * gamma; return { result: dilated, label: 'Dilated Time Δt', unit: 's', steps: [{ label: 'Formula', value: 'Δt = γ·Δt₀, γ = 1/√(1-v²/c²)' }, { label: 'Lorentz factor γ', value: `${gamma.toFixed(4)}` }, { label: 'Dilated time', value: `${dilated.toFixed(4)} s` }] } },
  description: 'Time dilation: a moving clock ticks slower relative to a stationary observer. This is a confirmed prediction of Einstein\'s special relativity.',
  formula: 'Δt = γ·Δt₀, γ = 1/√(1-v²/c²)',
  interpretation: 'At v = 0.5c, γ = 1.155. At v = 0.99c, γ = 7.09. GPS satellites must correct for time dilation effects (~7 μs/day). Muons from cosmic rays reach Earth due to time dilation.'
}

export default calcDef
