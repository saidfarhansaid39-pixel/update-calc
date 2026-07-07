import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ xValues: z.string().min(1, 'Required'), yValues: z.string().min(1, 'Required'), lambda: z.string().min(1).refine(v => parseFloat(v) >= 0, '≥0') }),
  fields: [{ name: 'xValues', label: 'X Values (comma separated)', type: 'number', step: 'any' }, { name: 'yValues', label: 'Y Values (comma separated)', type: 'number', step: 'any' }, { name: 'lambda', label: 'λ (L2 penalty)', type: 'number', min: 0, step: '0.1' }],
  compute: (v) => { const x = parseList(v.xValues); const y = parseList(v.yValues); if (x.length !== y.length || x.length < 2) return { result: 'Need ≥2 pairs', label: '', unit: '', steps: [] }; const mx = x.reduce((a, b) => a + b, 0) / x.length; const my = y.reduce((a, b) => a + b, 0) / y.length; const lambda = n(v.lambda); const num = x.reduce((acc, xi, i) => acc + (xi - mx) * (y[i] - my), 0); const den = x.reduce((acc, xi) => acc + (xi - mx) ** 2, 0) + lambda; const b1 = den !== 0 ? num / den : 0; const b0 = my - b1 * mx; return { result: b1, label: 'Ridge β₁', unit: '', steps: [{ label: 'OLS numerator', value: `${num.toFixed(4)}` }, { label: 'Denominator + λ', value: `${den.toFixed(4)}` }, { label: 'Shrunken β₁', value: `${b1.toFixed(4)}` }, { label: 'Intercept', value: `${b0.toFixed(4)}` }] } },
  description: 'Ridge regression applies L2 regularization (penalty = λΣβ²) to shrink coefficients and reduce multicollinearity.',
  formula: 'β_ridge = (X′X + λI)⁻¹X′y',
  interpretation: 'As λ increases, coefficients shrink toward zero. Ridge does not perform variable selection (all predictors retained).'
}

export default calcDef
