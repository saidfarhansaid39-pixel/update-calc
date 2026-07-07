import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18'), weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), creatinine: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), gender: z.enum(['male','female']) }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }, { name:'weight', label:'Weight (kg)', type:'number', min:20, step:'0.1' }, { name:'creatinine', label:'Creatinine (mg/dL)', type:'number', min:0.1, max:20, step:'0.1' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }],
  compute: (v) => { const a=parseFloat(v.age)||40; const w=parseFloat(v.weight)||70; const cr=parseFloat(v.creatinine)||1; const g=v.gender||'male'; const crcl=((140-a)*w)/(72*cr)*(g==='male'?1:0.85); return { result:crcl, label:'CrCl (Cockcroft-Gault)', unit:'mL/min', steps:[{ label:'CG: ((140-A)×W)/(72×Cr)×0.85(F)', value:crcl.toFixed(1) }] } },
  description: 'Creatinine clearance by Cockcroft-Gault formula for drug dosing.',
  formula: 'CrCl = ((140-age)×weight)/(72×creatinine) × 0.85 (female). Normal >90 mL/min.',
  interpretation: '>90: Normal. 60-89: Mild. 30-59: Moderate. 15-29: Severe. <15: ESRD.'
}

export default calcDef
