import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Base (b)'), numField('b', 'Height (h)')],
    defaults: { a: '8', b: '5' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      return { result: a * b, label: 'Area', unit: 'units2', steps: [step('Formula:', 'A = ' + a + ' x ' + b + ' = ' + (a * b))] ,
    extras: [
      { label: "Real-World Application", value: "Used in architecture, engineering, and design for spatial calculations." },
      { label: "Formula Derivation", value: "Derived from geometric definitions and spatial relationships." },
      { label: "Unit Check", value: "All lengths must be in the same unit for accurate results." },
      { label: "Precision Note", value: "Uses standard geometric constants for calculation." },
      { label: "Related Shapes", value: "Explore volume and area calculators for other 2D and 3D shapes." }
    ]}
    },
    formula: 'A = b x h',
    description: 'Calculate the area of a parallelogram.',
    interpretation: 'The area enclosed by a parallelogram with the given base and height.',
    presets: [
      { label: 'Small', values: { a: '2' } },
      { label: 'Medium', values: { a: '5' } },
      { label: 'Large', values: { a: '10' } }
    ]
}

export default calcDef
