import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Revenue'), numField('b', 'Cost')],
    defaults: { a: '1000', b: '600' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      const profit = a - b
      const margin = ((a - b) / a) * 100
      return { result: margin, label: 'Profit Margin', unit: '%', steps: [step('Profit:', a + ' - ' + b + ' = ' + profit), step('Margin:', '(' + profit + ' / ' + a + ') x 100 = ' + margin.toFixed(2) + '%')], extras: [{ label: 'Profit', value: profit }] }
    },
    formula: 'Margin = ((revenue - cost) / revenue) x 100%',
    description: 'Calculate the profit margin as a percentage of revenue.',
    interpretation: 'The percentage of revenue that is profit.'
}

export default calcDef
