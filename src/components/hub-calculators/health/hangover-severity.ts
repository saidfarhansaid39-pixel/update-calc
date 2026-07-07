import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ drinks: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), hoursSlept: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), waterIntake: z.enum(['none','some','adequate']), foodIntake: z.enum(['none','snack','meal']) }),
  fields: [{ name:'drinks', label:'Standard Drinks', type:'number', min:0, step:'0.5' }, { name:'weight', label:'Weight (kg)', type:'number', min:20, step:'0.1' }, { name:'hoursSlept', label:'Hours Slept', type:'number', min:0, max:24, step:'0.5' }, { name:'waterIntake', label:'Water During Drinking', type:'select', options:[{ label:'None', value:'none' },{ label:'Some', value:'some' },{ label:'Adequate', value:'adequate' }] }, { name:'foodIntake', label:'Food During Drinking', type:'select', options:[{ label:'None', value:'none' },{ label:'Snack', value:'snack' },{ label:'Meal', value:'meal' }] }],
  compute: (v) => { const d=parseFloat(v.drinks)||0; const w=parseFloat(v.weight)||70; const sl=parseFloat(v.hoursSlept)||0; const wa=v.waterIntake||'some'; const fo=v.foodIntake||'snack'; const bac=d*14/(0.68*w*1000)*100; const severity=(d>10?5:d>6?4:d>4?3:d>2?1:0)+(sl<4?3:sl<6?2:0)+(wa==='none'?2:wa==='some'?1:0)+(fo==='none'?2:fo==='snack'?1:0)+(bac>0.2?3:bac>0.1?2:0); const sev=severity<=3?'Mild':severity<=6?'Moderate':severity<=9?'Severe':'Extreme'; return { result:severity, label:'Hangover Severity', unit:'', steps:[{ label:'Drinks', value:severity.toString() },{ label:'Level', value:sev }] } },
  description: 'Hangover severity prediction from alcohol intake, sleep, hydration, and food.',
  formula: 'Score = BAC level + Sleep + Hydration + Food + Drinks. Multifactorial severity index.',
  interpretation: 'Prevention: hydrate 1:1 alcohol:H₂O, eat before/during, limit to ≤4 drinks, get 7-8h sleep.'
}

export default calcDef
