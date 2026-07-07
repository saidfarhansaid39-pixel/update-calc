import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    charge: z.string().min(1, 'Required').refine(v => parseInt(v) >= -4 && parseInt(v) <= 7, '-4 to +7')
}),
  fields: [
    { name: 'charge', label: 'Element Net Charge in Compound', type: 'number', unit: '', min: -4, max: 7, step: '1' },
  ],
  compute: (v) => {
    const ox = v.charge
    return {
      result: ox, label: 'Oxidation Number', unit: '',
      steps: [
        { label: 'Assigned charge', value: `${ox >= 0 ? '+' : ''}${ox}` },
        { label: 'Rule', value: ox === 0 ? 'Elemental form' : ox < 0 ? `Anion (${ox})` : `Cation (+${ox})` },
      ]
}
  },
  description: 'Oxidation numbers represent the hypothetical charge an atom would have if all bonds were fully ionic. They help track electron transfer in redox reactions.',
  formula: 'Rules: H is +1, O is -2, Group 1 = +1, Group 2 = +2, sum = molecular charge',
  interpretation: 'A change in oxidation number indicates a redox reaction. Oxidation = increase in number, Reduction = decrease in number. OIL RIG: Oxidation Is Loss, Reduction Is Gain.'
}

export default calcDef
