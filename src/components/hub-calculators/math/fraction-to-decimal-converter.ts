import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Numerator'), numField('b', 'Denominator')],
    defaults: { a: '3', b: '4' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      if (b === 0) return { result: 'Division by zero', label: 'Error' }
      return { result: (a / b).toFixed(6), label: 'Decimal', steps: [step('Fraction:', '' + a + '/' + b), step('Decimal:', '' + (a / b).toFixed(6))] }
    },
    formula: 'Convert fraction to decimal',
    description: 'Convert a fraction to a decimal number.',
    interpretation: 'The decimal equivalent of the fraction.'
}

export default calcDef
