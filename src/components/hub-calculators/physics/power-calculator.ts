import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ work: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), time: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'work', label: 'Work', type: 'number', unit: 'J', min: 0.001, step: '0.001' }, { name: 'time', label: 'Time', type: 'number', unit: 's', min: 0.001, step: '0.001' }],
  compute: (v) => ({ result: v.work / v.time, label: 'Power', unit: 'W', steps: [{ label: 'Formula', value: 'P = W/t' }, { label: 'Substitute', value: `${v.work} / ${v.time}` }, { label: 'Result', value: `${(v.work / v.time).toFixed(2)} W` }] }),
  description: 'Power is the rate at which work is done or energy is transferred. P = W/t.',
  formula: 'P = W / t',
  interpretation: 'Power is measured in watts (W). 1 W = 1 J/s. Higher power means work is done more quickly.'
}

export default calcDef
