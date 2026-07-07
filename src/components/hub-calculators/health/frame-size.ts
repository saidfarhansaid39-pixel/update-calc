import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), wrist: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), gender: z.enum(['male','female']) }),
  fields: [{ name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'wrist', label:'Wrist Circumference (cm)', type:'number', min:10, step:'0.1' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }],
  compute: (v) => { const h=parseFloat(v.height)||170; const w=parseFloat(v.wrist)||16; const g=v.gender||'male'; const r=h/w; let frame=''; if(g==='male'){frame=r>10.4?'Small':r>9.6?'Medium':'Large';}else{frame=r>11?'Small':r>10.1?'Medium':'Large';} return { result:r, label:'Height/Wrist Ratio', unit:'', steps:[{ label:'Ratio = Height/Wrist', value:r.toFixed(2) },{ label:'Frame Size', value:frame }] } },
  description: 'Body frame size estimation from height and wrist circumference for ideal weight range.',
  formula: 'Ratio = height(cm)/wrist circumference(cm). Male: >10.4 small, 9.6-10.4 medium, <9.6 large.',
  interpretation: 'Frame size adjusts ideal body weight ranges. Small frame: subtract 10% from IBW. Large: add 10%.'
}

export default calcDef
