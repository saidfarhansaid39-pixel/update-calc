import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Value'), numField('b', 'Total')],
    defaults: { a: '25', b: '200' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      const pct = (a / b) * 100
      return { result: pct, label: 'Percentage', unit: '%', steps: [step('Formula:', '(' + a + ' / ' + b + ') x 100 = ' + pct.toFixed(2) + '%')] }
    },
    formula: 'P = (a / b) x 100%',
    description: 'Calculate what percentage one number is of another.',
    interpretation: 'The percentage that Value A represents of Value B.'
}

export default calcDef
