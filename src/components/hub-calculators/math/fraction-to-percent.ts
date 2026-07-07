import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Numerator'), numField('b', 'Denominator')],
    defaults: { a: '3', b: '4' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      if (b === 0) return { result: 'Undefined', label: 'Error' }
      const pct = (a / b) * 100
      return { result: pct.toFixed(4), label: 'Percent', unit: '%', steps: [step('Formula:', '(' + a + '/' + b + ') x 100 = ' + pct.toFixed(4) + '%')] }
    },
    formula: 'percent = (a/b) x 100%',
    description: 'Convert a fraction to a percentage.',
    interpretation: 'The fraction expressed as a percentage.'
}

export default calcDef
