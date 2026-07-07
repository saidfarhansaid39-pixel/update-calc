import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    c1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    v1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    c2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'c1', label: 'Concentration of Titrant', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'v1', label: 'Volume of Titrant', type: 'number', unit: 'mL', min: 0.1, step: '0.1' },
    { name: 'c2', label: 'Concentration of Analyte', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const v2 = v.c1 * v.v1 / v.c2
    return {
      result: v2, label: 'Volume of Analyte at Equivalence', unit: 'mL',
      steps: [
        { label: 'C₁ (titrant)', value: `${v.c1} M` },
        { label: 'V₁ (titrant)', value: `${v.v1} mL` },
        { label: 'C₂ (analyte)', value: `${v.c2} M` },
        { label: 'V₂ = (C₁ × V₁) / C₂', value: `${v2.toFixed(2)} mL` },
        { label: 'Moles titrant used', value: `${(v.c1 * v.v1 / 1000).toFixed(6)} mol` },
      ]
}
  },
  description: 'The equivalence point in a titration is reached when the moles of titrant are stoichiometrically equal to the moles of analyte. At this point, n₁ = n₂ (C₁V₁ = C₂V₂ for 1:1 ratio).',
  formula: 'C₁V₁ = C₂V₂ (for monoprotic acid-base titration)',
  interpretation: 'The equivalence point is not the same as the endpoint. The endpoint is detected by an indicator color change, while the equivalence point is the theoretical completion point. A good indicator changes color near the equivalence point.'
}

export default calcDef
