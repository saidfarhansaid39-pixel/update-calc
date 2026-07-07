import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ fenceLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fenceHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), postSpacingFt: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), numGates: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'fenceLength', label: 'Fence Length (ft)', type: 'number', min: 10, step: '10' },
    { name: 'fenceHeight', label: 'Fence Height (ft)', type: 'number', min: 3, max: 12, step: '1' },
    { name: 'postSpacingFt', label: 'Post Spacing (ft)', type: 'number', min: 4, max: 12, step: '1' },
    { name: 'numGates', label: 'Number of Gates', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const posts = Math.ceil(v.fenceLength / v.postSpacingFt) + 1 + v.numGates * 2
    const railsTotal = Math.ceil(v.fenceHeight / 2) * 2 * v.fenceLength
    const pickets = Math.ceil(v.fenceLength * 12 / 5.5)
    const concrete = Math.ceil(posts * 1.5)
    return { result: posts, label: 'Total Posts Needed', unit: '', steps: [{ label: 'Fence Posts', value: `${posts}` }, { label: 'Rail Length', value: `${railsTotal} ft` }, { label: 'Pickets Needed', value: `${pickets}` }, { label: 'Concrete Bags (60lb)', value: `${concrete}` }] }
  },
  description: 'Calculate all materials needed for a fence project: posts, rails, pickets, and concrete based on dimensions and post spacing.',
  formula: 'Posts = Length/Spacing + 1 + Gates×2 | Pickets = Length × 12/5.5 | Rails = Ceil(Height/2)×2×Length',
  interpretation: 'Standard 6ft privacy fence uses 8ft post spacing, 5.5in pickets with 0.5in gap. Each post requires ~1.5 bags of 60lb concrete. Add 10% for waste.'
}

export default calcDef
