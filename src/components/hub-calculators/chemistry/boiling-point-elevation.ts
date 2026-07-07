import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    molality: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    kb: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    i: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 1, '≥ 1')
}),
  fields: [
    { name: 'molality', label: 'Molality', type: 'number', unit: 'mol/kg', min: 0.001, step: '0.001' },
    { name: 'kb', label: 'Ebullioscopic Constant Kb', type: 'number', unit: '°C·kg/mol', min: 0.01, step: '0.01' },
    { name: 'i', label: 'Van\'t Hoff Factor', type: 'number', unit: '', min: 1, max: 10, step: '0.1' },
  ],
  compute: (v) => {
    const dTb = v.i * v.kb * v.molality
    return {
      result: dTb, label: 'Boiling Point Elevation ΔTb', unit: '°C',
      steps: [
        { label: 'Molality', value: `${v.molality} mol/kg` },
        { label: 'Kb', value: `${v.kb} °C·kg/mol` },
        { label: 'i (van\'t Hoff)', value: `${v.i}` },
        { label: 'ΔTb = i × Kb × m', value: `${dTb.toFixed(4)} °C` },
        { label: 'New boiling point (water)', value: `${(100 + dTb).toFixed(2)} °C` },
      ]
}
  },
  description: 'Boiling point elevation (ΔTb) is the increase in boiling point when a solute dissolves. It is a colligative property — dependent on the number of dissolved particles.',
  formula: 'ΔTb = i × Kb × m',
  interpretation: 'For water, Kb = 0.512 °C·kg/mol. NaCl (i = 2) elevates boiling point twice as much as sugar (i = 1) at the same molality. Kb is specific to the solvent.'
}

export default calcDef
