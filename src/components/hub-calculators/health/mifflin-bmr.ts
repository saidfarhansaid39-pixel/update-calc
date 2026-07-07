import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), sex: z.string().min(1,'Required') }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:0, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:0, step:'0.1' }, { name:'age', label:'Age (years)', type:'number', min:18, max:120, step:'1' }, { name:'sex', label:'Sex', type:'select', options:[{value:'male',label:'Male'},{value:'female',label:'Female'}] }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const h=parseFloat(v.height)||175; const age=parseFloat(v.age)||30; const sex=v.sex||'male'; const bmr=sex==='male'?10*w+6.25*h-5*age+5:10*w+6.25*h-5*age-161; return { result:bmr, label:'BMR (Mifflin-St Jeor)', unit:'kcal/day', steps:[{ label:'Weight', value:w.toFixed(1)+' kg' },{ label:'Height', value:h.toFixed(1)+' cm' },{ label:'Age', value:age.toFixed(0)+' years' },{ label:'BMR', value:bmr.toFixed(0)+' kcal/day' }] } },
  description: 'Mifflin-St Jeor basal metabolic rate equation—most validated BMR formula for the general population.',
  formula: 'Male: BMR = 10W + 6.25H - 5A + 5. Female: BMR = 10W + 6.25H - 5A - 161. (W=kg, H=cm, A=years).',
  interpretation: 'BMR is calories needed at complete rest. Add activity factor for TDEE: ×1.2 (sedentary) to ×1.9 (very active).'
}

export default calcDef
