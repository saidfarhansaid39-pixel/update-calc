import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Radius of sphere (r)'), numField('b', 'Height of cap (h)')],
    defaults: { a: '5', b: '2' },
    compute: (v) => {
      const r = n(v.a), h = n(v.b)
      const vol = (Math.PI * h * h / 3) * (3 * r - h)
      return { result: vol, label: 'Volume', unit: 'units3', steps: [step('Formula:', 'V = (pi x ' + h + '2 / 3) x (3x' + r + ' - ' + h + ')'), step('Result:', 'V = ' + vol.toFixed(4))] ,
    extras: [
      { label: "Real-World Application", value: "Used in architecture, engineering, and design for spatial calculations." },
      { label: "Formula Derivation", value: "Derived from geometric definitions and spatial relationships." },
      { label: "Unit Check", value: "All lengths must be in the same unit for accurate results." },
      { label: "Precision Note", value: "Uses standard geometric constants for calculation." },
      { label: "Related Shapes", value: "Explore volume and area calculators for other 2D and 3D shapes." }
    ]}
    },
    formula: 'V = (pih2/3)(3r - h)',
    description: 'Calculate the volume of a spherical cap.',
    interpretation: 'The space occupied by a spherical cap with the given sphere radius and cap height.',
    presets: [
      { label: 'Small', values: { a: '2' } },
      { label: 'Medium', values: { a: '5' } },
      { label: 'Large', values: { a: '10' } }
    ]
}

export default calcDef
