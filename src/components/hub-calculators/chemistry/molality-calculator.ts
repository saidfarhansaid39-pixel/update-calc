import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    moles: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    kgSolvent: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'moles', label: 'Moles of Solute', type: 'number', unit: 'mol', min: 0.001, step: '0.001' },
    { name: 'kgSolvent', label: 'Mass of Solvent', type: 'number', unit: 'kg', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const m = v.moles / v.kgSolvent
    return {
      result: m, label: 'Molality', unit: 'mol/kg',
      steps: [
        { label: 'Moles solute', value: `${v.moles} mol` },
        { label: 'Mass solvent', value: `${v.kgSolvent} kg` },
        { label: 'm = n / kg(solvent)', value: `${m.toFixed(4)} mol/kg` },
      ]
}
  },
  description: 'Molality (m) is moles of solute per kilogram of solvent. Unlike molarity, molality is independent of temperature because it uses mass rather than volume.',
  formula: 'm = moles solute / kg solvent',
  interpretation: 'Molality is used for colligative properties (boiling point elevation, freezing point depression) because it does not change with temperature.'
}

export default calcDef
