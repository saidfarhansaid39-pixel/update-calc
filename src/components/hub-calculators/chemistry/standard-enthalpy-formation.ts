import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    prodDf: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return !isNaN(n) }, 'Must be a number'),
    reactDf: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return !isNaN(n) }, 'Must be a number')
}),
  fields: [
    { name: 'prodDf', label: 'Σ ΔH°f(products × coeff)', type: 'number', unit: 'kJ/mol', min: -99999, max: 99999, step: '0.1' },
    { name: 'reactDf', label: 'Σ ΔH°f(reactants × coeff)', type: 'number', unit: 'kJ/mol', min: -99999, max: 99999, step: '0.1' },
  ],
  compute: (v) => {
    const dH = v.prodDf - v.reactDf
    return {
      result: dH, label: 'ΔH°rxn', unit: 'kJ/mol',
      steps: [
        { label: 'Σ ΔH°f(products)', value: `${v.prodDf} kJ/mol` },
        { label: 'Σ ΔH°f(reactants)', value: `${v.reactDf} kJ/mol` },
        { label: 'ΔH° = ΣΔH°f(prod) - ΣΔH°f(react)', value: `${dH >= 0 ? '+' : ''}${dH.toFixed(2)} kJ/mol` },
      ]
}
  },
  description: 'Standard enthalpy of formation (ΔH°f) is the enthalpy change when one mole of a compound forms from its elements in their standard states. Elements in standard states have ΔH°f = 0.',
  formula: 'ΔH°rxn = Σ(nᵢ × ΔH°f, products) - Σ(nᵢ × ΔH°f, reactants)',
  interpretation: 'More negative ΔH°f = more stable compound. Standard state: 1 bar, 298 K. For example, ΔH°f of H₂O(l) = -285.8 kJ/mol.'
}

export default calcDef
