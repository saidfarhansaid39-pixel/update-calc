import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18'), diabetes: z.enum(['yes','no']), smoker: z.enum(['yes','no']), uvExposure: z.enum(['low','moderate','high']) }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }, { name:'diabetes', label:'Diabetes', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'smoker', label:'Smoker', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'uvExposure', label:'UV Exposure', type:'select', options:[{ label:'Low', value:'low' },{ label:'Moderate', value:'moderate' },{ label:'High', value:'high' }] }],
  compute: (v) => { const a=parseFloat(v.age)||40; const dm=v.diabetes||'no'; const sm=v.smoker||'no'; const uv=v.uvExposure||'moderate'; const risk=(a>60?3:a>40?1:0)+(dm==='yes'?3:0)+(sm==='yes'?2:0)+(uv==='high'?2:uv==='moderate'?1:0); const cat=risk>=6?'High risk - ophthalmology eval':risk>=3?'Moderate risk - monitor':'Low risk'; return { result:risk, label:'Cataract Risk Score', unit:'', steps:[{ label:'Age', value:(a>60?3:a>40?1:0).toString() },{ label:'Diabetes', value:(dm==='yes'?3:0).toString() },{ label:'Smoker', value:(sm==='yes'?2:0).toString() },{ label:'UV', value:(uv==='high'?2:uv==='moderate'?1:0).toString() },{ label:'Total', value:risk.toString() }] } },
  description: 'Cataract risk assessment from age, diabetes, smoking, and UV exposure.',
  formula: 'Score = Age>60(3)/>40(1) + Diabetes(3) + Smoker(2) + UV High(2)/Mod(1).',
  interpretation: 'Low <3: routine eye exams. Moderate 3-5: annual monitoring. High ≥6: ophthalmology referral.'
}

export default calcDef
