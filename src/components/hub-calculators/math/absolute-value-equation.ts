import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Must be >= 0') }),
    fields: [numField('a', 'Coefficient a (|ax + b| = c)'), numField('b', 'Constant b'), numField('c', 'Value c (>= 0)')],
    defaults: { a: '2', b: '-4', c: '8' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c)
      if (a === 0) return { result: Math.abs(b) === c ? 'All real numbers' : 'No solution', label: 'Error' }
      const sol1 = (c - b) / a, sol2 = (-c - b) / a
      return { result: 'x = ' + sol1.toFixed(4) + ', x = ' + sol2.toFixed(4), label: 'Solutions', steps: [step('Equation:', '|' + a + 'x + ' + b + '| = ' + c), step('Case 1:', '' + a + 'x + ' + b + ' = ' + c + ' -> x = ' + sol1.toFixed(4)), step('Case 2:', '' + a + 'x + ' + b + ' = -' + c + ' -> x = ' + sol2.toFixed(4))] }
    },
    formula: '|ax + b| = c -> ax + b = +/-c',
    description: 'Solve absolute value equations of the form |ax + b| = c.',
    interpretation: 'The values of x that satisfy the absolute value equation.'
}

export default calcDef
