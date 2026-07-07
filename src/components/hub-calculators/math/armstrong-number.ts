import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)), 'Must be non-negative integer') }),
    fields: [numField('a', 'Number n', { min: 0, step: '1' })],
    defaults: { a: '153' },
    compute: (v) => {
      const nStr = Math.round(n(v.a)).toString()
      const digits = nStr.split('').map(Number)
      const power = digits.length
      const sum = digits.reduce((s, d) => s + Math.pow(d, power), 0)
      const isArmstrong = sum === parseInt(nStr)
      const armstrongLabel = power === 3 ? 'Armstrong' : 'Narcissistic'
      return { result: isArmstrong ? 'Yes, ' + armstrongLabel + ' number' : 'No, not a ' + armstrongLabel + ' number', label: 'Check', steps: [step('Number:', nStr), step('Digits:', '' + power), step('Sum:', digits.map((d, i) => '' + d + '^' + power).join(' + ') + ' = ' + sum), step('Result:', '' + (isArmstrong ? 'Equal' : 'Not equal'))] }
    },
    formula: 'Sum of each digit raised to the power of number of digits equals the number',
    description: 'Check if a number is an Armstrong (narcissistic) number.',
    interpretation: 'An Armstrong number equals the sum of its digits each raised to the power of the number of digits.'
}

export default calcDef
