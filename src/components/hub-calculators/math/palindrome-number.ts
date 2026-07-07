import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)), 'Must be non-negative integer') }),
    fields: [numField('a', 'Number n', { min: 0, step: '1' })],
    defaults: { a: '12321' },
    compute: (v) => {
      const nStr = Math.round(n(v.a)).toString()
      const rev = nStr.split('').reverse().join('')
      const isPal = nStr === rev
      return { result: isPal ? 'Yes, palindrome' : 'Not a palindrome', label: 'Check', steps: [step('Original:', nStr), step('Reversed:', rev), step('Result:', '' + (isPal ? 'Same forwards and backwards' : 'Different forwards and backwards'))] }
    },
    formula: 'Number reads the same forwards and backwards',
    description: 'Check if a positive integer is a palindrome.',
    interpretation: 'A palindrome number reads the same forwards and backwards.'
}

export default calcDef
