import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ suprailiac: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18') }),
  fields: [{ name:'suprailiac', label:'Suprailiac Skinfold (mm)', type:'number', min:3, step:'0.5' }, { name:'weight', label:'Weight (kg)', type:'number', min:20, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }],
  compute: (v) => { const si=parseFloat(v.suprailiac)||20; const w=parseFloat(v.weight)||70; const h=parseFloat(v.height)||170; const a=parseFloat(v.age)||30; const bf=0.463*si+0.004*(h/100)*w-0.003*a+5.1; const fatKg=bf/100*w; return { result:bf, label:'Body Fat (Suprailiac)', unit:'%', steps:[{ label:'Skinfold', value:si.toFixed(1)+' mm' },{ label:'Body Fat %', value:bf.toFixed(1)+'%' },{ label:'Fat Mass', value:fatKg.toFixed(1)+' kg' }] } },
  description: 'Estimates body fat from suprailiac skinfold thickness, reflecting iliac crest subcutaneous adiposity.',
  formula: 'BF% = 0.463×SI + 0.004×(H×W) - 0.003×Age + 5.1. Suprailiac site correlates with abdominal visceral fat.',
  interpretation: 'Suprailiac skinfold >25 mm indicates elevated trunk fat. Used in Durnin-Womersley and Jackson-Pollock equations.'
}
export default calcDef