import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    concChange: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    time: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'concChange', label: 'Change in Concentration Δ[A]', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'time', label: 'Time Interval Δt', type: 'number', unit: 's', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const rate = v.concChange / v.time
    return {
      result: rate, label: 'Average Reaction Rate', unit: 'M/s',
      steps: [
        { label: 'Δ[A]', value: `${v.concChange} M` },
        { label: 'Δt', value: `${v.time} s` },
        { label: 'Rate = Δ[A]/Δt', value: `${rate.toExponential(4)} M/s` },
      ]
}
  },
  description: 'Reaction rate measures how quickly a reactant or product concentration changes over time. The rate depends on concentration, temperature, and catalysts.',
  formula: 'Rate = -Δ[reactant]/Δt = +Δ[product]/Δt',
  interpretation: 'Reaction rates are positive for products (formation) and negative for reactants (consumption). Rate units are typically M/s. Catalysts increase rate without being consumed.'
}

export default calcDef
