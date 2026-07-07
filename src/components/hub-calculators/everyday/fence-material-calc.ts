import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ perimeterFt: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), heightFt: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), postSpacing: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gates: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'perimeterFt', label: 'Fence Perimeter (ft)', type: 'number', min: 10, step: '10' },
    { name: 'heightFt', label: 'Fence Height (ft)', type: 'number', min: 1, step: '1' },
    { name: 'postSpacing', label: 'Post Spacing (ft)', type: 'number', min: 4, max: 12, step: '1' },
    { name: 'gates', label: 'Number of Gates', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const posts = Math.ceil(v.perimeterFt / v.postSpacing) + 1
    const rails = Math.ceil(v.heightFt / 2) * 2
    const totalRailLength = v.perimeterFt * rails
    const picketsPerFt = 12 / 5.5
    const pickets = Math.ceil(v.perimeterFt * picketsPerFt)
    const concreteBags = Math.ceil(posts * 1.5)
    const gatePosts = v.gates * 2
    const totalPosts = posts + gatePosts
    return { result: totalPosts, label: 'Posts Needed', unit: '', steps: [{ label: 'Line Posts', value: `${posts}` }, { label: 'Gate Posts', value: `${gatePosts}` }, { label: 'Total Posts', value: `${totalPosts}` }, { label: 'Rails Needed', value: `${totalRailLength} ft (${rails} rails)` }, { label: 'Pickets', value: `${pickets}` }, { label: 'Concrete Bags (60lb)', value: `${concreteBags} bags` }] }
  },
  description: 'Calculate materials needed for building a privacy fence: posts, rails, pickets, and concrete. Plan your fencing project accurately.',
  formula: 'Posts = Perimeter/Spacing + 1 + (Gates×2) | Pickets = Perimeter × 12/5.5 | Rails = (Height/2) × 2 × Perimeter',
  interpretation: 'Standard privacy fence: 6 ft tall, 8 ft post spacing, 5.5 in picket width with 0.5 in gap. Each post needs ~1.5 bags of 60lb concrete. Add 10% for waste and mistakes.'
}

export default calcDef
