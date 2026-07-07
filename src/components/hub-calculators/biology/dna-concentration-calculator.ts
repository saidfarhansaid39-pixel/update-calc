import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    a260: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    a280: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    factor: z.string().optional()
}),
  fields: [
    { name: 'a260', label: 'A260 Absorbance', type: 'number', min: 0.001, step: '0.001' },
    { name: 'a280', label: 'A280 Absorbance', type: 'number', min: 0.001, step: '0.001' },
    { name: 'factor', label: 'Conversion Factor', type: 'select', options: [
      { label: '50 (dsDNA)', value: '50' },
      { label: '40 (RNA)', value: '40' },
      { label: '33 (ssDNA)', value: '33' },
    ] },
  ],
  compute: (v) => {
    const factor = parseFloat(v.factor) || 50
    const conc = v.a260 * factor
    const ratio260280 = v.a260 / v.a280
    return {
      result: conc, label: 'Nucleic Acid Concentration', unit: 'µg/mL',
      steps: [
        { label: 'A260', value: `${v.a260}` },
        { label: 'A280', value: `${v.a280}` },
        { label: 'A260/A280 ratio', value: `${ratio260280.toFixed(2)}` },
        { label: 'Conversion factor', value: `${factor}` },
        { label: 'Concentration', value: `${conc.toFixed(1)} µg/mL` },
        { label: 'Quality', value: ratio260280 >= 1.8 ? 'Pure' : ratio260280 >= 1.5 ? 'Moderate' : 'Contaminated' },
      ]
}
  },
  description: 'Nucleic acid concentration is measured by UV absorbance at 260 nm. The A260/A280 ratio indicates sample purity for downstream applications.',
  formula: 'Concentration (µg/mL) = A260 × Conversion factor | Pure DNA A260/A280 ~1.8, RNA ~2.0',
  interpretation: 'A260/A280: 1.8-2.0 = pure. <1.8 = protein/phenol contamination. >2.0 = RNA contamination. A260/A230 > 2.0 indicates no organic contamination.'
}

export default calcDef
