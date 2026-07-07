import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    prodEntropy: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    reactEntropy: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'prodEntropy', label: 'Σ S°(products × coeff)', type: 'number', unit: 'J/(mol·K)', min: 0.1, step: '0.1' },
    { name: 'reactEntropy', label: 'Σ S°(reactants × coeff)', type: 'number', unit: 'J/(mol·K)', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const dS = v.prodEntropy - v.reactEntropy
    return {
      result: dS, label: 'Entropy Change ΔS°', unit: 'J/(mol·K)',
      steps: [
        { label: 'Σ S°(products)', value: `${v.prodEntropy} J/(mol·K)` },
        { label: 'Σ S°(reactants)', value: `${v.reactEntropy} J/(mol·K)` },
        { label: 'ΔS° = ΣS°(prod) - ΣS°(react)', value: `${dS >= 0 ? '+' : ''}${dS.toFixed(2)} J/(mol·K)` },
        { label: 'Disorder', value: dS > 0 ? 'Increases (more disorder)' : dS < 0 ? 'Decreases (more order)' : 'No change' },
      ]
}
  },
  description: 'Standard entropy change (ΔS°rxn) measures the change in disorder. ΔS° > 0 means increased randomness, which is thermodynamically favorable.',
  formula: 'ΔS°rxn = ΣS°(products) - ΣS°(reactants)',
  interpretation: 'Reactions producing more gas molecules increase entropy (ΔS > 0). Reactions forming solids from solutions decrease entropy (ΔS < 0).'
}

export default calcDef
