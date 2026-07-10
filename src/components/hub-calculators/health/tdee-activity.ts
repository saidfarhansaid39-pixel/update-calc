import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ bmr: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), pal: z.string().min(1,'Required').refine(v=>parseFloat(v)>=1,'≥1') }),
  fields: [{ name:'bmr', label:'Basal Metabolic Rate (kcal)', type:'number', min:300, step:'10' }, { name:'pal', label:'PAL (1.0-2.5)', type:'number', min:1, max:2.5, step:'0.05' }],
  compute: (v) => { const b=parseFloat(v.bmr)||1500; const p=parseFloat(v.pal)||1.4; const tdee=b*p; const cat=p<1.2?'Bed Rest':p<1.4?'Sedentary':p<1.6?'Lightly Active':p<1.8?'Moderately Active':p<2.0?'Active':'Very Active'; return { result:tdee, label:'Total Daily Energy Expenditure', unit:'kcal', steps:[{ label:'BMR', value:b.toFixed(0)+' kcal' },{ label:'PAL', value:p.toFixed(2) },{ label:'TDEE', value:tdee.toFixed(0)+' kcal' },{ label:'Category', value:cat }] } },
  description: 'TDEE calculated from BMR multiplied by physical activity level factor.',
  formula: 'TDEE = BMR × PAL. PAL: 1.2 bed rest, 1.4 sedentary, 1.6 light, 1.8 moderate, 2.0 active, 2.2-2.5 very active.',
  interpretation: 'TDEE is total energy used daily. For weight loss: consume 300-500 kcal less. For gain: eat 300-500 kcal above TDEE.'
}
export default calcDef