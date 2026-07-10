import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ waist: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'waist', label:'Waist Circumference (cm)', type:'number', min:30, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }],
  compute: (v) => { const w=parseFloat(v.waist)||80; const h=parseFloat(v.height)||170; const whtr=w/h; const risk=whtr>0.5?'Elevated':'Normal'; return { result:whtr, label:'Waist-to-Height Ratio', unit:'', steps:[{ label:'Waist', value:w.toFixed(1)+' cm' },{ label:'Height', value:h.toFixed(1)+' cm' },{ label:'WHtR', value:whtr.toFixed(3) },{ label:'Risk', value:risk }] } },
  description: 'Waist-to-height ratio assesses central obesity and cardiometabolic risk independent of height.',
  formula: 'WHtR = Waist circumference / Height. WHtR >0.5 indicates increased cardiometabolic risk.',
  interpretation: 'WHtR <0.5 is healthy. Values 0.5-0.6 indicate elevated risk. >0.6 indicates high risk for metabolic syndrome.'
}
export default calcDef