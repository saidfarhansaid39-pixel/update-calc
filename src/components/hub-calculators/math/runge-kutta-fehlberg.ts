import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ x0: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), y0: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), h: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('x0', 'x0'), numField('y0', 'y(x0)'), numField('h', 'Step size h', { min: 0.001 })],
    defaults: { x0: '0', y0: '1', h: '0.1' },
    compute: (v) => {
      let x = n(v.x0), y = n(v.y0), h = n(v.h)
      const k1 = h * (x + y); const k2 = h * ((x + h / 4) + (y + k1 / 4)); const k3 = h * ((x + 3 * h / 8) + (y + 3 * k1 / 32 + 9 * k2 / 32))
      const k4 = h * ((x + 12 * h / 13) + (y + 1932 * k1 / 2197 - 7200 * k2 / 2197 + 7296 * k3 / 2197))
      const k5 = h * ((x + h) + (y + 439 * k1 / 216 - 8 * k2 + 3680 * k3 / 513 - 845 * k4 / 4104))
      y += 25 * k1 / 216 + 1408 * k3 / 2565 + 2197 * k4 / 4104 - k5 / 5; x += h
      return { result: y.toFixed(6), label: `y(${x.toFixed(4)})`, steps: [step('k1', k1.toFixed(6)), step('k2', k2.toFixed(6)), step('k3', k3.toFixed(6)), step('k4', k4.toFixed(6)), step('k5', k5.toFixed(6)), step('Result', `y=${y.toFixed(6)}`)] }
    },
    formula: 'RKF45 � embedded 4th/5th order Runge-Kutta method.',
    description: 'Runge-Kutta-Fehlberg (RKF45) one-step ODE solver.',
    interpretation: 'Adaptive step-size Runge-Kutta method with error estimation.'
}

export default calcDef
