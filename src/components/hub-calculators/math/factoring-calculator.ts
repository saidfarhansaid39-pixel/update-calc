import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num3Schema,
    fields: [numField('a', 'Coefficient a'), numField('b', 'Coefficient b'), numField('c', 'Coefficient c')],
    defaults: { a: '1', b: '-3', c: '2' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c)
      if (a === 0) return { result: 'Not a quadratic (a = 0)', label: 'Error' }
      const disc = b * b - 4 * a * c
      if (disc < 0) return { result: 'Cannot factor over reals (complex roots)', label: 'Not Factorable' }
      const x1 = (-b + Math.sqrt(disc)) / (2 * a), x2 = (-b - Math.sqrt(disc)) / (2 * a)
      const r1 = Math.abs(x1 - Math.round(x1)) < 1e-10 ? Math.round(x1) : x1
      const r2 = Math.abs(x2 - Math.round(x2)) < 1e-10 ? Math.round(x2) : x2
      let factorStr = ''
      if (a === 1) factorStr = '(x ' + (r1 >= 0 ? '- ' + r1 : '+ ' + Math.abs(r1)) + ')(x ' + (r2 >= 0 ? '- ' + r2 : '+ ' + Math.abs(r2)) + ')'
      else factorStr = a + '(x - ' + r1 + ')(x - ' + r2 + ')'
      return { result: factorStr, label: 'Factored Form', steps: [step('Quadratic:', '' + a + 'x2 + ' + b + 'x + ' + c), step('Roots:', 'x = ' + x1.toFixed(4) + ', ' + x2.toFixed(4)), step('Factored:', factorStr)],
    extras: [
      { label: "Solution Methods", value: "Can be solved via factoring, formula, or graphical methods." },
      { label: "Discriminant Insight", value: "The discriminant reveals the number and type of solutions." },
      { label: "Graphical Meaning", value: "Solutions correspond to x-intercepts on the graph." },
      { label: "Checking Solutions", value: "Substitute results back into the original equation to verify." },
      { label: "Real vs Complex", value: "Real solutions appear when discriminant ≥ 0; otherwise complex." }
    ] }
    },
    formula: 'ax2 + bx + c = a(x - x1)(x - x2)',
    description: 'Factor a quadratic expression into its linear factors.',
    interpretation: 'The factored form of the quadratic expression.',
    presets: [
      { label: 'Simple', values: { a: '1', b: '-3', c: '2' } },
      { label: 'With GCF', values: { a: '2', b: '-8', c: '6' } }
    ]
}

export default calcDef
