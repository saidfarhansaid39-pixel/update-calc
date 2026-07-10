import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ naUrine: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), naSerum: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), crUrine: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), crSerum: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'naUrine', label:'Urine Sodium (mEq/L)', type:'number', min:0, step:'1' }, { name:'naSerum', label:'Serum Sodium (mEq/L)', type:'number', min:100, max:170, step:'1' }, { name:'crUrine', label:'Urine Creatinine (mg/dL)', type:'number', min:0, step:'1' }, { name:'crSerum', label:'Serum Creatinine (mg/dL)', type:'number', min:0.1, step:'0.01' }],
  compute: (v) => { const una=parseFloat(v.naUrine)||50; const sna=parseFloat(v.naSerum)||140; const ucr=parseFloat(v.crUrine)||100; const scr=parseFloat(v.crSerum)||1; const fena=(una*scr)/(sna*ucr)*100; return { result:fena, label:'Fractional Excretion of Sodium', unit:'%', steps:[{ label:'Urine Na', value:una.toFixed(0)+' mEq/L' },{ label:'Serum Cr', value:scr.toFixed(2)+' mg/dL' },{ label:'Serum Na', value:sna.toFixed(0)+' mEq/L' },{ label:'Urine Cr', value:ucr.toFixed(0)+' mg/dL' },{ label:'FENa', value:fena.toFixed(2)+'%' }] } },
  description: 'FENa distinguishes between prerenal azotemia and intrinsic acute kidney injury (ATN).',
  formula: 'FENa = (Urine Na × Serum Cr) / (Serum Na × Urine Cr) × 100%',
  interpretation: 'FENa <1%: prerenal azotemia (decreased renal perfusion). FENa >2%: intrinsic AKI (ATN). 1-2%: indeterminate. Note: FENa may be <1% in contrast nephropathy and early GN. Diuretics increase FENa.'
}
export default calcDef
