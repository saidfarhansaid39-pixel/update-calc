import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 3, 'Must be >= 3'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('a', 'Number of Sides (n)', { min: 3, step: '1' }), numField('b', 'Side Length (s)')],
    defaults: { a: '6', b: '5' },
    compute: (v) => {
      const nSides = Math.max(3, ni(v.a)), s = n(v.b)
      const area = (nSides * s * s) / (4 * Math.tan(Math.PI / nSides))
      return { result: area, label: 'Area', unit: 'units2', steps: [step('Formula:', 'A = (' + nSides + ' x ' + s + '2) / (4 x tan(pi/' + nSides + '))'), step('Result:', 'A = ' + area.toFixed(4))] }
    },
    formula: 'A = (ns2) / (4 tan(pi/n))',
    description: 'Calculate the area of a regular polygon.',
    interpretation: 'The area enclosed by a regular polygon with the given number of sides and side length.'
}

export default calcDef
