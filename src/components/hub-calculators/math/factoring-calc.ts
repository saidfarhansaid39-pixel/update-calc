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
      if (disc < 0) return { result: 'Cannot factor over reals', label: 'Not factorable', steps: [step('Discriminant:', 'D = ' + disc + ' < 0')] ,
    extras: [
      { label: "Solution Methods", value: "Can be solved via factoring, formula, or graphical methods." },
      { label: "Discriminant Insight", value: "The discriminant reveals the number and type of solutions." },
      { label: "Graphical Meaning", value: "Solutions correspond to x-intercepts on the graph." },
      { label: "Checking Solutions", value: "Substitute results back into the original equation to verify." },
      { label: "Real vs Complex", value: "Real solutions appear when discriminant ≥ 0; otherwise complex." }
    ]}
      const x1 = (-b + Math.sqrt(disc)) / (2 * a), x2 = (-b - Math.sqrt(disc)) / (2 * a)
      return { result: a === 1 ? '(x - ' + x1.toFixed(4) + ')(x - ' + x2.toFixed(4) + ')' : a.toFixed(4) + '(x - ' + x1.toFixed(4) + ')(x - ' + x2.toFixed(4) + ')', label: 'Factored form', steps: [step('Roots:', 'x1 = ' + x1.toFixed(4) + ', x2 = ' + x2.toFixed(4)), step('Factored:', 'a(x - x1)(x - x2)')] }
    },
    formula: 'ax2 + bx + c = a(x - x1)(x - x2)',
    description: 'Factor a quadratic expression.',
    interpretation: 'The factored form of the quadratic expression.',
    presets: [
      { label: 'Simple', values: { a: '1', b: '-3', c: '2' } },
      { label: 'With GCF', values: { a: '2', b: '-8', c: '6' } }
    ]
}

export default calcDef
