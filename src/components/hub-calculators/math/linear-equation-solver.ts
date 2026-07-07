import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Coefficient a'), numField('b', 'Constant b')],
    defaults: { a: '2', b: '-6' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      if (a === 0) return { result: b === 0 ? 'All real numbers' : 'No solution', label: 'Error' }
      const x = -b / a
      return { result: x.toFixed(4), label: 'Solution', steps: [step('Equation:', '' + a + 'x + ' + b + ' = 0'), step('Solve:', 'x = -' + b + ' / ' + a), step('x:', '' + x.toFixed(4))] }
    },
    formula: 'ax + b = 0 -> x = -b/a',
    description: 'Solve linear equations of the form ax + b = 0.',
    interpretation: 'The solution of the linear equation.'
}

export default calcDef
