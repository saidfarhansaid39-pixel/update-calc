import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ triceps: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'triceps', label:'Triceps Skinfold (mm)', type:'number', min:2, step:'0.5' }, { name:'weight', label:'Weight (kg)', type:'number', min:20, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }],
  compute: (v) => { const t=parseFloat(v.triceps)||15; const w=parseFloat(v.weight)||70; const h=parseFloat(v.height)||170; const bf=0.595*t+0.002*(h/100)*w-0.001*w; const fatKg=bf/100*w; const pct=bf; return { result:pct, label:'Body Fat (Triceps)', unit:'%', steps:[{ label:'Skinfold', value:t.toFixed(1)+' mm' },{ label:'Body Fat %', value:pct.toFixed(1)+'%' },{ label:'Fat Mass', value:fatKg.toFixed(1)+' kg' }] } },
  description: 'Body fat estimation from triceps skinfold thickness using regression equations.',
  formula: 'BF% estimated from triceps skinfold (mm), weight (kg), and height (m). Single-site prediction model.',
  interpretation: 'Triceps skinfold: M ~6-25 mm, F ~12-38 mm. Higher values indicate greater subcutaneous fat stores.'
}
export default calcDef