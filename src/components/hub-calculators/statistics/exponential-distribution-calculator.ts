import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ rate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), x: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [{ name: 'rate', label: 'Rate (λ)', type: 'number', min: 0.001, step: '0.01' }, { name: 'x', label: 'x (time/distance)', type: 'number', min: 0, step: '0.1' }],
  compute: (v) => { const rate = n(v.rate); const x = n(v.x); const pdf = rate * Math.exp(-rate * x); const cdf = 1 - Math.exp(-rate * x); return { result: pdf, label: 'PDF', unit: '', steps: [{ label: 'PDF', value: `${pdf.toExponential(4)}` }, { label: 'CDF', value: `${cdf.toExponential(4)}` }] } },
  description: 'The exponential distribution models waiting times between events in a Poisson process.',
  formula: 'f(x) = λe^(-λx), F(x) = 1 - e^(-λx)',
  interpretation: 'Mean = 1/λ. The exponential is memoryless: P(X > s+t | X > s) = P(X > t).'
}

export default calcDef
