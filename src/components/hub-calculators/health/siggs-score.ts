import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), hypotension: z.string().min(1,'Required'), anemia: z.string().min(1,'Required'), diabetes: z.string().min(1,'Required'), contrastVol: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), chf: z.string().min(1,'Required'), ckd: z.string().min(1,'Required') }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:18, max:100, step:'1' }, { name:'hypotension', label:'Hypotension (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }, { name:'anemia', label:'Anemia (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }, { name:'diabetes', label:'Diabetes (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }, { name:'contrastVol', label:'Contrast Volume (mL)', type:'number', min:10, step:'1' }, { name:'chf', label:'CHF (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }, { name:'ckd', label:'CKD (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }],
  compute: (v) => { const age=parseFloat(v.age)||65; const hypo=parseFloat(v.hypotension)||0; const an=parseFloat(v.anemia)||0; const dm=parseFloat(v.diabetes)||0; const cv=parseFloat(v.contrastVol)||100; const chf=parseFloat(v.chf)||0; const ckd=parseFloat(v.ckd)||0; const score=(age>75?4:0)+(hypo?5:0)+(an?3:0)+(dm?3:0)+(cv>200?5:cv>100?3:0)+(chf?3:0)+(ckd?4:0); return { result:score, label:'SIGGS Contrast Nephropathy Risk Score', steps:[{ label:'Age >75', value:(age>75?'4':'0') },{ label:'Total Score', value:score.toFixed(0) }] } },
  description: 'SIGGS score predicts the risk of contrast-induced nephropathy (CIN) after coronary angiography.',
  formula: 'Score = age>75(4) + hypotension(5) + anemia(3) + diabetes(3) + contrast vol>100(3) + CHF(3) + CKD(4).',
  interpretation: 'Score 0-5: low risk (<2% CIN). 6-10: moderate risk (10-20%). 11-15: high risk (25-40%). >15: very high risk (>50%). Hydration and limiting contrast dose reduce risk.'
}
export default calcDef
