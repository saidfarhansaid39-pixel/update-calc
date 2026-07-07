import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num3Schema,
    fields: [numField('a', 'Coefficient a'), numField('b', 'Constant b'), selectField('op', 'Inequality', [{ value: 'gt', label: '> (greater than)' }, { value: 'gte', label: '>= (greater than or equal)' }, { value: 'lt', label: '< (less than)' }, { value: 'lte', label: '<= (less than or equal)' }])],
    defaults: { a: '2', b: '-6', c: 'gt' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), op = v.c || 'gt'
      if (a === 0) return { result: b === 0 ? (['gte', 'lte'].includes(op) ? 'All real' : 'No solution') : (['gt', 'gte'].includes(op) ? 'All real' : 'No solution'), label: 'Result' }
      const val = -b / a
      const flip = a < 0
      const m = { gt: flip ? 'x < ' : 'x > ', gte: flip ? 'x <= ' : 'x >= ', lt: flip ? 'x > ' : 'x < ', lte: flip ? 'x >= ' : 'x <= ' }
      return { result: m[op as keyof typeof m] + val.toFixed(4), label: 'Solution', steps: [step('Inequality:', '' + a + 'x + ' + b + ' ' + op + ' 0'), step('Critical point:', 'x = ' + val.toFixed(4)), step('Direction:', a > 0 ? 'Positive coefficient, no flip' : 'Negative coefficient, flip sign')] }
    },
    formula: 'ax + b > 0, etc.',
    description: 'Solve linear inequalities of the form ax + b > 0, etc.',
    interpretation: 'The range of x values that satisfy the inequality.'
}

export default calcDef
