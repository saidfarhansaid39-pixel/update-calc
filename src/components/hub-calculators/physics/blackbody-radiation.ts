import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ temperature: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'temperature', label: 'Temperature', type: 'number', unit: 'K', min: 1, step: '10' }],
  compute: (v) => { const sigma = 5.670e-8; const j = sigma * v.temperature * v.temperature * v.temperature * v.temperature; const lambdaPeak = 2.898e-3 / v.temperature; return { result: j, label: 'Radiant Flux', unit: 'W/m^2', steps: [{ label: 'Formula', value: 'j = σT^4 (Stefan-Boltzmann)' }, { label: 'σ', value: '5.670×10^-8 W·m^-2·K^-4' }, { label: 'Radiant flux', value: `${j.toExponential(4)} W/m^2` }, { label: 'Peak wavelength', value: `${(lambdaPeak * 1e9).toFixed(1)} nm (Wien\'s Law)` }] } },
  description: 'Blackbody radiation: all objects emit electromagnetic radiation based on their temperature. Hotter objects emit more total power at shorter wavelengths.',
  formula: 'j = σT^4, λ_max = b/T (Wien\'s Law)',
  interpretation: 'σ = 5.670×10^-8 W·m^-2·K^-4. The Sun (T ≈ 5778 K) peaks in visible light at ~500 nm. A hot stove (T ≈ 800 K) peaks in infrared. Wien\'s constant b = 2.898×10^-3 m·K.'
}

export default calcDef
