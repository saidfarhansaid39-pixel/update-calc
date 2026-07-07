import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18'), bmi: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), gender: z.enum(['male','female']), pregnancy: z.enum(['never','past','current']), weightLoss: z.enum(['stable','moderate','rapid']), familyHistory: z.enum(['yes','no']) }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }, { name:'bmi', label:'BMI', type:'number', min:10, max:60, step:'0.5' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }, { name:'pregnancy', label:'Pregnancy History', type:'select', options:[{ label:'Never', value:'never' },{ label:'Past', value:'past' },{ label:'Current', value:'current' }] }, { name:'weightLoss', label:'Weight Loss Rate', type:'select', options:[{ label:'Stable', value:'stable' },{ label:'Moderate', value:'moderate' },{ label:'Rapid', value:'rapid' }] }, { name:'familyHistory', label:'Family History of Gallstones', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }],
  compute: (v) => { const a=parseFloat(v.age)||40; const bmi=parseFloat(v.bmi)||25; const g=v.gender||'female'; const preg=v.pregnancy||'never'; const wl=v.weightLoss||'stable'; const fh=v.familyHistory||'no'; const score=(a>60?3:a>40?2:0)+(bmi>30?3:bmi>25?2:0)+(g==='female'?2:0)+(preg==='current'?3:preg==='past'?2:0)+(wl==='rapid'?3:wl==='moderate'?1:0)+(fh==='yes'?2:0); const risk=score>=10?'High risk - consider US screening':score>=6?'Moderate risk - dietary prevention':'Low risk'; return { result:score, label:'Gallstone Risk Score', unit:'', steps:[{ label:'Age', value:(a>60?3:a>40?2:0).toString() },{ label:'BMI', value:(bmi>30?3:bmi>25?2:0).toString() },{ label:'Female', value:(g==='female'?2:0).toString() },{ label:'Pregnancy', value:(preg==='current'?3:preg==='past'?2:0).toString() },{ label:'Weight Loss', value:(wl==='rapid'?3:wl==='moderate'?1:0).toString() },{ label:'Family Hx', value:(fh==='yes'?2:0).toString() },{ label:'Total', value:score.toString() }] } },
  description: 'Gallstone risk assessment using the classic 5 Fs: Female, Fat, Forty, Fertile, Family.',
  formula: 'Score = Age + BMI + Female + Pregnancy + Weight Loss + Family Hx. Range 0-16.',
  interpretation: '<6: Low. 6-9: Moderate - high fiber, healthy weight. ≥10: High - consider RUQ US.'
}

export default calcDef
