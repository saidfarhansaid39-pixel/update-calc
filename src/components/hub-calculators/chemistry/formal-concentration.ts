import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    moles: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    volume: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'moles', label: 'Total Moles of Substance', type: 'number', unit: 'mol', min: 0.0001, step: '0.001' },
    { name: 'volume', label: 'Volume of Solution', type: 'number', unit: 'L', min: 0.001, step: '0.01' },
  ],
  compute: (v) => {
    const F = v.moles / v.volume
    return {
      result: F, label: 'Formal Concentration (F)', unit: 'M',
      steps: [
        { label: 'Total moles', value: `${v.moles} mol` },
        { label: 'Volume', value: `${v.volume} L` },
        { label: 'F = n / V', value: `${v.moles} / ${v.volume}` },
        { label: 'Formality', value: `${F.toFixed(4)} M` },
      ]
}
  },
  description: 'Formal concentration (F) is the total number of moles of a substance added per liter of solution, regardless of its actual speciation (dissociation, complexation, etc.). Unlike molarity, it accounts for all forms of the substance.',
  formula: 'F = n_total / V(L) | F > M when the substance dissociates | F = M for non-electrolytes',
  interpretation: 'Examples: 1.0 M acetic acid has F = 1.0 M but actual [CH₃COO⁻] < 1.0 M due to incomplete dissociation. Formality is used in analytical chemistry when speciation is unknown or complex.'
}

export default calcDef
