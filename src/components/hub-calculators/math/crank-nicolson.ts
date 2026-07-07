import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('a', 'Initial temp T0'), numField('b', 'Time step dt')],
    defaults: { a: '100', b: '0.01' },
    compute: (v) => {
      const T0 = n(v.a), dt = n(v.b)
      const alpha = 0.01, dx = 0.1, r = alpha * dt / (dx * dx)
      const T = [T0, T0 * 0.8, T0 * 0.6]
      const Tnew = T.map((_, i) => T[i] + r * ((T[i + 1] || 0) - 2 * T[i] + (T[i - 1] || 0)) / 2)
      return { result: 'T1=' + Tnew[0].toFixed(2) + ', T2=' + Tnew[1].toFixed(2) + ', T3=' + Tnew[2].toFixed(2), label: 'Crank-Nicolson step', steps: [step('Diffusivity:', 'alpha=' + alpha + ', dx=' + dx + ', r=' + r.toFixed(4)), step('New temps:', Tnew.map((t, i) => 'T' + (i + 1) + '=' + t.toFixed(2)).join(', '))] }
    },
    formula: 'T_i^{n+1} = T_i^n + r/2 (T_{i+1}^n - 2T_i^n + T_{i-1}^n + T_{i+1}^{n+1} - 2T_i^{n+1} + T_{i-1}^{n+1})',
    description: 'Crank-Nicolson method for heat equation (one step).',
    interpretation: 'The temperature distribution after one time step using Crank-Nicolson.'
}

export default calcDef
