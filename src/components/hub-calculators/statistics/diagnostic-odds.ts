import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tp: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), fp: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), fn: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), tn: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0') }),
  fields: [{ name: 'tp', label: 'True Positives', type: 'number', min: 0, step: '1' }, { name: 'fp', label: 'False Positives', type: 'number', min: 0, step: '1' }, { name: 'fn', label: 'False Negatives', type: 'number', min: 0, step: '1' }, { name: 'tn', label: 'True Negatives', type: 'number', min: 0, step: '1' }],
  compute: (v) => { const tp = n(v.tp); const fp = n(v.fp); const fn = n(v.fn); const tn = n(v.tn); const sens = (tp + fn) > 0 ? tp / (tp + fn) : 0; const spec = (tn + fp) > 0 ? tn / (tn + fp) : 0; const ppv = (tp + fp) > 0 ? tp / (tp + fp) : 0; const npv = (tn + fn) > 0 ? tn / (tn + fn) : 0; const dor = fp > 0 && fn > 0 ? (tp * tn) / (fp * fn) : 0; return { result: dor, label: 'Diagnostic Odds Ratio', unit: '', steps: [{ label: 'Sensitivity', value: `${(sens * 100).toFixed(1)}%` }, { label: 'Specificity', value: `${(spec * 100).toFixed(1)}%` }, { label: 'PPV', value: `${(ppv * 100).toFixed(1)}%` }, { label: 'NPV', value: `${(npv * 100).toFixed(1)}%` }, { label: 'DOR', value: `${dor.toFixed(4)}` }] } },
  description: 'Diagnostic Odds Ratio (DOR) summarizes diagnostic test accuracy as a single number: (TP×TN)/(FP×FN).',
  formula: 'DOR = (TP × TN) / (FP × FN)',
  interpretation: 'DOR ranges from 0 to ∞. Higher values indicate better discrimination. DOR = 1: no discriminatory power.'
}

export default calcDef
