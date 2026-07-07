import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({
      a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
      b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
      c: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseInt(v) >= 1, 'Must be >= 1')
}),
    fields: [numField('a', 'Bill Amount'), numField('b', 'Tip Percentage'), numField('c', 'Number of People', { min: 1, step: '1' })],
    defaults: { a: '100', b: '15', c: '1' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = Math.max(1, ni(v.c))
      const tip = a * (b / 100)
      const total = a + tip
      const perPerson = total / c
      return { result: perPerson, label: 'Per Person', steps: [step('Tip:', b + '% of ' + a + ' = ' + tip.toFixed(2)), step('Total:', a + ' + ' + tip.toFixed(2) + ' = ' + total.toFixed(2)), step('Split:', total.toFixed(2) + ' / ' + c + ' = ' + perPerson.toFixed(2))], extras: [{ label: 'Tip Amount', value: tip }, { label: 'Total', value: total }] }
    },
    formula: 'Per person = (bill + bill x tip%/100) / people',
    description: 'Calculate the tip amount and split the bill.',
    interpretation: 'The amount each person needs to pay including tip.'
}

export default calcDef
