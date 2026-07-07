import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ period: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'period', label: 'Period', type: 'number', unit: 's', min: 1e-6, step: '0.001' }],
  compute: (v) => ({ result: 1 / v.period, label: 'Frequency', unit: 'Hz', steps: [{ label: 'Formula', value: 'f = 1/T' }, { label: 'Substitute', value: `1 / ${v.period}` }, { label: 'Result', value: `${(1 / v.period).toFixed(4)} Hz` }] }),
  description: 'Frequency is the reciprocal of the period. It is the number of wave cycles per second.',
  formula: 'f = 1 / T',
  interpretation: '1 Hz = 1 cycle per second. Visible light has frequencies of 4×10¹^4 to 8×10¹^4 Hz.'
}

export default calcDef
