import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ temperature: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'temperature', label: 'Temperature', type: 'number', unit: 'K', min: 1, step: '10' }],
  defaults: { temperature: '5778' },
  presets: [
    { label: 'Sun (surface ~5778 K)', values: { temperature: '5778' } },
    { label: 'Room temperature (300 K)', values: { temperature: '300' } },
    { label: 'Red giant star (3500 K)', values: { temperature: '3500' } },
    { label: 'White dwarf (20000 K)', values: { temperature: '20000' } },
  ],
  compute: (v) => { const sigma = 5.670e-8; const j = sigma * v.temperature * v.temperature * v.temperature * v.temperature; const lambdaPeak = 2.898e-3 / v.temperature; return { result: j, label: 'Radiant Flux', unit: 'W/m^2', steps: [{ label: 'Formula', value: 'j = σT^4 (Stefan-Boltzmann)' }, { label: 'σ', value: '5.670×10^-8 W·m^-2·K^-4' }, { label: 'Radiant flux', value: `${j.toExponential(4)} W/m^2` }, { label: 'Peak wavelength', value: `${(lambdaPeak * 1e9).toFixed(1)} nm (Wien\'s Law)` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Blackbody radiation explains star colors, incandescent bulbs, and thermal imaging. The Sun\'s 5778 K surface peaks in visible light (green at ~500 nm).' },
        { label: 'Common Values', value: 'Wien\'s law: λ_max = b/T (b = 2.898×10⁻³ m·K). Sun (5778 K): λ=500 nm. Room (300 K): λ=9.7 μm (infrared). Steel melting (1811 K): λ=1.6 μm.' },
        { label: 'Precision Tip', value: 'Stefan-Boltzmann law: P = σεAT⁴. σ = 5.67×10⁻⁸ W/(m²·K⁴). Real objects are gray bodies (emissivity ε < 1).' },
        { label: 'Related Formula', value: 'Wien: λ_max = b/T. Stefan-Boltzmann: P = σAT⁴. Planck: u(λ) = 8πhc/λ⁵ × 1/(e^(hc/λkT)-1). Rayleigh-Jeans: classical limit.' },
        { label: 'Unit Conversion Note', value: 'T in K. λ in m or nm. b = 2.898×10⁻³ m·K. σ = 5.67×10⁻⁸ W/(m²·K⁴). h = 6.626×10⁻³⁴ J·s. k_B = 1.381×10⁻²³ J/K.' }
      ]} },
  description: 'Blackbody radiation: all objects emit electromagnetic radiation based on their temperature. Hotter objects emit more total power at shorter wavelengths.',
  formula: 'j = σT^4, λ_max = b/T (Wien\'s Law)',
  interpretation: 'σ = 5.670×10^-8 W·m^-2·K^-4. The Sun (T ≈ 5778 K) peaks in visible light at ~500 nm. A hot stove (T ≈ 800 K) peaks in infrared. Wien\'s constant b = 2.898×10^-3 m·K.'
}

export default calcDef
