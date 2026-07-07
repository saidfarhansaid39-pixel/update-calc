import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ serumNa: z.string().min(1,'Required').refine(v=>parseFloat(v)>=100,'≥100'), urineNa: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), serumCr: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0.1,'≥0.1'), urineCr: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'serumNa', label:'Serum Na (mEq/L)', type:'number', min:100, max:180, step:'1' }, { name:'urineNa', label:'Urine Na (mEq/L)', type:'number', min:0, max:300, step:'1' }, { name:'serumCr', label:'Serum Creatinine (mg/dL)', type:'number', min:0.1, max:20, step:'0.1' }, { name:'urineCr', label:'Urine Creatinine (mg/dL)', type:'number', min:0, max:500, step:'1' }],
  compute: (v) => { const sNa=parseFloat(v.serumNa)||140; const uNa=parseFloat(v.urineNa)||0; const sCr=parseFloat(v.serumCr)||1; const uCr=parseFloat(v.urineCr)||100; const fena=(uNa*sCr)/(sNa*uCr)*100; const interp=fena<1?'Prerenal azotemia':fena>2?'Intrinsic renal (ATN)':'Borderline'; return { result:fena, label:'FENa', unit:'%', steps:[{ label:'FENa = (UNa×SCr)/(SNa×UCr)×100', value:fena.toFixed(2) },{ label:'Interpretation', value:interp }] } },
  description: 'Fractional excretion of sodium (FENa) for distinguishing prerenal vs intrinsic AKI.',
  formula: 'FENa = (Urine Na × Serum Cr)/(Serum Na × Urine Cr) × 100%.',
  interpretation: '<1%: Prerenal (volume responsive). >2%: Intrinsic renal (ATN, interstitial nephritis). 1-2%: Borderline.'
}

export default calcDef
