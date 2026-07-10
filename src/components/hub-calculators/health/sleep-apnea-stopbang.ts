import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ snoring: z.string().min(1), tired: z.string().min(1), observed: z.string().min(1), pressure: z.string().min(1), bmi35: z.string().min(1), age50: z.string().min(1), neck40: z.string().min(1), genderMale: z.string().min(1) }),
  fields: [
    { name:'snoring', label:'Snoring (loud enough to be heard through door?)', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'tired', label:'Tired / Sleepy during daytime?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'observed', label:'Observed stop breathing / choking?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'pressure', label:'High blood pressure / on treatment?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'bmi35', label:'BMI > 35 kg/m²?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'age50', label:'Age > 50 years?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'neck40', label:'Neck circumference > 40 cm?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'genderMale', label:'Gender is male?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }
  ],
  compute: (v) => { const score=[v.snoring,v.tired,v.observed,v.pressure,v.bmi35,v.age50,v.neck40,v.genderMale].filter(x=>x==='yes').length; let risk='Low'; if(score>=5) risk='High'; else if(score>=3) risk='Intermediate'; return { result:score, label:'STOP-BANG Score', unit:'/8', steps:[{ label:'Score', value:score+'/8' },{ label:'OSA Risk', value:risk }] } },
  description: 'STOP-BANG screening tool for obstructive sleep apnea risk assessment.',
  formula: 'Score 1 point each for Snoring, Tired, Observed apnea, Pressure, BMI>35, Age>50, Neck>40cm, Male gender.',
  interpretation: '0-2: Low risk. 3-4: Intermediate risk. 5-8: High risk of moderate-severe OSA.'
}
export default calcDef
