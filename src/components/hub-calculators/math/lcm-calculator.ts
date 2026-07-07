import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Number a'), numField('b', 'Number b')],
    defaults: { a: '12', b: '18' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      const g = gcd(a, b)
      const result = Math.abs(a * b) / g
      return { result, label: 'LCM(' + a + ', ' + b + ')', steps: [step('Formula:', 'lcm(a,b) = |a x b| / gcd(a,b)'), step('GCD:', 'gcd(' + a + ', ' + b + ') = ' + g), step('LCM:', '|' + a + ' x ' + b + '| / ' + g + ' = ' + result)] }
    },
    formula: 'lcm(a, b) = |a x b| / gcd(a, b)',
    description: 'Calculate the least common multiple of two numbers.',
    interpretation: 'The smallest positive integer that is divisible by both numbers.'
}

export default calcDef
