import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Price Before Tax'), numField('b', 'Tax Rate (%)')],
    defaults: { a: '100', b: '8.5' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      const tax = a * (b / 100)
      const total = a + tax
      return { result: total, label: 'Total Price', steps: [step('Tax:', b + '% of ' + a + ' = ' + tax.toFixed(2)), step('Total:', a + ' + ' + tax.toFixed(2) + ' = ' + total.toFixed(2))], extras: [{ label: 'Sales Tax', value: tax }] }
    },
    formula: 'Total = price x (1 + tax%/100)',
    description: 'Calculate the total price including sales tax.',
    interpretation: 'The final amount including the applicable sales tax.'
}

export default calcDef
