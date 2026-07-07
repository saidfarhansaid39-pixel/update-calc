import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    bondsBroken: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    bondsFormed: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'bondsBroken', label: 'Sum of Bond Energies (broken)', type: 'number', unit: 'kJ/mol', min: 1, step: '1' },
    { name: 'bondsFormed', label: 'Sum of Bond Energies (formed)', type: 'number', unit: 'kJ/mol', min: 1, step: '1' },
  ],
  compute: (v) => {
    const dH = v.bondsBroken - v.bondsFormed
    return {
      result: dH, label: 'Enthalpy Change ΔH', unit: 'kJ/mol',
      steps: [
        { label: 'Bonds broken (energy absorbed)', value: `${v.bondsBroken} kJ/mol` },
        { label: 'Bonds formed (energy released)', value: `${v.bondsFormed} kJ/mol` },
        { label: 'ΔH = broken - formed', value: `${dH >= 0 ? '+' : ''}${dH.toFixed(1)} kJ/mol` },
        { label: 'Type', value: dH < 0 ? 'Exothermic' : dH > 0 ? 'Endothermic' : 'Thermoneutral' },
      ]
}
  },
  description: 'Bond enthalpy estimation uses average bond dissociation energies to calculate reaction enthalpy. Breaking bonds absorbs energy; forming bonds releases energy.',
  formula: 'ΔH = Σ(bond energies broken) - Σ(bond energies formed)',
  interpretation: 'Average bond energies (e.g., C-H = 413 kJ/mol, O=O = 498 kJ/mol) provide approximate ΔH values. Results are approximate because bond energies vary between compounds.'
}

export default calcDef
