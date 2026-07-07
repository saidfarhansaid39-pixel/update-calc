import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    a260: z.string().refine(v => parseFloat(v) >= 0, '>=0'),
    dilutionFactor3: z.string().refine(v => parseFloat(v) >= 1, '>=1')
}),
  fields: [
    { name: 'a260', label: 'A260 Reading', type: 'number', min: 0, step: '0.001' },
    { name: 'dilutionFactor3', label: 'Dilution Factor', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const concNgUl = v.a260 * 50 * v.dilutionFactor3
    return {
      result: concNgUl, label: 'DNA Concentration', unit: 'ng/µL',
      steps: [
        { label: 'A260 reading', value: `${v.a260.toFixed(3)}` },
        { label: 'Dilution factor', value: `${v.dilutionFactor3}` },
        { label: 'Concentration = A260 × 50 × dilution', value: `${concNgUl.toFixed(2)} ng/µL` },
        { label: 'Purity check (A260/A280)', value: 'Expected > 1.8 for pure DNA. Use your spectrophotometer ratio.' },
      ]
}
  },
  description: 'Calculate DNA concentration from UV absorbance at 260 nm. An A260 of 1.0 corresponds to ~50 µg/mL for double-stranded DNA.',
  formula: 'dsDNA: c = A260 × 50 × dilution (ng/µL) | ssDNA: c = A260 × 33 × dilution | RNA: c = A260 × 40 × dilution',
  interpretation: 'A260/A280 < 1.7: protein or phenol contamination. A260/A280 > 2.0: possible RNA contamination. A260/A230 < 1.5: chaotropic salt or organic compound contamination. Reliable A260 range: 0.1-1.0.'
}

export default calcDef
