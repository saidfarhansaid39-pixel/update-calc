import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ x1: z.string().min(1, 'Required'), x2: z.string().min(1, 'Required'), y: z.string().min(1, 'Required') }),
  fields: [{ name: 'x1', label: 'X₁ (comma separated)', type: 'number', step: 'any' }, { name: 'x2', label: 'X₂ (comma separated)', type: 'number', step: 'any' }, { name: 'y', label: 'Y (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const x1 = parseList(v.x1); const x2 = parseList(v.x2); const y = parseList(v.y); if (x1.length !== x2.length || x1.length !== y.length || x1.length < 3) return { result: 'Need ≥3 obs', label: '', unit: '', steps: [] }; const n = x1.length; const mx1 = x1.reduce((a, b) => a + b, 0) / n; const mx2 = x2.reduce((a, b) => a + b, 0) / n; const my = y.reduce((a, b) => a + b, 0) / n; const s11 = x1.reduce((acc, xi) => acc + (xi - mx1) ** 2, 0); const s22 = x2.reduce((acc, xi) => acc + (xi - mx2) ** 2, 0); const s12 = x1.reduce((acc, xi, i) => acc + (xi - mx1) * (x2[i] - mx2), 0); const s1y = x1.reduce((acc, xi, i) => acc + (xi - mx1) * (y[i] - my), 0); const s2y = x2.reduce((acc, xi, i) => acc + (xi - mx2) * (y[i] - my), 0); const denom = s11 * s22 - s12 * s12; const b1 = denom !== 0 ? (s22 * s1y - s12 * s2y) / denom : 0; const b2 = denom !== 0 ? (s11 * s2y - s12 * s1y) / denom : 0; const b0 = my - b1 * mx1 - b2 * mx2; const yPred = x1.map((_, i) => b0 + b1 * x1[i] + b2 * x2[i]); const ssRes = y.reduce((acc, yi, i) => acc + (yi - yPred[i]) ** 2, 0); const ssTot = y.reduce((acc, yi) => acc + (yi - my) ** 2, 0); const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0; return { result: `y=${b0.toFixed(2)}+${b1.toFixed(2)}x₁+${b2.toFixed(2)}x₂`, label: 'Regression Equation', unit: '', steps: [{ label: 'β₁', value: `${b1.toFixed(4)}` }, { label: 'β₂', value: `${b2.toFixed(4)}` }, { label: 'β₀', value: `${b0.toFixed(4)}` }, { label: 'R²', value: `${r2.toExponential(4)}` }] } },
  description: 'Multiple regression models a response as a linear combination of two or more predictors.',
  formula: 'y = β₀ + β₁x₁ + β₂x₂, β = (X′X)⁻¹X′y',
  interpretation: 'Each βᵢ is the expected change in y per unit change in xᵢ holding other predictors constant. R² measures overall fit.'
}

export default calcDef
