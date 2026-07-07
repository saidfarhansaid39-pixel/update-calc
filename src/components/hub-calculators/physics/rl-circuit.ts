import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ resistance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), inductance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'resistance', label: 'Resistance', type: 'number', unit: 'ohm', min: 1, step: '1' }, { name: 'inductance', label: 'Inductance', type: 'number', unit: 'H', min: 1e-6, step: '1e-6' }],
  compute: (v) => { const tau = v.inductance / v.resistance; return { result: tau, label: 'Time Constant', unit: 's', steps: [{ label: 'Formula', value: 'τ = L/R' }, { label: 'Substitute', value: `${v.inductance} / ${v.resistance}` }, { label: 'Result', value: `${tau.toExponential(4)} s` }, { label: 'After 1τ', value: '63.2% of steady-state current' }] } },
  description: 'The RL time constant characterizes how quickly current builds up in an inductor-resistor circuit.',
  formula: 'τ = L / R',
  interpretation: 'After 1τ, current reaches 63.2% of its final value. After 5τ, current is essentially at steady state. RL circuits are used in filters and transformers.'
}

export default calcDef
