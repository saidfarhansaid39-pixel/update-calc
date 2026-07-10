import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bun: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), cr: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), urineOutput: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), potassium: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), ph: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'bun', label:'BUN (mg/dL)', type:'number', min:0, step:'1' }, { name:'cr', label:'Creatinine (mg/dL)', type:'number', min:0, step:'0.1' }, { name:'urineOutput', label:'Urine Output (mL/24h)', type:'number', min:0, step:'10' }, { name:'potassium', label:'Potassium (mEq/L)', type:'number', min:2, max:9, step:'0.1' }, { name:'ph', label:'Arterial pH', type:'number', min:6.8, max:7.6, step:'0.01' }],
  compute: (v) => { const bun=parseFloat(v.bun)||60; const cr=parseFloat(v.cr)||4; const uo=parseFloat(v.urineOutput)||500; const k=parseFloat(v.potassium)||5; const ph=parseFloat(v.ph)||7.3; let criteria=0; if(bun>100)criteria++; if(cr>4)criteria++; if(uo<400)criteria++; if(k>6)criteria++; if(ph<7.2)criteria++; const rrtIndicated=criteria>=2; return { result:rrtIndicated?1:0, label:'RRT Indicated?', steps:[{ label:'BUN>100', value:(bun>100?'Yes':'No') },{ label:'Cr>4', value:(cr>4?'Yes':'No') },{ label:'UO<400 mL/24h', value:(uo<400?'Yes':'No') },{ label:'K+>6', value:(k>6?'Yes':'No') },{ label:'pH<7.2', value:(ph<7.2?'Yes':'No') },{ label:'Criteria Met', value:criteria.toFixed(0)+'/5' },{ label:'RRT Recommendation', value:rrtIndicated?'RRT Indicated':'May Consider Medical Management' }] } },
  description: 'Renal replacement therapy assessment evaluates need for dialysis based on AKI criteria.',
  formula: 'Criteria: severe azotemia (BUN>100), Cr>4, oliguria (<400 mL/d), hyperkalemia (>6), severe acidosis (pH<7.2). ≥2 criteria suggests RRT.',
  interpretation: '≥2 criteria: RRT is indicated. Consider hemodialysis, CRRT, or peritoneal dialysis based on hemodynamic stability. Timing also considers trajectory of illness, not just absolute values.'
}
export default calcDef
