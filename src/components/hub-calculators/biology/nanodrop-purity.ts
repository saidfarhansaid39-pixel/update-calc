import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    a260_280: z.string().refine(v => parseFloat(v) >= 0, '>=0'),
    a260_230: z.string().refine(v => parseFloat(v) >= 0, '>=0'),
    sampleType: z.string()
}),
  fields: [
    { name: 'a260_280', label: 'A260/A280 Ratio', type: 'number', min: 0, max: 3, step: '0.01' },
    { name: 'a260_230', label: 'A260/A230 Ratio', type: 'number', min: 0, max: 3, step: '0.01' },
    { name: 'sampleType', label: 'Sample Type', type: 'select', options: [
      { label: 'dsDNA', value: 'dsdna' }, { label: 'RNA', value: 'rna' },
    ] },
  ],
  compute: (v) => {
    const pure260_280 = v.sampleType === 'rna' ? (v.a260_280 >= 1.9 ? 'Pure' : v.a260_280 > 1.6 ? 'Acceptable' : 'Contaminated') : (v.a260_280 >= 1.8 ? 'Pure' : v.a260_280 > 1.5 ? 'Acceptable' : 'Contaminated')
    const pure260_230 = v.a260_230 >= 1.8 ? 'Pure' : v.a260_230 > 1.0 ? 'Acceptable' : 'Contaminated'
    return {
      result: v.a260_280, label: 'Nucleic Acid Purity Score', unit: '',
      steps: [
        { label: 'Sample type', value: v.sampleType === 'rna' ? 'RNA' : 'dsDNA' },
        { label: 'A260/A280', value: `${v.a260_280.toFixed(2)} — ${pure260_280}` },
        { label: 'A260/A230', value: `${v.a260_230.toFixed(2)} — ${pure260_230}` },
        { label: 'Interpretation', value: pure260_280 === 'Pure' && pure260_230 === 'Pure' ? 'Sample is clean — suitable for downstream applications' : 'Contamination detected — consider re-purification' },
      ]
}
  },
  description: 'Nucleic acid purity is assessed by UV absorbance ratios. A260/A280 indicates protein/phenol contamination; A260/A230 indicates chaotropic salt or organic compound contamination.',
  formula: 'Pure dsDNA: A260/A280 ˜ 1.8, A260/A230 ˜ 2.0-2.2 | Pure RNA: A260/A280 ˜ 2.0, A260/A230 ˜ 2.0-2.2',
  interpretation: 'Low A260/A280: protein or phenol contamination. Low A260/A230: EDTA, carbohydrates, or guanidine salts carryover from extraction. High A260/A280 (>2.2 for DNA): RNA contamination. Re-purify if both ratios are low.'
}

export default calcDef
