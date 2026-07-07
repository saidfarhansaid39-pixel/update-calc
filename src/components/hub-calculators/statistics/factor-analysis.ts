import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ correlations: z.string().min(1, 'Required'), nFactors: z.string().min(1).refine(v => { const f = parseInt(v); return f >= 1 && f <= 10 }, '1-10') }),
  fields: [{ name: 'correlations', label: 'Correlation matrix (comma sep, lower triangle)', type: 'number', step: 'any' }, { name: 'nFactors', label: 'Number of Factors', type: 'number', min: 1, max: 10, step: '1' }],
  compute: (v) => { const cors = parseList(v.correlations); const k = Math.round(n(v.nFactors)); if (cors.length < 3) return { result: 'Need ≥3 correlations', label: '', unit: '', steps: [] }; const avgCor = cors.reduce((a, b) => a + b, 0) / cors.length; return { result: `Avg correlation:${avgCor.toFixed(4)}`, label: 'Factor Analysis Summary', unit: '', steps: [{ label: 'Input correlations', value: `${cors.length}` }, { label: 'Factors to extract', value: `${k}` }, { label: 'Average correlation', value: `${avgCor.toFixed(4)}` }, { label: 'KMO approx', value: 'Use correlation > 0.3 for factorability' }] } },
  description: 'Factor analysis identifies latent variables that explain patterns of correlations among observed variables.',
  formula: 'X = LF + ε, where L = factor loadings, F = factors, ε = unique variance',
  interpretation: 'Factors are rotated for interpretability (varimax, oblimin). Loadings > 0.4 are typically considered meaningful.'
}

export default calcDef
