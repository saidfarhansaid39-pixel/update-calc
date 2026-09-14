import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num3Schema,
    fields: [numField('a', 'Side a'), numField('b', 'Side b'), numField('c', 'Hypotenuse (c) (optional)', { placeholder: 'Leave blank to find' })],
    defaults: { a: '3', b: '4', c: '' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = v.c ? n(v.c) : 0
      if (c === 0) { const hyp = Math.sqrt(a * a + b * b); return { result: hyp, label: 'Hypotenuse', steps: [step('Formula:', 'c = sqrt(' + a + '2 + ' + b + '2)'), step('Result:', 'c = ' + hyp.toFixed(4))] ,
    extras: [
      { label: "Real-World Application", value: "Used in architecture, engineering, and design for spatial calculations." },
      { label: "Formula Derivation", value: "Derived from geometric definitions and spatial relationships." },
      { label: "Unit Check", value: "All lengths must be in the same unit for accurate results." },
      { label: "Precision Note", value: "Uses standard geometric constants for calculation." },
      { label: "Related Shapes", value: "Explore volume and area calculators for other 2D and 3D shapes." }
    ]} }
      else if (c <= a || c <= b) return { result: 'Invalid triangle', label: 'Error' }
      else if (b === 0) { const bCalc = Math.sqrt(c * c - a * a); return { result: bCalc, label: 'Side b', steps: [step('Formula:', 'b = sqrt(' + c + '2 - ' + a + '2)'), step('Result:', 'b = ' + bCalc.toFixed(4))] } }
      else { const aCalc = Math.sqrt(c * c - b * b); return { result: aCalc, label: 'Side a', steps: [step('Formula:', 'a = sqrt(' + c + '2 - ' + b + '2)'), step('Result:', 'a = ' + aCalc.toFixed(4))] } }
    },
    formula: 'a2 + b2 = c2 (Pythagorean theorem)',
    description: 'Solve a right triangle using the Pythagorean theorem.',
    interpretation: 'The missing side length of a right triangle.',
    presets: [
      { label: 'Small', values: { a: '3', b: '4' } },
      { label: 'Medium', values: { a: '6', b: '8' } },
      { label: 'Large', values: { a: '10', b: '12' } }
    ]
}

export default calcDef
