import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ crp: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18'), gender: z.enum(['male','female']) }),
  fields: [{ name:'crp', label:'hs-CRP (mg/L)', type:'number', min:0, max:100, step:'0.1' }, { name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }],
  compute: (v) => { const crp=parseFloat(v.crp)||1; const a=parseFloat(v.age)||40; const g=v.gender||'male'; let risk=''; if(crp<1) risk='Low cardiovascular risk (<1 mg/L)'; else if(crp<=3) risk='Average CV risk (1-3 mg/L)'; else risk='High CV risk (>3 mg/L) - consider statin'; const relRisk=crp<1?1:crp<=2?1.5:crp<=3?2:crp<=5?2.5:3; return { result:crp, label:'hs-CRP', unit:'mg/L', steps:[{ label:'CRP Level', value:crp.toFixed(1) },{ label:'CV Risk Category', value:risk },{ label:'Relative Risk Multiplier', value:relRisk.toFixed(1)+'x' }] } },
  description: 'High-sensitivity CRP cardiovascular risk stratification per AHA/CDC.',
  formula: '<1 mg/L: low risk. 1-3: average. >3: high risk. CRP >10 suggests active inflammation, recheck.',
  interpretation: 'hs-CRP adds prognostic info to LDL and Framingham. Statins reduce CRP independent of LDL.'
}

export default calcDef
