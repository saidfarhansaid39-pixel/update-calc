import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ waist: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), hip: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'waist', label:'Waist (cm)', type:'number', min:30, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'hip', label:'Hip (cm)', type:'number', min:30, step:'0.1' }],
  compute: (v) => { const w=parseFloat(v.waist)||80; const h=parseFloat(v.height)||170; const bri=364.2-365.5*Math.sqrt(1-(Math.pow(w/(2*3.14159),2))/Math.pow(0.5*h,2)); return { result:bri, label:'Body Roundness Index', unit:'', steps:[{ label:'BRI', value:bri.toFixed(2) }] } },
  description: 'Body Roundness Index for estimating body fat and visceral adipose tissue.',
  formula: 'BRI = 364.2 - 365.5×√(1-(W/(2π))²/(0.5×height)²). Range ~1-16.',
  interpretation: 'Higher BRI = greater body roundness/visceral fat. Strongly correlates with metabolic syndrome risk.'
}

export default calcDef
