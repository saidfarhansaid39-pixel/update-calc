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
      return { result: isPal ? 'Yes, palindrome' : 'Not a palindrome', label: 'Check', steps: [step('Original:', nStr), step('Reversed:', rev), step('Result:', '' + (isPal ? 'Same forwards and backwards' : 'Different forwards and backwards'))] ,
    extras: [
      { label: "Mathematical Significance", value: "Fundamental concept in number theory and discrete mathematics." },
      { label: "Computational Note", value: "Large inputs may require optimized algorithms for performance." },
      { label: "Historical Context", value: "Studied by mathematicians across centuries for its unique properties." },
      { label: "Related Sequences", value: "Related to other integer sequences and special numbers." },
      { label: "Pattern Recognition", value: "Observe recurring patterns and relationships between values." }
    ]}
    },
    formula: 'Number reads the same forwards and backwards',
    description: 'Check if a positive integer is a palindrome.',
    interpretation: 'A palindrome number reads the same forwards and backwards.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
