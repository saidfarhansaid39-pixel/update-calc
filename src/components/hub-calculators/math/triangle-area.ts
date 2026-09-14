import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Base (b)'), numField('b', 'Height (h)')],
    defaults: { a: '6', b: '4' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      const area = 0.5 * a * b
      return { result: area, label: 'Area', unit: 'units2', steps: [step('Formula:', 'A = 1/2 x ' + a + ' x ' + b), step('Result:', 'A = ' + area.toFixed(4))] ,
    extras: [
      { label: "Real-World Application", value: "Used in architecture, engineering, and design for spatial calculations." },
      { label: "Formula Derivation", value: "Derived from geometric definitions and spatial relationships." },
      { label: "Unit Check", value: "All lengths must be in the same unit for accurate results." },
      { label: "Precision Note", value: "Uses standard geometric constants for calculation." },
      { label: "Related Shapes", value: "Explore volume and area calculators for other 2D and 3D shapes." }
    ]}
    },
    formula: 'A = 1/2bh',
    description: 'Calculate the area of a triangle.',
    interpretation: 'The area enclosed by a triangle with the given base and height.',
    presets: [
      { label: 'Small', values: { a: '2' } },
      { label: 'Medium', values: { a: '5' } },
      { label: 'Large', values: { a: '10' } }
    ]
}

export default calcDef
