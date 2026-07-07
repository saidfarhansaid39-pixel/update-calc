import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ x: z.string().min(1, 'Required'), y: z.string().min(1, 'Required'), lam: z.string().min(1).refine(v => parseFloat(v) >= 0, '≥0') }),
  fields: [{ name: 'x', label: 'X (comma separated)', type: 'number', step: 'any' }, { name: 'y', label: 'Y (comma separated)', type: 'number', step: 'any' }, { name: 'lam', label: 'λ (L1 penalty)', type: 'number', min: 0, step: '0.1' }],
  compute: (v) => { const x = parseList(v.x); const y = parseList(v.y); if (x.length !== y.length || x.length < 3) return { result: 'Need ≥3 obs', label: '', unit: '', steps: [] }; const mx = x.reduce((a, b) => a + b, 0) / x.length; const my = y.reduce((a, b) => a + b, 0) / y.length; const num = x.reduce((acc, xi, i) => acc + (xi - mx) * (y[i] - my), 0); const den = x.reduce((acc, xi) => acc + (xi - mx) ** 2, 0); const bOLS = den > 0 ? num / den : 0; const lam = n(v.lam); const bLasso = Math.sign(bOLS) * Math.max(Math.abs(bOLS) - lam / (den || 1), 0); const b0 = my - bLasso * mx; return { result: bLasso, label: 'Lasso β₁', unit: '', steps: [{ label: 'OLS β₁', value: `${bOLS.toFixed(4)}` }, { label: 'λ', value: `${lam}` }, { label: 'Lasso β₁', value: `${bLasso.toFixed(4)}` }, { label: 'β₁=0 if |OLS|<λ/den', value: Math.abs(bLasso) < 1e-10 ? 'Yes (variable eliminated)' : 'No' }] } },
  description: 'Lasso regression applies L1 penalty that can shrink coefficients to exactly zero, performing automatic variable selection.',
  formula: 'β̂_lasso = argmin(||y - Xβ||² + λ||β||₁)',
  interpretation: 'As λ increases, more coefficients become zero. Cross-validation selects optimal λ via minimum MSE or 1-SE rule.'
}

export default calcDef
