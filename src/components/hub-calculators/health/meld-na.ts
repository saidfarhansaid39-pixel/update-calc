import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bilirubin: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), inr: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), creatinine: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), sodium: z.string().min(1,'Required').refine(v=>parseFloat(v)>=100,'>=100') }),
  fields: [{ name:'bilirubin', label:'Bilirubin (mg/dL)', type:'number', min:0, step:'0.1' }, { name:'inr', label:'INR', type:'number', min:0.5, step:'0.1' }, { name:'creatinine', label:'Creatinine (mg/dL)', type:'number', min:0, step:'0.1' }, { name:'sodium', label:'Sodium (mEq/L)', type:'number', min:100, max:180, step:'1' }],
  compute: (v) => { const bili=parseFloat(v.bilirubin)||2; const inr=parseFloat(v.inr)||1.5; const cr=parseFloat(v.creatinine)||1; const na=parseFloat(v.sodium)||140; const b=Math.max(Math.log(bili),0); const i=Math.max(Math.log(inr),0); const c=Math.max(Math.log(cr),0); const n=Math.max(Math.min(na,140),125); const meld=3.78*b+11.2*i+9.57*c+6.43; const meldNa=meld+1.32*(140-n)-0.033*meld*(140-n); return { result:meldNa, label:'MELD-Na Score', unit:'', steps:[{ label:'Bilirubin', value:bili.toFixed(1)+' mg/dL' },{ label:'INR', value:inr.toFixed(2) },{ label:'Creatinine', value:cr.toFixed(1)+' mg/dL' },{ label:'Sodium', value:na.toFixed(0)+' mEq/L' },{ label:'MELD', value:meld.toFixed(1) },{ label:'MELD-Na', value:meldNa.toFixed(1) }] } },
  description: 'MELD-Na score predicts 3-month mortality in end-stage liver disease patients awaiting transplant (updated with sodium).',
  formula: 'MELD = 3.78×ln(bili) + 11.2×ln(INR) + 9.57×ln(cr) + 6.43. MELD-Na = MELD + 1.32×(140-Na) - 0.033×MELD×(140-Na).',
  interpretation: 'Score range 6-40. Higher=worse prognosis. >25: high mortality. >30: urgent listing. Na<125 capped at 125, Na>140 capped at 140.'
}

export default calcDef
