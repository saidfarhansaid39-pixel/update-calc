import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'>=0'), gender: z.string().min(1), priorUti: z.string().min(1), catheter: z.string().min(1), diabetes: z.string().min(1), pregnancy: z.string().min(1), sexualActivity: z.string().min(1), symptoms: z.string().min(1) }),
  fields: [
    { name:'age', label:'Age (years)', type:'number', min:0, max:120, step:'1' },
    { name:'gender', label:'Gender', type:'select', options:[{ label:'Female', value:'female' },{ label:'Male', value:'male' }] },
    { name:'priorUti', label:'Prior UTI in past 12 months?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'catheter', label:'Indwelling urinary catheter?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'diabetes', label:'Diabetes mellitus?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'pregnancy', label:'Currently pregnant?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'sexualActivity', label:'Sexually active?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'symptoms', label:'Dysuria / frequency / urgency?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }
  ],
  compute: (v) => { let score=0; if(v.gender==='female') score+=3; if(parseInt(v.age)||0) score+=Math.min(3,Math.floor((parseInt(v.age)||30)/20)); if(v.priorUti==='yes') score+=2; if(v.catheter==='yes') score+=3; if(v.diabetes==='yes') score+=2; if(v.pregnancy==='yes') score+=2; if(v.sexualActivity==='yes') score+=1; if(v.symptoms==='yes') score+=4; let risk='Low'; if(score>=12) risk='High'; else if(score>=7) risk='Moderate'; return { result:score, label:'UTI Risk Score', unit:'/20', steps:[{ label:'Risk Score', value:score+'/20' },{ label:'Risk Category', value:risk }] } },
  description: 'Urinary tract infection risk assessment based on demographic and clinical risk factors.',
  formula: 'Weighted scoring: female gender, age, prior UTI, catheter, diabetes, pregnancy, sexual activity, symptoms.',
  interpretation: '0-6 Low risk, 7-11 Moderate risk, 12-20 High risk of UTI. Symptoms + risk factors warrant urinalysis.'
}
export default calcDef
