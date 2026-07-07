import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hba1c: z.string().min(1,'Required').refine(v=>parseFloat(v)>=3,'≥3') }),
  fields: [{ name:'hba1c', label:'HbA1c (%)', type:'number', min:3, max:20, step:'0.1' }],
  compute: (v) => { const a1c=parseFloat(v.hba1c)||5; const eag=(28.7*a1c-46.7); return { result:eag, label:'Estimated Avg Glucose', unit:'mg/dL', steps:[{ label:'eAG = 28.7×HbA1c-46.7', value:eag.toFixed(0)+' mg/dL ('+(eag/18).toFixed(1)+' mmol/L)' },{ label:'Target', value:a1c<7?'Good glycemic control':'Above target' }] } },
  description: 'Estimated average glucose (eAG) from HbA1c using ADAG formula.',
  formula: 'eAG (mg/dL) = 28.7 × HbA1c - 46.7. eAG (mmol/L) = 1.59 × HbA1c - 2.59.',
  interpretation: 'HbA1c 6% = eAG 126 mg/dL, 7% = 154, 8% = 183, 9% = 212, 10% = 240.'
}

export default calcDef
