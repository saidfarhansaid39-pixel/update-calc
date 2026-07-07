import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18'), bmi: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), albumin: z.string().min(1,'Required').refine(v=>parseFloat(v)>=1,'≥1'), steroids: z.enum(['yes','no']), smoking: z.enum(['yes','no']), emergency: z.enum(['yes','no']) }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }, { name:'bmi', label:'BMI', type:'number', min:10, max:60, step:'0.5' }, { name:'albumin', label:'Albumin (g/dL)', type:'number', min:1, max:6, step:'0.1' }, { name:'steroids', label:'Chronic Steroid Use', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'smoking', label:'Current Smoker', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'emergency', label:'Emergency Surgery', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }],
  compute: (v) => { const a=parseFloat(v.age)||40; const bmi=parseFloat(v.bmi)||25; const alb=parseFloat(v.albumin)||3.5; const st=v.steroids||'no'; const sm=v.smoking||'no'; const em=v.emergency||'no'; const score=(a>65?2:a>50?1:0)+(bmi>30?2:bmi>25?1:0)+(alb<3?2:alb<3.5?1:0)+(st==='yes'?2:0)+(sm==='yes'?2:0)+(em==='yes'?2:0); const risk=score>=8?'High risk - consider protective ostomy':score>=4?'Moderate - optimize nutrition preop':'Low risk'; return { result:score, label:'Anastomotic Leak Risk', unit:'', steps:[{ label:'Age', value:(a>65?2:a>50?1:0).toString() },{ label:'BMI', value:(bmi>30?2:bmi>25?1:0).toString() },{ label:'Albumin', value:(alb<3?2:alb<3.5?1:0).toString() },{ label:'Steroids', value:(st==='yes'?2:0).toString() },{ label:'Smoking', value:(sm==='yes'?2:0).toString() },{ label:'Emergency', value:(em==='yes'?2:0).toString() },{ label:'Total', value:score.toString() }] } },
  description: 'Postoperative anastomotic leak/fistula risk assessment for GI surgery.',
  formula: 'Risk score: Age+BMI+Albumin+Steroids+Smoking+Emergency Surgery. Range 0-12.',
  interpretation: '≥4: moderate risk, optimize albumin >3.5. ≥8: high risk, consider diverting ostomy.'
}

export default calcDef
