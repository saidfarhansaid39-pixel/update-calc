import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ resistance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), capacitance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'resistance', label: 'Resistance', type: 'number', unit: 'ohm', min: 1, step: '1' }, { name: 'capacitance', label: 'Capacitance', type: 'number', unit: 'F', min: 1e-12, step: '1e-12' }],
  compute: (v) => { const tau = v.resistance * v.capacitance; return { result: tau, label: 'Time Constant', unit: 's', steps: [{ label: 'Formula', value: 'τ = RC' }, { label: 'Substitute', value: `${v.resistance} × ${v.capacitance}` }, { label: 'Result', value: `${tau.toExponential(4)} s` }, { label: 'After 1τ', value: '63.2% charged/discharged' }] } },
  description: 'The RC time constant is the time required to charge a capacitor to 63.2% of full charge through a resistor.',
  formula: 'τ = RC',
  interpretation: 'After 1τ, charge reaches 63.2%; after 5τ, ~99.3%. Smaller τ means faster charging. RC circuits are used in timing and filtering.'
}

export default calcDef
