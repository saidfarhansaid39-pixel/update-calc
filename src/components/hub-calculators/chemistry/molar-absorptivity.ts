import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    absorbance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    concentration: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    pathlength: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'absorbance', label: 'Absorbance (A)', type: 'number', unit: 'AU', min: 0.001, step: '0.01' },
    { name: 'concentration', label: 'Concentration (c)', type: 'number', unit: 'M', min: 0.000001, step: '0.001' },
    { name: 'pathlength', label: 'Path Length (b)', type: 'number', unit: 'cm', min: 0.01, step: '0.1' },
  ],
  compute: (v) => {
    const ε = v.absorbance / (v.concentration * v.pathlength)
    return {
      result: ε, label: 'Molar Absorptivity (ε)', unit: 'M⁻¹·cm⁻¹',
      steps: [
        { label: 'A (absorbance)', value: `${v.absorbance} AU` },
        { label: 'c (concentration)', value: `${v.concentration} M` },
        { label: 'b (path length)', value: `${v.pathlength} cm` },
        { label: 'ε = A/(b×c)', value: `${ε.toFixed(1)} M⁻¹·cm⁻¹` },
      ]
}
  },
  description: 'Molar absorptivity (ε) measures how strongly a substance absorbs light at a given wavelength. It is derived from the Beer-Lambert law: A = εbc.',
  formula: 'ε = A / (b × c) | Beer-Lambert Law: A = εbc',
  interpretation: 'High ε (>10⁴ M⁻¹·cm⁻¹) indicates strong absorption (e.g., conjugated dyes). Low ε (<10² M⁻¹·cm⁻¹) indicates weak absorption (e.g., d-d transitions in metal complexes). ε is wavelength-dependent.'
}

export default calcDef
