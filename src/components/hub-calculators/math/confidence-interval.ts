import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({
      a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
      b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
      c: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'),
      d: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1, 'Must be >= 1')
}),
    fields: [numField('a', 'Sample Mean (x)'), numField('b', 'Confidence Level %'), numField('c', 'Standard Deviation (s)'), numField('d', 'Sample Size (n)', { min: 1, step: '1' })],
    defaults: { a: '100', b: '95', c: '15', d: '50' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = Math.max(1, ni(v.d))
      const zMap: Record<number, number> = { 90: 1.645, 95: 1.96, 99: 2.576 }
      const zScore = zMap[Math.round(b)] || 1.96
      const margin = zScore * (c / Math.sqrt(d))
      const lower = a - margin, upper = a + margin
      return { result: '(' + lower.toFixed(4) + ', ' + upper.toFixed(4) + ')', label: b + '% Confidence Interval', steps: [step('Margin of Error:', zScore + ' x (' + c + ' / sqrt(' + d + ')) = ' + margin.toFixed(4)), step('Lower:', a + ' - ' + margin.toFixed(4) + ' = ' + lower.toFixed(4)), step('Upper:', a + ' + ' + margin.toFixed(4) + ' = ' + upper.toFixed(4))], extras: [{ label: 'Margin of Error', value: margin }] }
    },
    formula: 'CI = x +/- z* x (s / sqrt(n))',
    description: 'Calculate the confidence interval for a population mean.',
    interpretation: 'We are [level]% confident the true population mean lies within this interval.'
}

export default calcDef
