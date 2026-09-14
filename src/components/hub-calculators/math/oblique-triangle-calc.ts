import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Side a'), numField('b', 'Side b'), numField('c', 'Angle C (degrees)')],
    defaults: { a: '5', b: '7', c: '60' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), angleC = n(v.c)
      const cRad = angleC * (Math.PI / 180)
      const cSide = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(cRad))
      return { result: cSide, label: 'Side c', steps: [step('Law of Cosines:', 'c2 = ' + a + '2 + ' + b + '2 - 2(' + a + ')(' + b + ')cos(' + angleC + ')'), step('Result:', 'c = ' + cSide.toFixed(4))] ,
    extras: [
      { label: "Real-World Application", value: "Used in architecture, engineering, and design for spatial calculations." },
      { label: "Formula Derivation", value: "Derived from geometric definitions and spatial relationships." },
      { label: "Unit Check", value: "All lengths must be in the same unit for accurate results." },
      { label: "Precision Note", value: "Uses standard geometric constants for calculation." },
      { label: "Related Shapes", value: "Explore volume and area calculators for other 2D and 3D shapes." }
    ]}
    },
    formula: 'c2 = a2 + b2 - 2ab cos(C)',
    description: 'Solve an oblique triangle using the law of cosines.',
    interpretation: 'The missing side length of an oblique triangle.',
    presets: [
      { label: 'Small', values: { a: '3', b: '4' } },
      { label: 'Medium', values: { a: '6', b: '8' } },
      { label: 'Large', values: { a: '10', b: '12' } }
    ]
}

export default calcDef
