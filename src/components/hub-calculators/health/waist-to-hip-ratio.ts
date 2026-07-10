import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ waist: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), hip: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'waist', label:'Waist Circumference (cm)', type:'number', min:30, step:'0.1' }, { name:'hip', label:'Hip Circumference (cm)', type:'number', min:30, step:'0.1' }],
  compute: (v) => { const w=parseFloat(v.waist)||80; const h=parseFloat(v.hip)||100; const whr=w/h; const risk=whr>0.85?'High':'Low'; return { result:whr, label:'Waist-to-Hip Ratio', unit:'', steps:[{ label:'Waist', value:w.toFixed(1)+' cm' },{ label:'Hip', value:h.toFixed(1)+' cm' },{ label:'WHR', value:whr.toFixed(2) },{ label:'Risk', value:risk }] } },
  description: 'Waist-to-hip ratio is a measure of body fat distribution indicating central obesity risk.',
  formula: 'WHR = Waist circumference / Hip circumference. WHR >0.85 (women) or >0.90 (men) indicates central obesity.',
  interpretation: 'WHR <0.85 (women) or <0.90 (men) is low risk. Higher values indicate increased cardiovascular and metabolic disease risk.'
}
export default calcDef