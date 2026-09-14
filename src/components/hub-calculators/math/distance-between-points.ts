import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, num4Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num4Schema,
    fields: [numField('a', 'x1'), numField('b', 'y1'), numField('c', 'x2'), numField('d', 'y2')],
    defaults: { a: '0', b: '0', c: '3', d: '4' },
    compute: (v) => {
      const x1 = n(v.a), y1 = n(v.b), x2 = n(v.c), y2 = n(v.d)
      const d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
      return { result: d, label: 'Distance', steps: [step('Formula:', 'd = sqrt((' + x2 + ' - ' + x1 + ')2 + (' + y2 + ' - ' + y1 + ')2)'), step('Result:', 'd = sqrt(' + ((x2 - x1) ** 2) + ' + ' + ((y2 - y1) ** 2) + ') = sqrt(' + ((x2 - x1) ** 2 + (y2 - y1) ** 2) + ') = ' + d.toFixed(4))] ,
    extras: [
      { label: "Real-World Application", value: "Used in architecture, engineering, and design for spatial calculations." },
      { label: "Formula Derivation", value: "Derived from geometric definitions and spatial relationships." },
      { label: "Unit Check", value: "All lengths must be in the same unit for accurate results." },
      { label: "Precision Note", value: "Uses standard geometric constants for calculation." },
      { label: "Related Shapes", value: "Explore volume and area calculators for other 2D and 3D shapes." }
    ]}
    },
    formula: 'd = sqrt((x2 - x1)2 + (y2 - y1)2)',
    description: 'Calculate the Euclidean distance between two points in 2D space.',
    interpretation: 'The straight-line distance between the two points.',
    presets: [
      { label: 'Simple', values: { x1: '0', y1: '0', x2: '3', y2: '4' } },
      { label: 'Negative', values: { x1: '-2', y1: '1', x2: '4', y2: '-3' } }
    ]
}

export default calcDef
