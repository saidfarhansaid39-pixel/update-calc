import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    a260: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    a280: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'a260', label: 'A260 Absorbance', type: 'number', min: 0.001, step: '0.001' },
    { name: 'a280', label: 'A280 Absorbance', type: 'number', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const conc = v.a260 * 40
    const ratio = v.a260 / v.a280
    return {
      result: conc, label: 'RNA Concentration', unit: 'µg/mL',
      steps: [
        { label: 'A260', value: `${v.a260}` },
        { label: 'A280', value: `${v.a280}` },
        { label: 'A260/A280 ratio', value: `${ratio.toFixed(2)}` },
        { label: 'Concentration (40×A260)', value: `${conc.toFixed(1)} µg/mL` },
        { label: 'Quality (RNA)', value: ratio >= 2.0 ? 'Pure RNA' : ratio >= 1.8 ? 'Acceptable' : 'Contaminated (protein/phenol)' },
      ]
}
  },
  description: 'RNA concentration is determined by UV absorbance at 260 nm using the conversion factor of 40 µg/mL per A260 unit. A260/A280 ratio indicates purity.',
  formula: '[RNA] (µg/mL) = A260 × 40 | Pure RNA A260/A280 ˜ 2.0',
  interpretation: 'Pure RNA: A260/A280 = 2.0-2.2. Lower ratios indicate protein or phenol contamination. A260/A230 > 2.0 indicates no guanidine or organic contamination.'
}

export default calcDef
