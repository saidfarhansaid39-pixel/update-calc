import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ voltage: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), current: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'voltage', label: 'Voltage', type: 'number', unit: 'V', min: 0, step: '0.1' }, { name: 'current', label: 'Current', type: 'number', unit: 'A', min: 0.001, step: '0.001' }],
  compute: (v) => ({ result: v.voltage * v.current, label: 'Power', unit: 'W', steps: [{ label: 'Formula', value: 'P = VI' }, { label: 'Substitute', value: `${v.voltage} × ${v.current}` }, { label: 'Result', value: `${(v.voltage * v.current).toFixed(2)} W` }] }),
  description: 'Electrical power is the product of voltage and current. P = VI.',
  formula: 'P = V × I',
  interpretation: 'A 120 V circuit drawing 10 A delivers 1200 W. Power dissipation in resistors converts electrical energy to heat.'
}

export default calcDef
