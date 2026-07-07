import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ value: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Must be >= 0'), n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 2 && Number.isInteger(Number(v)), 'Integer >= 2') }),
    fields: [numField('value', 'Radicand', { min: 0 }), numField('n', 'Index (nth root)', { min: 2, step: '1' })],
    defaults: { value: '16', n: '2' },
    compute: (v) => { const val = n(v.value), idx = Math.round(n(v.n)); const root = Math.pow(val, 1 / idx); return { result: root.toFixed(6), label: `${idx}th root`, steps: [step('Radicand', '' + val), step('Index', '' + idx), step('Result', root.toFixed(6))] } },
    formula: 'nvx = x^(1/n).',
    description: 'Evaluate radical expressions (nth root).',
    interpretation: 'The nth root of the given radicand.'
}

export default calcDef
