import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num3Schema,
    fields: [numField('a', 'Known side of Triangle 1'), numField('b', 'Corresponding side of Triangle 2'), numField('c', 'Other known side of Triangle 1')],
    defaults: { a: '3', b: '6', c: '4' },
    compute: (v) => {
      const s1 = n(v.a), s2 = n(v.b), s3 = n(v.c)
      const ratio = s2 / s1
      const result = s3 * ratio
      return { result, label: 'Unknown Side', steps: [step('Scale factor:', s2 + ' / ' + s1 + ' = ' + ratio.toFixed(4)), step('Unknown side:', s3 + ' x ' + ratio.toFixed(4) + ' = ' + result.toFixed(4))] ,
    extras: [
      { label: "Real-World Application", value: "Used in architecture, engineering, and design for spatial calculations." },
      { label: "Formula Derivation", value: "Derived from geometric definitions and spatial relationships." },
      { label: "Unit Check", value: "All lengths must be in the same unit for accurate results." },
      { label: "Precision Note", value: "Uses standard geometric constants for calculation." },
      { label: "Related Shapes", value: "Explore volume and area calculators for other 2D and 3D shapes." }
    ]}
    },
    formula: 'Scale factor = s2 / s1, unknown = s3 x scale',
    description: 'Find an unknown side length in similar triangles using proportions.',
    interpretation: 'Corresponding sides of similar triangles are proportional.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
