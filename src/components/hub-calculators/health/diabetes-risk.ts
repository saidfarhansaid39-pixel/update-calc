import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18'), bmi: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), waist: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), familyHistory: z.enum(['yes','no']), hypertension: z.enum(['yes','no']), physicalActivity: z.enum(['sedentary','moderate','active']) }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }, { name:'bmi', label:'BMI', type:'number', min:10, max:60, step:'0.5' }, { name:'waist', label:'Waist Circumference (cm)', type:'number', min:40, step:'0.5' }, { name:'familyHistory', label:'Family History of DM', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'hypertension', label:'Hypertension', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'physicalActivity', label:'Physical Activity', type:'select', options:[{ label:'Sedentary', value:'sedentary' },{ label:'Moderate', value:'moderate' },{ label:'Active', value:'active' }] }],
  compute: (v) => { const a=parseFloat(v.age)||40; const bmi=parseFloat(v.bmi)||25; const w=parseFloat(v.waist)||80; const f=v.familyHistory||'no'; const htn=v.hypertension||'no'; const pa=v.physicalActivity||'moderate'; const score=(a>45?3:a>35?2:0)+(bmi>30?3:bmi>25?2:0)+(w>102||w>88?2:0)+(f==='yes'?2:0)+(htn==='yes'?2:0)+(pa==='sedentary'?1:0); const risk=score>=8?'High (ADA risk test)':score>=4?'Moderate - screen with HbA1c/FPG':'Low - lifestyle maintenance'; return { result:score, label:'Diabetes Risk Score', unit:'', steps:[{ label:'Age', value:(a>45?3:a>35?2:0).toString() },{ label:'BMI', value:(bmi>30?3:bmi>25?2:0).toString() },{ label:'Waist', value:(w>102||w>88?2:0).toString() },{ label:'Family Hx', value:(f==='yes'?2:0).toString() },{ label:'HTN', value:(htn==='yes'?2:0).toString() },{ label:'Inactivity', value:(pa==='sedentary'?1:0).toString() },{ label:'Total', value:score.toString() }] } },
  description: 'Type 2 diabetes risk assessment using ADA risk factors.',
  formula: 'Score = Age + BMI + Waist + Family Hx + HTN + Inactivity. Range 0-13.',
  interpretation: 'Low <4: healthy lifestyle. Moderate 4-7: screen q3yr. High ≥8: screen now (FPG/HbA1c).'
}

export default calcDef
