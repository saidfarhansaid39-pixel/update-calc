import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num3Schema,
    fields: [numField('a', 'Center x (h)'), numField('b', 'Center y (k)'), numField('c', 'Radius (r)')],
    defaults: { a: '0', b: '0', c: '5' },
    compute: (v) => {
      const h = n(v.a), k = n(v.b), r = n(v.c)
      return { result: '(x - ' + h + ')2 + (y - ' + k + ')2 = ' + (r * r), label: 'Circle Equation', steps: [step('Standard form:', '(x - h)2 + (y - k)2 = r2'), step('Result:', '(x - ' + h + ')2 + (y - ' + k + ')2 = ' + (r * r))] ,
    extras: [
      { label: "Real-World Application", value: "Used in architecture, engineering, and design for spatial calculations." },
      { label: "Formula Derivation", value: "Derived from geometric definitions and spatial relationships." },
      { label: "Unit Check", value: "All lengths must be in the same unit for accurate results." },
      { label: "Precision Note", value: "Uses standard geometric constants for calculation." },
      { label: "Related Shapes", value: "Explore volume and area calculators for other 2D and 3D shapes." }
    ]}
    },
    formula: '(x - h)2 + (y - k)2 = r2',
    description: 'Find the equation of a circle given its center and radius.',
    interpretation: 'The standard form equation of the circle with the given center and radius.',
    presets: [
      { label: 'Small', values: { a: '2' } },
      { label: 'Medium', values: { a: '5' } },
      { label: 'Large', values: { a: '10' } }
    ]
}

export default calcDef
