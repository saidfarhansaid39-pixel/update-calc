import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ resistance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), inductance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), capacitance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'resistance', label: 'Resistance', type: 'number', unit: 'ohm', min: 0.01, step: '0.01' }, { name: 'inductance', label: 'Inductance', type: 'number', unit: 'H', min: 1e-6, step: '1e-6' }, { name: 'capacitance', label: 'Capacitance', type: 'number', unit: 'F', min: 1e-12, step: '1e-12' }],
  defaults: { inductance: '0.01', resistance: '10', capacitance: '1e-7' },
  presets: [
    { label: 'Band-pass filter (10 mH, 100 nF, 10 Ω)', values: { inductance: '0.01', capacitance: '1e-7', resistance: '10' } },
    { label: 'AM radio (5 mH, 200 pF, 50 Ω)', values: { inductance: '0.005', capacitance: '2e-10', resistance: '50' } },
    { label: 'Crossover (1 mH, 10 μF, 4 Ω)', values: { inductance: '0.001', capacitance: '1e-5', resistance: '4' } },
  ],
  compute: (v) => { const omega0 = 1 / Math.sqrt(v.inductance * v.capacitance); const f0 = omega0 / (2 * Math.PI); const Zmin = v.resistance; const Q = (1 / v.resistance) * Math.sqrt(v.inductance / v.capacitance); return { result: f0, label: 'Resonant Frequency', unit: 'Hz', steps: [{ label: 'Formula', value: 'f0 = 1/(2pisqrt(LC))' }, { label: 'Resonant f0', value: `${f0.toExponential(4)} Hz` }, { label: 'Quality factor Q', value: `${Q.toFixed(2)}` },         { label: 'Impedance at f0', value: `${Zmin.toFixed(2)} ohm (minimum)` }] ,
    extras: [
        { label: 'Real-World Application', value: 'RLC circuits are fundamental to radio receivers (tuned circuits), audio crossovers, and power factor correction.' },
        { label: 'Common Values', value: 'Resonant frequency: f₀ = 1/(2π√(LC)). Q factor: Q = 1/R × √(L/C). Bandwidth: Δf = f₀/Q.' },
        { label: 'Precision Tip', value: 'At resonance, impedance is purely resistive (Z=R). Underdamped: R < 2√(L/C). Critically damped: R = 2√(L/C). Overdamped: R > 2√(L/C).' },
        { label: 'Related Formula', value: 'f₀ = 1/(2π√(LC)). Z = R + j(ωL - 1/ωC). Q = ω₀L/R = 1/(ω₀RC). Damping factor: ζ = R/2 × √(C/L).' },
        { label: 'Unit Conversion Note', value: 'L in H, C in F, R in Ω. f₀ in Hz. 1 nF = 10⁻⁹ F. 1 μF = 10⁻⁶ F. 1 mH = 10⁻³ H. 1 μH = 10⁻⁶ H.' }
      ]} },
  description: 'A series RLC circuit has minimum impedance at resonance. The quality factor Q determines the sharpness of the resonance peak.',
  formula: 'f0 = 1/(2pisqrt(LC)), Q = (1/R)sqrt(L/C)',
  interpretation: 'At resonance, impedance is purely resistive and minimized. Higher Q means sharper resonance and better frequency selectivity. Bandwidth Δf = f0/Q.'
}

export default calcDef
