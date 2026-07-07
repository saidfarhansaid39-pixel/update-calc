import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    bondsBroken: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    bondsFormed: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'bondsBroken', label: 'Energy to Break Bonds', type: 'number', unit: 'kJ/mol', min: 1, step: '1' },
    { name: 'bondsFormed', label: 'Energy Released Forming Bonds', type: 'number', unit: 'kJ/mol', min: 1, step: '1' },
  ],
  compute: (v) => {
    const dH = v.bondsBroken - v.bondsFormed
    const type = dH < 0 ? 'Exothermic' : dH > 0 ? 'Endothermic' : 'Thermoneutral'
    return {
      result: dH, label: 'Enthalpy Change ΔH', unit: 'kJ/mol',
      steps: [
        { label: 'Bonds broken', value: `${v.bondsBroken} kJ/mol` },
        { label: 'Bonds formed', value: `${v.bondsFormed} kJ/mol` },
        { label: 'ΔH = broken - formed', value: `${dH.toFixed(1)} kJ/mol` },
        { label: 'Reaction type', value: type },
      ]
}
  },
  description: 'Enthalpy change (ΔH) measures heat absorbed or released during a chemical reaction at constant pressure.',
  formula: 'ΔH = Σ(bond energies broken) - Σ(bond energies formed)',
  interpretation: 'Negative ΔH: exothermic (heat released), feels hot. Positive ΔH: endothermic (heat absorbed), feels cold. Bond breaking requires energy; bond forming releases energy.'
}

export default calcDef
