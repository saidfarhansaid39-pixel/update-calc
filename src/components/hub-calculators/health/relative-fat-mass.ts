import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), waist: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), sex: z.string().min(1,'Required') }),
  fields: [{ name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'waist', label:'Waist Circumference (cm)', type:'number', min:30, step:'0.1' }, { name:'sex', label:'Sex', type:'select', options:[{value:'male',label:'Male'},{value:'female',label:'Female'}] }],
  compute: (v) => { const h=parseFloat(v.height)||170; const w=parseFloat(v.waist)||80; const s=v.sex||'male'; const rfm=s==='male'?64-20*(h/w)+12:76-20*(h/w)+12; const fatKg=rfm/100*((h/100)**2*22); const cat=rfm<20?'Essential':rfm<25?'Athlete':rfm<32?'Healthy':'Overfat'; return { result:rfm, label:'Relative Fat Mass', unit:'%', steps:[{ label:'Height (cm)', value:h.toFixed(1) },{ label:'Waist (cm)', value:w.toFixed(1) },{ label:'RFM', value:rfm.toFixed(1)+'%' },{ label:'Category', value:cat }] } },
  description: 'Relative Fat Mass estimates body fat percentage using height and waist circumference only.',
  formula: 'Male: RFM = 64 - 20×(H/W) + 12. Female: RFM = 76 - 20×(H/W) + 12. F as % of total weight.',
  interpretation: 'Male: <20 lean, 20-30 healthy. Female: <30 lean, 30-40 healthy. >30 (M) or >40 (F) indicates overfat.'
}
export default calcDef