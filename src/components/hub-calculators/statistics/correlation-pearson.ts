import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ xValues: z.string().min(1, 'Required'), yValues: z.string().min(1, 'Required') }),
  fields: [{ name: 'xValues', label: 'X Values (comma separated)', type: 'number', step: 'any' }, { name: 'yValues', label: 'Y Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const x = parseList(v.xValues); const y = parseList(v.yValues); if (x.length !== y.length || x.length < 2) return { result: 'Need ≥2 pairs', label: '', unit: '', steps: [] }; const mx = x.reduce((a, b) => a + b, 0) / x.length; const my = y.reduce((a, b) => a + b, 0) / y.length; const num = x.reduce((acc, xi, i) => acc + (xi - mx) * (y[i] - my), 0); const den = Math.sqrt(x.reduce((acc, xi) => acc + (xi - mx) ** 2, 0) * y.reduce((acc, yi) => acc + (yi - my) ** 2, 0)); const r = den !== 0 ? num / den : 0; return { result: r, label: 'Pearson r', unit: '', steps: [{ label: 'Count', value: `${x.length}` }, { label: 'r', value: `${r.toFixed(4)}` }, { label: 'Strength', value: Math.abs(r) >= 0.8 ? 'Strong' : Math.abs(r) >= 0.5 ? 'Moderate' : Math.abs(r) >= 0.3 ? 'Weak' : 'Negligible' }] } },
  description: 'Pearson correlation measures the linear relationship between two continuous variables. r ranges from -1 to +1.',
  formula: 'r = Σ((xᵢ-x̄)(yᵢ-ȳ)) / √(Σ(xᵢ-x̄)² Σ(yᵢ-ȳ)²)',
  interpretation: 'r = +1: perfect positive, r = -1: perfect negative, r = 0: no linear correlation. |r| > 0.8 indicates strong association.'
}

export default calcDef
