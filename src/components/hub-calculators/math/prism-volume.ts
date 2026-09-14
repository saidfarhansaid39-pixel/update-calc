import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Base Area (B)'), numField('b', 'Height (h)')],
    defaults: { a: '25', b: '10' },
    compute: (v) => {
      const B = n(v.a), h = n(v.b)
      return { result: B * h, label: 'Volume', unit: 'units3', steps: [step('Formula:', 'V = ' + B + ' x ' + h + ' = ' + (B * h))] ,
    extras: [
      { label: "Real-World Application", value: "Used in architecture, engineering, and design for spatial calculations." },
      { label: "Formula Derivation", value: "Derived from geometric definitions and spatial relationships." },
      { label: "Unit Check", value: "All lengths must be in the same unit for accurate results." },
      { label: "Precision Note", value: "Uses standard geometric constants for calculation." },
      { label: "Related Shapes", value: "Explore volume and area calculators for other 2D and 3D shapes." }
    ]}
    },
    formula: 'V = Bh',
    description: 'Calculate the volume of a prism.',
    interpretation: 'The space occupied by a prism with the given base area and height.',
    presets: [
      { label: 'Small', values: { a: '2' } },
      { label: 'Medium', values: { a: '5' } },
      { label: 'Large', values: { a: '10' } }
    ]
}

export default calcDef
