import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    sProd: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be ≥ 0'),
    sReact: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be ≥ 0')
}),
  fields: [
    { name: 'sProd', label: 'Sum of Product Entropies', type: 'number', unit: 'J/(mol·K)', min: 0, step: '0.1' },
    { name: 'sReact', label: 'Sum of Reactant Entropies', type: 'number', unit: 'J/(mol·K)', min: 0, step: '0.1' },
  ],
  compute: (v) => {
    const dS = v.sProd - v.sReact
    return {
      result: dS, label: 'Entropy Change ΔS', unit: 'J/(mol·K)',
      steps: [
        { label: 'ΣS(products)', value: `${v.sProd} J/(mol·K)` },
        { label: 'ΣS(reactants)', value: `${v.sReact} J/(mol·K)` },
        { label: 'ΔS = ΣS(products) - ΣS(reactants)', value: `${dS.toFixed(2)} J/(mol·K)` },
      ]
}
  },
  description: 'Entropy (S) measures the disorder or randomness of a system. Entropy change (ΔS) indicates whether a reaction increases or decreases disorder.',
  formula: 'ΔS°(reaction) = ΣS°(products) - ΣS°(reactants)',
  interpretation: 'ΔS > 0: disorder increases (favorable). ΔS < 0: disorder decreases. The Second Law states total entropy always increases for spontaneous processes.'
}

export default calcDef
