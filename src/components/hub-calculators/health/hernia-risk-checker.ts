import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseInt(v)>=18,'>=18'), gender: z.string().min(1), bmi: z.string().min(1,'Required').refine(v=>parseFloat(v)>=10,'>=10'), smoking: z.string().min(1), constipation: z.string().min(1), heavyLifting: z.string().min(1), familyHernia: z.string().min(1), priorHernia: z.string().min(1) }),
  fields: [
    { name:'age', label:'Age (years)', type:'number', min:18, max:100, step:'1' },
    { name:'gender', label:'Gender', type:'select', options:[{ label:'Female', value:'female' },{ label:'Male', value:'male' }] },
    { name:'bmi', label:'BMI (kg/m²)', type:'number', min:10, max:60, step:'0.1' },
    { name:'smoking', label:'Chronic Smoker?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'constipation', label:'Chronic Constipation?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'heavyLifting', label:'Occupation involves heavy lifting?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'familyHernia', label:'Family history of hernia?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'priorHernia', label:'Prior hernia repair?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }
  ],
  compute: (v) => { const a=parseInt(v.age)||45; const bmi=parseFloat(v.bmi)||25; let score=0; if(a>=50) score+=2; else if(a>=40) score+=1; if(v.gender==='male') score+=2; if(bmi>=30) score+=2; else if(bmi>=25) score+=1; if(v.smoking==='yes') score+=1; if(v.constipation==='yes') score+=1; if(v.heavyLifting==='yes') score+=2; if(v.familyHernia==='yes') score+=1; if(v.priorHernia==='yes') score+=2; let risk='Low'; if(score>=8) risk='High'; else if(score>=4) risk='Moderate'; return { result:score, label:'Hernia Risk Score', unit:'/13', steps:[{ label:'Risk Score', value:score+'/13' },{ label:'Risk Category', value:risk }] } },
  description: 'Hernia risk assessment based on demographic, lifestyle, and occupational risk factors.',
  formula: 'Weighted scoring: age, male gender, BMI, smoking, constipation, heavy lifting, family/prior history.',
  interpretation: '0-3 Low risk, 4-7 Moderate risk, 8-13 High risk. Preventive measures recommended for moderate-high risk.'
}
export default calcDef
