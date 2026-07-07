import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ predictors: z.string().min(1, 'Required'), response: z.string().min(1, 'Required') }),
  fields: [{ name: 'predictors', label: 'Predictors (comma separated)', type: 'number', step: 'any' }, { name: 'response', label: 'Response Y (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const preds = parseList(v.predictors); const resp = parseList(v.response); if (preds.length !== resp.length || preds.length < 3) return { result: 'Need ≥3 observations', label: '', unit: '', steps: [] }; const mx = preds.reduce((a, b) => a + b, 0) / preds.length; const my = resp.reduce((a, b) => a + b, 0) / resp.length; const num = preds.reduce((acc, xi, i) => acc + (xi - mx) * (resp[i] - my), 0); const den = preds.reduce((acc, xi) => acc + (xi - mx) ** 2, 0); const b1 = den !== 0 ? num / den : 0; const b0 = my - b1 * mx; const r2 = den !== 0 && resp.reduce((acc, yi) => acc + (yi - my) ** 2, 0) > 0 ? (num * num) / (den * resp.reduce((acc, yi) => acc + (yi - my) ** 2, 0)) : 0; return { result: r2, label: 'R² (Step 1)', unit: '', steps: [{ label: 'Equation', value: `y = ${b1.toFixed(4)}x + ${b0.toFixed(4)}` }, { label: 'R²', value: `${r2.toExponential(4)}` }, { label: 'Observations', value: `${preds.length}` }] } },
  description: 'Stepwise regression automatically selects predictors by adding/removing variables based on statistical criteria (AIC, p-values).',
  formula: 'Forward: add predictors with p < p_enter; Backward: remove with p > p_remove',
  interpretation: 'Stepwise regression can inflate Type I error. It is best used for exploratory analysis, not confirmatory hypothesis testing.'
}

export default calcDef
