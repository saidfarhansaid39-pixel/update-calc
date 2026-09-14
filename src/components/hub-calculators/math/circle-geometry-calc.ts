import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('a', 'Radius (r)')],
    defaults: { a: '5' },
    compute: (v) => {
      const r = n(v.a)
      const area = Math.PI * r * r
      const circ = 2 * Math.PI * r
      return { result: area, label: 'Area', unit: 'units2', steps: [step('Area:', 'A = pi x ' + r + '2 = ' + area.toFixed(4)), step('Circumference:', 'C = 2 x pi x ' + r + ' = ' + circ.toFixed(4))] ,
    extras: [
      { label: "Real-World Application", value: "Used in architecture, engineering, and design for spatial calculations." },
      { label: "Formula Derivation", value: "Derived from geometric definitions and spatial relationships." },
      { label: "Unit Check", value: "All lengths must be in the same unit for accurate results." },
      { label: "Precision Note", value: "Uses standard geometric constants for calculation." },
      { label: "Related Shapes", value: "Explore volume and area calculators for other 2D and 3D shapes." }
    ]}
    },
    formula: 'A = pir2, C = 2pir',
    description: 'Calculate circle area and circumference from radius.',
    interpretation: 'The area enclosed by a circle and its circumference.',
    presets: [
      { label: 'Small', values: { a: '2' } },
      { label: 'Medium', values: { a: '5' } },
      { label: 'Large', values: { a: '10' } }
    ]
}

export default calcDef
