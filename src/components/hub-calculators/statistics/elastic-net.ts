import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ x: z.string().min(1, 'Required'), y: z.string().min(1, 'Required'), lambda: z.string().min(1).refine(v => parseFloat(v) >= 0, '≥0'), alpha: z.string().min(1).refine(v => { const a = parseFloat(v); return a >= 0 && a <= 1 }, '0-1') }),
  fields: [{ name: 'x', label: 'X (comma separated)', type: 'number', step: 'any' }, { name: 'y', label: 'Y (comma separated)', type: 'number', step: 'any' }, { name: 'lambda', label: 'λ (regularization)', type: 'number', min: 0, step: '0.1' }, { name: 'alpha', label: 'α (mix: 0=Ridge, 1=Lasso)', type: 'number', min: 0, max: 1, step: '0.1' }],
  compute: (v) => { const x = parseList(v.x); const y = parseList(v.y); if (x.length !== y.length || x.length < 3) return { result: 'Need ≥3 obs', label: '', unit: '', steps: [] }; const mx = x.reduce((a, b) => a + b, 0) / x.length; const my = y.reduce((a, b) => a + b, 0) / y.length; const num = x.reduce((acc, xi, i) => acc + (xi - mx) * (y[i] - my), 0); const den = x.reduce((acc, xi) => acc + (xi - mx) ** 2, 0); const b1OLS = den > 0 ? num / den : 0; const l1 = n(v.alpha) * n(v.lambda); const l2 = (1 - n(v.alpha)) * n(v.lambda); const b1 = den > 0 ? (Math.sign(b1OLS) * Math.max(Math.abs(b1OLS) - l1 / den, 0)) / (1 + l2 / den) : 0; const b0 = my - b1 * mx; return { result: b1, label: 'Elastic Net β₁', unit: '', steps: [{ label: 'OLS β₁', value: `${b1OLS.toFixed(4)}` }, { label: 'α-L1, (1-α)-L2', value: `${n(v.alpha)}, ${1 - n(v.alpha)}` }, { label: 'Elastic Net β₁', value: `${b1.toFixed(4)}` }] } },
  description: 'Elastic net combines L1 (Lasso) and L2 (Ridge) penalties for regularized regression.',
  formula: 'β̂ = argmin(||y-Xβ||² + αλ||β||₁ + (1-α)λ||β||²/2)',
  interpretation: 'α = 1 gives Lasso, α = 0 gives Ridge. Elastic net handles correlated predictors by grouping them together.'
}

export default calcDef
