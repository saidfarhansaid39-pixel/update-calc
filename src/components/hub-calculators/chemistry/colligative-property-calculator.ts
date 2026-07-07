import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    molality: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    i: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 1, '≥ 1'),
    kf: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    kb: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'molality', label: 'Molality of Solution', type: 'number', unit: 'mol/kg', min: 0.001, step: '0.001' },
    { name: 'i', label: 'Van\'t Hoff Factor (i)', type: 'number', unit: '', min: 1, max: 10, step: '0.1' },
    { name: 'kf', label: 'Cryoscopic Constant Kf', type: 'number', unit: '°C·kg/mol', min: 0.01, step: '0.01' },
    { name: 'kb', label: 'Ebullioscopic Constant Kb', type: 'number', unit: '°C·kg/mol', min: 0.01, step: '0.01' },
  ],
  compute: (v) => {
    const dTf = v.i * v.kf * v.molality
    const dTb = v.i * v.kb * v.molality
    return {
      result: dTf, label: 'Freezing Point Depression ΔTf', unit: '°C',
      steps: [
        { label: 'Molality', value: `${v.molality} mol/kg` },
        { label: 'i (van\'t Hoff)', value: `${v.i}` },
        { label: 'ΔTf = i × Kf × m', value: `${dTf.toFixed(4)} °C` },
        { label: 'ΔTb = i × Kb × m', value: `${dTb.toFixed(4)} °C` },
      ]
}
  },
  description: 'Colligative properties depend on the number of solute particles, not their identity. Freezing point depression and boiling point elevation are key examples.',
  formula: 'ΔTf = i × Kf × m | ΔTb = i × Kb × m',
  interpretation: 'For water, Kf = 1.86 and Kb = 0.512 °C·kg/mol. NaCl dissociates into 2 ions (i = 2), CaCl₂ into 3 (i = 3). Higher i causes greater ΔT.'
}

export default calcDef
