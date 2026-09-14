import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Major Radius (R)'), numField('b', 'Minor Radius (r)')],
    defaults: { a: '5', b: '2' },
    compute: (v) => {
      const R = n(v.a), r = n(v.b)
      const vol = 2 * Math.PI * Math.PI * R * r * r
      return { result: vol, label: 'Volume', unit: 'units3', steps: [step('Volume:', 'V = 2pi2 x ' + R + ' x ' + r + '2 = ' + vol.toFixed(4))] ,
    extras: [
      { label: "Real-World Application", value: "Used in architecture, engineering, and design for spatial calculations." },
      { label: "Formula Derivation", value: "Derived from geometric definitions and spatial relationships." },
      { label: "Unit Check", value: "All lengths must be in the same unit for accurate results." },
      { label: "Precision Note", value: "Uses standard geometric constants for calculation." },
      { label: "Related Shapes", value: "Explore volume and area calculators for other 2D and 3D shapes." }
    ]}
    },
    formula: 'V = 2pi2Rr2',
    description: 'Calculate the volume of a torus.',
    interpretation: 'The volume of a torus with given radii.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
