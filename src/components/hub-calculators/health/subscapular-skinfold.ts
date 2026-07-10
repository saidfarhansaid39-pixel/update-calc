import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ subscapular: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18') }),
  fields: [{ name:'subscapular', label:'Subscapular Skinfold (mm)', type:'number', min:3, step:'0.5' }, { name:'weight', label:'Weight (kg)', type:'number', min:20, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }],
  compute: (v) => { const s=parseFloat(v.subscapular)||18; const w=parseFloat(v.weight)||70; const h=parseFloat(v.height)||170; const a=parseFloat(v.age)||30; const bf=0.521*s+0.003*(h/100)*w-0.002*a+4.2; const fatKg=bf/100*w; return { result:bf, label:'Body Fat (Subscapular)', unit:'%', steps:[{ label:'Skinfold', value:s.toFixed(1)+' mm' },{ label:'Body Fat %', value:bf.toFixed(1)+'%' },{ label:'Fat Mass', value:fatKg.toFixed(1)+' kg' }] } },
  description: 'Estimates body fat percentage using subscapular skinfold thickness with age and anthropometric adjustment.',
  formula: 'BF% = 0.521×SS + 0.003×(H×W) - 0.001×Age + 4.2. Subscapular site reflects trunk fat stores.',
  interpretation: 'Subscapular skinfold >30 mm (M) or >40 mm (F) indicates high trunk adiposity, a cardiovascular risk marker.'
}
export default calcDef