import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    concChange: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    time: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'concChange', label: 'Change in Concentration', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'time', label: 'Time Interval', type: 'number', unit: 's', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const rate = v.concChange / v.time
    return {
      result: rate, label: 'Average Reaction Rate', unit: 'M/s',
      steps: [
        { label: 'Δ[A]', value: `${v.concChange} M` },
        { label: 'Δt', value: `${v.time} s` },
        { label: 'Rate = Δ[A] / Δt', value: `${rate.toExponential(4)} M/s` },
      ]
}
  },
  description: 'Reaction rate measures how quickly the concentration of a reactant or product changes over time. It is the foundation of chemical kinetics.',
  formula: 'Rate = -Δ[reactant] / Δt = +Δ[product] / Δt',
  interpretation: 'Reaction rates depend on concentration, temperature, and catalysts. The rate law relates the rate to reactant concentrations via the rate constant k.'
}

export default calcDef
