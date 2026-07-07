import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ actual: z.string().min(1, 'Required'), pred: z.string().min(1, 'Required'), threshold: z.string().min(1).refine(v => { const t = parseFloat(v); return t >= 0 && t <= 1 }, '0-1') }),
  fields: [{ name: 'actual', label: 'Actual (0/1, comma sep)', type: 'number', step: 'any' }, { name: 'pred', label: 'Predicted Prob (comma sep)', type: 'number', step: 'any' }, { name: 'threshold', label: 'Classification Threshold', type: 'number', min: 0, max: 1, step: '0.05' }],
  compute: (v) => { const a = parseList(v.actual); const p = parseList(v.pred); const th = n(v.threshold); if (a.length !== p.length || a.length < 2) return { result: 'Need ≥2 obs', label: '', unit: '', steps: [] }; const pairs = a.filter((_, i) => a[i] === 0 || a[i] === 1); const pos = a.filter((x, i) => x === 1).length; const neg = a.filter((x, i) => x === 0).length; const tp = a.filter((x, i) => x === 1 && p[i] >= th).length; const fp = a.filter((x, i) => x === 0 && p[i] >= th).length; const fn = pos - tp; const tn = neg - fp; const sens = pos > 0 ? tp / pos : 0; const spec = neg > 0 ? tn / neg : 0; const ppv = (tp + fp) > 0 ? tp / (tp + fp) : 0; const npv = (tn + fn) > 0 ? tn / (tn + fn) : 0; const acc = (tp + tn) / (pos + neg); return { result: sens, label: 'Sensitivity', unit: '', steps: [{ label: 'Sensitivity (TPR)', value: `${sens.toFixed(4)}` }, { label: 'Specificity (TNR)', value: `${spec.toFixed(4)}` }, { label: 'PPV', value: `${ppv.toFixed(4)}` }, { label: 'NPV', value: `${npv.toFixed(4)}` }, { label: 'Accuracy', value: `${acc.toFixed(4)}` }] } },
  description: 'ROC curve analysis evaluates diagnostic test performance across classification thresholds.',
  formula: 'Sensitivity = TP/(TP+FN), Specificity = TN/(TN+FP), Youden\'s J = Sensitivity + Specificity - 1',
  interpretation: 'Optimal threshold maximizes Youden\'s J. AUC summarizes overall performance (0.5-1.0). Sensitivity and specificity trade off at each threshold.'
}

export default calcDef
