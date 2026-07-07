import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)), 'Integer'), m: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) > 0, 'Integer > 0') }),
    fields: [numField('a', 'Number a', { step: '1' }), numField('m', 'Modulus m', { min: 1, step: '1' })],
    defaults: { a: '3', m: '11' },
    compute: (v) => {
      const a = Math.round(n(v.a)), m = Math.round(n(v.m)); const g = (x: number, y: number): number => y === 0 ? Math.abs(x) : g(y, x % y)
      if (g(a, m) !== 1) return { result: 'No inverse (gcd != 1)', label: 'Error', steps: [step('gcd(' + a + ',' + m + ')', '' + g(a, m))] }
      for (let i = 1; i < m; i++) { if ((a * i) % m === 1) return { result: i, label: 'a^(-1) mod m', steps: [step('Trial', 'Checking i from 1 to ' + (m - 1)), step('Inverse', '' + i)] } }
      return { result: 'Not found', label: 'Error' }
    },
    formula: 'a x a^(-1) ? 1 (mod m). Exists iff gcd(a, m) = 1.',
    description: 'Find the modular multiplicative inverse of a modulo m.',
    interpretation: 'The number x such that a � x ? 1 (mod m).'
}

export default calcDef
