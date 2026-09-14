import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Outer Radius (R)'), numField('b', 'Inner Radius (r)')],
    defaults: { a: '5', b: '3' },
    compute: (v) => {
      const R = n(v.a), r = n(v.b)
      const area = Math.PI * (R * R - r * r)
      return { result: area, label: 'Annulus Area', unit: 'units2', steps: [step('Formula:', 'A = pi(' + R + '2 - ' + r + '2)'), step('Result:', 'A = ' + area.toFixed(4))] ,
    extras: [
      { label: "Real-World Application", value: "Used in architecture, engineering, and design for spatial calculations." },
      { label: "Formula Derivation", value: "Derived from geometric definitions and spatial relationships." },
      { label: "Unit Check", value: "All lengths must be in the same unit for accurate results." },
      { label: "Precision Note", value: "Uses standard geometric constants for calculation." },
      { label: "Related Shapes", value: "Explore volume and area calculators for other 2D and 3D shapes." }
    ]}
    },
    formula: 'A = pi(R2 - r2)',
    description: 'Calculate the area of an annulus (ring).',
    interpretation: 'The area between two concentric circles.',
    presets: [
      { label: 'Small', values: { a: '2' } },
      { label: 'Medium', values: { a: '5' } },
      { label: 'Large', values: { a: '10' } }
    ]
}

export default calcDef
