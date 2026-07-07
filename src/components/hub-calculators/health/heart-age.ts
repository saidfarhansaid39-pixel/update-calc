import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18'), systolic: z.string().min(1,'Required').refine(v=>parseFloat(v)>=60,'≥60'), bmi: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), smoker: z.enum(['yes','no']), diabetic: z.enum(['yes','no']), gender: z.enum(['male','female']) }),
  fields: [{ name:'age', label:'Age', type:'number', min:18, max:100, step:'1' }, { name:'systolic', label:'Systolic BP', type:'number', min:60, max:300, step:'1' }, { name:'bmi', label:'BMI', type:'number', min:10, max:60, step:'0.5' }, { name:'smoker', label:'Smoker', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'diabetic', label:'Diabetic', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }],
  compute: (v) => { const a=parseFloat(v.age)||40; const sbp=parseFloat(v.systolic)||120; const bmi=parseFloat(v.bmi)||25; const sm=v.smoker||'no'; const dm=v.diabetic||'no'; const g=v.gender||'male'; const riskScore=((sbp-120)/20*2)+((bmi-25)/5*2)+(sm==='yes'?4:0)+(dm==='yes'?3:0)+(g==='male'?2:0); const heartAge=a+riskScore; return { result:heartAge, label:'Heart Age', unit:'years', steps:[{ label:'Chronological Age', value:a.toString() },{ label:'Risk Factor Points', value:riskScore.toString() },{ label:'Heart Age', value:heartAge.toString() }] } },
  description: 'Heart age estimate based on cardiovascular risk factor burden (adapted from Framingham).',
  formula: 'Heart Age = Chronological Age + Risk Points (BP+BMI+Smoking+Diabetes+Gender).',
  interpretation: 'Heart age > actual age: elevated CVD risk. Reducing risk factors (quit smoking, lower BP/BMI) reduces heart age.'
}

export default calcDef
