import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ m1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), m2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'm1', label: 'Mass 1', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'm2', label: 'Mass 2', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }],
  compute: (v) => { const a = (Math.abs(v.m1 - v.m2) * 9.81) / (v.m1 + v.m2); const T = (2 * v.m1 * v.m2 * 9.81) / (v.m1 + v.m2); return { result: a, label: 'Acceleration', unit: 'm/s^2', steps: [{ label: 'Formula', value: 'a = |m1-m2|g/(m1+m2)' }, { label: 'Net force', value: `${Math.abs(v.m1 - v.m2) * 9.81} N` }, { label: 'Acceleration', value: `${a.toFixed(3)} m/s^2` }, { label: 'Tension', value: `${T.toFixed(3)} N` }] } },
  description: 'Atwood\'s machine demonstrates Newton\'s laws using two masses connected by a string over a pulley. The acceleration depends on the mass difference.',
  formula: 'a = |m1 - m2|·g / (m1 + m2)',
  interpretation: 'If masses are equal, acceleration is zero. As mass difference increases, acceleration approaches g. Tension in the string is constant throughout.'
}

export default calcDef
