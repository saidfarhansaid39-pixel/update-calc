import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({
      a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
      b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
      c: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0')
}),
    fields: [numField('a', 'Mean of Group 1 (M1)'), numField('b', 'Mean of Group 2 (M2)'), numField('c', 'Pooled SD (s)')],
    defaults: { a: '100', b: '85', c: '20' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c)
      const d = (a - b) / c
      const mag = Math.abs(d) < 0.2 ? 'negligible' : Math.abs(d) < 0.5 ? 'small' : Math.abs(d) < 0.8 ? 'medium' : 'large'
      return { result: d.toFixed(4), label: "Cohen's d", steps: [step('Formula:', 'd = (' + a + ' - ' + b + ') / ' + c + ' = ' + d.toFixed(4)), step('Interpretation:', 'Effect size is ' + mag + ' (|d| = ' + Math.abs(d).toFixed(2) + ')')] }
    },
    formula: 'd = (M1 - M2) / s_pooled',
    description: "Calculate Cohen's d effect size for comparing two group means.",
    interpretation: "Cohen's d measures the standardized difference between two means."
}

export default calcDef
