import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Old Value'), numField('b', 'New Value')],
    defaults: { a: '100', b: '150' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      const change = ((b - a) / Math.abs(a)) * 100
      return { result: change, label: 'Percentage Change', unit: '%', steps: [step('Formula:', '((' + b + ' - ' + a + ') / |' + a + '|) x 100 = ' + change.toFixed(2) + '%')] }
    },
    formula: 'D% = ((new - old) / |old|) x 100%',
    description: 'Calculate the percentage change from an old value to a new value.',
    interpretation: 'Positive values indicate an increase; negative values indicate a decrease.'
}

export default calcDef
