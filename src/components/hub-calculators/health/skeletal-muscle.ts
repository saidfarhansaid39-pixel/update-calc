import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18'), sex: z.string().min(1,'Required'), frame: z.string().min(1,'Required') }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:20, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }, { name:'sex', label:'Sex', type:'select', options:[{value:'male',label:'Male'},{value:'female',label:'Female'}] }, { name:'frame', label:'Frame Size', type:'select', options:[{value:'small',label:'Small'},{value:'medium',label:'Medium'},{value:'large',label:'Large'}] }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const h=parseFloat(v.height)||170; const a=parseFloat(v.age)||30; const s=v.sex||'male'; const f=v.frame||'medium'; const fAdj:Record<string,number>={small:-0.15,medium:0,large:0.15}; const frameAdj=fAdj[f]||0; let smm:number; if(s==='male'){smm=(0.407*w+0.267*h-19.2)*(1+frameAdj)}else{smm=(0.252*w+0.236*h-12.8)*(1+frameAdj)} const pct=smm/w*100; return { result:smm, label:'Skeletal Muscle Mass', unit:'kg', steps:[{ label:'SMM', value:smm.toFixed(1)+' kg' },{ label:'SMM %', value:pct.toFixed(1)+'%' },{ label:'Frame Adjustment', value:(frameAdj*100).toFixed(0)+'%' }] } },
  description: 'Estimates skeletal muscle mass from anthropometric data with frame size adjustment.',
  formula: 'SMM by Lee equation + frame adjustment (±15% for small/large frame). Frame size based on height-wrist ratio.',
  interpretation: 'SMM 30-40 kg (male) and 20-30 kg (female) is typical. Athletes and large-frame individuals at higher end.'
}
export default calcDef