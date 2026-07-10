import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ waist: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), hip: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), sex: z.string().min(1,'Required') }),
  fields: [{ name:'waist', label:'Waist Circumference (cm)', type:'number', min:30, step:'0.1' }, { name:'hip', label:'Hip Circumference (cm)', type:'number', min:30, step:'0.1' }, { name:'sex', label:'Sex', type:'select', options:[{value:'male',label:'Male'},{value:'female',label:'Female'}] }],
  compute: (v) => { const w=parseFloat(v.waist)||80; const h=parseFloat(v.hip)||100; const s=v.sex||'male'; const sag=s==='male'?w-0.5*h-15:Math.max(0.55*w-0.4*h-5,10); return { result:sag, label:'Sagittal Abdominal Diameter', unit:'cm', steps:[{ label:'Waist', value:w.toFixed(1)+' cm' },{ label:'Hip', value:h.toFixed(1)+' cm' },{ label:'Estimated SAD', value:sag.toFixed(1)+' cm' }] } },
  description: 'Estimated sagittal abdominal diameter (SAD) from waist and hip circumference, a marker of visceral fat.',
  formula: 'Male: SAD ≈ WC - 0.5×HC - 15. Female: SAD ≈ 0.55×WC - 0.4×HC - 5. Direct measurement via CT is gold standard.',
  interpretation: 'SAD >25 cm indicates high visceral fat. SAD correlates strongly with insulin resistance and metabolic syndrome.'
}
export default calcDef