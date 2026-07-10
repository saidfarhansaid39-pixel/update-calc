import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ tdee: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), bmr: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'tdee', label:'Total Daily Energy Expenditure (kcal)', type:'number', min:500, step:'10' }, { name:'bmr', label:'Basal Metabolic Rate (kcal)', type:'number', min:300, step:'10' }],
  compute: (v) => { const t=parseFloat(v.tdee)||2000; const b=parseFloat(v.bmr)||1500; const pal=t/b; const cat=pal<1.4?'Sedentary':pal<1.7?'Moderately Active':pal<2.0?'Active':'Very Active'; return { result:pal, label:'Physical Activity Level (PAL)', unit:'', steps:[{ label:'TDEE', value:t.toFixed(0)+' kcal' },{ label:'BMR', value:b.toFixed(0)+' kcal' },{ label:'PAL', value:pal.toFixed(2) },{ label:'Category', value:cat }] } },
  description: 'Physical Activity Level is the ratio of TDEE to BMR, used to classify activity intensity.',
  formula: 'PAL = TDEE / BMR. Sedentary: <1.4, Moderate: 1.4-1.7, Active: 1.7-2.0, Very Active: >2.0.',
  interpretation: 'PAL <1.4 is sedentary; 1.4-1.7 moderately active; 1.7-2.0 active; >2.0 extremely active (athlete/labor).'
}
export default calcDef