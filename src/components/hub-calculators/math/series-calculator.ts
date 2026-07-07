import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && Number.isInteger(Number(v)), 'Must be integer >= 1'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && Number.isInteger(Number(v)), 'Must be integer >= 1'), type: z.enum(['arithmetic', 'geometric', 'sum-squares', 'sum-cubes']) }),
    fields: [numField('a', 'Start', { step: '1' }), numField('b', 'Number of terms', { min: 1, step: '1' }), selectField('type', 'Type', [{ value: 'arithmetic', label: 'Arithmetic Series' }, { value: 'geometric', label: 'Geometric Series' }, { value: 'sum-squares', label: 'Sum of Squares' }, { value: 'sum-cubes', label: 'Sum of Cubes' }])],
    defaults: { a: '1', b: '10', type: 'arithmetic' },
    compute: (v) => {
      const start = n(v.a), nTerms = Math.round(n(v.b))
      const type = v.type || 'arithmetic'
      let sum = 0
      if (type === 'arithmetic') sum = (nTerms / 2) * (2 * start + (nTerms - 1) * start)
      else if (type === 'geometric') sum = start * (1 - Math.pow(2, nTerms)) / (1 - 2)
      else if (type === 'sum-squares') { for (let i = 1; i <= nTerms; i++) sum += i * i; sum *= start }
      else if (type === 'sum-cubes') { for (let i = 1; i <= nTerms; i++) sum += i * i * i; sum *= start }
      return { result: sum, label: 'Sum', steps: [step('Type:', type), step('Sum:', '' + sum)] }
    },
    formula: 'Arithmetic: S = n/2 x (2a + (n-1)d)',
    description: 'Calculate the sum of arithmetic, geometric, or power series.',
    interpretation: 'The total sum of the series terms.'
}

export default calcDef
