import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Cost'), numField('b', 'Markup Percentage')],
    defaults: { a: '50', b: '40' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      const markup = a * (b / 100)
      const price = a + markup
      return { result: price, label: 'Selling Price', steps: [step('Markup:', b + '% of ' + a + ' = ' + markup.toFixed(2)), step('Price:', a + ' + ' + markup.toFixed(2) + ' = ' + price.toFixed(2))], extras: [{ label: 'Markup Amount', value: markup }] }
    },
    formula: 'Selling Price = cost x (1 + markup%/100)',
    description: 'Calculate the selling price based on cost and markup percentage.',
    interpretation: 'The selling price that includes the desired markup.'
}

export default calcDef
