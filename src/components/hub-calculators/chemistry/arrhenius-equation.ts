import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    a: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    ea: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    temp: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'a', label: 'Frequency Factor A', type: 'number', unit: 's⁻¹', min: 1, step: 'any' },
    { name: 'ea', label: 'Activation Energy Ea', type: 'number', unit: 'J/mol', min: 100, step: '100' },
    { name: 'temp', label: 'Temperature T', type: 'number', unit: 'K', min: 1, step: '1' },
  ],
  compute: (v) => {
    const R = 8.314
    const k = v.a * Math.exp(-v.ea / (R * v.temp))
    return {
      result: k, label: 'Rate Constant k', unit: 's⁻¹',
      steps: [
        { label: 'A (frequency factor)', value: `${v.a.toExponential(4)} s⁻¹` },
        { label: 'Ea', value: `${v.ea} J/mol (${(v.ea / 1000).toFixed(2)} kJ/mol)` },
        { label: 'T', value: `${v.temp} K` },
        { label: '-Ea/(RT)', value: `${(-v.ea / (R * v.temp)).toFixed(4)}` },
        { label: 'k = A·exp(-Ea/RT)', value: `${k.toExponential(4)} s⁻¹` },
      ]
}
  },
  description: 'The Arrhenius equation (k = A·e^(-Ea/RT)) describes the temperature dependence of reaction rates. The frequency factor A represents collision frequency, and Ea is the activation energy barrier.',
  formula: 'k = A × e^(-Ea/RT)',
  interpretation: 'Higher temperature and lower Ea increase k. A rule of thumb: raising T by 10°C roughly doubles the rate for many reactions near room temperature (Ea ≈ 50 kJ/mol).'
}

export default calcDef
