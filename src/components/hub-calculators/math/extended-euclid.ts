import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 1 && Number(v) <= 100000, 'Integer 1-100000'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 1 && Number(v) <= 100000, 'Integer 1-100000') }),
    fields: [numField('a', 'a', { min: 1, max: 100000, step: '1' }), numField('b', 'b', { min: 1, max: 100000, step: '1' })],
    defaults: { a: '120', b: '23' },
    compute: (v) => {
      let a = Math.round(n(v.a)), b = Math.round(n(v.b)), x0 = 1, x1 = 0, y0 = 0, y1 = 1, origA = a, origB = b; const steps: { label: string; value: string }[] = []
      while (b) { const q = Math.floor(a / b); [a, b] = [b, a - q * b]; [x0, x1] = [x1, x0 - q * x1]; [y0, y1] = [y1, y0 - q * y1] }
      steps.push(step('GCD(' + origA + ',' + origB + ')', '' + a), step('Coefficients (x,y)', `(${x0}, ${y0})`), step('Verification', `${origA}�(${x0}) + ${origB}�(${y0}) = ${a}`))
      return { result: a, label: 'GCD', steps }
    },
    formula: 'ax + by = gcd(a,b). Extended Euclidean finds x,y.',
    description: 'Extended Euclidean algorithm � find gcd and B�zout coefficients.',
    interpretation: 'B�zout coefficients satisfy ax + by = gcd(a,b).'
}

export default calcDef
