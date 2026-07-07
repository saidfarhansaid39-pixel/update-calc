import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= -1 && parseFloat(v) <= 1, 'Must be between -1 and 1'), func: z.enum(['arcsin', 'arccos', 'arctan']) }),
    fields: [numField('a', 'Value x'), selectField('func', 'Function', [{ value: 'arcsin', label: 'arcsin' }, { value: 'arccos', label: 'arccos' }, { value: 'arctan', label: 'arctan' }])],
    defaults: { a: '0.5', func: 'arcsin' },
    compute: (v) => {
      const x = n(v.a), fn = v.func || 'arcsin'
      let result = 0, label = ''
      if (fn === 'arcsin') { result = Math.asin(x); label = 'arcsin(' + x + ')' }
      else if (fn === 'arccos') { result = Math.acos(x); label = 'arccos(' + x + ')' }
      else { result = Math.atan(x); label = 'arctan(' + x + ')' }
      return { result: result.toFixed(6) + ' rad (' + (result * 180 / Math.PI).toFixed(4) + ' deg)', label, steps: [step('Input:', '' + fn + '(' + x + ')'), step('Result (rad):', '' + result.toFixed(6)), step('Result (deg):', '' + (result * 180 / Math.PI).toFixed(4))] }
    },
    formula: 'arcsin(x), arccos(x), arctan(x)',
    description: 'Calculate inverse trigonometric functions.',
    interpretation: 'The angle (in radians and degrees) whose trigonometric function equals the input.'
}

export default calcDef
