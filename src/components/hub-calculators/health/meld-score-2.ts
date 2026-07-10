import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ creatinine: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), bilirubin: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), inr: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), dialysis: z.string().min(1) }),
  fields: [
    { name:'creatinine', label:'Serum Creatinine (mg/dL)', type:'number', min:0.1, max:20, step:'0.1' },
    { name:'bilirubin', label:'Total Bilirubin (mg/dL)', type:'number', min:0.1, max:50, step:'0.1' },
    { name:'inr', label:'INR', type:'number', min:0.5, max:10, step:'0.1' },
    { name:'dialysis', label:'Dialysis ≥2x/week?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }
  ],
  compute: (v) => { const cr=Math.max(parseFloat(v.creatinine)||1,1); const bili=Math.max(parseFloat(v.bilirubin)||1,1); const inr=Math.max(parseFloat(v.inr)||1,1); const dial=v.dialysis==='yes'; const score=9.57*Math.log(cr)+3.78*Math.log(bili)+11.2*Math.log(inr)+(dial?6.43:0); const finalScore=Math.round(score*100)/100; let mortality='<1.9%'; if(finalScore>=40) mortality='>71.3%'; else if(finalScore>=30) mortality='52.6%'; else if(finalScore>=20) mortality='19.6%'; else if(finalScore>=15) mortality='6.4%'; else if(finalScore>=10) mortality='5.6%'; return { result:finalScore, label:'MELD Score', steps:[{ label:'Creatinine Contribution', value:(9.57*Math.log(cr)).toFixed(2) },{ label:'Bilirubin Contribution', value:(3.78*Math.log(bili)).toFixed(2) },{ label:'INR Contribution', value:(11.2*Math.log(inr)).toFixed(2) },{ label:'Dialysis Adjustment', value:dial?'+6.43':'+0' },{ label:'3-Month Mortality', value:mortality }] } },
  description: 'MELD Score (Model for End-Stage Liver Disease) for liver transplant priority assessment.',
  formula: 'MELD = 9.57×ln(Creatinine) + 3.78×ln(Bilirubin) + 11.2×ln(INR) + 6.43×(dialysis).',
  interpretation: 'Higher scores indicate higher 3-month mortality. <10: 1.9%, 10-19: 5.6%, 20-29: 19.6%, 30-39: 52.6%, ≥40: 71.3%.'
}
export default calcDef
