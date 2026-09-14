import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num3Schema,
    fields: [numField('a', 'Height of segment (h)'), numField('b', 'Radius of top base (a)'), numField('c', 'Radius of bottom base (b)')],
    defaults: { a: '3', b: '2', c: '4' },
    compute: (v) => {
      const h = n(v.a), a = n(v.b), b = n(v.c)
      const vol = (Math.PI * h / 6) * (3 * a * a + 3 * b * b + h * h)
      return { result: vol, label: 'Volume', unit: 'units3', steps: [step('Formula:', 'V = (pix' + h + '/6) x (3x' + a + '2 + 3x' + b + '2 + ' + h + '2)'), step('Result:', 'V = ' + vol.toFixed(4))] ,
    extras: [
      { label: "Real-World Application", value: "Used in architecture, engineering, and design for spatial calculations." },
      { label: "Formula Derivation", value: "Derived from geometric definitions and spatial relationships." },
      { label: "Unit Check", value: "All lengths must be in the same unit for accurate results." },
      { label: "Precision Note", value: "Uses standard geometric constants for calculation." },
      { label: "Related Shapes", value: "Explore volume and area calculators for other 2D and 3D shapes." }
    ]}
    },
    formula: 'V = (pih/6)(3a2 + 3b2 + h2)',
    description: 'Calculate the volume of a spherical segment.',
    interpretation: 'The space occupied by a spherical segment (zone) of a sphere.',
    presets: [
      { label: 'Small', values: { a: '2' } },
      { label: 'Medium', values: { a: '5' } },
      { label: 'Large', values: { a: '10' } }
    ]
}

export default calcDef
