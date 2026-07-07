import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    sProd: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    sReact: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'sProd', label: 'Σ S°(products × coeff)', type: 'number', unit: 'J/(mol·K)', min: 0.1, step: '0.1' },
    { name: 'sReact', label: 'Σ S°(reactants × coeff)', type: 'number', unit: 'J/(mol·K)', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const dS = v.sProd - v.sReact
    return {
      result: dS, label: 'ΔS°rxn', unit: 'J/(mol·K)',
      steps: [
        { label: 'Σ S°(products)', value: `${v.sProd} J/(mol·K)` },
        { label: 'Σ S°(reactants)', value: `${v.sReact} J/(mol·K)` },
        { label: 'ΔS°rxn', value: `${dS >= 0 ? '+' : ''}${dS.toFixed(2)} J/(mol·K)` },
      ]
}
  },
  description: 'Standard molar entropy (S°) is the absolute entropy of one mole under standard conditions (1 bar, 298 K). Values are always positive and increase with molecular complexity.',
  formula: 'ΔS°rxn = Σ(nᵢ × S°(products)) - Σ(nᵢ × S°(reactants))',
  interpretation: 'Gases have much higher entropies than liquids or solids. Diamond (2.4 J/mol·K) has lower entropy than graphite (5.7 J/mol·K). More complex molecules have higher S°.'
}

export default calcDef
