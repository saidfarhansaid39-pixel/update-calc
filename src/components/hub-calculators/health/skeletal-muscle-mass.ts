import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18'), gender: z.string().min(1,'Required') }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:20, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }, { name:'gender', label:'Gender', type:'select', options:[{value:'male',label:'Male'},{value:'female',label:'Female'}] }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const h=parseFloat(v.height)||170; const a=parseFloat(v.age)||30; const g=v.gender||'male'; const smm=g==='male'?0.407*w+0.267*h-19.2:0.252*w+0.236*h-12.8; const pct=smm/w*100; return { result:smm, label:'Skeletal Muscle Mass', unit:'kg', steps:[{ label:'Total SMM', value:smm.toFixed(1)+' kg' },{ label:'SMM %', value:pct.toFixed(1)+'%' }] } },
  description: 'Estimates skeletal muscle mass using anthropometric equations based on weight, height, age, and gender.',
  formula: 'Male: SMM = 0.407×W + 0.267×H - 19.4. Female: SMM = 0.252×W + 0.236×H - 13.8 (Lee equation).',
  interpretation: 'SMM 25-35 kg (female) or 30-40 kg (male) is typical. Athletes may have higher values relative to total weight.'
}
export default calcDef