import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ xValues: z.string().min(1, 'Required'), yValues: z.string().min(1, 'Required') }),
  fields: [{ name: 'xValues', label: 'X Values (comma separated)', type: 'number', step: 'any' }, { name: 'yValues', label: 'Y Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const x = parseList(v.xValues); const y = parseList(v.yValues); if (x.length !== y.length || x.length < 2) return { result: 'Need ≥2 pairs', label: '', unit: '', steps: [] }; const mx = x.reduce((a, b) => a + b, 0) / x.length; const my = y.reduce((a, b) => a + b, 0) / y.length; const num = x.reduce((acc, xi, i) => acc + (xi - mx) * (y[i] - my), 0); const den = x.reduce((acc, xi) => acc + (xi - mx) ** 2, 0); const slope = den !== 0 ? num / den : 0; const intercept = my - slope * mx; const yPred = x.map(xi => slope * xi + intercept); const ssRes = y.reduce((acc, yi, i) => acc + (yi - yPred[i]) ** 2, 0); const ssTot = y.reduce((acc, yi) => acc + (yi - my) ** 2, 0); const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0; return { result: `${slope.toFixed(4)}x + ${intercept.toFixed(4)}`, label: 'Regression Equation', unit: '', steps: [{ label: 'Slope', value: `${slope.toFixed(4)}` }, { label: 'Intercept', value: `${intercept.toFixed(4)}` }, { label: 'R²', value: `${r2.toExponential(4)}` }] } },
  description: 'Simple linear regression fits a line y = mx + b to minimize sum of squared residuals.',
  formula: 'y = mx + b, m = Σ(xᵢ-x̄)(yᵢ-ȳ)/Σ(xᵢ-x̄)², b = ȳ - mx̄',
  interpretation: 'Slope m represents the change in y per unit change in x. R² measures the proportion of variance explained.'
}

export default calcDef
