import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ hemoglobin: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), hematocrit: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), age: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'>=0'), gender: z.string().min(1), mcv: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), ferritin: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0') }),
  fields: [
    { name:'hemoglobin', label:'Hemoglobin (g/dL)', type:'number', min:0, max:25, step:'0.1' },
    { name:'hematocrit', label:'Hematocrit (%)', type:'number', min:0, max:70, step:'0.1' },
    { name:'age', label:'Age (years)', type:'number', min:0, max:120, step:'1' },
    { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] },
    { name:'mcv', label:'MCV (fL)', type:'number', min:50, max:150, step:'1' },
    { name:'ferritin', label:'Ferritin (ng/mL)', type:'number', min:0, max:2000, step:'1' }
  ],
  compute: (v) => { const hgb=parseFloat(v.hemoglobin)||13; const hct=parseFloat(v.hematocrit)||40; const age=parseInt(v.age)||30; const gender=v.gender||'female'; const mcv=parseFloat(v.mcv)||90; const fer=parseFloat(v.ferritin)||50; let threshold=12; if(gender==='male') threshold=13; if(age<12) threshold=11.5; if(age<5) threshold=11; const hasAnemia=hgb<threshold; let type='Normal'; if(hasAnemia){ if(mcv<80) type='Microcytic (likely iron deficiency)'; else if(mcv>100) type='Macrocytic (B12/folate deficiency)'; else type='Normocytic (consider chronic disease, renal, hemolysis)' }; let severity='None'; if(hasAnemia){ if(hgb<7) severity='Severe'; else if(hgb<10) severity='Moderate'; else severity='Mild' }; const ironDef=fer<30?'Likely iron deficient':fer<75?'Possible iron deficiency':'Normal iron stores'; return { result:parseFloat(hgb.toFixed(1)), label:'Hemoglobin', unit:'g/dL', steps:[{ label:'Hemoglobin', value:hgb.toFixed(1)+' g/dL' },{ label:'Threshold', value:threshold+' g/dL' },{ label:'Anemia Status', value:hasAnemia?'Anemic':'Normal' },{ label:'Severity', value:severity },{ label:'Type (by MCV)', value:type },{ label:'Iron Status', value:ironDef }] } },
  description: 'Anemia assessment tool evaluating hemoglobin, cell indices, and iron status.',
  formula: 'WHO anemia thresholds: children 6mo-5yr <11, 5-12yr <11.5, adult female <12, adult male <13. MCV <80 microcytic, >100 macrocytic.',
  interpretation: 'Ferritin <30 ng/mL indicates iron depletion. MCV helps differentiate microcytic (iron deficiency) vs macrocytic (B12/folate) anemia.'
}
export default calcDef
