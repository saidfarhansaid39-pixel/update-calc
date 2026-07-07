import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Original Price'), numField('b', 'Discount Percentage')],
    defaults: { a: '100', b: '20' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      const discount = a * (b / 100)
      const finalPrice = a - discount
      return { result: finalPrice, label: 'Final Price', steps: [step('Discount:', b + '% of ' + a + ' = ' + discount.toFixed(2)), step('Final:', a + ' - ' + discount.toFixed(2) + ' = ' + finalPrice.toFixed(2))], extras: [{ label: 'You Save', value: discount }] }
    },
    formula: 'Final = price x (1 - discount%/100)',
    description: 'Calculate the final price after a discount.',
    interpretation: 'The amount you pay after the discount is applied.'
}

export default calcDef
