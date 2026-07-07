import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.enum(['under65','65to74','75plus']), hypertensive: z.enum(['yes','no']), diabetic: z.enum(['yes','no']), stroke: z.enum(['yes','no']), vascularDisease: z.enum(['yes','no']), female: z.enum(['yes','no']), heartFailure: z.enum(['yes','no']) }),
  fields: [{ name:'age', label:'Age', type:'select', options:[{ label:'<65', value:'under65' },{ label:'65-74', value:'65to74' },{ label:'75+', value:'75plus' }] }, { name:'hypertensive', label:'HTN', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'diabetic', label:'DM', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'stroke', label:'Stroke/TIA', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'vascularDisease', label:'Vascular Disease', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'female', label:'Female Sex', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'heartFailure', label:'CHF', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }],
  compute: (v) => { let pts=0; pts+=v.age==='65to74'?1:2; pts+=v.hypertensive==='yes'?1:0; pts+=v.diabetic==='yes'?1:0; pts+=v.stroke==='yes'?2:0; pts+=v.vascularDisease==='yes'?1:0; pts+=v.female==='yes'?1:0; pts+=v.heartFailure==='yes'?1:0; const rec=pts===0?'No therapy':pts===1?'Consider OAC':'OAC recommended'; return { result:pts, label:'CHA₂DS₂-VASc', unit:'', steps:[{ label:'Score', value:pts.toString() },{ label:'Management', value:rec }] } },
  description: 'CHA₂DS₂-VASc for AF stroke risk and anticoagulation decision.',
  formula: 'CHF(1)+HTN(1)+Age≥75(2)/65-74(1)+DM(1)+Stroke(2)+Vasc(1)+Female(1). Range 0-9.',
  interpretation: '0: Low, no OAC. 1: Consider OAC. ≥2: OAC recommended (NOAC or warfarin).'
}

export default calcDef
