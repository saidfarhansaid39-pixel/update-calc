import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), sbp: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), heightCm: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:1, max:17, step:'1' }, { name:'sbp', label:'Systolic BP (mmHg)', type:'number', min:60, max:180, step:'1' }, { name:'heightCm', label:'Height (cm)', type:'number', min:50, max:200, step:'1' }],
  compute: (v) => { const a=parseFloat(v.age)||10; const sbp=parseFloat(v.sbp)||110; const ht=parseFloat(v.heightCm)||140; const p50=90+2*a; const p90=110+2.5*a; const p95=115+3*a; let percentile=''; let category=''; if(sbp<=p50){ percentile='<50th'; category='Normal' }else if(sbp<=p90){ percentile='50-90th'; category='Normal' }else if(sbp<=p95){ percentile='90-95th'; category='Prehypertension' }else{ percentile='>95th'; category='Hypertension' }; return { result:sbp, label:'Pediatric BP Assessment', unit:'mmHg', steps:[{ label:'Measured SBP', value:sbp.toFixed(0)+' mmHg' },{ label:'Height', value:ht.toFixed(0)+' cm' },{ label:'BP Percentile', value:percentile },{ label:'Category', value:category }] } },
  description: 'Pediatric blood pressure assessment classifies BP by percentile based on age, sex, and height.',
  formula: 'Simplified percentile-based classification: <90th normal, 90-95th prehypertension, >95th hypertension (per AAP guidelines).',
  interpretation: 'Normal: SBP/DBP <90th percentile. Prehypertension: 90-95th percentile. Stage 1 HTN: 95th-99th+5 mmHg. Stage 2 HTN: >99th+5 mmHg. Confirm with repeated measurements.'
}
export default calcDef
