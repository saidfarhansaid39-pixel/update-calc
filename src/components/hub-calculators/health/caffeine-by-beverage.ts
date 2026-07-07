import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ beverage: z.enum(['coffee','espresso','tea','soda','energy','preworkout']), servings: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'beverage', label:'Beverage', type:'select', options:[{ label:'Coffee', value:'coffee' },{ label:'Espresso', value:'espresso' },{ label:'Tea', value:'tea' },{ label:'Soda', value:'soda' },{ label:'Energy Drink', value:'energy' },{ label:'Pre-Workout', value:'preworkout' }] }, { name:'servings', label:'Servings', type:'number', min:0.5, max:20, step:'0.5' }],
  compute: (v) => { const b=v.beverage||'coffee'; const c:{[k:string]:number}={coffee:95,espresso:63,tea:47,soda:34,energy:160,preworkout:200}; const mg=c[b]*(parseFloat(v.servings)||1); return { result:mg, label:'Total Caffeine', unit:'mg', steps:[{ label:'Per Serving', value:c[b].toString()+' mg' },{ label:'Total', value:mg.toString() },{ label:'FDA Limit 400mg', value:mg<=400?'Within limit':'Exceeds limit' }] } },
  description: 'Caffeine content from common beverages per standardized serving.',
  formula: 'Total = servings × caffeine per serving. FDA safe limit: ≤400 mg/day.',
  interpretation: '<200 mg: mild; 200-400: typical; >400: anxiety/insomnia risk; >600: significant side effects.'
}

export default calcDef
