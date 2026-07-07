import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ xValues: z.string().min(1, 'Required'), yValues: z.string().min(1, 'Required'), lambda: z.string().min(1).refine(v => parseFloat(v) >= 0, '≥0') }),
  fields: [{ name: 'xValues', label: 'X Values (comma separated)', type: 'number', step: 'any' }, { name: 'yValues', label: 'Y Values (comma separated)', type: 'number', step: 'any' }, { name: 'lambda', label: 'λ (L1 penalty)', type: 'number', min: 0, step: '0.1' }],
  compute: (v) => { const x = parseList(v.xValues); const y = parseList(v.yValues); if (x.length !== y.length || x.length < 2) return { result: 'Need ≥2 pairs', label: '', unit: '', steps: [] }; const mx = x.reduce((a, b) => a + b, 0) / x.length; const my = y.reduce((a, b) => a + b, 0) / y.length; const lambda = n(v.lambda); const num = x.reduce((acc, xi, i) => acc + (xi - mx) * (y[i] - my), 0); const den = x.reduce((acc, xi) => acc + (xi - mx) ** 2, 0); const b1OLS = den !== 0 ? num / den : 0; const b1 = Math.sign(b1OLS) * Math.max(Math.abs(b1OLS) - lambda / (den || 1), 0); const b0 = my - b1 * mx; return { result: b1, label: 'Lasso β₁', unit: '', steps: [{ label: 'OLS β₁', value: `${b1OLS.toFixed(4)}` }, { label: 'λ', value: `${lambda}` }, { label: 'Lasso β₁', value: `${b1.toFixed(4)}` }, { label: 'Intercept', value: `${b0.toFixed(4)}` }] } },
  description: 'Lasso regression applies L1 regularization (penalty = λ|β|) that can shrink coefficients exactly to zero, performing variable selection.',
  formula: 'β_lasso = argmin(||y - Xβ||² + λ||β||₁)',
  interpretation: 'Lasso automatically selects variables. At large λ, most coefficients become zero. Use cross-validation to choose λ.'
}

export default calcDef
