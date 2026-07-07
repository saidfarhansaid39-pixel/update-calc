import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ carbGrams: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), gi: z.string().min(1,'Required').refine(v=>parseFloat(v)>=1,'≥1') }),
  fields: [{ name:'carbGrams', label:'Available Carbs (g)', type:'number', min:0, step:'1' }, { name:'gi', label:'Glycemic Index (1-100)', type:'number', min:1, max:100, step:'1' }],
  compute: (v) => { const c=parseFloat(v.carbGrams)||0; const gi=parseFloat(v.gi)||55; const gl=c*gi/100; const load=gl<=10?'Low GL':gl<=19?'Medium GL':'High GL'; return { result:gl, label:'Glycemic Load', unit:'', steps:[{ label:'GL = Carbs×GI/100', value:gl.toFixed(1) },{ label:'Classification', value:load }] } },
  description: 'Glycemic load calculation for blood sugar impact estimation of carbohydrate foods.',
  formula: 'GL = (Available Carbs(g) × GI) / 100. Low ≤10, Medium 11-19, High ≥20.',
  interpretation: 'Low GL: minimal blood sugar impact, preferred. High GL: large spike, limit intake. GL more practical than GI alone.'
}

export default calcDef
