import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseInt(v)>=13,'>=13'), gender: z.string().min(1), partners: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'>=0'), condomUse: z.string().min(1), stdHistory: z.string().min(1), ivDrugUse: z.string().min(1), msm: z.string().min(1), symptoms: z.string().min(1) }),
  fields: [
    { name:'age', label:'Age (years)', type:'number', min:13, max:100, step:'1' },
    { name:'gender', label:'Gender', type:'select', options:[{ label:'Female', value:'female' },{ label:'Male', value:'male' }] },
    { name:'partners', label:'Sexual Partners (past 12 months)', type:'number', min:0, max:100, step:'1' },
    { name:'condomUse', label:'Consistent Condom Use?', type:'select', options:[{ label:'Always', value:'always' },{ label:'Sometimes', value:'sometimes' },{ label:'Never', value:'never' }] },
    { name:'stdHistory', label:'Prior STI History?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'ivDrugUse', label:'IV Drug Use?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'msm', label:'Male who has sex with men?', type:'select', options:[{ label:'Not applicable', value:'na' },{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'symptoms', label:'Any symptoms (discharge, sores, burning, rash)?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }
  ],
  compute: (v) => { let score=0; const age=parseInt(v.age)||25; if(age<25) score+=2; const partners=parseInt(v.partners)||0; if(partners>=2) score+=2; else if(partners==1) score+=1; if(v.condomUse==='never') score+=3; else if(v.condomUse==='sometimes') score+=1; if(v.stdHistory==='yes') score+=3; if(v.ivDrugUse==='yes') score+=3; if(v.msm==='yes') score+=2; if(v.symptoms==='yes') score+=4; let risk='Low'; if(score>=10) risk='High'; else if(score>=5) risk='Moderate'; return { result:score, label:'STI Risk Score', unit:'/20', steps:[{ label:'Risk Score', value:score+'/20' },{ label:'Risk Category', value:risk },{ label:'Recommendation', value:risk==='High'?'Testing recommended immediately':risk==='Moderate'?'Consider STI screening':'Routine screening per guidelines' }] } },
  description: 'STD/STI risk screening tool based on sexual health history and behavioral risk factors.',
  formula: 'Weighted scoring: age<25(2), partners(1-2), condom use(1-3), prior STI(3), IV drugs(3), MSM(2), symptoms(4).',
  interpretation: '0-4 Low risk, 5-9 Moderate risk, 10-20 High risk. High risk + symptoms warrants immediate testing.'
}
export default calcDef
