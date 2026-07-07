import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    prodEnthalpy: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return !isNaN(n) }, 'Must be a number'),
    reactEnthalpy: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return !isNaN(n) }, 'Must be a number')
}),
  fields: [
    { name: 'prodEnthalpy', label: 'Σ H°(products × coeff)', type: 'number', unit: 'kJ/mol', min: -99999, max: 99999, step: '0.1' },
    { name: 'reactEnthalpy', label: 'Σ H°(reactants × coeff)', type: 'number', unit: 'kJ/mol', min: -99999, max: 99999, step: '0.1' },
  ],
  compute: (v) => {
    const dH = v.prodEnthalpy - v.reactEnthalpy
    return {
      result: dH, label: 'Enthalpy of Reaction ΔH°', unit: 'kJ/mol',
      steps: [
        { label: 'Σ H°(products)', value: `${v.prodEnthalpy} kJ/mol` },
        { label: 'Σ H°(reactants)', value: `${v.reactEnthalpy} kJ/mol` },
        { label: 'ΔH° = ΣH°(prod) - ΣH°(react)', value: `${dH >= 0 ? '+' : ''}${dH.toFixed(2)} kJ/mol` },
        { label: 'Type', value: dH < 0 ? 'Exothermic (heat released)' : dH > 0 ? 'Endothermic (heat absorbed)' : 'Thermoneutral' },
      ]
}
  },
  description: 'The standard enthalpy change of reaction (ΔH°rxn) is the difference between the sum of enthalpies of products and reactants, each multiplied by their stoichiometric coefficients.',
  formula: 'ΔH°rxn = Σ(nᵢ × H°f,products) - Σ(nᵢ × H°f,reactants)',
  interpretation: 'Negative ΔH: heat is released (exothermic). Positive ΔH: heat is absorbed (endothermic). Standard conditions are 1 bar and 298 K.'
}

export default calcDef
