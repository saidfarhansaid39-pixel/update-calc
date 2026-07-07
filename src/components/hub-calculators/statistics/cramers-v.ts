import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ n: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), rows: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2'), cols: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2'), chi2: z.string().min(1).refine(v => parseFloat(v) >= 0, '≥0') }),
  fields: [{ name: 'n', label: 'Total N', type: 'number', min: 1, step: '1' }, { name: 'rows', label: 'Rows', type: 'number', min: 2, step: '1' }, { name: 'cols', label: 'Columns', type: 'number', min: 2, step: '1' }, { name: 'chi2', label: 'χ² statistic', type: 'number', min: 0, step: 'any' }],
  compute: (v) => { const nVal = n(v.n); const r = Math.round(n(v.rows)); const c = Math.round(n(v.cols)); const chi2 = n(v.chi2); const k = Math.min(r, c) - 1; const vVal = nVal > 0 && k > 0 ? Math.sqrt(chi2 / (nVal * k)) : 0; return { result: vVal, label: "Cramer's V", unit: '', steps: [{ label: 'χ²', value: `${chi2.toFixed(4)}` }, { label: 'N', value: `${nVal}` }, { label: 'k', value: `${k}` }, { label: 'V', value: `${vVal.toFixed(4)}` }] } },
  description: 'Cramer\'s V measures the strength of association between two nominal variables in a contingency table larger than 2×2.',
  formula: 'V = √(χ² / (n × min(r-1, c-1)))',
  interpretation: 'V ranges from 0 (no association) to 1 (perfect association). V > 0.3 is typically considered a moderate association.'
}

export default calcDef
