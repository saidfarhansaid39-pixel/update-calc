import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ base: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)), 'Integer'), exp: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 0, 'Integer >= 0'), mod: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) > 0, 'Integer > 0') }),
    fields: [numField('base', 'Base', { step: '1' }), numField('exp', 'Exponent', { min: 0, step: '1' }), numField('mod', 'Modulus', { min: 1, step: '1' })],
    defaults: { base: '7', exp: '13', mod: '5' },
    compute: (v) => {
      let base = Math.round(n(v.base)), exp = Math.round(n(v.exp)), mod = Math.round(n(v.mod))
      let result = 1; base = base % mod
      while (exp > 0) { if (exp % 2 === 1) result = (result * base) % mod; exp = Math.floor(exp / 2); base = (base * base) % mod }
      return { result, label: 'base^exp mod mod', steps: [step('Method', 'Exponentiation by squaring'), step('Result', '' + result)] }
    },
    formula: 'a^b mod m using fast exponentiation (binary exponentiation).',
    description: 'Efficiently calculate modular exponentiation a^b mod m.',
    interpretation: 'The remainder when a^b is divided by m.'
}

export default calcDef
