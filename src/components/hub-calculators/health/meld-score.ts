import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bilirubin: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), inr: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), creatinine: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0') }),
  fields: [{ name:'bilirubin', label:'Bilirubin (mg/dL)', type:'number', min:0, step:'0.1' }, { name:'inr', label:'INR', type:'number', min:0.5, step:'0.1' }, { name:'creatinine', label:'Creatinine (mg/dL)', type:'number', min:0, step:'0.1' }],
  compute: (v) => { const bili=parseFloat(v.bilirubin)||2; const inr=parseFloat(v.inr)||1.5; const cr=parseFloat(v.creatinine)||1; const b=Math.max(Math.log(bili),0); const i=Math.max(Math.log(inr),0); const c=Math.max(Math.log(cr),0); const meld=3.78*b+11.2*i+9.57*c+6.43; return { result:meld, label:'MELD Score', unit:'', steps:[{ label:'Bilirubin', value:bili.toFixed(1)+' mg/dL' },{ label:'INR', value:inr.toFixed(2) },{ label:'Creatinine', value:cr.toFixed(1)+' mg/dL' },{ label:'MELD Score', value:meld.toFixed(1) }] } },
  description: 'MELD score (Model for End-Stage Liver Disease) predicts 3-month mortality in liver disease patients.',
  formula: 'MELD = 3.78 × ln(bilirubin) + 11.2 × ln(INR) + 9.57 × ln(creatinine) + 6.43. Values <1 log-transformed as 1.',
  interpretation: 'Score 6-40. <10: low mortality; 10-19: moderate; 20-29: high; 30-40: very high. Used for transplant listing priority.'
}

export default calcDef
