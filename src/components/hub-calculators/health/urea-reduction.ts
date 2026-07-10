import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ preBun: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), postBun: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'preBun', label:'Pre-Hemodialysis BUN (mg/dL)', type:'number', min:10, step:'1' }, { name:'postBun', label:'Post-Hemodialysis BUN (mg/dL)', type:'number', min:1, step:'1' }],
  compute: (v) => { const pre=parseFloat(v.preBun)||80; const post=parseFloat(v.postBun)||30; const urr=(pre-post)/pre*100; return { result:urr, label:'Urea Reduction Ratio', unit:'%', steps:[{ label:'Pre-BUN', value:pre.toFixed(0)+' mg/dL' },{ label:'Post-BUN', value:post.toFixed(0)+' mg/dL' },{ label:'URR', value:urr.toFixed(1)+'%' }] } },
  description: 'Urea reduction ratio measures the adequacy of hemodialysis by quantifying urea clearance.',
  formula: 'URR = (Pre-BUN - Post-BUN) / Pre-BUN × 100%',
  interpretation: 'Adequate dialysis: URR ≥65% (per KDOQI guidelines). URR <65%: inadequate dialysis. Target corresponds to Kt/V ~1.2. Causes of inadequate URR: access dysfunction, shortened time, recirculation.'
}
export default calcDef
