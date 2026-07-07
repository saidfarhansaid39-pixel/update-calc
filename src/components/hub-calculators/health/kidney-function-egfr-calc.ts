import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ serumCreatinine: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), sex: z.string().min(1,'Required') }),
  fields: [{ name:'serumCreatinine', label:'Serum Creatinine (mg/dL)', type:'number', min:0, step:'0.01' }, { name:'age', label:'Age (years)', type:'number', min:18, max:120, step:'1' }, { name:'sex', label:'Sex', type:'select', options:[{value:'female',label:'Female'},{value:'male',label:'Male'}] }],
  compute: (v) => { const cr=parseFloat(v.serumCreatinine)||1; const age=parseFloat(v.age)||40; const sex=v.sex||'male'; const k=sex==='female'?0.7:0.9; const a=sex==='female'?-0.329:-0.411; const min=Math.min(cr/k,1); const max=Math.max(cr/k,1); const sexFactor=sex==='female'?1.018:1; const egfr=141*min**a*max**(-1.209)*0.993**age*sexFactor; return { result:egfr, label:'eGFR', unit:'mL/min/1.73m²', steps:[{ label:'eGFR (CKD-EPI)', value:egfr.toFixed(0)+' mL/min/1.73m²' }] } },
  description: 'eGFR estimates kidney function using the CKD-EPI 2021 equation to stage chronic kidney disease.',
  formula: 'eGFR = 141 × min(SCr/κ,1)^α × max(SCr/κ,1)^-1.209 × 0.993^Age × 1.018 (if female). κ=0.7(f)/0.9(m), α=-0.329(f)/-0.411(m).',
  interpretation: 'eGFR ≥90: Normal (G1); 60-89: Mildly decreased (G2); 30-59: Moderately decreased (G3); 15-29: Severely decreased (G4); <15: Kidney failure (G5).'
}

export default calcDef
