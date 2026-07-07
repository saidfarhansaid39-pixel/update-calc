import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'a11'), numField('b', 'a12'), numField('c', 'a21'), numField('d', 'a22')],
    defaults: { a: '2', b: '1', c: '1', d: '2' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d)
      const ATA_a = a * a + c * c, ATA_b = a * b + c * d, ATA_d = b * b + d * d
      const trace = ATA_a + ATA_d, det = ATA_a * ATA_d - ATA_b * ATA_b
      const disc = trace * trace - 4 * det
      const lambda1 = disc >= 0 ? (trace + Math.sqrt(disc)) / 2 : 0
      const lambda2 = disc >= 0 ? (trace - Math.sqrt(disc)) / 2 : 0
      const sigma1 = lambda1 > 0 ? Math.sqrt(lambda1) : 0
      const sigma2 = lambda2 > 0 ? Math.sqrt(lambda2) : 0
      return { result: sigma1.toFixed(4) + ', ' + sigma2.toFixed(4), label: 'Singular values', steps: [step('ATA eigenvalues:', 'l1=' + lambda1.toFixed(4) + ', l2=' + lambda2.toFixed(4)), step('Singular values:', 's1=' + sigma1.toFixed(4) + ', s2=' + sigma2.toFixed(4))] }
    },
    formula: 'SVD: A = U * Sigma * VT',
    description: 'Calculate singular values of a 2x2 matrix.',
    interpretation: 'The singular values of the 2x2 matrix.'
}

export default calcDef
