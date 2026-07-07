import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.enum(['under65','65to74','75plus']), hypertensive: z.enum(['yes','no']), diabetic: z.enum(['yes','no']), stroke: z.enum(['yes','no']), vascularDisease: z.enum(['yes','no']), female: z.enum(['yes','no']), heartFailure: z.enum(['yes','no']) }),
  fields: [{ name:'age', label:'Age', type:'select', options:[{ label:'<65', value:'under65' },{ label:'65-74', value:'65to74' },{ label:'75+', value:'75plus' }] }, { name:'hypertensive', label:'Hypertension', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'diabetic', label:'Diabetes', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'stroke', label:'Stroke/TIA/Thromboembolism', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'vascularDisease', label:'Vascular Disease', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'female', label:'Female Sex', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'heartFailure', label:'Heart Failure', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }],
  compute: (v) => { let pts=0; pts+=v.age==='65to74'?1:0; pts+=v.age==='75plus'?2:0; pts+=v.hypertensive==='yes'?1:0; pts+=v.diabetic==='yes'?1:0; pts+=v.stroke==='yes'?2:0; pts+=v.vascularDisease==='yes'?1:0; pts+=v.female==='yes'?1:0; pts+=v.heartFailure==='yes'?1:0; const rec=pts===0?'No anticoagulation (low risk)':pts===1?'Consider OAC (intermediate)':'Anticoagulation recommended (high risk)'; return { result:pts, label:'CHA₂DS₂-VASc Score', unit:'', steps:[{ label:'Score', value:pts.toString() },{ label:'Recommendation', value:rec }] } },
  description: 'CHA₂DS₂-VASc score for atrial fibrillation stroke risk stratification.',
  formula: 'CHF(1)+HTN(1)+Age≥75(2)/65-74(1)+DM(1)+Stroke(2)+Vascular(1)+Female(1).',
  interpretation: '0: Low risk, no OAC. 1: Consider OAC. ≥2: OAC recommended (direct oral or warfarin).'
}

export default calcDef
