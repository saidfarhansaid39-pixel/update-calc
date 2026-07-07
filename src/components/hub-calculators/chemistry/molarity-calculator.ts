import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    moles: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    volume: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'moles', label: 'Moles of Solute', type: 'number', unit: 'mol', min: 0.001, step: '0.001' },
    { name: 'volume', label: 'Volume of Solution', type: 'number', unit: 'L', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const M = v.moles / v.volume
    return {
      result: M, label: 'Molarity', unit: 'M',
      steps: [
        { label: 'Moles solute', value: `${v.moles} mol` },
        { label: 'Volume solution', value: `${v.volume} L` },
        { label: 'M = n / V', value: `${M.toFixed(4)} M` },
      ]
}
  },
  description: 'Molarity (M) is the most common concentration unit in chemistry, defined as moles of solute per liter of solution.',
  formula: 'M = n / V',
  interpretation: '1 M = 1 mol/L. Molarity depends on temperature because volume changes with temperature. For precise work, molality (m) may be preferred.'
}

export default calcDef
