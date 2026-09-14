import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Original Value'), numField('b', 'Percentage Decrease')],
    defaults: { a: '100', b: '20' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      const result = a * (1 - b / 100)
      return { result, label: 'Result', steps: [step('Formula:', a + ' x (1 - ' + b + '/100) = ' + result.toFixed(2))] ,
    extras: [
      { label: "How It Works", value: "Simple percentage-based calculation applied to your input values." },
      { label: "Common Use Case", value: "Used in shopping, budgeting, and everyday financial decisions." },
      { label: "Input Requirements", value: "All monetary values should be in the same currency." },
      { label: "Accuracy Note", value: "Results rounded to 2 decimal places for standard currency format." }
    ]}
    },
    formula: 'Result = original x (1 - pct/100)',
    description: 'Calculate the result after a percentage decrease.',
    interpretation: 'The original value decreased by the given percentage.',
    presets: [
      { label: '50% of 200', values: { a: '200', b: '50' } },
      { label: '25% of 80', values: { a: '80', b: '25' } }
    ]
}

export default calcDef
