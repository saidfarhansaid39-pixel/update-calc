import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ timeDilation: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => { const n = parseFloat(v); return n > 0 && n < 299792458 }, '0-c') }),
  fields: [{ name: 'timeDilation', label: 'Proper Time', type: 'number', unit: 's', min: 0.01, step: '0.01' }, { name: 'velocity', label: 'Velocity', type: 'number', unit: 'm/s', min: 1, step: '1' }],
  defaults: { velocity: '1e8' },
  presets: [
    { label: 'Voyager (17 km/s = 0.000057c)', values: { velocity: '17000' } },
    { label: 'LHC proton (0.99999999c)', values: { velocity: '2.99792458e8' } },
    { label: 'Fast spacecraft (0.5c)', values: { velocity: '1.5e8' } },
  ],
  compute: (v) => { const c = 299792458; const gamma = 1 / Math.sqrt(1 - (v.velocity * v.velocity) / (c * c)); const dilated = v.timeDilation * gamma; return { result: dilated, label: 'Dilated Time', unit: 's', steps: [{ label: 'Formula', value: 'Δt = γ·Δt0, γ = 1/sqrt(1-v^2/c^2)' }, { label: 'Lorentz factor', value: `γ = ${gamma.toFixed(6)}` }, { label: 'Result', value: `${dilated.toFixed(4)} s` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Special relativity is essential for GPS (satellites moving at 3.9 km/s need relativistic corrections of 38 μs/day). LHC protons at 0.99999999c.' },
        { label: 'Common Values', value: 'γ = 1/√(1-v²/c²). At 0.1c: γ = 1.005. At 0.5c: γ = 1.155. At 0.9c: γ = 2.29. At 0.99c: γ = 7.09. At 0.999c: γ = 22.4.' },
        { label: 'Precision Tip', value: 'Relativistic effects become significant above 0.1c. Time dilation: Δt = γΔt₀. Length contraction: L = L₀/γ. Momentum: p = γmv.' },
        { label: 'Related Formula', value: 'γ = 1/√(1-β²) where β = v/c. Lorentz transformation. E² = (pc)² + (mc²)². Relativistic KE = (γ-1)mc².' },
        { label: 'Unit Conversion Note', value: 'c = 2.998×10⁸ m/s. Enter v in m/s. β = v/c (dimensionless). γ is dimensionless. 1 ly/year = c. 1 AU/year ≈ 4.74 km/s.' }
      ]} },
  description: 'Special relativity: moving clocks run slow relative to a stationary observer. Time dilation increases as velocity approaches light speed.',
  formula: 'Δt = Δt0 / sqrt(1 - v^2/c^2)',
  interpretation: 'At 50% of light speed, γ = 1.155. At 99% of light speed, γ = 7.09. Time dilation is confirmed in particle physics and GPS satellites.'
}

export default calcDef
