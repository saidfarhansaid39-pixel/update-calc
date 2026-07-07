import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({
      x: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
      mu: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
      sigma: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0')
}),
    fields: [numField('x', 'Raw Score (x)'), numField('mu', 'Population Mean (u)'), numField('sigma', 'Standard Deviation (s)')],
    defaults: { x: '85', mu: '70', sigma: '10' },
    compute: (v) => {
      const x = n(v.x), mu = n(v.mu), sigma = n(v.sigma)
      const z = (x - mu) / sigma
      return { result: z, label: 'Z-Score', steps: [step('Formula:', 'z = (' + x + ' - ' + mu + ') / ' + sigma + ' = ' + z.toFixed(4)), step('Interpretation:', 'The value ' + x + ' is ' + (z >= 0 ? 'above' : 'below') + ' the mean by ' + Math.abs(z).toFixed(2) + ' standard deviations.')] }
    },
    formula: 'z = (x - u) / s',
    description: 'Calculate the z-score for a raw value given the population mean and standard deviation.',
    interpretation: 'The z-score tells you how many standard deviations a value is from the mean.'
}

export default calcDef
