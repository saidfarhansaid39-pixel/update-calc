import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    distCompound: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    distSolvent: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'distCompound', label: 'Distance Traveled by Compound', type: 'number', unit: 'cm', min: 0.1, step: '0.1' },
    { name: 'distSolvent', label: 'Distance Traveled by Solvent Front', type: 'number', unit: 'cm', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const rf = v.distCompound / v.distSolvent
    return {
      result: rf, label: 'Retention Factor (Rf)', unit: '',
      steps: [
        { label: 'Compound distance', value: `${v.distCompound} cm` },
        { label: 'Solvent front distance', value: `${v.distSolvent} cm` },
        { label: 'Rf = d_compound / d_solvent', value: rf.toFixed(3) },
      ]
}
  },
  description: 'The retention factor (Rf) in chromatography is the ratio of the distance traveled by a compound to the distance traveled by the solvent front. Rf values are characteristic for compounds under specific conditions.',
  formula: 'Rf = distance traveled by compound / distance traveled by solvent front',
  interpretation: 'Rf values range from 0 (compound stays at origin, very polar) to 1 (compound moves with solvent front, very non-polar). Rf depends on the solvent system, stationary phase, and temperature. Pure compounds have a single, reproducible Rf value.'
}

export default calcDef
