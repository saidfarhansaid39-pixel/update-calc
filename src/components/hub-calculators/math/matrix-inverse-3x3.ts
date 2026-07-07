import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), e: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), f: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), g: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), h: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), i: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'a11'), numField('b', 'a12'), numField('c', 'a13'), numField('d', 'a21'), numField('e', 'a22'), numField('f', 'a23'), numField('g', 'a31'), numField('h', 'a32'), numField('i', 'a33')],
    defaults: { a: '1', b: '2', c: '3', d: '0', e: '1', f: '4', g: '5', h: '6', i: '0' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d), e = n(v.e), f = n(v.f), g = n(v.g), h = n(v.h), i = n(v.i)
      const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)
      if (Math.abs(det) < 1e-10) return { result: 'Matrix is singular', label: 'Inverse', steps: [step('det = 0', 'No inverse')] }
      const r = (x: number) => (x / det).toFixed(4)
      return { result: `[[${r(e*i-f*h)},${r(-(b*i-c*h))},${r(b*f-c*e)}],[${r(-(d*i-f*g))},${r(a*i-c*g)},${r(-(a*f-c*d))}],[${r(d*h-e*g)},${r(-(a*h-b*g))},${r(a*e-b*d)}]]`, label: 'A?�', steps: [step('det', '' + det), step('Inverse computed', 'Using adjugate/det method')] }
    },
    formula: 'A?� = adj(A) / det(A).',
    description: 'Calculate the inverse of a 3x3 matrix.',
    interpretation: 'The matrix that when multiplied by the original yields identity.'
}

export default calcDef
