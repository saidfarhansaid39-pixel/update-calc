import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({
      shape: z.enum(['square', 'rectangle', 'circle', 'triangle']),
      a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
      b: z.string().optional().or(z.literal('')),
      c: z.string().optional().or(z.literal(''))
}),
    fields: [selectField('shape', 'Shape', [
      { value: 'square', label: 'Square' },
      { value: 'rectangle', label: 'Rectangle' },
      { value: 'circle', label: 'Circle' },
      { value: 'triangle', label: 'Triangle' },
    ]), numField('a', 'Side / Radius / Side a'), numField('b', 'Width / Side b (optional)', { placeholder: 'Leave blank for square/circle' }), numField('c', 'Side c (triangle only, optional)', { placeholder: 'For triangle' })],
    defaults: { shape: 'square', a: '5', b: '', c: '' },
    compute: (v) => {
      const shape = v.shape || 'square', a = n(v.a), b = v.b ? n(v.b) : 0, c = v.c ? n(v.c) : 0
      let result = 0, label = ''
      switch (shape) {
        case 'square': result = 4 * a; label = 'Perimeter (4s)'; break
        case 'rectangle': result = 2 * (a + (b || a)); label = 'Perimeter (2(l+w))'; break
        case 'circle': result = 2 * Math.PI * a; label = 'Circumference (2pir)'; break
        case 'triangle': result = a + (b || a) + (c || a); label = 'Perimeter (a+b+c)'; break
      }
      return { result, label, steps: [step('Result:', label + ' = ' + (typeof result === 'number' ? result.toFixed(4) : result))] }
    },
    formula: 'P varies by shape',
    description: 'Calculate the perimeter (or circumference) of common shapes.',
    interpretation: 'The total distance around the boundary of the shape.'
}

export default calcDef
