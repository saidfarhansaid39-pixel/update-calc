import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    a: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    e: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    b: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'a', label: 'Absorbance (A)', type: 'number', unit: '', min: 0.001, step: '0.001' },
    { name: 'e', label: 'Molar Absorptivity (ε)', type: 'number', unit: 'M⁻¹·cm⁻¹', min: 1, step: '10' },
    { name: 'b', label: 'Path Length (b)', type: 'number', unit: 'cm', min: 0.01, step: '0.1' },
  ],
  compute: (v) => {
    const c = v.a / (v.e * v.b)
    return {
      result: c, label: 'Concentration', unit: 'M',
      steps: [
        { label: 'Absorbance', value: `${v.a.toFixed(3)}` },
        { label: 'ε', value: `${v.e} M⁻¹·cm⁻¹` },
        { label: 'Path length', value: `${v.b} cm` },
        { label: 'c = A / (εb)', value: `${c.toExponential(4)} M` },
      ]
}
  },
  description: 'The Beer-Lambert Law (A = εbc) relates the absorbance of a sample to its concentration, path length, and molar absorptivity. It is the fundamental principle of UV-Vis spectrophotometry.',
  formula: 'A = εbc',
  interpretation: 'A higher absorbance at a given concentration indicates a stronger chromophore (higher ε). The Beer-Lambert law is linear only at low to moderate concentrations. At high concentrations, deviations occur due to molecular interactions.'
}

export default calcDef
