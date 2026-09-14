import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, num4Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num4Schema,
    fields: [numField('a', 'x1'), numField('b', 'y1'), numField('c', 'x2'), numField('d', 'y2')],
    defaults: { a: '0', b: '0', c: '6', d: '8' },
    compute: (v) => {
      const x1 = n(v.a), y1 = n(v.b), x2 = n(v.c), y2 = n(v.d)
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
      return { result: '(' + mx.toFixed(4) + ', ' + my.toFixed(4) + ')', label: 'Midpoint', steps: [step('Formula:', 'M = ((' + x1 + ' + ' + x2 + ')/2, (' + y1 + ' + ' + y2 + ')/2)'), step('Result:', 'M = (' + mx.toFixed(4) + ', ' + my.toFixed(4) + ')')] ,
    extras: [
      { label: "Real-World Application", value: "Used in architecture, engineering, and design for spatial calculations." },
      { label: "Formula Derivation", value: "Derived from geometric definitions and spatial relationships." },
      { label: "Unit Check", value: "All lengths must be in the same unit for accurate results." },
      { label: "Precision Note", value: "Uses standard geometric constants for calculation." },
      { label: "Related Shapes", value: "Explore volume and area calculators for other 2D and 3D shapes." }
    ]}
    },
    formula: 'M = ((x1 + x2)/2, (y1 + y2)/2)',
    description: 'Calculate the midpoint between two points.',
    interpretation: 'The point exactly halfway between the two given points.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
