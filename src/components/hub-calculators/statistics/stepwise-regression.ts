import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ p1: z.string().min(1, 'Required'), p2: z.string().min(1, 'Required'), p3: z.string().min(1, 'Required'), y: z.string().min(1, 'Required') }),
  fields: [{ name: 'p1', label: 'Predictor X₁ (comma sep)', type: 'number', step: 'any' }, { name: 'p2', label: 'Predictor X₂ (comma sep)', type: 'number', step: 'any' }, { name: 'p3', label: 'Predictor X₃ (comma sep)', type: 'number', step: 'any' }, { name: 'y', label: 'Response Y (comma sep)', type: 'number', step: 'any' }],
  compute: (v) => { const preds = [parseList(v.p1), parseList(v.p2), parseList(v.p3)]; const y = parseList(v.y); if (preds.some(p => p.length !== y.length) || y.length < 4) return { result: 'Need ≥4 obs, equal lengths', label: '', unit: '', steps: [] }; const my = y.reduce((a, b) => a + b, 0) / y.length; const ssTot = y.reduce((acc, yi) => acc + (yi - my) ** 2, 0); const r2s = preds.map((p, pi) => { const mp = p.reduce((a, b) => a + b, 0) / p.length; const num = p.reduce((acc, xi, i) => acc + (xi - mp) * (y[i] - my), 0); const den = p.reduce((acc, xi) => acc + (xi - mp) ** 2, 0); const b1 = den > 0 ? num / den : 0; const b0 = my - b1 * mp; const yHat = p.map(xi => b0 + b1 * xi); const ssRes = y.reduce((acc, yi, i) => acc + (yi - yHat[i]) ** 2, 0); return { idx: pi, r2: ssTot > 0 ? 1 - ssRes / ssTot : 0 } }); r2s.sort((a, b) => b.r2 - a.r2); return { result: r2s[0].r2, label: 'Best Single Predictor R²', unit: '', steps: [{ label: 'Best predictor', value: `X${r2s[0].idx + 1} (R²=${r2s[0].r2.toFixed(4)})` }, { label: 'X₁ R²', value: `${r2s.find(r => r.idx === 0)?.r2.toFixed(4)}` }, { label: 'X₂ R²', value: `${r2s.find(r => r.idx === 1)?.r2.toFixed(4)}` }, { label: 'X₃ R²', value: `${r2s.find(r => r.idx === 2)?.r2.toFixed(4)}` }] } },
  description: 'Stepwise regression iteratively adds/removes predictors based on statistical significance or AIC.',
  formula: 'Forward: add predictor with smallest p-value < p_enter. Backward: remove largest p-value > p_remove.',
  interpretation: 'Stepwise can inflate Type I error. Better used for exploratory analysis. AIC-based selection is preferred over p-value thresholds.'
}

export default calcDef
