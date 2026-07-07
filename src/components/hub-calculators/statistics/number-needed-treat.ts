import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ treatedEvents: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), treatedTotal: z.string().min(1).refine(v => parseInt(v) > 0, '>0'), controlEvents: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), controlTotal: z.string().min(1).refine(v => parseInt(v) > 0, '>0') }),
  fields: [{ name: 'treatedEvents', label: 'Treated with Outcome', type: 'number', min: 0, step: '1' }, { name: 'treatedTotal', label: 'Treated Total', type: 'number', min: 1, step: '1' }, { name: 'controlEvents', label: 'Control with Outcome', type: 'number', min: 0, step: '1' }, { name: 'controlTotal', label: 'Control Total', type: 'number', min: 1, step: '1' }],
  compute: (v) => { const a = n(v.treatedEvents); const nt = n(v.treatedTotal); const c = n(v.controlEvents); const nc = n(v.controlTotal); const riskT = nt > 0 ? a / nt : 0; const riskC = nc > 0 ? c / nc : 0; const arr = riskC - riskT; const nnt = arr > 0 ? Math.ceil(1 / arr) : Infinity; const rrr = riskC > 0 ? (riskC - riskT) / riskC : 0; return { result: nnt === Infinity ? 'Infinity (harm)' : `${nnt}`, label: 'Number Needed to Treat', unit: '', steps: [{ label: 'ARR', value: `${(arr * 100).toFixed(2)}%` }, { label: 'RRR', value: `${(rrr * 100).toFixed(1)}%` }, { label: 'NNT', value: nnt === Infinity ? '∞ (treatment harmful)' : `${nnt}` }] } },
  description: 'Number Needed to Treat (NNT) is the average number of patients needed to treat to prevent one adverse outcome.',
  formula: 'NNT = 1 / (CER - EER) = 1 / ARR, where ARR = absolute risk reduction',
  interpretation: 'Lower NNT indicates more effective treatment. NNT = 10 means treating 10 patients prevents 1 event. Harm: NNH = 1/ARI.'
}

export default calcDef
