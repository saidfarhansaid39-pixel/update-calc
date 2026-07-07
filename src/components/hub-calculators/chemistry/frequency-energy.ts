import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    frequency: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'frequency', label: 'Frequency (ν)', type: 'number', unit: 'Hz', min: 1, step: 'any' },
  ],
  compute: (v) => {
    const h = 6.626e-34
    const E = h * v.frequency
    const λ = 2.998e8 / v.frequency
    return {
      result: E, label: 'Photon Energy', unit: 'J',
      steps: [
        { label: 'ν', value: `${v.frequency.toExponential(4)} Hz` },
        { label: 'E = hν', value: `${E.toExponential(4)} J` },
        { label: 'E in eV', value: `${(E / 1.602e-19).toExponential(4)} eV` },
        { label: 'λ = c/ν', value: `${λ.toExponential(4)} m` },
      ]
}
  },
  description: 'Photon energy is directly proportional to frequency via Planck\'s constant: E = hν. Higher frequency (bluer light) means higher energy.',
  formula: 'E = hν = hc/λ',
  interpretation: 'Planck\'s constant h = 6.626 × 10⁻³⁴ J·s. Radio waves (MHz) have very low energy. Gamma rays (EHz) have extremely high energy. The photoelectric effect demonstrates the particle nature of light.'
}

export default calcDef
