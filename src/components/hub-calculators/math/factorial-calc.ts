import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 170 && Number.isInteger(Number(v)), 'Must be integer 0-170') }),
    fields: [numField('a', 'Number n', { min: 0, max: 170, step: '1' })],
    defaults: { a: '10' },
    compute: (v) => {
      const a = Math.round(n(v.a))
      if (a > 170) return { result: 'Overflow', label: 'Error' }
      const result = fact(a)
      return { result, label: 'n!', steps: [step('Formula:', '' + a + '! = ' + a + ' x ' + (a - 1) + ' x ... x 1'), step('Result:', '' + result)],
    extras: [
      { label: "Mathematical Significance", value: "Fundamental concept in number theory and discrete mathematics." },
      { label: "Computational Note", value: "Large inputs may require optimized algorithms for performance." },
      { label: "Historical Context", value: "Studied by mathematicians across centuries for its unique properties." },
      { label: "Related Sequences", value: "Related to other integer sequences and special numbers." },
      { label: "Pattern Recognition", value: "Observe recurring patterns and relationships between values." }
    ] }
    },
    formula: 'n! = n x (n-1) x ... x 1',
    description: 'Calculate the factorial of a non-negative integer.',
    interpretation: 'The product of all positive integers from 1 to n.',
    presets: [
      { label: 'Small 5', values: { a: '5' } },
      { label: 'Medium 10', values: { a: '10' } },
      { label: 'Large 20', values: { a: '20' } }
    ]
}

export default calcDef
