import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({
      a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
      b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
      c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number')
}),
    fields: [numField('a', 'Fixed Costs'), numField('b', 'Price per Unit'), numField('c', 'Variable Cost per Unit')],
    defaults: { a: '10000', b: '50', c: '30' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c)
      const cm = b - c
      const bep = cm > 0 ? a / cm : Infinity
      return { result: bep === Infinity ? 'Cannot break even' : Math.ceil(bep), label: 'Break-Even Point (units)', steps: [step('Contribution Margin:', b + ' - ' + c + ' = ' + cm), step('BEP:', a + ' / ' + cm + ' = ' + (bep === Infinity ? 'infinity' : Math.ceil(bep)) + ' units')], extras: [{ label: 'Contribution Margin', value: cm }] }
    },
    formula: 'BEP = fixed / (price - variable cost per unit)',
    description: 'Calculate how many units must be sold to break even.',
    interpretation: 'The number of units that must be sold to cover all costs (zero profit).'
}

export default calcDef
