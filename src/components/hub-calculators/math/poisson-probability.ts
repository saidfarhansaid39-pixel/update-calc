import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ k: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 0, 'Integer >= 0'), lambda: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('k', 'Events (k)', { min: 0, step: '1' }), numField('lambda', 'Rate (lambda)')],
    defaults: { k: '3', lambda: '2.5' },
    compute: (v) => {
      const k = Math.round(n(v.k)), lambda = n(v.lambda); const prob = Math.exp(-lambda) * Math.pow(lambda, k) / fact(k)
      return { result: prob.toFixed(6), label: 'P(X=k)', steps: [step('Formula', 'P(k) = e^(-lambda) x lambda^k / k!'), step('Result', prob.toFixed(6))] }
    },
    formula: 'P(X=k) = e^(-lambda) x lambda^k / k!.',
    description: 'Calculate Poisson probability for exactly k events.',
    interpretation: 'The probability of exactly k events occurring in a fixed interval.'
}

export default calcDef
