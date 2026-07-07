import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ outcomes: z.string().min(1, 'Required'), probs: z.string().min(1, 'Required') }),
    fields: [textField('outcomes', 'Outcomes (comma-separated)'), textField('probs', 'Probabilities (comma-separated, sum=1)')],
    defaults: { outcomes: '1, 2, 3, 4, 5, 6', probs: '0.1667, 0.1667, 0.1667, 0.1667, 0.1667, 0.1667' },
    compute: (v) => {
      const vals = String(v.outcomes || '').split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x))
      const probs = String(v.probs || '').split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x))
      if (vals.length !== probs.length || vals.length === 0) return { result: 'Equal length required', label: 'Error' }
      const ev = vals.reduce((s, v, i) => s + v * probs[i], 0)
      return { result: ev.toFixed(6), label: 'E[X]', steps: [step('Items', '' + vals.length), step('Formula', 'E[X] = S xi � pi'), step('Result', ev.toFixed(6))] }
    },
    formula: 'E[X] = S xi � P(xi).',
    description: 'Calculate the expected value of a discrete random variable.',
    interpretation: 'The long-run average value of the random variable.'
}

export default calcDef
