import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    mwProduct: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    mwTotal: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'mwProduct', label: 'MW of Desired Product', type: 'number', unit: 'g/mol', min: 1, step: '0.1' },
    { name: 'mwTotal', label: 'Sum of MW of All Reactants', type: 'number', unit: 'g/mol', min: 1, step: '0.1' },
  ],
  compute: (v) => {
    const ae = (v.mwProduct / v.mwTotal) * 100
    const waste = 100 - ae
    return {
      result: ae, label: 'Atom Economy', unit: '%',
      steps: [
        { label: 'MW product', value: `${v.mwProduct} g/mol` },
        { label: 'Total MW reactants', value: `${v.mwTotal} g/mol` },
        { label: 'AE = (MW product / MW reactants) × 100', value: `${ae.toFixed(2)}%` },
        { label: 'Waste', value: `${waste.toFixed(2)}%` },
      ]
}
  },
  description: 'Atom economy measures the efficiency of a chemical reaction by calculating the proportion of reactant atoms that end up in the desired product. Higher atom economy means less waste.',
  formula: 'Atom Economy = (MW of desired product / Σ MW of all reactants) × 100%',
  interpretation: 'A higher atom economy (closer to 100%) means a greener, more sustainable reaction. Reactions with low atom economy generate significant waste. Addition and rearrangement reactions typically have high atom economy (100%), while substitution reactions are lower.'
}

export default calcDef
