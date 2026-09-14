import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ resistance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), capacitance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'resistance', label: 'Resistance', type: 'number', unit: 'ohm', min: 1, step: '1' }, { name: 'capacitance', label: 'Capacitance', type: 'number', unit: 'F', min: 1e-12, step: '1e-12' }],
  defaults: { resistance: '1000', capacitance: '1e-6' },
  presets: [
    { label: 'Decoupling cap (100 nF, 1 kΩ)', values: { resistance: '1000', capacitance: '1e-7' } },
    { label: 'Camera flash (100 μF, 10 kΩ)', values: { resistance: '10000', capacitance: '1e-4' } },
    { label: 'Tone control (47 nF, 10 kΩ)', values: { resistance: '10000', capacitance: '4.7e-8' } },
  ],
  compute: (v) => { const tau = v.resistance * v.capacitance; return { result: tau, label: 'Time Constant', unit: 's', steps: [{ label: 'Formula', value: 'τ = RC' }, { label: 'Substitute', value: `${v.resistance} × ${v.capacitance}` }, { label: 'Result', value: `${tau.toExponential(4)} s` }, { label: 'After 1τ', value: '63.2% charged/discharged' }] ,
    extras: [
        { label: 'Real-World Application', value: 'RC circuits are everywhere: coupling/decoupling capacitors, timing circuits (555 timer), audio filters, and power supply smoothing.' },
        { label: 'Common Values', value: 'τ = RC. Typical decoupling: 100 nF + 100 Ω → τ = 10 μs. Power supply smoothing: 470 μF + 1 kΩ → τ = 0.47 s.' },
        { label: 'Precision Tip', value: 'One time constant τ = RC. After 5τ, capacitor is 99.3% charged/discharged. Charging: V(t) = V₀(1 - e⁻ᵗ/ʳ).' },
        { label: 'Related Formula', value: 'τ = RC. Cutoff frequency: f_c = 1/(2πRC). Discharge: V(t) = V₀e⁻ᵗ/ʳ. Energy stored: E = ½CV².' },
        { label: 'Unit Conversion Note', value: 'R in Ω, C in F. τ in s. 1 μF = 10⁻⁶ F. 1 nF = 10⁻⁹ F. 1 pF = 10⁻¹² F.' }
      ]} },
  description: 'The RC time constant is the time required to charge a capacitor to 63.2% of full charge through a resistor.',
  formula: 'τ = RC',
  interpretation: 'After 1τ, charge reaches 63.2%; after 5τ, ~99.3%. Smaller τ means faster charging. RC circuits are used in timing and filtering.'
}

export default calcDef
