import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), sbp: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), diabetes: z.string().min(1,'Required'), smoking: z.string().min(1,'Required'), afib: z.string().min(1,'Required'), lvh: z.string().min(1,'Required'), cvd: z.string().min(1,'Required') }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:55, max:100, step:'1' }, { name:'sbp', label:'Systolic BP (mmHg)', type:'number', min:60, max:250, step:'1' }, { name:'diabetes', label:'Diabetes', type:'number', min:0, step:'1' }, { name:'smoking', label:'Smoker', type:'number', min:0, step:'1' }, { name:'afib', label:'Atrial Fibrillation', type:'number', min:0, step:'1' }, { name:'lvh', label:'LV Hypertrophy', type:'number', min:0, step:'1' }, { name:'cvd', label:'Prior CVD', type:'number', min:0, step:'1' }],
  compute: (v) => { const age=parseFloat(v.age)||65; const sbp=parseFloat(v.sbp)||140; const dm=parseFloat(v.diabetes)||0; const sm=parseFloat(v.smoking)||0; const af=parseFloat(v.afib)||0; const lvh=parseFloat(v.lvh)||0; const cvd=parseFloat(v.cvd)||0; const score=age>=75?8:age>=65?5:age>=55?3:0+(sbp>=160?4:sbp>=140?2:0)+dm*3+sm*3+af*4+lvh*3+cvd*3; return { result:score, label:'Framingham Stroke Risk Score', steps:[{ label:'Age', value:age.toFixed(0)+' yrs' },{ label:'BP Points', value:(sbp>=160?4:sbp>=140?2:0).toFixed(0) },{ label:'Total Score', value:score.toFixed(0) }] } },
  description: 'Framingham stroke risk profile estimates 10-year risk of stroke based on traditional cardiovascular risk factors.',
  formula: 'Based on Framingham Heart Study cohort. Points assigned for age, SBP, diabetes, smoking, AFib, LVH, prior CVD.',
  interpretation: 'Score 0-3: low risk (<5%), 4-7: moderate risk (5-15%), 8+: high risk (>15%). Discuss prevention strategies including BP control, statins, and lifestyle modifications.'
}
export default calcDef
