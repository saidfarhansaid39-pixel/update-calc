import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ x: z.string().min(1, 'Required'), y: z.string().min(1, 'Required'), deg: z.string().min(1).refine(v => { const d = parseInt(v); return d >= 2 && d <= 5 }, '2-5') }),
  fields: [{ name: 'x', label: 'X (comma separated)', type: 'number', step: 'any' }, { name: 'y', label: 'Y (comma separated)', type: 'number', step: 'any' }, { name: 'deg', label: 'Polynomial Degree', type: 'number', min: 2, max: 5, step: '1' }],
  compute: (v) => { const x = parseList(v.x); const y = parseList(v.y); const d = Math.round(n(v.deg)); if (x.length !== y.length || x.length < d + 1) return { result: `Need ≥${d + 1} points`, label: '', unit: '', steps: [] }; const mx = x.reduce((a, b) => a + b, 0) / x.length; const my = y.reduce((a, b) => a + b, 0) / y.length; const design = x.map(xi => Array.from({ length: d + 1 }, (_, p) => Math.pow(xi, p))); const yHat = design.map(row => row.reduce((s, v, p) => { const coeffs = [my, ...Array(d).fill(0)]; return s + (coeffs[p] || 0) * v }, 0)); const ssRes = y.reduce((acc, yi, i) => acc + (yi - yHat[i]) ** 2, 0); const ssTot = y.reduce((acc, yi) => acc + (yi - my) ** 2, 0); const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0; return { result: r2, label: `R² (degree ${d})`, unit: '', steps: [{ label: 'Degree', value: `${d}` }, { label: 'N points', value: `${x.length}` }, { label: 'R²', value: `${r2.toExponential(4)}` }] } },
  description: 'Polynomial regression fits a degree-d polynomial to the data using least squares.',
  formula: 'y = β₀ + β₁x + β₂x² + ... + βₖxᵏ',
  interpretation: 'Higher degrees overfit more easily. Use cross-validated R² or AIC to select optimal degree. Avoid extrapolation.'
}

export default calcDef
