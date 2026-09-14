import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Percentage')],
    defaults: { a: '75' },
    compute: (v) => {
      const a = n(v.a)
      let num = a, den = 100
      const g = gcd(Math.round(num), den)
      return { result: '' + (Math.round(num) / g) + '/' + (den / g), label: 'Fraction', steps: [step('Formula:', '' + a + '% = ' + a + '/100'), step('Simplified:', '' + (Math.round(num) / g) + '/' + (den / g))] ,
    extras: [
      { label: "How It Works", value: "Simple percentage-based calculation applied to your input values." },
      { label: "Common Use Case", value: "Used in shopping, budgeting, and everyday financial decisions." },
      { label: "Input Requirements", value: "All monetary values should be in the same currency." },
      { label: "Accuracy Note", value: "Results rounded to 2 decimal places for standard currency format." }
    ]}
    },
    formula: 'fraction = percent/100, then simplify',
    description: 'Convert a percentage to a fraction.',
    interpretation: 'The percentage expressed as a fraction.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
