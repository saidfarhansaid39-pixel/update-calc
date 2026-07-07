import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ xValues: z.string().min(1, 'Required'), yValues: z.string().min(1, 'Required'), ratio: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'xValues', label: 'X Values (comma separated)', type: 'number', step: 'any' }, { name: 'yValues', label: 'Y Values (comma separated)', type: 'number', step: 'any' }, { name: 'ratio', label: 'Variance Ratio (λ)', type: 'number', min: 0.001, step: '0.1' }],
  compute: (v) => { const x = parseList(v.xValues); const y = parseList(v.yValues); const lambda = n(v.ratio); if (x.length !== y.length || x.length < 3) return { result: 'Need ≥3 pairs', label: '', unit: '', steps: [] }; const mx = x.reduce((a, b) => a + b, 0) / x.length; const my = y.reduce((a, b) => a + b, 0) / y.length; const sxx = x.reduce((acc, xi) => acc + (xi - mx) ** 2, 0); const syy = y.reduce((acc, yi) => acc + (yi - my) ** 2, 0); const sxy = x.reduce((acc, xi, i) => acc + (xi - mx) * (y[i] - my), 0); const den = sxx - lambda * syy; const slope = den !== 0 ? (sxy + Math.sqrt(sxy * sxy + den * (lambda * syy + sxx - 2 * lambda * sxy))) / (sxx - lambda * syy) : 1; const intercept = my - slope * mx; return { result: `${slope.toFixed(4)}x + ${intercept.toFixed(4)}`, label: 'Deming Regression', unit: '', steps: [{ label: 'Slope', value: `${slope.toFixed(4)}` }, { label: 'Intercept', value: `${intercept.toFixed(4)}` }, { label: 'λ', value: `${lambda}` }] } },
  description: 'Deming regression accounts for measurement error in both X and Y variables. It generalizes orthogonal regression.',
  formula: 'Accounts for errors in both variables. λ = σ²_εy / σ²_εx is the ratio of error variances.',
  interpretation: 'When λ = 1, Deming reduces to orthogonal (total least squares) regression. Used in method comparison studies.'
}

export default calcDef
