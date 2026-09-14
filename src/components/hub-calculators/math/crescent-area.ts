import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Radius of larger circle (R)'), numField('b', 'Radius of smaller circle (r)')],
    defaults: { a: '5', b: '4' },
    compute: (v) => {
      const R = n(v.a), r = n(v.b)
      const area = Math.PI * (R * R - r * r) / 2
      return { result: area, label: 'Crescent Area', unit: 'units2', steps: [step('Formula:', 'A = 1/2pi(' + R + '2 - ' + r + '2) = ' + area.toFixed(4))] ,
    extras: [
      { label: "Real-World Application", value: "Used in architecture, engineering, and design for spatial calculations." },
      { label: "Formula Derivation", value: "Derived from geometric definitions and spatial relationships." },
      { label: "Unit Check", value: "All lengths must be in the same unit for accurate results." },
      { label: "Precision Note", value: "Uses standard geometric constants for calculation." },
      { label: "Related Shapes", value: "Explore volume and area calculators for other 2D and 3D shapes." }
    ]}
    },
    formula: 'A = 1/2pi(R2 - r2)',
    description: 'Calculate the area of a crescent (lune).',
    interpretation: 'The area of the crescent shape formed by two overlapping circles.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
