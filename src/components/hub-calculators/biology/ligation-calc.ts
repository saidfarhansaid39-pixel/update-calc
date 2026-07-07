import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    vecLen: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    insLen: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    vecMass: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    ratio: z.string().optional()
}),
  fields: [
    { name: 'vecLen', label: 'Vector Size', type: 'number', unit: 'kb', min: 0.1, step: '0.1' },
    { name: 'insLen', label: 'Insert Size', type: 'number', unit: 'kb', min: 0.1, step: '0.1' },
    { name: 'vecMass', label: 'Vector Mass', type: 'number', unit: 'ng', min: 1, step: '1' },
    { name: 'ratio', label: 'Insert:Vector Ratio', type: 'select', options: [
      { label: '1:1', value: '1' }, { label: '3:1', value: '3' }, { label: '5:1', value: '5' }, { label: '7:1', value: '7' },
    ] },
  ],
  compute: (v) => {
    const r = parseFloat(v.ratio) || 3
    const insMass = v.vecMass * (v.insLen / v.vecLen) * r
    return {
      result: insMass, label: 'Insert Mass Required', unit: 'ng',
      steps: [
        { label: 'Vector size', value: `${v.vecLen} kb` },
        { label: 'Insert size', value: `${v.insLen} kb` },
        { label: 'Vector mass', value: `${v.vecMass} ng` },
        { label: 'Ratio (insert:vector)', value: `${r}:1` },
        { label: 'Required insert mass', value: `${insMass.toFixed(1)} ng` },
        { label: 'Total in ligation', value: `${(v.vecMass + insMass).toFixed(1)} ng` },
      ]
}
  },
  description: 'Calculate insert mass needed for DNA ligation based on vector size, insert size, vector mass, and desired molar ratio. The optimal ratio depends on insert:vector size and end compatibility.',
  formula: 'Insert mass (ng) = Vector mass × (Insert kb / Vector kb) × molar ratio | Sticky ends: 3:1-5:1 | Blunt ends: 5:1-10:1',
  interpretation: 'Higher insert:vector ratios favor ligation but increase background from insert-insert concatemers. Use 50-200 ng total DNA per ligation. Include vector-only control to assess background. Ligation at 16°C overnight is standard.'
}

export default calcDef
