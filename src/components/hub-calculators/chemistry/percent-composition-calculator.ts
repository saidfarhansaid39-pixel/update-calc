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
        { label: '% = (element / total) × 100', value: `${pct.toFixed(2)}%` },
      ]
}
  },
  description: 'Percent composition shows the mass percentage of each element in a compound. It is calculated by dividing the element\'s mass by the total compound mass.',
  formula: '% = (mass of element / total mass) × 100%',
  interpretation: 'Percent composition is used to determine empirical formulas and verify compound purity. The sum of all element percentages should equal 100%.'
}

export default calcDef
