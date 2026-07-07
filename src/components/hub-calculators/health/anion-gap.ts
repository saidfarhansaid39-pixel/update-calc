import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ sodium: z.string().min(1,'Required').refine(v=>parseFloat(v)>=100,'≥100'), chloride: z.string().min(1,'Required').refine(v=>parseFloat(v)>=60,'≥60'), bicarbonate: z.string().min(1,'Required').refine(v=>parseFloat(v)>=5,'≥5') }),
  fields: [{ name:'sodium', label:'Sodium (mEq/L)', type:'number', min:100, max:180, step:'1' }, { name:'chloride', label:'Chloride (mEq/L)', type:'number', min:60, max:140, step:'1' }, { name:'bicarbonate', label:'HCO₃⁻ (mEq/L)', type:'number', min:5, max:50, step:'1' }],
  compute: (v) => { const na=parseFloat(v.sodium)||140; const cl=parseFloat(v.chloride)||100; const hco3=parseFloat(v.bicarbonate)||24; const ag=na-cl-hco3; const type=ag>12?'High AG (MUDPILES)':ag<6?'Low AG - hypoalbuminemia':'Normal AG'; return { result:ag, label:'Anion Gap', unit:'mEq/L', steps:[{ label:'AG = Na-Cl-HCO₃', value:ag.toFixed(1) },{ label:'Interpretation', value:type }] } },
  description: 'Serum anion gap differentiates metabolic acidosis etiologies.',
  formula: 'AG = Na - Cl - HCO₃. Normal 6-12 mEq/L. Corrected AG = AG + 2.5×(4.4-albumin).',
  interpretation: 'High AG: lactate, ketoacids, toxins, uremia. Normal AG: diarrhea, RTA. Low AG: hypoalbuminemia, myeloma.'
}

export default calcDef
