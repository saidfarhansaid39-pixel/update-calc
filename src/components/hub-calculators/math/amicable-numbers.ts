import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 2, 'Integer >= 2'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 2, 'Integer >= 2') }),
    fields: [numField('a', 'First number', { step: '1' }), numField('b', 'Second number', { step: '1' })],
    defaults: { a: '220', b: '284' },
    compute: (v) => {
      const a = Math.round(n(v.a)), b = Math.round(n(v.b))
      const sumDiv = (x: number) => { let s = 0; for (let i = 1; i < x; i++) if (x % i === 0) s += i; return s }
      const sumA = sumDiv(a), sumB = sumDiv(b); const isAmicable = sumA === b && sumB === a && a !== b
      return { result: isAmicable ? 'Yes, amicable pair' : 'Not an amicable pair', label: 'Amicable Check', steps: [step('Sum divisors of ' + a, '' + sumA), step('Sum divisors of ' + b, '' + sumB), step('Result', isAmicable ? a + ' and ' + b + ' form an amicable pair' : 'Not amicable')] }
    },
    formula: 'a and b are amicable if s(a) = b and s(b) = a, where s(n) = sum of proper divisors.',
    description: 'Check if two numbers form an amicable pair.',
    interpretation: 'Amicable numbers are pairs where each equals the sum of the other\'s proper divisors.'
}

export default calcDef
