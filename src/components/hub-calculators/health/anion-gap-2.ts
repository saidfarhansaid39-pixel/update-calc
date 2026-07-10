import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ sodium: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), chloride: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), bicarbonate: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'sodium', label:'Serum Sodium (mEq/L)', type:'number', min:100, max:170, step:'1' }, { name:'chloride', label:'Serum Chloride (mEq/L)', type:'number', min:60, max:140, step:'1' }, { name:'bicarbonate', label:'Serum Bicarbonate (mEq/L)', type:'number', min:5, max:45, step:'1' }],
  compute: (v) => { const na=parseFloat(v.sodium)||140; const cl=parseFloat(v.chloride)||104; const hco3=parseFloat(v.bicarbonate)||24; const ag=na-(cl+hco3); return { result:ag, label:'Anion Gap', unit:'mEq/L', steps:[{ label:'Sodium', value:na.toFixed(0)+' mEq/L' },{ label:'Chloride', value:cl.toFixed(0)+' mEq/L' },{ label:'Bicarbonate', value:hco3.toFixed(0)+' mEq/L' },{ label:'Anion Gap (Na - Cl - HCO₃)', value:ag.toFixed(0)+' mEq/L' }] } },
  description: 'Anion gap helps identify the cause of metabolic acidosis by measuring unmeasured anions.',
  formula: 'Anion Gap = Na⁺ - (Cl⁻ + HCO₃⁻)',
  interpretation: 'Normal: 8-12 mEq/L (or 6-10 with newer analyzers). High AG metabolic acidosis: MUDPILES (Methanol, Uremia, DKA, Paraldehyde, Isoniazid/starvation, Lactic acidosis, Ethylene glycol, Salicylates). Normal AG: HARDUP (Hyperal, ARI, RTA, Diarrhea, Ureterostomy, Pancreatic).'
}
export default calcDef
