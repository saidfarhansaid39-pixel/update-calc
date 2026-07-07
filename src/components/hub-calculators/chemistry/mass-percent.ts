import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    massElem: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    massTotal: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'massElem', label: 'Mass of Element', type: 'number', unit: 'g', min: 0.001, step: '0.001' },
    { name: 'massTotal', label: 'Total Mass of Compound', type: 'number', unit: 'g', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const pct = v.massElem / v.massTotal * 100
    return {
      result: pct, label: 'Mass Percent', unit: '%',
      steps: [
        { label: 'Element mass', value: `${v.massElem} g` },
        { label: 'Compound mass', value: `${v.massTotal} g` },
        { label: '% = (element / total) × 100%', value: `${pct.toFixed(2)}%` },
      ]
}
  },
  description: 'Mass percent expresses the mass of an element relative to the total mass of the compound, multiplied by 100%. It is also called percent composition by mass.',
  formula: '% = (mass of element / total mass) × 100%',
  interpretation: 'Mass percent is independent of sample size. For water (H₂O), the mass percent of oxygen is 88.8% and hydrogen is 11.2%. Used to determine empirical formulas.'
}

export default calcDef
