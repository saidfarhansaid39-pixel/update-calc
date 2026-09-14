import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ R: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), C: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), T: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'R', label: 'Resistance R', type: 'number', unit: 'Ω', min: 0.1, step: '0.1' }, { name: 'C', label: 'Capacitance C', type: 'number', unit: 'F', min: 1e-12, step: '1e-12' }, { name: 'T', label: 'Time t', type: 'number', unit: 's', min: 0.001, step: '0.001' }],
  defaults: { resistance: '1000', capacitance: '1e-6' },
  presets: [
    { label: 'Decoupling cap (100 nF, 1 kΩ)', values: { resistance: '1000', capacitance: '1e-7' } },
    { label: 'Camera flash (100 μF, 10 kΩ)', values: { resistance: '10000', capacitance: '1e-4' } },
    { label: 'Tone control (47 nF, 10 kΩ)', values: { resistance: '10000', capacitance: '4.7e-8' } },
  ],
  compute: (v) => { const tau = v.R * v.C; const qfrac = 1 - Math.exp(-v.T / tau); return { result: tau, label: 'Time Constant τ = RC', unit: 's', steps: [{ label: 'Formula', value: 'τ = RC' }, { label: 'τ', value: `${tau.toExponential(4)} s` }, { label: 'Charge % (charging)', value: `${(qfrac * 100).toFixed(1)}%` }] ,
    extras: [
        { label: 'Real-World Application', value: 'RC circuits are everywhere: coupling/decoupling capacitors, timing circuits (555 timer), audio filters, and power supply smoothing.' },
        { label: 'Common Values', value: 'τ = RC. Typical decoupling: 100 nF + 100 Ω → τ = 10 μs. Power supply smoothing: 470 μF + 1 kΩ → τ = 0.47 s.' },
        { label: 'Precision Tip', value: 'One time constant τ = RC. After 5τ, capacitor is 99.3% charged/discharged. Charging: V(t) = V₀(1 - e⁻ᵗ/ʳ).' },
        { label: 'Related Formula', value: 'τ = RC. Cutoff frequency: f_c = 1/(2πRC). Discharge: V(t) = V₀e⁻ᵗ/ʳ. Energy stored: E = ½CV².' },
        { label: 'Unit Conversion Note', value: 'R in Ω, C in F. τ in s. 1 μF = 10⁻⁶ F. 1 nF = 10⁻⁹ F. 1 pF = 10⁻¹² F.' }
      ]} },
  description: 'RC circuit time constant and transient response. τ = RC is the time for voltage/charge to reach ~63.2% of its final value (charging) or drop to ~36.8% (discharging).',
  formula: 'τ = RC, V(t) = V₀(1 − e^(−t/τ))',
  interpretation: 'After 5τ ≈ 5RC, the capacitor is considered fully charged (99.3%). RC circuits are fundamental to timing circuits, filters, power supplies, and signal processing.'
}

export default calcDef
