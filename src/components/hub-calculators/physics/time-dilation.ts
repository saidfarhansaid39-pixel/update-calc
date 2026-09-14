import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ properTime: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 0 && n < 299792458 }, '0-c') }),
  fields: [{ name: 'properTime', label: 'Proper Time Δt₀', type: 'number', unit: 's', min: 0.01, step: '0.01' }, { name: 'velocity', label: 'Velocity v', type: 'number', unit: 'm/s', min: 0, step: '1e7' }],
  defaults: { velocity: '3e7', properTime: '3600' },
  presets: [
    { label: 'GPS satellite (3.9 km/s, 1 day)', values: { velocity: '3900', properTime: '86400' } },
    { label: 'Muon in atmosphere (0.998c, 2.2 μs)', values: { velocity: '2.994e8', properTime: '2.2e-6' } },
    { label: 'LHC proton (0.99999999c, 1 h)', values: { velocity: '2.99792457e8', properTime: '3600' } },
  ],
  compute: (v) => { const c = 299792458; const gamma = 1 / Math.sqrt(1 - (v.velocity * v.velocity) / (c * c)); const dilated = v.properTime * gamma; return { result: dilated, label: 'Dilated Time Δt', unit: 's', steps: [{ label: 'Formula', value: 'Δt = γ·Δt₀, γ = 1/√(1-v²/c²)' }, { label: 'Lorentz factor γ', value: `${gamma.toFixed(4)}` }, { label: 'Dilated time', value: `${dilated.toFixed(4)} s` }] ,
    extras: [
        { label: 'Real-World Application', value: 'GPS satellites experience 38 μs/day time dilation (special + general relativity), requiring correction or position errors of ~11 km/day.' },
        { label: 'Common Values', value: 'γ=2 at 0.866c. Muons (2.2 μs half-life) reach Earth\'s surface from 10 km up due to time dilation. ISS (7.7 km/s): γ = 1.00000000033.' },
        { label: 'Precision Tip', value: 'Δt = γΔt₀ where Δt₀ is proper time (in the moving frame). Moving clocks run slow. Twin paradox: traveling twin ages less.' },
        { label: 'Related Formula', value: 'Δt = Δt₀/√(1-v²/c²). Also: length contraction L = L₀√(1-v²/c²). Relativistic Doppler: f_obs = f_src√((1-β)/(1+β)).' },
        { label: 'Unit Conversion Note', value: 'c = 2.998×10⁸ m/s. v in m/s. Time in any unit (both inputs must match). γ = 1/√(1-v²/c²).' }
      ]} },
  description: 'Time dilation: a moving clock ticks slower relative to a stationary observer. This is a confirmed prediction of Einstein\'s special relativity.',
  formula: 'Δt = γ·Δt₀, γ = 1/√(1-v²/c²)',
  interpretation: 'At v = 0.5c, γ = 1.155. At v = 0.99c, γ = 7.09. GPS satellites must correct for time dilation effects (~7 μs/day). Muons from cosmic rays reach Earth due to time dilation.'
}

export default calcDef
