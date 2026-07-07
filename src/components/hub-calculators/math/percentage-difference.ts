import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Value 1'), numField('b', 'Value 2')],
    defaults: { a: '100', b: '150' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      const diff = (Math.abs(a - b) / ((a + b) / 2)) * 100
      return { result: diff, label: 'Percentage Difference', unit: '%', steps: [step('Formula:', '(|' + a + ' - ' + b + '| / ((' + a + ' + ' + b + ')/2)) x 100 = ' + diff.toFixed(2) + '%')] }
    },
    formula: 'D% = |a - b| / ((a + b) / 2) x 100%',
    description: 'Calculate the percentage difference between two numbers.',
    interpretation: 'The relative difference between the two values as a percentage of their average.'
}

export default calcDef
