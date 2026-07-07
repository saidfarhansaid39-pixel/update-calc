import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    vectorLength: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    insertLength: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    vectorAmount: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    ratio: z.string().optional()
}),
  fields: [
    { name: 'vectorLength', label: 'Vector Size', type: 'number', unit: 'kb', min: 0.1, step: '0.1' },
    { name: 'insertLength', label: 'Insert Size', type: 'number', unit: 'kb', min: 0.1, step: '0.1' },
    { name: 'vectorAmount', label: 'Vector Amount', type: 'number', unit: 'ng', min: 1, step: '1' },
    { name: 'ratio', label: 'Insert:Vector Ratio', type: 'select', options: [
      { label: '1:1', value: '1' }, { label: '3:1', value: '3' }, { label: '5:1', value: '5' },
    ] },
  ],
  compute: (v) => {
    const ratio = parseFloat(v.ratio) || 3
    const insertMass = v.vectorAmount * (v.insertLength / v.vectorLength) * ratio
    return {
      result: insertMass, label: 'Insert Mass Needed', unit: 'ng',
      steps: [
        { label: 'Vector size', value: `${v.vectorLength} kb` },
        { label: 'Insert size', value: `${v.insertLength} kb` },
        { label: 'Vector amount', value: `${v.vectorAmount} ng` },
        { label: 'Insert:Vector ratio', value: `${ratio}:1` },
        { label: 'Insert mass needed', value: `${insertMass.toFixed(1)} ng` },
      ]
}
  },
  description: 'Ligation efficiency depends on the insert-to-vector molar ratio. Calculate the optimal insert mass for your cloning experiment.',
  formula: 'Insert mass (ng) = Vector mass × (Insert length / Vector length) × Molar ratio',
  interpretation: 'Typical insert:vector ratios: 3:1 to 5:1 for sticky ends, 5:1 to 10:1 for blunt ends. Total DNA in ligation: 50-200 ng.'
}

export default calcDef
