import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({
      a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
      b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
      c: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1, 'Must be >= 1')
}),
    fields: [numField('a', 'Confidence Level %'), numField('b', 'Standard Deviation (s)'), numField('c', 'Sample Size (n)', { min: 1, step: '1' })],
    defaults: { a: '95', b: '15', c: '100' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = Math.max(1, ni(v.c))
      const zMap: Record<number, number> = { 90: 1.645, 95: 1.96, 99: 2.576 }
      const zScore = zMap[Math.round(a)] || 1.96
      const moe = zScore * (b / Math.sqrt(c))
      return { result: moe, label: 'Margin of Error', steps: [step('Formula:', 'MOE = ' + zScore + ' x (' + b + ' / sqrt(' + c + ')) = ' + moe.toFixed(4))] }
    },
    formula: 'MOE = z* x (s / sqrt(n))',
    description: 'Calculate the margin of error for a survey or experiment.',
    interpretation: 'The margin of error is the range above and below the sample statistic.'
}

export default calcDef
