import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({
      a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'),
      b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0')
}),
    fields: [numField('a', 'Side A'), numField('b', 'Side B')],
    defaults: { a: '3', b: '4' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      const c = Math.sqrt(a * a + b * b)
      return { result: c, label: 'Hypotenuse (c)', steps: [step('Theorem:', a + '2 + ' + b + '2 = c2'), step('c2:', '' + (a * a) + ' + ' + (b * b) + ' = ' + (a * a + b * b)), step('c:', 'sqrt(' + (a * a + b * b) + ') = ' + c.toFixed(4))] ,
    extras: [
      { label: "Real-World Application", value: "Used in architecture, engineering, and design for spatial calculations." },
      { label: "Formula Derivation", value: "Derived from geometric definitions and spatial relationships." },
      { label: "Unit Check", value: "All lengths must be in the same unit for accurate results." },
      { label: "Precision Note", value: "Uses standard geometric constants for calculation." },
      { label: "Related Shapes", value: "Explore volume and area calculators for other 2D and 3D shapes." }
    ]}
    },
    formula: 'c = sqrt(a2 + b2)',
    description: 'Calculate the hypotenuse of a right triangle using the Pythagorean theorem.',
    interpretation: 'The length of the hypotenuse (longest side) of the right triangle.',
    presets: [
      { label: '3-4-5 Triangle', values: { a: '3', b: '4' } },
      { label: '5-12-13 Triangle', values: { a: '5', b: '12' } },
      { label: '8-15-17 Triangle', values: { a: '8', b: '15' } }
    ]
}

export default calcDef
