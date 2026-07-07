import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tdee: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), deficitPct: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'tdee', label:'TDEE (kcal)', type:'number', min:500, max:10000, step:'50' }, { name:'deficitPct', label:'Deficit % (0-50)', type:'number', min:0, max:50, step:'1' }],
  compute: (v) => { const tdee=parseFloat(v.tdee)||2500; const dp=parseFloat(v.deficitPct)||20; const def=tdee*dp/100; const cal=tdee-def; const fatWk=def*7/7700; return { result:cal, label:'Target Calories', unit:'kcal/day', steps:[{ label:'TDEE', value:tdee.toString() },{ label:'Deficit', value:def.toFixed(0) },{ label:'Target', value:cal.toFixed(0) },{ label:'Fat Loss/Wk', value:fatWk.toFixed(2)+' kg' }] } },
  description: 'Calorie deficit calculation for weight loss from TDEE.',
  formula: 'Target = TDEE×(1-D%). 1 kg fat ≈ 7700 kcal. Safe deficit: 10-25%.',
  interpretation: '10-15%: slow loss (0.2-0.4 kg/wk). 15-25%: moderate. >25%: muscle loss risk.'
}

export default calcDef
