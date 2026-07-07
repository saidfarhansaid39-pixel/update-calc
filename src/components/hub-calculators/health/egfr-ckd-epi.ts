import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18'), creatinine: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), gender: z.enum(['male','female']), race: z.enum(['black','non-black']) }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }, { name:'creatinine', label:'Creatinine (mg/dL)', type:'number', min:0.1, max:20, step:'0.1' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }, { name:'race', label:'Race', type:'select', options:[{ label:'Non-Black', value:'non-black' },{ label:'Black', value:'black' }] }],
  compute: (v) => { const a=parseFloat(v.age)||40; const cr=parseFloat(v.creatinine)||1; const g=v.gender||'male'; const r=v.race||'non-black'; const k=g==='female'?0.7:0.9; const alpha=g==='female'?-0.241:-0.302; const mult=g==='female'?1.012:1; const raceMult=r==='black'?1.159:1; const egfr=141*Math.pow(Math.min(cr/k,1),alpha)*Math.pow(Math.max(cr/k,1),-1.209)*Math.pow(0.993,a)*mult*raceMult; return { result:egfr, label:'eGFR (CKD-EPI)', unit:'mL/min/1.73m²', steps:[{ label:'eGFR', value:egfr.toFixed(1) }] } },
  description: 'eGFR by CKD-EPI with race coefficient (pre-2021) for CKD staging.',
  formula: 'eGFR = 141 × min(Cr/k,1)^α × max(Cr/k,1)^-1.209 × 0.993^age × 1.012(F) × 1.159(Black).',
  interpretation: 'Recent guidelines recommend removing race coefficient. Use with caution as Black coefficient may perpetuate inequity.'
}

export default calcDef
