import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    moleFrac: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > 0 && n <= 1 }, '0-1'),
    pPure: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'moleFrac', label: 'Mole Fraction of Solvent (X)', type: 'number', unit: '', min: 0.001, max: 1, step: '0.01' },
    { name: 'pPure', label: 'Vapor Pressure of Pure Solvent (P°)', type: 'number', unit: 'mmHg', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const p = v.moleFrac * v.pPure
    return {
      result: p, label: 'Vapor Pressure of Solution', unit: 'mmHg',
      steps: [
        { label: 'X_solvent', value: v.moleFrac.toFixed(4) },
        { label: 'P°_solvent', value: `${v.pPure} mmHg` },
        { label: 'P = X × P°', value: `${p.toFixed(2)} mmHg` },
        { label: 'Vapor pressure lowering', value: `${(v.pPure - p).toFixed(2)} mmHg` },
      ]
}
  },
  description: 'Raoult\'s Law: the vapor pressure of a solution equals the mole fraction of solvent times the vapor pressure of the pure solvent.',
  formula: 'P = X_solvent × P°_solvent',
  interpretation: 'Adding a non-volatile solute lowers vapor pressure proportionally. This is a colligative property — it depends only on the number of solute particles. Ideal solutions obey Raoult\'s law exactly.'
}

export default calcDef
