import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18'), creatinine: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), gender: z.enum(['male','female']) }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }, { name:'creatinine', label:'Creatinine (mg/dL)', type:'number', min:0.1, max:20, step:'0.1' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }],
  compute: (v) => { const a=parseFloat(v.age)||40; const cr=parseFloat(v.creatinine)||1; const g=v.gender||'male'; const k=g==='female'?0.7:0.9; const alpha=g==='female'?-0.241:-0.302; const mult=g==='female'?1.012:1; const egfr=141*Math.pow(Math.min(cr/k,1),alpha)*Math.pow(Math.max(cr/k,1),-1.209)*Math.pow(0.993,a)*mult; const stage=egfr>=90?'G1: Normal':egfr>=60?'G2: Mild':egfr>=45?'G3a: Mild-Mod':egfr>=30?'G3b: Mod-Severe':egfr>=15?'G4: Severe':'G5: Kidney Failure'; return { result:egfr, label:'eGFR (CKD-EPI)', unit:'mL/min/1.73m²', steps:[{ label:'eGFR', value:egfr.toFixed(1) },{ label:'CKD Stage', value:stage }] } },
  description: 'eGFR by CKD-EPI 2021 equation without race coefficient for CKD staging.',
  formula: 'eGFR = 141 × min(Cr/k,1)^α × max(Cr/k,1)^-1.209 × 0.993^age × 1.012 (female).',
  interpretation: 'G1 ≥90: Normal. G2 60-89: Mild. G3a 45-59: Mild-Mod. G3b 30-44: Mod-Sev. G4 15-29: Severe. G5 <15: Kidney failure.'
}

export default calcDef
