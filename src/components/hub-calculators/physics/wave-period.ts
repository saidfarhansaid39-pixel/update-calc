import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ frequency: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'frequency', label: 'Frequency', type: 'number', unit: 'Hz', min: 1e-6, step: '0.001' }],
  compute: (v) => ({ result: 1 / v.frequency, label: 'Period', unit: 's', steps: [{ label: 'Formula', value: 'T = 1/f' }, { label: 'Substitute', value: `1 / ${v.frequency}` }, { label: 'Result', value: `${(1 / v.frequency).toFixed(6)} s` }] }),
  description: 'The period is the time required for one complete wave cycle. It is the reciprocal of frequency.',
  formula: 'T = 1 / f',
  interpretation: 'A wave with frequency 100 Hz has a period of 0.01 s. Period and frequency are inversely related.'
}

export default calcDef
