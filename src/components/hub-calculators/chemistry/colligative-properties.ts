import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    molality: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    i: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 1, '≥ 1'),
    temp: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'molality', label: 'Molality', type: 'number', unit: 'mol/kg', min: 0.001, step: '0.001' },
    { name: 'i', label: 'Van\'t Hoff Factor', type: 'number', unit: '', min: 1, max: 10, step: '0.1' },
    { name: 'temp', label: 'Temperature', type: 'number', unit: 'K', min: 1, step: '1' },
  ],
  compute: (v) => {
    const R = 0.082057
    const pi = v.i * v.molality * R * v.temp
    return {
      result: pi, label: 'Osmotic Pressure Π', unit: 'atm',
      steps: [
        { label: 'Molality', value: `${v.molality} mol/kg` },
        { label: 'i (van\'t Hoff)', value: `${v.i}` },
        { label: 'T', value: `${v.temp} K` },
        { label: 'Π = iMRT (osmotic pressure)', value: `${pi.toFixed(4)} atm` },
        { label: 'ΔTb (if Kb known)', value: 'ΔTb = i × Kb × m' },
        { label: 'ΔTf (if Kf known)', value: 'ΔTf = i × Kf × m' },
      ]
}
  },
  description: 'Colligative properties depend only on the number of solute particles, not their identity. Key properties: vapor pressure lowering (Raoult), boiling point elevation (ΔTb), freezing point depression (ΔTf), osmotic pressure (Π).',
  formula: 'ΔTb = iKbm, ΔTf = iKfm, Π = iMRT',
  interpretation: 'NaCl (i = 2) produces twice the effect of sugar (i = 1) at the same concentration. Colligative properties are used to determine molar mass and understand solution behavior.'
}

export default calcDef
