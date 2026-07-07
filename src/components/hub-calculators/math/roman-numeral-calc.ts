import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 3999 && Number.isInteger(Number(v)), 'Must be integer 1-3999') }),
    fields: [numField('a', 'Number (1-3999)', { min: 1, max: 3999, step: '1' })],
    defaults: { a: '2024' },
    compute: (v) => {
      const num = Math.round(n(v.a))
      const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
      const romans = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']
      let result = '', remaining = num
      for (let i = 0; i < vals.length; i++) { while (remaining >= vals[i]) { result += romans[i]; remaining -= vals[i] } }
      return { result, label: 'Roman numeral', steps: [step('Number:', '' + num), step('Roman:', result)] }
    },
    formula: 'Roman numeral conversion',
    description: 'Convert a number to Roman numerals.',
    interpretation: 'The Roman numeral representation of the number.'
}

export default calcDef
