import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), waist: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), hip: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), neck: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), sex: z.string().min(1,'Required') }),
  fields: [{ name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'waist', label:'Waist (cm)', type:'number', min:30, step:'0.1' }, { name:'hip', label:'Hip (cm)', type:'number', min:30, step:'0.1' }, { name:'neck', label:'Neck (cm)', type:'number', min:15, step:'0.1' }, { name:'sex', label:'Sex', type:'select', options:[{value:'male',label:'Male'},{value:'female',label:'Female'}] }],
  compute: (v) => { const H=parseFloat(v.height)||175; const W=parseFloat(v.waist)||90; const Hp=parseFloat(v.hip)||100; const N=parseFloat(v.neck)||38; const s=v.sex||'male'; let bf:number; if(s==='male'){bf=495/(1.0324-0.19077*Math.log10(W-N)+0.15456*Math.log10(H))-450}else{bf=495/(1.29579-0.35004*Math.log10(Hp+N-W)+0.22100*Math.log10(H))-450} const fatKg=bf/100*((H/100)**2*22); return { result:bf, label:'Body Fat % (Navy)', unit:'%', steps:[{ label:'Body Fat %', value:bf.toFixed(1)+'%' },{ label:'Fat Mass (est)', value:fatKg.toFixed(1)+' kg' }] } },
  description: 'US Navy circumference method estimates body fat percentage using height, waist, neck, and hip (for females).',
  formula: 'Male: BF% = 495/(1.0324-0.19077×log(W-N)+0.15456×log(H))-450. Female: Uses hip, waist, neck, height.',
  interpretation: 'Essential fat: 2-5% (male), 10-13% (female). Athlete: 6-13% (M), 14-20% (F). Healthy: 14-17% (M), 21-24% (F).'
}
export default calcDef