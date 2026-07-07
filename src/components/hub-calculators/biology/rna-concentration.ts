import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    a260: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    dilution: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 1, '>=1')
}),
  fields: [
    { name: 'a260', label: 'A260 Reading', type: 'number', min: 0.001, step: '0.001' },
    { name: 'dilution', label: 'Dilution Factor', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const conc = v.a260 * 40 * v.dilution
    return {
      result: conc, label: 'RNA Concentration', unit: 'ng/µL',
      steps: [
        { label: 'A260', value: `${v.a260.toFixed(3)}` },
        { label: 'Conversion factor', value: '40 (RNA)' },
        { label: 'Dilution factor', value: `${v.dilution}` },
        { label: 'Conc = A260 × 40 × DF', value: `${conc.toFixed(2)} ng/µL` },
        { label: 'A260/A280 (expected ~2.0)', value: 'Check spectrophotometer for purity' },
      ]
}
  },
  description: 'Calculate RNA concentration from UV absorbance at 260 nm. A260 of 1.0 corresponds to ~40 µg/mL for RNA. The A260/A280 and A260/A230 ratios indicate purity.',
  formula: '[RNA] (ng/µL) = A260 × 40 × DF | Pure RNA: A260/A280 ˜ 2.0, A260/A230 > 2.0',
  interpretation: 'Pure RNA: A260/A280 = 2.0-2.2. Lower ratios indicate protein (A280) or phenol contamination. A260/A230 < 1.5 suggests guanidine salt carryover. Read in 10 mM Tris pH 7.5 for best accuracy.'
}

export default calcDef
