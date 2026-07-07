import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), coughDays: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), fever: z.enum(['yes','no']), smoker: z.enum(['yes','no']) }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:1, max:110, step:'1' }, { name:'coughDays', label:'Cough Duration (days)', type:'number', min:0, step:'1' }, { name:'fever', label:'Fever (>38°C)', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'smoker', label:'Smoker', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }],
  compute: (v) => { const a=parseFloat(v.age)||40; const c=parseFloat(v.coughDays)||0; const f=v.fever||'no'; const s=v.smoker||'no'; const rs=(a>60?2:0)+(c>14?2:c>7?1:0)+(f==='yes'?1:0)+(s==='yes'?2:0); const r=rs>=4?'High - CXR/sputum':rs>=2?'Moderate - symptomatic tx':'Low - supportive'; return { result:rs, label:'Bronchitis Risk', unit:'', steps:[{ label:'Score', value:rs.toString() },{ label:'Risk', value:r }] } },
  description: 'Bronchitis risk from age, cough duration, fever, and smoking.',
  formula: 'Age>60(2) + Cough>14d(2)/>7d(1) + Fever(1) + Smoker(2). Range 0-7.',
  interpretation: 'Low (0-1): supportive. Moderate (2-3): bronchodilators. High (≥4): CXR, sputum, consider pneumonia.'
}

export default calcDef
