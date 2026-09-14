import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ inductance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), capacitance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'inductance', label: 'Inductance', type: 'number', unit: 'H', min: 1e-6, step: '1e-6' }, { name: 'capacitance', label: 'Capacitance', type: 'number', unit: 'F', min: 1e-12, step: '1e-12' }],
  defaults: { inductance: '0.001', capacitance: '1e-9' },
  presets: [
    { label: 'FM radio (100 MHz)', values: { inductance: '2.53e-7', capacitance: '1e-11' } },
    { label: 'AM radio (1 MHz)', values: { inductance: '2.53e-4', capacitance: '1e-10' } },
    { label: 'Tesla coil (10 mH, 10 nF)', values: { inductance: '0.01', capacitance: '1e-8' } },
  ],
  compute: (v) => { const omega = 1 / Math.sqrt(v.inductance * v.capacitance); const f = omega / (2 * Math.PI); const T = 1 / f; return { result: f, label: 'Resonant Frequency', unit: 'Hz', steps: [{ label: 'Formula', value: 'f = 1/(2pisqrt(LC))' }, { label: 'Angular frequency', value: `${omega.toExponential(4)} rad/s` }, { label: 'Frequency', value: `${f.toExponential(4)} Hz` }, { label: 'Period', value: `${T.toExponential(4)} s` }] ,
    extras: [
        { label: 'Real-World Application', value: 'LC circuits are the basis for radio tuning (AM/FM), oscillators, Tesla coils, and wireless power transfer.' },
        { label: 'Common Values', value: 'FM radio: 88-108 MHz. AM radio: 530-1700 kHz. Wi-Fi: 2.4 GHz. Tesla coil: 50-500 kHz. Characteristic impedance: Z₀ = √(L/C).' },
        { label: 'Precision Tip', value: 'f₀ = 1/(2π√(LC)). At resonance, impedance is purely resistive. Energy oscillates between E-field (capacitor) and B-field (inductor).' },
        { label: 'Related Formula', value: 'f₀ = 1/(2π√(LC)). Quality factor: Q = 1/R × √(L/C). Ringing frequency: ω₀ = 1/√(LC). Bandwidth: Δf = f₀/Q.' },
        { label: 'Unit Conversion Note', value: 'L in H, C in F. f₀ in Hz. 1 pF = 10⁻¹² F. 1 nF = 10⁻⁹ F. 1 μF = 10⁻⁶ F. 1 mH = 10⁻³ H. 1 μH = 10⁻⁶ H.' }
      ]} },
  description: 'An LC circuit oscillates with energy alternating between the inductor\'s magnetic field and the capacitor\'s electric field at the resonant frequency.',
  formula: 'f = 1 / (2pisqrt(LC))',
  interpretation: 'Energy in an ideal LC circuit oscillates forever without damping. The resonant frequency is the natural frequency at which the circuit oscillates. Used in radio tuners and oscillators.'
}

export default calcDef
