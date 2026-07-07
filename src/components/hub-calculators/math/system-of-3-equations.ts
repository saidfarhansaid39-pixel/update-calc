import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a1: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b1: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c1: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d1: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), a2: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b2: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c2: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d2: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), a3: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b3: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c3: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d3: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a1', 'a1'), numField('b1', 'b1'), numField('c1', 'c1'), numField('d1', 'd1 (const)'), numField('a2', 'a2'), numField('b2', 'b2'), numField('c2', 'c2'), numField('d2', 'd2 (const)', { mode: 'advanced' }), numField('a3', 'a3', { mode: 'advanced' }), numField('b3', 'b3', { mode: 'advanced' }), numField('c3', 'c3', { mode: 'advanced' }), numField('d3', 'd3 (const)', { mode: 'advanced' })],
    defaults: { a1: '1', b1: '0', c1: '0', d1: '3', a2: '0', b2: '1', c2: '0', d2: '4', a3: '0', b3: '0', c3: '1', d3: '5' },
    compute: (v) => {
      const toNum = (k: string) => n(v[k])
      const a1 = toNum('a1'), b1 = toNum('b1'), c1 = toNum('c1'), d1 = toNum('d1')
      const a2 = toNum('a2'), b2 = toNum('b2'), c2 = toNum('c2'), d2 = toNum('d2')
      const a3 = toNum('a3'), b3 = toNum('b3'), c3 = toNum('c3'), d3 = toNum('d3')
      const detM = a1 * (b2 * c3 - b3 * c2) - b1 * (a2 * c3 - a3 * c2) + c1 * (a2 * b3 - a3 * b2)
      if (Math.abs(detM) < 1e-10) return { result: 'No unique solution', label: 'Error' }
      const detX = d1 * (b2 * c3 - b3 * c2) - b1 * (d2 * c3 - d3 * c2) + c1 * (d2 * b3 - d3 * b2)
      const detY = a1 * (d2 * c3 - d3 * c2) - d1 * (a2 * c3 - a3 * c2) + c1 * (a2 * d3 - a3 * d2)
      const detZ = a1 * (b2 * d3 - b3 * d2) - b1 * (a2 * d3 - a3 * d2) + d1 * (a2 * b3 - a3 * b2)
      const x = detX / detM, y = detY / detM, z = detZ / detM
      return { result: 'x = ' + x.toFixed(4) + ', y = ' + y.toFixed(4) + ', z = ' + z.toFixed(4), label: 'Solution', extras: [{ label: 'Determinant', value: detM }] }
    },
    formula: 'Cramers rule for 3x3 system',
    description: 'Solve a system of three linear equations with three unknowns.',
    interpretation: 'The (x, y, z) solution of the system of equations.'
}

export default calcDef
