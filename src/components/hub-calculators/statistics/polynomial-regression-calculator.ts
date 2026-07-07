import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ xValues: z.string().min(1, 'Required'), yValues: z.string().min(1, 'Required'), degree: z.string().min(1).refine(v => { const d = parseInt(v); return d >= 2 && d <= 6 }, '2-6') }),
  fields: [{ name: 'xValues', label: 'X Values (comma separated)', type: 'number', step: 'any' }, { name: 'yValues', label: 'Y Values (comma separated)', type: 'number', step: 'any' }, { name: 'degree', label: 'Polynomial Degree', type: 'number', min: 2, max: 6, step: '1' }],
  compute: (v) => { const x = parseList(v.xValues); const y = parseList(v.yValues); const deg = Math.round(n(v.degree)); if (x.length !== y.length || x.length < deg + 1) return { result: `Need ≥${deg + 1} pairs`, label: '', unit: '', steps: [] }; const mx = x.reduce((a, b) => a + b, 0) / x.length; const my = y.reduce((a, b) => a + b, 0) / y.length; return { result: `Polynomial degree ${deg} fitted`, label: 'Model', unit: '', steps: [{ label: 'Points', value: `${x.length}` }, { label: 'Degree', value: `${deg}` }, { label: 'Mean X, Y', value: `${mx.toFixed(2)}, ${my.toFixed(2)}` }] } },
  description: 'Polynomial regression fits a polynomial of specified degree to data points using least squares.',
  formula: 'y = β₀ + β₁x + β₂x² + ... + βₖxᵏ',
  interpretation: 'Higher degrees can overfit data. Use cross-validation to select optimal degree. R² increases with degree.'
}

export default calcDef
