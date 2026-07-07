import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ confusion: z.enum(['yes','no']), bun: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), respiratoryRate: z.string().min(1,'Required').refine(v=>parseFloat(v)>=5,'≥5'), systolic: z.string().min(1,'Required').refine(v=>parseFloat(v)>=50,'≥50'), age: z.enum(['under65','65plus']) }),
  fields: [{ name:'confusion', label:'Confusion', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'bun', label:'BUN (mg/dL)', type:'number', min:0, max:200, step:'1' }, { name:'respiratoryRate', label:'Respiratory Rate', type:'number', min:5, max:100, step:'1' }, { name:'systolic', label:'Systolic BP (mmHg)', type:'number', min:50, max:300, step:'1' }, { name:'age', label:'Age', type:'select', options:[{ label:'<65', value:'under65' },{ label:'65+', value:'65plus' }] }],
  compute: (v) => { let pts=0; pts+=v.confusion==='yes'?1:0; pts+=parseFloat(v.bun)>19?1:0; pts+=parseFloat(v.respiratoryRate)>=30?1:0; pts+=parseFloat(v.systolic)<90?1:0; pts+=v.age==='65plus'?1:0; const mort=pts<=1?2.1:pts===2?9.2:pts===3?14.5:pts===4?27.8:40; const rec=pts<=1?'Outpatient':pts===2?'Hospital admission':'ICU admission'; return { result:pts, label:'CURB-65 Score', unit:'', steps:[{ label:'Score (0-5)', value:pts.toString() },{ label:'Mortality', value:mort+'%' },{ label:'Recommendation', value:rec }] } },
  description: 'CURB-65 pneumonia severity score for mortality prediction and disposition.',
  formula: 'Confusion(1)+BUN>19(1)+RR≥30(1)+SBP<90(1)+Age≥65(1). Range 0-5.',
  interpretation: '0-1: 2.1% mortality, outpatient. 2: 9.2%, hospital. ≥3: 14.5-40%, ICU.'
}

export default calcDef
