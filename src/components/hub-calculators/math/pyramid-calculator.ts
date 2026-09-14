import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Base Area (B)'), numField('b', 'Height (h)')],
    defaults: { a: '25', b: '10' },
    compute: (v) => {
      const B = n(v.a), h = n(v.b)
      const vol = (1 / 3) * B * h
      return { result: vol, label: 'Volume', unit: 'units3', steps: [step('Volume:', 'V = 1/3 x ' + B + ' x ' + h + ' = ' + vol.toFixed(4))] ,
    extras: [
      { label: "Real-World Application", value: "Used in architecture, engineering, and design for spatial calculations." },
      { label: "Formula Derivation", value: "Derived from geometric definitions and spatial relationships." },
      { label: "Unit Check", value: "All lengths must be in the same unit for accurate results." },
      { label: "Precision Note", value: "Uses standard geometric constants for calculation." },
      { label: "Related Shapes", value: "Explore volume and area calculators for other 2D and 3D shapes." }
    ]}
    },
    formula: 'V = 1/3Bh',
    description: 'Calculate the volume of a pyramid.',
    interpretation: 'The space occupied by a pyramid with the given base area and height.',
    presets: [
      { label: 'Small', values: { a: '3', b: '4' } },
      { label: 'Medium', values: { a: '6', b: '8' } },
      { label: 'Large', values: { a: '10', b: '12' } }
    ]
}

export default calcDef
