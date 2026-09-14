import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Radius (r)'), numField('b', 'Cylinder Height (h)')],
    defaults: { a: '2', b: '6' },
    compute: (v) => {
      const r = n(v.a), h = n(v.b)
      const vol = Math.PI * r * r * (4 * r / 3 + h)
      return { result: vol, label: 'Volume', unit: 'units3', steps: [step('Formula:', 'V = pi x ' + r + '2 x (4x' + r + '/3 + ' + h + ')'), step('Result:', 'V = ' + vol.toFixed(4))] ,
    extras: [
      { label: "Real-World Application", value: "Used in architecture, engineering, and design for spatial calculations." },
      { label: "Formula Derivation", value: "Derived from geometric definitions and spatial relationships." },
      { label: "Unit Check", value: "All lengths must be in the same unit for accurate results." },
      { label: "Precision Note", value: "Uses standard geometric constants for calculation." },
      { label: "Related Shapes", value: "Explore volume and area calculators for other 2D and 3D shapes." }
    ]}
    },
    formula: 'V = pir2(4r/3 + h)',
    description: 'Calculate the volume of a capsule (cylinder with hemispherical ends).',
    interpretation: 'The space occupied by a capsule with the given radius and cylinder height.',
    presets: [
      { label: 'Small', values: { a: '2' } },
      { label: 'Medium', values: { a: '5' } },
      { label: 'Large', values: { a: '10' } }
    ]
}

export default calcDef
