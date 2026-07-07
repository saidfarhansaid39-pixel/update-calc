import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ waist: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), hip: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'waist', label:'Waist (cm)', type:'number', min:30, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'hip', label:'Hip (cm)', type:'number', min:30, step:'0.1' }],
  compute: (v) => { const w=parseFloat(v.waist)||80; const h=parseFloat(v.height)||170; const hip=parseFloat(v.hip)||90; const whtr=w/h; const whr=w/hip; return { result:whtr, label:'Waist-to-Height', unit:'', steps:[{ label:'WHtR', value:whtr.toFixed(3) },{ label:'WHR', value:whr.toFixed(3) }] } },
  description: 'Body roundness via waist-to-height and waist-to-hip ratios.',
  formula: 'WHtR = waist/height. WHR = waist/hip.',
  interpretation: 'WHtR <0.5: healthy; 0.5-0.6: increased risk; >0.6: high risk. WHR >0.85(F) or >0.9(M): abdominal obesity.'
}

export default calcDef
