import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ actual: z.string().min(1, 'Required'), predicted: z.string().min(1, 'Required') }),
  fields: [{ name: 'actual', label: 'Actual (0/1, comma separated)', type: 'number', step: 'any' }, { name: 'predicted', label: 'Predicted probability (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const actual = parseList(v.actual); const pred = parseList(v.predicted); if (actual.length !== pred.length || actual.length < 2) return { result: 'Need ≥2 observations', label: '', unit: '', steps: [] }; const pairs = actual.map((a, i) => ({ actual: a, pred: pred[i] })).filter(p => p.actual === 0 || p.actual === 1); const thresholds = Array.from(new Set(pairs.map(p => p.pred))).sort((a, b) => a - b); let rocPoints = thresholds.map(th => { const tp = pairs.filter(p => p.actual === 1 && p.pred >= th).length; const fp = pairs.filter(p => p.actual === 0 && p.pred >= th).length; const fn = pairs.filter(p => p.actual === 1 && p.pred < th).length; const tn = pairs.filter(p => p.actual === 0 && p.pred < th).length; const tpr = (tp + fn) > 0 ? tp / (tp + fn) : 0; const fpr = (fp + tn) > 0 ? fp / (fp + tn) : 0; return { tpr, fpr } }).filter((_, i, arr) => i === 0 || _.tpr !== arr[i - 1].tpr || _.fpr !== arr[i - 1].fpr); if (rocPoints.length < 2) return { result: 'ROC unavailable', label: '', unit: '', steps: [] }; let auc = 0; for (let i = 1; i < rocPoints.length; i++) { auc += (rocPoints[i].fpr - rocPoints[i - 1].fpr) * (rocPoints[i].tpr + rocPoints[i - 1].tpr) / 2 }; return { result: Math.abs(auc), label: 'AUC', unit: '', steps: [{ label: 'Thresholds', value: `${rocPoints.length}` }, { label: 'AUC', value: `${Math.abs(auc).toFixed(4)}` }] } },
  description: 'The ROC curve plots the true positive rate against the false positive rate across classification thresholds.',
  formula: 'ROC: TPR vs FPR for all thresholds, AUC = ∫TPR d(FPR)',
  interpretation: 'AUC = 0.5: no discrimination (random), 0.7-0.8: acceptable, 0.8-0.9: excellent, >0.9: outstanding. AUC = 1: perfect classifier.'
}

export default calcDef
