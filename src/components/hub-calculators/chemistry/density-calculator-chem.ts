import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    mass: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    volume: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'mass', label: 'Mass', type: 'number', unit: 'g', min: 0.001, step: '0.001' },
    { name: 'volume', label: 'Volume', type: 'number', unit: 'mL', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const d = v.mass / v.volume
    return {
      result: d, label: 'Density', unit: 'g/mL',
      steps: [
        { label: 'Mass', value: `${v.mass} g` },
        { label: 'Volume', value: `${v.volume} mL` },
        { label: 'ρ = m / V', value: `${d.toFixed(4)} g/mL` },
      ]
}
  },
  description: 'Density (ρ) is mass per unit volume. It is an intensive property that helps identify substances and predict their behavior.',
  formula: 'ρ = m / V',
  interpretation: 'Density is temperature-dependent (most substances expand when heated, decreasing density). Water has a maximum density of 1.000 g/mL at 4°C.'
}

export default calcDef
