import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ emf: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), resistance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'emf', label: 'Induced EMF', type: 'number', unit: 'V', min: 0.001, step: '0.001' }, { name: 'resistance', label: 'Circuit Resistance', type: 'number', unit: 'ohm', min: 0.01, step: '0.01' }],
  compute: (v) => { const I = v.emf / v.resistance; return { result: I, label: 'Induced Current', unit: 'A', steps: [{ label: 'Formula', value: 'I = eps/R (Ohm\'s Law)' }, { label: 'Substitute', value: `${v.emf} / ${v.resistance}` }, { label: 'Result', value: `${I.toExponential(4)} A` }] } },
  description: 'Lenz\'s Law states that the direction of induced current opposes the change in magnetic flux that produced it.',
  formula: 'eps = -dΦ/dt',
  interpretation: 'The induced current creates a magnetic field opposing the flux change. This is a consequence of energy conservation.'
}

export default calcDef
