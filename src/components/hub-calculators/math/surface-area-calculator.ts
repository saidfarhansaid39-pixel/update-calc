import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({
      shape: z.enum(['cube', 'sphere', 'cylinder', 'cone']),
      a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
      b: z.string().optional().or(z.literal(''))
}),
    fields: [selectField('shape', 'Shape', [
      { value: 'cube', label: 'Cube' },
      { value: 'sphere', label: 'Sphere' },
      { value: 'cylinder', label: 'Cylinder' },
      { value: 'cone', label: 'Cone' },
    ]), numField('a', 'Side / Radius'), numField('b', 'Height / Slant Height (optional)', { placeholder: 'Required for cylinder/cone' })],
    defaults: { shape: 'cube', a: '4', b: '' },
    compute: (v) => {
      const shape = v.shape || 'cube', a = n(v.a), b = v.b ? n(v.b) : 0
      let result = 0
      switch (shape) {
        case 'cube': result = 6 * a * a; break
        case 'sphere': result = 4 * Math.PI * a * a; break
        case 'cylinder': result = 2 * Math.PI * a * (a + (b || a)); break
        case 'cone': result = Math.PI * a * (a + (b || a)); break
      }
      return { result, label: 'Surface Area', unit: 'units2', steps: [step('Result:', shape + ' surface area = ' + result.toFixed(4))] }
    },
    formula: 'A varies by shape',
    description: 'Calculate the surface area of common 3D shapes.',
    interpretation: 'The total surface area of the selected 3D shape.'
}

export default calcDef
