import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ confusion: z.string().min(1,'Required'), bun: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), rr: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), sbp: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'confusion', label:'Confusion (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }, { name:'bun', label:'BUN (mg/dL)', type:'number', min:0, step:'1' }, { name:'rr', label:'Resp Rate (breaths/min)', type:'number', min:10, max:60, step:'1' }, { name:'sbp', label:'Systolic BP (mmHg)', type:'number', min:50, max:250, step:'1' }, { name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }],
  compute: (v) => { const conf=parseFloat(v.confusion)||0; const bun=parseFloat(v.bun)||15; const rr=parseFloat(v.rr)||20; const sbp=parseFloat(v.sbp)||120; const age=parseFloat(v.age)||65; const score=(conf?1:0)+(bun>19?1:0)+(rr>=30?1:0)+(sbp<90?1:0)+(age>=65?1:0); return { result:score, label:'CURB-65 Score', steps:[{ label:'Confusion', value:(conf?'1':'0') },{ label:'BUN>19', value:(bun>19?'1':'0') },{ label:'RR≥30', value:(rr>=30?'1':'0') },{ label:'SBP<90', value:(sbp<90?'1':'0') },{ label:'Age≥65', value:(age>=65?'1':'0') },{ label:'Total', value:score.toFixed(0)+'/5' }] } },
  description: 'CURB-65 is a simple severity score for community-acquired pneumonia predicting 30-day mortality.',
  formula: 'Score = Confusion(1) + BUN>19mg/dL(1) + RR≥30(1) + SBP<90(1) + Age≥65(1). Range 0-5.',
  interpretation: 'Score 0-1: low risk (3% mortality), outpatient management. Score 2: moderate risk (9%), hospitalize or observe. Score ≥3: severe (15-50%), hospitalize, consider ICU.'
}
export default calcDef
