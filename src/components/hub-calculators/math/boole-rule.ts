import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Lower limit a'), numField('b', 'Upper limit b')],
    defaults: { a: '0', b: '1' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), h = (b - a) / 4
      const f = (x: number) => Math.exp(x)
      const fx0 = f(a), fx1 = f(a + h), fx2 = f(a + 2 * h), fx3 = f(a + 3 * h), fx4 = f(b)
      const integral = (2 * h / 45) * (7 * fx0 + 32 * fx1 + 12 * fx2 + 32 * fx3 + 7 * fx4)
      return { result: integral.toFixed(6), label: 'Boole integral', steps: [step('h:', '' + h.toFixed(4)), step('f(x0)...f(x4):', fx0.toFixed(4) + ', ' + fx1.toFixed(4) + ', ' + fx2.toFixed(4) + ', ' + fx3.toFixed(4) + ', ' + fx4.toFixed(4)), step('Integral:', '' + integral.toFixed(6))] }
    },
    formula: 'int_a^b f(x) dx approx 2h/45 (7f0 + 32f1 + 12f2 + 32f3 + 7f4)',
    description: 'Boole rule (5-point Newton-Cotes) integration.',
    interpretation: 'The approximate integral using Boole rule (degree 4).'
}

export default calcDef
