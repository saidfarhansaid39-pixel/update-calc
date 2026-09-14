import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Radius (r)'), numField('b', 'Height (h)')],
    defaults: { a: '3', b: '7' },
    compute: (v) => {
      const r = n(v.a), h = n(v.b)
      const vol = Math.PI * r * r * h
      const area = 2 * Math.PI * r * (r + h)
      return { result: vol, label: 'Volume', unit: 'units3', steps: [step('Volume:', 'V = pi x ' + r + '2 x ' + h + ' = ' + vol.toFixed(4)), step('Surface area:', 'S = 2pi x ' + r + ' x (' + r + ' + ' + h + ') = ' + area.toFixed(4))] ,
    extras: [
      { label: "Real-World Application", value: "Used in architecture, engineering, and design for spatial calculations." },
      { label: "Formula Derivation", value: "Derived from geometric definitions and spatial relationships." },
      { label: "Unit Check", value: "All lengths must be in the same unit for accurate results." },
      { label: "Precision Note", value: "Uses standard geometric constants for calculation." },
      { label: "Related Shapes", value: "Explore volume and area calculators for other 2D and 3D shapes." }
    ]}
    },
    formula: 'V = pir2h, S = 2pir(r + h)',
    description: 'Calculate cylinder volume and surface area.',
    interpretation: 'The volume and surface area of a cylinder with given radius and height.',
    presets: [
      { label: 'Small', values: { a: '2' } },
      { label: 'Medium', values: { a: '5' } },
      { label: 'Large', values: { a: '10' } }
    ]
}

export default calcDef
