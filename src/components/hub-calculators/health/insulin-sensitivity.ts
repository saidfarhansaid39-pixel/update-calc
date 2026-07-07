import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ fastingGlucose: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), fastingInsulin: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), gender: z.string().min(1,'Required'), bmi: z.string().min(1,'Required') }),
  fields: [{ name:'fastingGlucose', label:'Fasting Glucose (mg/dL)', type:'number', min:0, step:'1' }, { name:'fastingInsulin', label:'Fasting Insulin (µIU/mL)', type:'number', min:0, step:'0.1' }, { name:'gender', label:'Gender', type:'select', options:[{value:'male',label:'Male'},{value:'female',label:'Female'}] }, { name:'bmi', label:'BMI (kg/m²)', type:'number', min:0, step:'0.1' }],
  compute: (v) => { const g=parseFloat(v.fastingGlucose)||90; const i=parseFloat(v.fastingInsulin)||10; const homa=(g*i)/405; const q=1/(Math.log(g)+Math.log(i)); const st=homa<1?'Normal (optimal)':homa<2?'Normal':homa<3?'Early IR':'Moderate-severe IR'; const qst=q>0.379?'Normal':q>0.357?'Reduced':'Severe IR'; return { result:homa, label:'HOMA-IR', unit:'', steps:[{ label:'Glucose', value:g.toString()+' mg/dL' },{ label:'Insulin', value:i.toFixed(1)+' µIU/mL' },{ label:'HOMA-IR', value:homa.toFixed(2) },{ label:'QUICKI', value:q.toFixed(4)+' ('+qst+')' }] } },
  description: 'Insulin sensitivity assessment using HOMA-IR and QUICKI indices for metabolic evaluation.',
  formula: 'HOMA-IR = (Glucose×Insulin)/405. QUICKI = 1/(log(G)+log(I)). Normal HOMA-IR: <2.0.',
  interpretation: 'HOMA-IR >2.5: insulin resistance. QUICKI <0.357: reduced sensitivity. Lifestyle intervention ± metformin for IR.'
}

export default calcDef
