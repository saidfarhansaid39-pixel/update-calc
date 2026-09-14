import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Coefficient a'), numField('b', 'Coefficient b'), numField('c', 'Constant c')],
    defaults: { a: '1', b: '-5', c: '6' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c)
      const disc = b * b - 4 * a * c
      if (disc < 0) return { result: 'Complex roots', label: 'Discriminant < 0', steps: [step('Discriminant:', 'D = ' + disc.toFixed(4) + ' < 0'), step('Roots:', 'x = (' + (-b).toFixed(4) + ' +/- i' + Math.sqrt(-disc).toFixed(4) + ') / ' + (2 * a).toFixed(4))] ,
    extras: [
      { label: "Solution Methods", value: "Can be solved via factoring, formula, or graphical methods." },
      { label: "Discriminant Insight", value: "The discriminant reveals the number and type of solutions." },
      { label: "Graphical Meaning", value: "Solutions correspond to x-intercepts on the graph." },
      { label: "Checking Solutions", value: "Substitute results back into the original equation to verify." },
      { label: "Real vs Complex", value: "Real solutions appear when discriminant ≥ 0; otherwise complex." }
    ]}
      const x1 = (-b + Math.sqrt(disc)) / (2 * a), x2 = (-b - Math.sqrt(disc)) / (2 * a)
      return { result: x1.toFixed(4) + ', ' + x2.toFixed(4), label: 'Roots', steps: [step('Discriminant:', 'D = ' + disc.toFixed(4)), step('x1:', '' + x1.toFixed(4)), step('x2:', '' + x2.toFixed(4))] }
    },
    formula: 'x = (-b +/- sqrt(b2 - 4ac)) / 2a',
    description: 'Solve a quadratic equation ax2 + bx + c = 0.',
    interpretation: 'The roots of the quadratic equation.',
    presets: [
      { label: 'Two Real Roots', values: { a: '1', b: '-3', c: '2' } },
      { label: 'Double Root', values: { a: '1', b: '-4', c: '4' } },
      { label: 'Complex Roots', values: { a: '1', b: '0', c: '1' } }
    ]
}

export default calcDef
