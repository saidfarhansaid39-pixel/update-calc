import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ calcium: z.string().min(1,'Required').refine(v=>parseFloat(v)>=5,'≥5'), albumin: z.string().min(1,'Required').refine(v=>parseFloat(v)>=1,'≥1') }),
  fields: [{ name:'calcium', label:'Total Calcium (mg/dL)', type:'number', min:5, max:20, step:'0.1' }, { name:'albumin', label:'Albumin (g/dL)', type:'number', min:1, max:7, step:'0.1' }],
  compute: (v) => { const ca=parseFloat(v.calcium)||9; const alb=parseFloat(v.albumin)||4; const corrected=ca+0.8*(4-alb); return { result:corrected, label:'Corrected Calcium', unit:'mg/dL', steps:[{ label:'Total Calcium', value:ca.toFixed(1) },{ label:'Albumin', value:alb.toFixed(1) },{ label:'Corrected = Ca + 0.8×(4-Alb)', value:corrected.toFixed(2) }] } },
  description: 'Corrected calcium for hypoalbuminemia using the Payne formula.',
  formula: 'Corrected Ca (mg/dL) = Total Ca + 0.8×(4 - albumin). Normal total Ca: 8.5-10.5.',
  interpretation: 'Corrects for falsely low total calcium in hypoalbuminemia. Ionized calcium is gold standard.'
}

export default calcDef
