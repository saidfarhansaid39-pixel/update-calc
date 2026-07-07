import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ x0: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), y0: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), h: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'), steps: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 1, 'Integer >= 1') }),
    fields: [numField('x0', 'x0'), numField('y0', 'y(x0)'), numField('h', 'Step size h', { min: 0.001 }), numField('steps', 'Number of steps', { min: 1, step: '1' })],
    defaults: { x0: '0', y0: '1', h: '0.1', steps: '3' },
    compute: (v) => {
      let x = n(v.x0), y = n(v.y0), h = n(v.h), s = Math.round(n(v.steps)); const steps: { label: string; value: string }[] = [step('Initial', `x0=${x.toFixed(4)}, y0=${y.toFixed(4)}`)]
      for (let i = 0; i < s; i++) { const k1 = x + y; const k2 = (x + h) + (y + h * k1); y += h * (k1 + k2) / 2; x += h; steps.push(step(`Step ${i + 1}`, `x=${x.toFixed(4)}, y=${y.toFixed(4)}`)) }
      return { result: y.toFixed(6), label: `y(${x.toFixed(4)})`, steps }
    },
    formula: 'y??1 = y? + h/2 � (k1 + k2). k1 = f(x?,y?), k2 = f(x??1, y? + h�k1).',
    description: 'Heun method (improved Euler) for ODEs.',
    interpretation: 'Second-order Runge-Kutta method with predictor-corrector.'
}

export default calcDef
