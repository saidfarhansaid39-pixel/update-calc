import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Coefficient a'), numField('b', 'Constant b')],
    defaults: { a: '2', b: '-4' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      if (a === 0) return { result: b === 0 ? 'All real numbers' : 'No solution', label: 'Result' }
      const x = -b / a
      return { result: x, label: 'x', steps: [step('Equation:', '' + a + 'x + ' + b + ' = 0'), step('Solution:', 'x = ' + x.toFixed(4))] }
    },
    formula: 'ax + b = 0 => x = -b/a',
    description: 'Solve a linear equation ax + b = 0.',
    interpretation: 'The value of x that satisfies the linear equation.'
}

export default calcDef
