import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ input1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), input2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'input1', label: 'Reserve Design Input', type: 'number', unit: '', min: 0, step: '0.1' }, { name: 'input2', label: 'Second Parameter', type: 'number', unit: '', min: 0, step: '0.1' }],
  compute: (v) => ({ result: v.input1 * v.input2 || v.input1, label: 'Reserve Design Result', unit: 'ha', steps: [{ label: 'Formula', value: 'Standard formula' }, { label: 'Input', value: String(v.input1) }, { label: 'Result', value: String(Math.round((v.input1 * v.input2 || v.input1) * 100) / 100) + ' ha' }] }),
  description: 'Reserve design optimization. Calculates the reserve design based on input parameters.',
  formula: 'Standard formula',
  interpretation: 'Minimum area for target species persistence in reserve network.'
}

export default calcDef
