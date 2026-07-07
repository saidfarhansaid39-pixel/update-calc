import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({
      a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
      b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
      op: z.enum(['add', 'subtract', 'multiply', 'divide', 'power', 'percent'])
}),
    fields: [
      selectField('op', 'Operation', [
        { value: 'add', label: 'Add (+)' },
        { value: 'subtract', label: 'Subtract (-)' },
        { value: 'multiply', label: 'Multiply (x)' },
        { value: 'divide', label: 'Divide (/)' },
        { value: 'power', label: 'Power (^)' },
        { value: 'percent', label: 'Percentage (%)' },
      ]),
      numField('a', 'First Number'),
      numField('b', 'Second Number'),
    ],
    defaults: { a: '10', b: '5', op: 'add' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), op = v.op || 'add'
      let result = 0, label = ''
      const st = [step('Input:', a + ' ' + op + ' ' + b)]
      switch (op) {
        case 'add': result = a + b; label = 'Sum'; st.push(step('Formula:', a + ' + ' + b + ' = ' + result)); break
        case 'subtract': result = a - b; label = 'Difference'; st.push(step('Formula:', a + ' - ' + b + ' = ' + result)); break
        case 'multiply': result = a * b; label = 'Product'; st.push(step('Formula:', a + ' x ' + b + ' = ' + result)); break
        case 'divide': result = b !== 0 ? a / b : NaN; label = 'Quotient'; st.push(step('Formula:', a + ' / ' + b + ' = ' + (b !== 0 ? result : 'undefined'))); break
        case 'power': result = Math.pow(a, b); label = 'Power'; st.push(step('Formula:', a + '^' + b + ' = ' + result)); break
        case 'percent': result = (a / b) * 100; label = 'Percentage'; st.push(step('Formula:', '(' + a + ' / ' + b + ') x 100 = ' + result + '%')); break
      }
      return { result: isNaN(result) ? 'Error' : result, label, steps: st }
    },
    formula: 'Op(A, B) -> Result',
    description: 'Arithmetic operations include addition, subtraction, multiplication, division, exponentiation, and percentage.',
    interpretation: 'The result of the selected arithmetic operation on the two input values.',
    presets: [
      { label: '10 + 5', values: { a: '10', b: '5', op: 'add' } },
      { label: '100 x 3.14', values: { a: '100', b: '3.14', op: 'multiply' } },
      { label: '144 / 12', values: { a: '144', b: '12', op: 'divide' } },
      { label: '2^10', values: { a: '2', b: '10', op: 'power' } },
    ]
}

export default calcDef
