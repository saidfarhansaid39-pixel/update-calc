import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ predialysisBUN: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), postdialysisBUN: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), dialysisDuration: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'predialysisBUN', label:'Pre-dialysis BUN (mg/dL)', type:'number', min:0, step:'1' }, { name:'postdialysisBUN', label:'Post-dialysis BUN (mg/dL)', type:'number', min:0, step:'1' }, { name:'dialysisDuration', label:'Dialysis Duration (hours)', type:'number', min:1, max:6, step:'0.5' }],
  compute: (v) => { const pre=parseFloat(v.predialysisBUN)||60; const post=parseFloat(v.postdialysisBUN)||20; const t=parseFloat(v.dialysisDuration)||4; const rr=pre/post; const ktV=-Math.log(rr-0.008*t)+(4-3.5*rr)*0.55/t; return { result:ktV, label:'Kt/V', unit:'', steps:[{ label:'Urea Reduction Ratio', value:(100*(1-1/rr)).toFixed(1)+'%' },{ label:'Kt/V (Daugirdas)', value:ktV.toFixed(3) }] } },
  description: 'Kt/V measures hemodialysis adequacy using urea kinetics (Daugirdas formula).',
  formula: 'Kt/V = -ln(R - 0.008 × t) + (4 - 3.5 × R) × 0.55/t, where R = pre-BUN / post-BUN.',
  interpretation: 'Minimum adequate: Kt/V ≥1.2 (thrice-weekly hemodialysis). Target: Kt/V 1.4-1.6.'
}

export default calcDef
