import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), wrist: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'wrist', label:'Wrist Circumference (cm)', type:'number', min:10, step:'0.1' }],
  compute: (v) => { const h=parseFloat(v.height)||170; const w=parseFloat(v.wrist)||16; const ratio=h/w; let frame:string; if(ratio>10.4){frame='Small'}else if(ratio>9.6){frame='Medium'}else{frame='Large'} return { result:ratio, label:'Height-to-Wrist Ratio', unit:'', steps:[{ label:'Ratio', value:ratio.toFixed(2) },{ label:'Frame Size', value:frame }] } },
  description: 'Estimates body frame size using height and wrist circumference, used to adjust ideal body weight ranges.',
  formula: 'Frame Ratio = Height (cm) / Wrist Circumference (cm). >10.4 small, 9.6-10.4 medium, <9.6 large.',
  interpretation: 'Frame size adjusts IBW estimates. Small frame = IBW -10%, large frame = IBW +10% from medium-frame standard.'
}
export default calcDef