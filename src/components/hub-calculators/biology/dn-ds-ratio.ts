import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    dn: z.string().refine(v => parseFloat(v) >= 0, '>=0'),
    ds: z.string().refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'dn', label: 'dN (non-synonymous substitutions/site)', type: 'number', min: 0, step: '0.001' },
    { name: 'ds', label: 'dS (synonymous substitutions/site)', type: 'number', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const ratio = v.dn / v.ds
    return {
      result: ratio, label: 'dN/dS Ratio (?)', unit: '',
      steps: [
        { label: 'dN (non-synonymous)', value: `${v.dn.toFixed(4)}` },
        { label: 'dS (synonymous)', value: `${v.ds.toFixed(4)}` },
        { label: '? = dN / dS', value: `${ratio.toFixed(4)}` },
        { label: 'Selection inference', value: ratio < 1 ? 'Purifying selection (conserved)' : ratio === 1 ? 'Neutral evolution' : 'Positive/Diversifying selection' },
      ]
}
  },
  description: 'The dN/dS ratio (?) compares the rate of non-synonymous to synonymous substitutions. It is the most widely used test for detecting selection in protein-coding sequences.',
  formula: '? = dN / dS | ? < 1: purifying selection, ? = 1: neutral, ? > 1: positive selection',
  interpretation: 'Most genes have ? < 0.1-0.3 (strong purifying selection). ? ˜ 1 indicates neutral. ? > 1 is rare but indicates adaptive evolution. Immune system and reproductive genes often show ? > 1.'
}

export default calcDef
