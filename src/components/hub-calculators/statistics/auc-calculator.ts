import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ actual: z.string().min(1, 'Required'), predicted: z.string().min(1, 'Required') }),
  fields: [{ name: 'actual', label: 'Actual (0/1, comma separated)', type: 'number', step: 'any' }, { name: 'predicted', label: 'Predicted probability (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const actual = parseList(v.actual); const pred = parseList(v.predicted); if (actual.length !== pred.length || actual.length < 2) return { result: 'Need ≥2 observations', label: '', unit: '', steps: [] }; const pos = actual.map((a, i) => ({ a, p: pred[i] })).filter(x => x.a === 1).map(x => x.p); const neg = actual.filter((a, i) => a === 0).map((_, i) => pred[i]); if (pos.length === 0 || neg.length === 0) return { result: 'Need both classes', label: '', unit: '', steps: [] }; let concordant = 0; let total = 0; for (const p of pos) { for (const n of neg) { if (p > n) concordant++; total++ } }; const auc = total > 0 ? concordant / total : 0.5; const sens = pos.length > 0 ? pos.filter(p => p >= 0.5).length / pos.length : 0; const spec = neg.length > 0 ? neg.filter(n => n < 0.5).length / neg.length : 0; return { result: auc, label: 'AUC', unit: '', steps: [{ label: 'Positives', value: `${pos.length}` }, { label: 'Negatives', value: `${neg.length}` }, { label: 'AUC', value: `${auc.toFixed(4)}` }, { label: 'Sensitivity (at 0.5)', value: `${sens.toFixed(4)}` }, { label: 'Specificity (at 0.5)', value: `${spec.toFixed(4)}` }] } },
  description: 'The AUC (Area Under the ROC Curve) summarizes the overall diagnostic accuracy across all classification thresholds.',
  formula: 'AUC = P(p_pos > p_neg) = Mann-Whitney U / (n₁n₂)',
  interpretation: 'AUC = 0.5: random guessing, AUC = 1.0: perfect separation. For medical diagnostics, AUC > 0.8 is considered good.'
}

export default calcDef
