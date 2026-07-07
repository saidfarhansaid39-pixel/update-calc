import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ x: z.string().min(1, 'Required'), y: z.string().min(1, 'Required'), lam: z.string().min(1).refine(v => parseFloat(v) >= 0, '≥0') }),
  fields: [{ name: 'x', label: 'X (comma separated)', type: 'number', step: 'any' }, { name: 'y', label: 'Y (comma separated)', type: 'number', step: 'any' }, { name: 'lam', label: 'λ (L2 penalty)', type: 'number', min: 0, step: '0.1' }],
  compute: (v) => { const x = parseList(v.x); const y = parseList(v.y); if (x.length !== y.length || x.length < 3) return { result: 'Need ≥3 obs', label: '', unit: '', steps: [] }; const mx = x.reduce((a, b) => a + b, 0) / x.length; const my = y.reduce((a, b) => a + b, 0) / y.length; const num = x.reduce((acc, xi, i) => acc + (xi - mx) * (y[i] - my), 0); const den = x.reduce((acc, xi) => acc + (xi - mx) ** 2, 0); const lam = n(v.lam); const b1 = den > 0 ? num / (den + lam) : 0; const b0 = my - b1 * mx; return { result: b1, label: 'Ridge β₁', unit: '', steps: [{ label: 'OLS β₁', value: `${den > 0 ? num / den : 0}` }, { label: 'λ', value: `${lam}` }, { label: 'Ridge β₁', value: `${b1.toFixed(4)}` }, { label: 'Shrinkage factor', value: `${(den / (den + lam)).toFixed(4)}` }] } },
  description: 'Ridge regression applies L2 penalty (λΣβ²) to shrink coefficients and handle multicollinearity.',
  formula: 'β̂_ridge = (X′X + λI)⁻¹X′y, shrinkage = den/(den+λ)',
  interpretation: 'As λ increases, coefficients shrink toward zero but never reach zero. Ridge retains all predictors, unlike Lasso.'
}

export default calcDef
