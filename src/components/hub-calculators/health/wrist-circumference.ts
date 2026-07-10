import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ wrist: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), sex: z.string().min(1,'Required'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'wrist', label:'Wrist Circumference (cm)', type:'number', min:10, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'sex', label:'Sex', type:'select', options:[{value:'male',label:'Male'},{value:'female',label:'Female'}] }],
  compute: (v) => { const w=parseFloat(v.wrist)||16; const h=parseFloat(v.height)||170; const s=v.sex||'male'; const ratio=h/w; let frame:string; if(s==='male'){frame=ratio>10.4?'Small':ratio>9.6?'Medium':'Large'}else{frame=ratio>11.0?'Small':ratio>10.1?'Medium':'Large'} return { result:w, label:'Wrist Circumference', unit:'cm', steps:[{ label:'Wrist', value:w.toFixed(1)+' cm' },{ label:'Ht/Wrist Ratio', value:ratio.toFixed(2) },{ label:'Frame Size', value:frame }] } },
  description: 'Wrist circumference is used to determine body frame size, which adjusts ideal body weight calculations.',
  formula: 'Ht(cm)/Wrist(cm) ratio: Male: >10.4 small, 9.6-10.4 medium, <9.6 large. Female: >11.0/10.1-11.0/<10.1.',
  interpretation: 'Frame classification: small (delicate), medium (average), large (sturdy). IBW varies ±10% from medium standard.'
}
export default calcDef