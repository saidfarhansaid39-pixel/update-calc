import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.enum(['under75','75plus']), hypertensive: z.enum(['yes','no']), diabetic: z.enum(['yes','no']), stroke: z.enum(['yes','no']), heartFailure: z.enum(['yes','no']) }),
  fields: [{ name:'age', label:'Age', type:'select', options:[{ label:'<75', value:'under75' },{ label:'75+', value:'75plus' }] }, { name:'hypertensive', label:'HTN', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'diabetic', label:'DM', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'stroke', label:'Stroke/TIA', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'heartFailure', label:'CHF', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }],
  compute: (v) => { let pts=0; pts+=v.age==='75plus'?1:0; pts+=v.hypertensive==='yes'?1:0; pts+=v.diabetic==='yes'?1:0; pts+=v.stroke==='yes'?2:0; pts+=v.heartFailure==='yes'?1:0; const risk=pts===0?'Low (0% annual stroke)':pts===1?'Moderate (1.3%)':'High (>2.2%)'; return { result:pts, label:'CHADS₂ Score', unit:'', steps:[{ label:'Score', value:pts.toString() },{ label:'Stroke Risk', value:risk }] } },
  description: 'CHADS₂ score for AF stroke risk - predecessor to CHA₂DS₂-VASc.',
  formula: 'CHF(1)+HTN(1)+Age≥75(1)+DM(1)+Stroke(2). Range 0-6.',
  interpretation: '0: Low (0% annual); 1: Moderate (1.3%); ≥2: High (2.2%+). OAC recommended for ≥2.'
}

export default calcDef
