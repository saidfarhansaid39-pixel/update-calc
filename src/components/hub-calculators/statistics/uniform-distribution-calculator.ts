import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), x: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required') }),
  fields: [{ name: 'a', label: 'Min (a)', type: 'number', step: 'any' }, { name: 'b', label: 'Max (b)', type: 'number', step: 'any' }, { name: 'x', label: 'Value (x)', type: 'number', step: 'any' }],
  compute: (v) => { const a = n(v.a); const b = n(v.b); const x = n(v.x); if (a >= b) return { result: 'Error', label: '', unit: '', steps: [] }; const pdf = (x >= a && x <= b) ? 1 / (b - a) : 0; const cdf = x < a ? 0 : x > b ? 1 : (x - a) / (b - a); const mean = (a + b) / 2; return { result: pdf, label: 'PDF', unit: '', steps: [{ label: 'PDF', value: `${pdf.toExponential(4)}` }, { label: 'CDF', value: `${cdf.toExponential(4)}` }, { label: 'Mean', value: `${mean.toFixed(4)}` }] } },
  description: 'The uniform distribution has constant probability over [a, b]. All intervals of equal length within [a, b] are equally likely.',
  formula: 'f(x) = 1/(b-a) for a ≤ x ≤ b, 0 otherwise',
  interpretation: 'Mean = (a+b)/2, Variance = (b-a)²/12. Used for random number generation and modeling complete uncertainty.'
}

export default calcDef
