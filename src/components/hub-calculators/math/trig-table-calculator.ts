import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Angle (degrees)')],
    defaults: { a: '30' },
    compute: (v) => {
      const deg = n(v.a), rad = deg * (Math.PI / 180)
      const sinV = Math.sin(rad), cosV = Math.cos(rad), tanV = Math.tan(rad)
      const cscV = 1 / sinV, secV = 1 / cosV, cotV = 1 / tanV
      return { result: sinV, label: 'Trig Table', steps: [step('sin:', '' + sinV.toFixed(6)), step('cos:', '' + cosV.toFixed(6)), step('tan:', '' + (Math.abs(tanV) > 1e15 ? 'undefined' : tanV.toFixed(6))), step('csc:', '' + (Math.abs(sinV) < 1e-15 ? 'undefined' : cscV.toFixed(6))), step('sec:', '' + (Math.abs(cosV) < 1e-15 ? 'undefined' : secV.toFixed(6))), step('cot:', '' + (Math.abs(tanV) < 1e-15 ? 'undefined' : cotV.toFixed(6)))], extras: [{ label: 'cos', value: cosV }, { label: 'tan', value: Math.abs(tanV) > 1e15 ? 'Undefined' : tanV }, { label: 'csc', value: Math.abs(sinV) < 1e-15 ? 'Undefined' : cscV }, { label: 'sec', value: Math.abs(cosV) < 1e-15 ? 'Undefined' : secV }] }
    },
    formula: 'All six trigonometric functions',
    description: 'Calculate all six trigonometric functions for a given angle.',
    interpretation: 'The values of sin, cos, tan, csc, sec, and cot for the given angle.'
}

export default calcDef
