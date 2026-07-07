import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Numerator'), numField('b', 'Denominator')],
    defaults: { a: '3', b: '8' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      if (b === 0) return { result: 'Undefined', label: 'Error' }
      return { result: a / b, label: 'Decimal', steps: [step('Formula:', '' + a + ' / ' + b + ' = ' + (a / b))] }
    },
    formula: 'decimal = numerator / denominator',
    description: 'Convert a fraction to a decimal.',
    interpretation: 'The decimal equivalent of the fraction.'
}

export default calcDef
