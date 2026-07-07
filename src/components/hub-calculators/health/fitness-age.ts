import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18'), restHR: z.string().min(1,'Required').refine(v=>parseFloat(v)>=30,'≥30'), bmi: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), activityDays: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), gender: z.enum(['male','female']) }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:18, max:90, step:'1' }, { name:'restHR', label:'Resting HR (bpm)', type:'number', min:30, max:150, step:'1' }, { name:'bmi', label:'BMI', type:'number', min:10, max:60, step:'0.5' }, { name:'activityDays', label:'Active Days/Week', type:'number', min:0, max:7, step:'1' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }],
  compute: (v) => { const a=parseFloat(v.age)||40; const hr=parseFloat(v.restHR)||70; const bmi=parseFloat(v.bmi)||25; const ad=parseFloat(v.activityDays)||3; const fitnessScore=(hr>80?-5:hr>70?-2:hr<60?3:0)+(bmi>30?-5:bmi>25?-2:bmi<22?3:0)+(ad>=5?5:ad>=3?2:ad>=1?0:-3); const fitAge=a-fitnessScore; return { result:fitAge, label:'Fitness Age', unit:'years', steps:[{ label:'Chronological Age', value:a.toString() },{ label:'Fitness Adjustment', value:(fitnessScore>=0?'+':'')+fitnessScore.toString() },{ label:'Fitness Age', value:fitAge.toString() }] } },
  description: 'Fitness age estimate from resting HR, BMI, and activity level compared to chronological age.',
  formula: 'Fitness Age = Age - (RHR+BMI+Activity adjustment). Negative adjustment = younger fitness age.',
  interpretation: 'Fitness age < chronological: better cardiovascular fitness. Higher activity, lower RHR/bMI = younger fitness age.'
}

export default calcDef
