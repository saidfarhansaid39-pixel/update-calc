import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), waist: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), neck: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), hip: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), sex: z.string().min(1,'Required') }),
  fields: [{ name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'waist', label:'Waist (cm)', type:'number', min:30, step:'0.1' }, { name:'neck', label:'Neck (cm)', type:'number', min:15, step:'0.1' }, { name:'hip', label:'Hip (cm, female only)', type:'number', min:30, step:'0.1' }, { name:'sex', label:'Sex', type:'select', options:[{value:'male',label:'Male'},{value:'female',label:'Female'}] }],
  compute: (v) => { const H=parseFloat(v.height)||175; const W=parseFloat(v.waist)||90; const N=parseFloat(v.neck)||38; const Hp=parseFloat(v.hip)||100; const s=v.sex||'male'; let bf:number;let lm:number; if(s==='male'){bf=86.010*Math.log10(W-N)-70.041*Math.log10(H)+36.76;lm=Number(((H/100)**2*22*(1-bf/100)).toFixed(1))}else{bf=163.205*Math.log10(W+Hp-N)-97.684*Math.log10(H)-78.387;lm=Number(((H/100)**2*22*(1-bf/100)).toFixed(1))} return { result:bf, label:'Body Fat % (Navy)', unit:'%', steps:[{ label:'Body Fat %', value:bf.toFixed(1)+'%' },{ label:'Lean Mass (est)', value:lm.toFixed(1)+' kg' }] } },
  description: 'Alternate US Navy body fat formula using circumference measurements (equations from Hodgdon & Beckett).',
  formula: 'Male: BF% = 495×log₁₀(W-N) - 70×log₁₀(H) + 36.76. Female: Uses hip, waist, neck circumferences.',
  interpretation: 'Navy standards: 18-39 y/o: 8-22% (M), 21-33% (F). Over 40 y/o thresholds are slightly higher.'
}
export default calcDef