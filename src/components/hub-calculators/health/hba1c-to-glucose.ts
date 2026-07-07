import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hba1c: z.string().min(1,'Required').refine(v=>parseFloat(v)>=3,'≥3') }),
  fields: [{ name:'hba1c', label:'HbA1c (%)', type:'number', min:3, max:20, step:'0.1' }],
  compute: (v) => { const a1c=parseFloat(v.hba1c)||5; const eag=28.7*a1c-46.7; const eagMmol=eag/18; return { result:eag, label:'Estimated Avg Glucose', unit:'mg/dL', steps:[{ label:'eAG (mg/dL)', value:eag.toFixed(0) },{ label:'eAG (mmol/L)', value:eagMmol.toFixed(1) }] } },
  description: 'HbA1c to estimated average glucose conversion (ADAG study equation).',
  formula: 'eAG (mg/dL) = 28.7 × A1C - 46.7. mmol/L = mg/dL / 18.',
  interpretation: 'Each 1% change in HbA1c ≈ 29 mg/dL change in average glucose.'
}

export default calcDef
