import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ xValues: z.string().min(1, 'Required'), yValues: z.string().min(1, 'Required') }),
  fields: [{ name: 'xValues', label: 'X Values (comma separated)', type: 'number', step: 'any' }, { name: 'yValues', label: 'Y Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const x = parseList(v.xValues); const y = parseList(v.yValues); if (x.length !== y.length || x.length < 2) return { result: 'Need ≥2 pairs', label: '', unit: '', steps: [] }; const mx = x.reduce((a, b) => a + b, 0) / x.length; const my = y.reduce((a, b) => a + b, 0) / y.length; const cov = x.reduce((acc, xi, i) => acc + (xi - mx) * (y[i] - my), 0) / (x.length - 1); return { result: cov, label: 'Covariance (sample)', unit: '', steps: [{ label: 'Mean X', value: `${mx.toFixed(4)}` }, { label: 'Mean Y', value: `${my.toFixed(4)}` }, { label: 'Covariance', value: `${cov.toFixed(4)}` }] } },
  description: 'Covariance measures how two variables vary together. Positive covariance indicates they move in the same direction.',
  formula: 'Cov(X,Y) = Σ((xᵢ-x̄)(yᵢ-ȳ)) / (n-1)',
  interpretation: 'Covariance magnitude depends on scale. Pearson correlation (standardized covariance) is preferred for interpretation.'
}

export default calcDef
