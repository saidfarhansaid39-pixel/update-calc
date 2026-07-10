import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseInt(v)>=18,'>=18'), wbc: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), glucose: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), ast: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), ldh: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0') }),
  fields: [
    { name:'age', label:'Age (years)', type:'number', min:18, max:100, step:'1' },
    { name:'wbc', label:'WBC Count (×10³/µL)', type:'number', min:0, max:100, step:'0.1' },
    { name:'glucose', label:'Serum Glucose (mg/dL)', type:'number', min:0, max:800, step:'1' },
    { name:'ast', label:'AST (U/L)', type:'number', min:0, max:2000, step:'1' },
    { name:'ldh', label:'LDH (U/L)', type:'number', min:0, max:5000, step:'1' }
  ],
  compute: (v) => { const a=parseInt(v.age)||45; const w=parseFloat(v.wbc)||10; const g=parseFloat(v.glucose)||100; const ast=parseFloat(v.ast)||40; const ldh=parseFloat(v.ldh)||200; let score=0; if(a>55)score++; if(w>16)score++; if(g>200)score++; if(ast>250)score++; if(ldh>350)score++; let sev='Mild'; if(score>=4) sev='Severe'; else if(score>=2) sev='Moderate'; return { result:score, label:'Ranson Criteria (Admission)', unit:'/5', steps:[{ label:'Admission Score', value:score+'/5' },{ label:'Predicted Severity', value:sev }] } },
  description: 'Ranson admission criteria for acute pancreatitis severity assessment (first 5 of 11 criteria).',
  formula: 'Age>55 + WBC>16K + Glucose>200 + AST>250 + LDH>350. Range 0-5.',
  interpretation: '0-1 Mild pancreatitis (<1% mortality), 2-3 Moderate (10-15%), 4-5 Severe (>40% mortality).'
}
export default calcDef
