import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ R: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), L: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), T: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'R', label: 'Resistance R', type: 'number', unit: 'Ω', min: 0.1, step: '0.1' }, { name: 'L', label: 'Inductance L', type: 'number', unit: 'H', min: 0.001, step: '0.001' }, { name: 'T', label: 'Time t', type: 'number', unit: 's', min: 0.001, step: '0.001' }],
  defaults: { inductance: '0.01', resistance: '10' },
  presets: [
    { label: 'Inductor filter (10 mH, 10 Ω)', values: { inductance: '0.01', resistance: '10' } },
    { label: 'Motor winding (100 mH, 5 Ω)', values: { inductance: '0.1', resistance: '5' } },
    { label: 'Solenoid (1 H, 100 Ω)', values: { inductance: '1', resistance: '100' } },
  ],
  compute: (v) => { const tau = v.L / v.R; const factor = 1 - Math.exp(-v.T / tau); const Ifrac = factor; return { result: tau, label: 'Time Constant τ', unit: 's', steps: [{ label: 'Formula', value: 'τ = L/R' }, { label: 'τ', value: `${tau.toExponential(4)} s` }, { label: 'I(t)/I_max', value: `${(Ifrac * 100).toFixed(1)}%` }] ,
    extras: [
        { label: 'Real-World Application', value: 'RL circuits model motor windings, transformer coils, and inductor-based power supply filters.' },
        { label: 'Common Values', value: 'τ = L/R. Time constant: 10 mH + 10 Ω → τ = 1 ms. Motor inductance: 1-100 mH. Speaker crossover: 0.5-5 mH.' },
        { label: 'Precision Tip', value: 'After 5τ, current reaches 99.3% of steady state. Current growth: I(t) = V/R(1 - e⁻ᵗʳ/ᴸ). Energy stored: U = ½LI².' },
        { label: 'Related Formula', value: 'τ = L/R. Cutoff frequency: f_c = R/(2πL). Impedance: Z_L = jωL. Voltage across L: V_L = L(dI/dt).' },
        { label: 'Unit Conversion Note', value: 'L in H, R in Ω. τ in s. 1 mH = 10⁻³ H. 1 μH = 10⁻⁶ H. 1 henry = 1 Wb/A = 1 V·s/A.' }
      ]} },
  description: 'RL circuit time constant and transient response. τ = L/R is the time for current to reach ~63.2% of its final value after a voltage step.',
  formula: 'τ = L/R, I(t) = I_max(1 − e^(−t/τ))',
  interpretation: 'Current rises exponentially with time constant τ. After 5τ, current is within 0.7% of steady-state. RL circuits are used in filters, power supplies, and inductive loads.'
}

export default calcDef
