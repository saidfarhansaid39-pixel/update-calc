import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)), 'Integer'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)), 'Integer') }),
    fields: [numField('a', 'Coefficient a', { step: '1' }), numField('b', 'Coefficient b', { step: '1' })],
    defaults: { a: '12', b: '18' },
    compute: (v) => { const a = Math.round(n(v.a)), b = Math.round(n(v.b)); const g = (x: number, y: number): number => y === 0 ? Math.abs(x) : g(y, x % y); const result = g(a, b); return { result, label: 'GCD', steps: [step('gcd(' + a + ',' + b + ')', '' + result)] } },
    formula: 'gcd(p,q) using Euclidean algorithm.',
    description: 'Calculate GCD of polynomial coefficients (GCD of integers).',
    interpretation: 'The greatest common divisor of the two coefficients.'
}

export default calcDef
