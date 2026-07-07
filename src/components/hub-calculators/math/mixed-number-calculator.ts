import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), e: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), f: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), op: z.enum(['add', 'subtract', 'multiply', 'divide']) }),
    fields: [numField('a', 'Whole 1'), numField('b', 'Num 1'), numField('c', 'Den 1'), selectField('op', 'Operation', [{ value: 'add', label: 'Add' }, { value: 'subtract', label: 'Subtract' }, { value: 'multiply', label: 'Multiply' }, { value: 'divide', label: 'Divide' }]), numField('d', 'Whole 2'), numField('e', 'Num 2'), numField('f', 'Den 2')],
    defaults: { a: '1', b: '1', c: '2', d: '2', e: '2', f: '3', op: 'add' },
    compute: (v) => {
      const w1 = ni(v.a), n1 = ni(v.b), d1 = Math.max(1, ni(v.c))
      const w2 = ni(v.d), n2 = ni(v.e), d2 = Math.max(1, ni(v.f))
      const op = v.op || 'add'
      const imp1 = Math.abs(w1) * d1 + n1, imp2 = Math.abs(w2) * d2 + n2
      const sign1 = w1 < 0 ? -1 : 1, sign2 = w2 < 0 ? -1 : 1
      let numResult = 0, denResult = 1
      if (op === 'add') { numResult = sign1 * imp1 * d2 + sign2 * imp2 * d1; denResult = d1 * d2 }
      else if (op === 'subtract') { numResult = sign1 * imp1 * d2 - sign2 * imp2 * d1; denResult = d1 * d2 }
      else if (op === 'multiply') { numResult = sign1 * imp1 * sign2 * imp2; denResult = d1 * d2 }
      else if (op === 'divide') { if (imp2 === 0) return { result: 'Division by zero', label: 'Error' }; numResult = sign1 * imp1 * d2; denResult = d1 * sign2 * imp2 }
      const g = gcd(Math.abs(numResult), Math.abs(denResult))
      const sNum = numResult / g, sDen = denResult / g
      let resultStr = '' + sNum + '/' + sDen
      if (Math.abs(sNum) >= Math.abs(sDen)) { const whole = Math.floor(sNum / sDen); const rem = sNum % sDen; resultStr = rem === 0 ? '' + whole : whole + ' ' + Math.abs(rem) + '/' + Math.abs(sDen) }
      return { result: resultStr, label: 'Result', steps: [step('Convert to improper:', '' + w1 + ' ' + n1 + '/' + d1 + ' and ' + w2 + ' ' + n2 + '/' + d2), step('Operation:', op), step('Result:', resultStr)] }
    },
    formula: 'Operate on mixed numbers by converting to improper fractions first',
    description: 'Perform arithmetic operations on mixed numbers.',
    interpretation: 'The result of the operation on the two mixed numbers.'
}

export default calcDef
