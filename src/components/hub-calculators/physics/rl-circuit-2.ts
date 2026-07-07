import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ R: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), L: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), T: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'R', label: 'Resistance R', type: 'number', unit: 'Ω', min: 0.1, step: '0.1' }, { name: 'L', label: 'Inductance L', type: 'number', unit: 'H', min: 0.001, step: '0.001' }, { name: 'T', label: 'Time t', type: 'number', unit: 's', min: 0.001, step: '0.001' }],
  compute: (v) => { const tau = v.L / v.R; const factor = 1 - Math.exp(-v.T / tau); const Ifrac = factor; return { result: tau, label: 'Time Constant τ', unit: 's', steps: [{ label: 'Formula', value: 'τ = L/R' }, { label: 'τ', value: `${tau.toExponential(4)} s` }, { label: 'I(t)/I_max', value: `${(Ifrac * 100).toFixed(1)}%` }] } },
  description: 'RL circuit time constant and transient response. τ = L/R is the time for current to reach ~63.2% of its final value after a voltage step.',
  formula: 'τ = L/R, I(t) = I_max(1 − e^(−t/τ))',
  interpretation: 'Current rises exponentially with time constant τ. After 5τ, current is within 0.7% of steady-state. RL circuits are used in filters, power supplies, and inductive loads.'
}

export default calcDef
