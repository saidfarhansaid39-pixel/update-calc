import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), ageDays: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'≥0'), feedingType: z.string().min(1,'Required'), kcalPerOz: z.string().min(1,'Required') }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:0, step:'0.01' }, { name:'ageDays', label:'Age (days)', type:'number', min:0, step:'1' }, { name:'feedingType', label:'Feeding Type', type:'select', options:[{value:'formula',label:'Standard Formula'},{value:'preterm',label:'Preterm Formula'},{value:'specialized',label:'Specialized Formula'}] }, { name:'kcalPerOz', label:'Calories per oz', type:'select', options:[{value:'20',label:'20 kcal/oz (standard)'},{value:'22',label:'22 kcal/oz (preterm)'},{value:'24',label:'24 kcal/oz (preterm/HF)'},{value:'27',label:'27 kcal/oz (growth)'}] }],
  compute: (v) => { const w=parseFloat(v.weight)||3.5; const a=parseInt(v.ageDays)||7; const kcal=parseInt(v.kcalPerOz)||20; const req=a<=30?150:a<=90?140:130; const vol=req*w; const feeds=a<=30?8:6; const per=vol/feeds; return { result:vol, label:'Daily Formula Volume', unit:'mL', steps:[{ label:'Weight', value:w.toFixed(2)+' kg' },{ label:'Caloric Needs', value:req+' kcal/kg/day' },{ label:'Total Volume', value:vol.toFixed(0)+' mL/day' },{ label:'Per Feed', value:per.toFixed(0)+' mL q'+(24/feeds).toString()+'h' }] } },
  description: 'Infant formula feeding volume calculation based on weight, age, and caloric density needs.',
  formula: 'Daily volume (mL) = Weight (kg) × 150 kcal/kg/day (neonates) ÷ (kcal per oz / 30). Per feed = total ÷ feeds/day (q3h=8, q4h=6).',
  interpretation: 'Term infants: 150-200 mL/kg/day. Preterm: start 80-100, advance to 150-180. Monitor growth curve, output, and satiety cues.'
}

export default calcDef
