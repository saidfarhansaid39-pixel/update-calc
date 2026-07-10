import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ neck: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), sex: z.string().min(1,'Required') }),
  fields: [{ name:'neck', label:'Neck Circumference (cm)', type:'number', min:15, step:'0.1' }, { name:'sex', label:'Sex', type:'select', options:[{value:'male',label:'Male'},{value:'female',label:'Female'}] }],
  compute: (v) => { const n=parseFloat(v.neck)||38; const s=v.sex||'male'; const cutoff=s==='male'?39:34; const risk=n>=cutoff?'Elevated':'Normal'; const sleepRisk=s==='male'?n>=43:n>=38; return { result:n, label:'Neck Circumference', unit:'cm', steps:[{ label:'Your Neck', value:n.toFixed(1)+' cm' },{ label:'Obesity Risk Cutoff', value:cutoff+' cm' },{ label:'OSA Risk (>43/38)', value:sleepRisk?'At Risk':'Low Risk' },{ label:'Status', value:risk }] } },
  description: 'Neck circumference is a marker for upper body fat distribution and obstructive sleep apnea risk.',
  formula: 'Neck circumference ≥43 cm (male) or ≥38 cm (female) correlates with sleep apnea risk.',
  interpretation: 'Increased neck circumference is associated with OSA severity. >43 cm (M) or >38 cm (F) warrants sleep evaluation.'
}
export default calcDef