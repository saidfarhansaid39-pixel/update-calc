import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ resistance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), inductance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'resistance', label: 'Resistance', type: 'number', unit: 'ohm', min: 1, step: '1' }, { name: 'inductance', label: 'Inductance', type: 'number', unit: 'H', min: 1e-6, step: '1e-6' }],
  defaults: { inductance: '0.01', resistance: '10' },
  presets: [
    { label: 'Inductor filter (10 mH, 10 Ω)', values: { inductance: '0.01', resistance: '10' } },
    { label: 'Motor winding (100 mH, 5 Ω)', values: { inductance: '0.1', resistance: '5' } },
    { label: 'Solenoid (1 H, 100 Ω)', values: { inductance: '1', resistance: '100' } },
  ],
  compute: (v) => { const tau = v.inductance / v.resistance; return { result: tau, label: 'Time Constant', unit: 's', steps: [{ label: 'Formula', value: 'τ = L/R' }, { label: 'Substitute', value: `${v.inductance} / ${v.resistance}` }, { label: 'Result', value: `${tau.toExponential(4)} s` }, { label: 'After 1τ', value: '63.2% of steady-state current' }] ,
    extras: [
        { label: 'Real-World Application', value: 'RL circuits model motor windings, transformer coils, and inductor-based power supply filters.' },
        { label: 'Common Values', value: 'τ = L/R. Time constant: 10 mH + 10 Ω → τ = 1 ms. Motor inductance: 1-100 mH. Speaker crossover: 0.5-5 mH.' },
        { label: 'Precision Tip', value: 'After 5τ, current reaches 99.3% of steady state. Current growth: I(t) = V/R(1 - e⁻ᵗʳ/ᴸ). Energy stored: U = ½LI².' },
        { label: 'Related Formula', value: 'τ = L/R. Cutoff frequency: f_c = R/(2πL). Impedance: Z_L = jωL. Voltage across L: V_L = L(dI/dt).' },
        { label: 'Unit Conversion Note', value: 'L in H, R in Ω. τ in s. 1 mH = 10⁻³ H. 1 μH = 10⁻⁶ H. 1 henry = 1 Wb/A = 1 V·s/A.' }
      ]} },
  description: 'The RL time constant characterizes how quickly current builds up in an inductor-resistor circuit.',
  formula: 'τ = L / R',
  interpretation: 'After 1τ, current reaches 63.2% of its final value. After 5τ, current is essentially at steady state. RL circuits are used in filters and transformers.'
}

export default calcDef
