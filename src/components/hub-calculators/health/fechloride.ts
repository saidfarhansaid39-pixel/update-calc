import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ serumCl: z.string().min(1,'Required').refine(v=>parseFloat(v)>=60,'≥60'), urineCl: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), serumCr: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0.1,'≥0.1'), urineCr: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'serumCl', label:'Serum Chloride (mEq/L)', type:'number', min:60, max:140, step:'1' }, { name:'urineCl', label:'Urine Chloride (mEq/L)', type:'number', min:0, max:300, step:'1' }, { name:'serumCr', label:'Serum Creatinine (mg/dL)', type:'number', min:0.1, max:20, step:'0.1' }, { name:'urineCr', label:'Urine Creatinine (mg/dL)', type:'number', min:0, max:500, step:'1' }],
  compute: (v) => { const sCl=parseFloat(v.serumCl)||100; const uCl=parseFloat(v.urineCl)||0; const sCr=parseFloat(v.serumCr)||1; const uCr=parseFloat(v.urineCr)||100; const feCl=(uCl*sCr)/(sCl*uCr)*100; const interp=feCl<1?'Hypochloremic (extrarenal)':feCl>3?'High Cl loss (renal)':'Normal'; return { result:feCl, label:'FE Chloride', unit:'%', steps:[{ label:'FE Chloride = (UCl×SCr)/(SCl×UCr)×100', value:feCl.toFixed(2) },{ label:'Interpretation', value:interp }] } },
  description: 'Fractional excretion of chloride for differential diagnosis of metabolic alkalosis.',
  formula: 'FE Chloride = (Urine Cl × Serum Cr)/(Serum Cl × Urine Cr) × 100%.',
  interpretation: '<1%: Extrarenal cause (vomiting, diuretic withdrawal). >3%: Renal cause (active diuretic, Bartter, hyperaldo).'
}

export default calcDef
