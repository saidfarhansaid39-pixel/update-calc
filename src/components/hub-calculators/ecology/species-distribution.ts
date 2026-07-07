import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ input1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), input2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'input1', label: 'Species Distribution Input', type: 'number', unit: '', min: 0, step: '0.1' }, { name: 'input2', label: 'Second Parameter', type: 'number', unit: '', min: 0, step: '0.1' }],
  compute: (v) => ({ result: v.input1 * v.input2 || v.input1, label: 'Species Distribution Result', unit: '', steps: [{ label: 'Formula', value: 'Standard formula' }, { label: 'Input', value: String(v.input1) }, { label: 'Result', value: String(Math.round((v.input1 * v.input2 || v.input1) * 100) / 100) + ' ' }] }),
  description: 'Species distribution model. Calculates the species distribution based on input parameters.',
  formula: 'Standard formula',
  interpretation: 'MaxEnt or GLM based habitat suitability mapping.'
}

export default calcDef
