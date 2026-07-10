import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=1,'≥1'), activity: z.string().min(1,'Required') }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:5, step:'0.1' }, { name:'age', label:'Age (years)', type:'number', min:1, max:120, step:'1' }, { name:'activity', label:'Activity Level', type:'select', options:[{value:'sedentary',label:'Sedentary'},{value:'moderate',label:'Moderate Activity'},{value:'active',label:'Active/Exercise'},{value:'heat',label:'Heat Exposure'}] }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const a=parseFloat(v.age)||30; const act=v.activity||'sedentary'; const factors:{[k:string]:number}={sedentary:30,moderate:35,active:40,heat:45}; const f=factors[act]||30; const water=f*w; const fromFood=water*0.2; const fromDrink=water-fromFood; return { result:fromDrink, label:'Daily Water from Drinks', unit:'mL', steps:[{ label:'Total Needs', value:water.toFixed(0)+' mL' },{ label:'From Food (20%)', value:fromFood.toFixed(0)+' mL' },{ label:'From Drinks', value:fromDrink.toFixed(0)+' mL' },{ label:'In Cups (~240mL)', value:(fromDrink/240).toFixed(1) }] } },
  description: 'Estimates daily water needs based on body weight, age, and activity level.',
  formula: 'Total water (mL) = Weight (kg) × Factor. ~20% from food, rest from beverages. Factor: 30-45 mL/kg.',
  interpretation: 'General recommendation: ~2.7 L (women) and ~3.7 L (men) total water daily, including food. Adjust for activity/heat.'
}
export default calcDef