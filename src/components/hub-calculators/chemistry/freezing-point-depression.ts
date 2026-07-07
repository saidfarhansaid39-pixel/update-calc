import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    molality: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    kf: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    i: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 1, '≥ 1')
}),
  fields: [
    { name: 'molality', label: 'Molality', type: 'number', unit: 'mol/kg', min: 0.001, step: '0.001' },
    { name: 'kf', label: 'Cryoscopic Constant Kf', type: 'number', unit: '°C·kg/mol', min: 0.01, step: '0.01' },
    { name: 'i', label: 'Van\'t Hoff Factor', type: 'number', unit: '', min: 1, max: 10, step: '0.1' },
  ],
  compute: (v) => {
    const dTf = v.i * v.kf * v.molality
    return {
      result: dTf, label: 'Freezing Point Depression ΔTf', unit: '°C',
      steps: [
        { label: 'Molality', value: `${v.molality} mol/kg` },
        { label: 'Kf', value: `${v.kf} °C·kg/mol` },
        { label: 'i (van\'t Hoff)', value: `${v.i}` },
        { label: 'ΔTf = i × Kf × m', value: `${dTf.toFixed(4)} °C` },
        { label: 'New freezing point (water)', value: `${(0 - dTf).toFixed(2)} °C` },
      ]
}
  },
  description: 'Freezing point depression (ΔTf) is the lowering of the freezing point when a solute is dissolved. It is a colligative property used for antifreeze and determining molar mass.',
  formula: 'ΔTf = i × Kf × m',
  interpretation: 'For water, Kf = 1.86 °C·kg/mol. Road salt (NaCl, i = 2) lowers the freezing point of water to about -6°C at 1.6 mol/kg. CaCl₂ (i = 3) is even more effective.'
}

export default calcDef
