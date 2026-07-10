import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), serumCr: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), female: z.string().min(1,'Required') }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }, { name:'weight', label:'Weight (kg)', type:'number', min:20, step:'0.1' }, { name:'serumCr', label:'Serum Creatinine (mg/dL)', type:'number', min:0.1, step:'0.01' }, { name:'female', label:'Female (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }],
  compute: (v) => { const age=parseFloat(v.age)||50; const wt=parseFloat(v.weight)||70; const scr=parseFloat(v.serumCr)||1; const f=parseFloat(v.female)||0; const crcl=((140-age)*wt)/(72*scr)*(f?0.85:1); return { result:crcl, label:'Creatinine Clearance (Cockcroft-Gault)', unit:'mL/min', steps:[{ label:'Age', value:age.toFixed(0)+' yrs' },{ label:'Weight', value:wt.toFixed(0)+' kg' },{ label:'Serum Cr', value:scr.toFixed(2)+' mg/dL' },{ label:'CrCl', value:crcl.toFixed(1)+' mL/min' }] } },
  description: 'Cockcroft-Gault equation estimates creatinine clearance for renal function assessment.',
  formula: 'CrCl = ((140 - Age) × Weight) / (72 × SCr) × (0.85 if female)',
  interpretation: 'Normal: >90 mL/min. Mild CKD: 60-89. Moderate: 30-59. Severe: 15-29. ESRD: <15 (or dialysis). Used for drug dosing adjustments. Note: CG may overestimate in obesity or edema.'
}
export default calcDef
