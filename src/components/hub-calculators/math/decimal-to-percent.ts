import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Decimal')],
    defaults: { a: '0.85' },
    compute: (v) => {
      const a = n(v.a)
      return { result: (a * 100).toFixed(4), label: 'Percent', unit: '%', steps: [step('Formula:', '' + a + ' x 100 = ' + (a * 100).toFixed(4) + '%')] ,
    extras: [
      { label: "How It Works", value: "Simple percentage-based calculation applied to your input values." },
      { label: "Common Use Case", value: "Used in shopping, budgeting, and everyday financial decisions." },
      { label: "Input Requirements", value: "All monetary values should be in the same currency." },
      { label: "Accuracy Note", value: "Results rounded to 2 decimal places for standard currency format." }
    ]}
    },
    formula: 'percent = decimal x 100%',
    description: 'Convert a decimal to a percentage.',
    interpretation: 'The decimal expressed as a percentage.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
