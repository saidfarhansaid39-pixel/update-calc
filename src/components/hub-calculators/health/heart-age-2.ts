import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), sbp: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), bmi: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), smoking: z.string().min(1,'Required'), diabetes: z.string().min(1,'Required') }),
  fields: [{ name:'age', label:'Your Age (years)', type:'number', min:30, max:90, step:'1' }, { name:'sbp', label:'Systolic BP (mmHg)', type:'number', min:80, max:220, step:'1' }, { name:'bmi', label:'BMI (kg/m²)', type:'number', min:15, max:50, step:'0.1' }, { name:'smoking', label:'Smoker (1=Yes, 0=No)', type:'number', min:0, max:1, step:'1' }, { name:'diabetes', label:'Diabetic (1=Yes, 0=No)', type:'number', min:0, max:1, step:'1' }],
  compute: (v) => { const a=parseFloat(v.age)||50; const sbp=parseFloat(v.sbp)||130; const bmi=parseFloat(v.bmi)||27; const sm=parseFloat(v.smoking)||0; const dm=parseFloat(v.diabetes)||0; const riskFactor=((sbp-120)/20)*2+(bmi>25?3:0)+sm*5+dm*4; const heartAge=a+riskFactor; return { result:heartAge, label:'Estimated Heart Age', unit:'years', steps:[{ label:'Chronological Age', value:a.toFixed(0)+' yrs' },{ label:'Risk Factor Adjustment', value:'+'+(heartAge-a).toFixed(0)+' yrs' },{ label:'Heart Age', value:heartAge.toFixed(0)+' yrs' }] } },
  description: 'Heart age estimates the biological age of your cardiovascular system compared to your chronological age.',
  formula: 'Heart Age = Chronological Age + risk factor adjustments based on BP, BMI, smoking, and diabetes status.',
  interpretation: 'A heart age higher than chronological age indicates elevated cardiovascular risk. Ideally heart age ≤ chronological age. Every 5-year excess increases CVD event risk by ~20%.'
}
export default calcDef
