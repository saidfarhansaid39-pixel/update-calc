import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ vA: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), vB: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'vA', label: 'Velocity of A', type: 'number', unit: 'm/s', min: 0, step: '0.1' }, { name: 'vB', label: 'Velocity of B', type: 'number', unit: 'm/s', min: 0, step: '0.1' }],
  compute: (v) => ({ result: Math.abs(v.vA - v.vB), label: 'Relative Velocity', unit: 'm/s', steps: [{ label: 'Formula', value: 'v_AB = |v_A - v_B|' }, { label: 'Substitute', value: `|${v.vA} - ${v.vB}|` }, { label: 'Result', value: `${Math.abs(v.vA - v.vB).toFixed(2)} m/s` }] }),
  description: 'Relative velocity is the velocity of an object as observed from another moving reference frame.',
  formula: 'v_AB = |v_A - v_B|',
  interpretation: 'When two objects move in the same direction, relative velocity is the difference. In opposite directions, it is the sum. This concept is fundamental in collision analysis and reference frames.'
}

export default calcDef
