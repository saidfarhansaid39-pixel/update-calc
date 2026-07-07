import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ pvalues: z.string().min(1, 'Required'), nComparisons: z.string().min(1).refine(v => parseInt(v) >= 1, '≥1') }),
  fields: [{ name: 'pvalues', label: 'Raw p-values (comma separated)', type: 'number', step: 'any' }, { name: 'nComparisons', label: 'Number of Comparisons', type: 'number', min: 1, step: '1' }],
  compute: (v) => { const pVals = parseList(v.pvalues); const m = Math.round(n(v.nComparisons)); const adjusted = pVals.map(p => Math.min(p * m, 1)); return { result: adjusted.map(a => a.toFixed(4)).join(', '), label: 'Bonferroni-adjusted p', unit: '', steps: [{ label: 'Comparisons', value: `${m}` }, { label: 'Original p', value: pVals.map(p => p.toFixed(4)).join(', ') }, { label: 'Adjusted p', value: adjusted.map(a => a.toFixed(4)).join(', ') }] } },
  description: 'Bonferroni correction divides the significance threshold by the number of comparisons to control familywise error rate.',
  formula: 'p_adj = min(p_raw × m, 1)',
  interpretation: 'The most conservative multiple comparison correction. Can be overly strict with many comparisons.'
}

export default calcDef
