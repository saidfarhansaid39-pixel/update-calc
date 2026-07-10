import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseInt(v)>=40,'>=40'), familyHistory: z.string().min(1), apoe4: z.string().min(1), memoryLoss: z.string().min(1), cognitiveDecline: z.string().min(1), hypertension: z.string().min(1), diabetes: z.string().min(1), headTrauma: z.string().min(1), depression: z.string().min(1), lowEducation: z.string().min(1), smoking: z.string().min(1), physicalInactivity: z.string().min(1) }),
  fields: [
    { name:'age', label:'Age (years)', type:'number', min:40, max:100, step:'1' },
    { name:'familyHistory', label:'Family History of Dementia?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (2)', value:'2' }] },
    { name:'apoe4', label:'APOE ε4 carrier?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (3)', value:'3' }] },
    { name:'memoryLoss', label:'Subjective memory complaints?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (2)', value:'2' }] },
    { name:'cognitiveDecline', label:'Observed cognitive decline by others?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (3)', value:'3' }] },
    { name:'hypertension', label:'Hypertension?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (1)', value:'1' }] },
    { name:'diabetes', label:'Diabetes?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (1)', value:'1' }] },
    { name:'headTrauma', label:'Moderate-Severe Head Trauma history?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (2)', value:'2' }] },
    { name:'depression', label:'Depression history?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (1)', value:'1' }] },
    { name:'lowEducation', label:'Low education (<12 years)?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (1)', value:'1' }] },
    { name:'smoking', label:'Current smoker?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (1)', value:'1' }] },
    { name:'physicalInactivity', label:'Physical inactivity?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (1)', value:'1' }] }
  ],
  compute: (v) => { const a=parseInt(v.age)||60; const agePts=a>=85?4:a>=75?3:a>=65?2:a>=55?1:0; const score=agePts+parseInt(v.familyHistory||'0')+parseInt(v.apoe4||'0')+parseInt(v.memoryLoss||'0')+parseInt(v.cognitiveDecline||'0')+parseInt(v.hypertension||'0')+parseInt(v.diabetes||'0')+parseInt(v.headTrauma||'0')+parseInt(v.depression||'0')+parseInt(v.lowEducation||'0')+parseInt(v.smoking||'0')+parseInt(v.physicalInactivity||'0'); let risk='Low'; if(score>=14) risk='High'; else if(score>=8) risk='Moderate'; return { result:score, label:'Alzheimer\'s Risk Score', unit:'/25', steps:[{ label:'Age Points', value:agePts+'/4' },{ label:'Risk Factor Points', value:score-agePts+'/21' },{ label:'Total Score', value:score+'/25' },{ label:'Risk Level', value:risk }] } },
  description: 'Alzheimer\'s disease risk screening based on modifiable and non-modifiable risk factors.',
  formula: 'Weighted score: age + family history + APOE4 + subjective/objective decline + vascular risk factors + lifestyle.',
  interpretation: '0-7 Low risk, 8-13 Moderate risk, 14-25 High risk. Modifiable factors (HTN, diabetes, smoking) are actionable.'
}
export default calcDef
