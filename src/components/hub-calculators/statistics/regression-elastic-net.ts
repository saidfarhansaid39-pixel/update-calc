import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ xValues: z.string().min(1, 'Required'), yValues: z.string().min(1, 'Required'), lambda: z.string().min(1).refine(v => parseFloat(v) >= 0, '≥0'), alpha: z.string().min(1).refine(v => { const a = parseFloat(v); return a >= 0 && a <= 1 }, '0-1') }),
  fields: [{ name: 'xValues', label: 'X Values (comma separated)', type: 'number', step: 'any' }, { name: 'yValues', label: 'Y Values (comma separated)', type: 'number', step: 'any' }, { name: 'lambda', label: 'λ (penalty)', type: 'number', min: 0, step: '0.1' }, { name: 'alpha', label: 'α (L1 ratio)', type: 'number', min: 0, max: 1, step: '0.1' }],
  compute: (v) => { const x = parseList(v.xValues); const y = parseList(v.yValues); if (x.length !== y.length || x.length < 2) return { result: 'Need ≥2 pairs', label: '', unit: '', steps: [] }; const mx = x.reduce((a, b) => a + b, 0) / x.length; const my = y.reduce((a, b) => a + b, 0) / y.length; const lambda = n(v.lambda); const alpha = n(v.alpha); const num = x.reduce((acc, xi, i) => acc + (xi - mx) * (y[i] - my), 0); const den = x.reduce((acc, xi) => acc + (xi - mx) ** 2, 0); const b1OLS = den !== 0 ? num / den : 0; const l1Pen = alpha * lambda; const l2Pen = (1 - alpha) * lambda; const b1Num = Math.sign(b1OLS) * Math.max(Math.abs(b1OLS) - l1Pen / (den || 1), 0); const b1 = den > 0 ? b1Num / (1 + l2Pen / den) : 0; const b0 = my - b1 * mx; return { result: b1, label: 'Elastic Net β₁', unit: '', steps: [{ label: 'OLS β₁', value: `${b1OLS.toFixed(4)}` }, { label: 'α (L1 ratio)', value: `${alpha}` }, { label: 'Elastic Net β₁', value: `${b1.toFixed(4)}` }] } },
  description: 'Elastic Net combines L1 and L2 penalties (αλ|β| + (1-α)λβ²/2). It selects groups of correlated variables together.',
  formula: 'β_en = argmin(||y-Xβ||² + αλ||β||₁ + (1-α)λ||β||²/2)',
  interpretation: 'α = 1 gives Lasso, α = 0 gives Ridge. Elastic Net handles correlated predictors better than Lasso alone.'
}

export default calcDef
