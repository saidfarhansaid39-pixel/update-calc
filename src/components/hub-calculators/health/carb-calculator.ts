import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), activity: z.enum(['sedentary','light','moderate','active','very-active']) }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:20, step:'0.1' }, { name:'activity', label:'Activity Level', type:'select', options:[{ label:'Sedentary', value:'sedentary' },{ label:'Light', value:'light' },{ label:'Moderate', value:'moderate' },{ label:'Active', value:'active' },{ label:'Very Active', value:'very-active' }] }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const act=v.activity||'moderate'; const gpk:{[k:string]:number}={sedentary:3,light:4,moderate:5,active:6,'very-active':7}; const g=w*gpk[act]; return { result:g, label:'Daily Carbs', unit:'g', steps:[{ label:'Weight', value:w.toString() },{ label:'Multiplier', value:gpk[act].toString()+' g/kg' },{ label:'Total Carbs', value:g.toFixed(0) }] } },
  description: 'Daily carbohydrate needs by body weight and activity level.',
  formula: 'Carbs = weight(kg) × multiplier (3-7 g/kg based on activity).',
  interpretation: 'Low-carb <130g; Moderate 130-225g; Athlete 225-500g. Prioritize complex carbs.'
}

export default calcDef
