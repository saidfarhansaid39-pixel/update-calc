import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseInt(v)>=18,'>=18'), ards: z.string().min(1), arf: z.string().min(1), giAnticoag: z.string().min(1), lactic: z.string().min(1), baseDeficit: z.string().min(1) }),
  fields: [
    { name:'age', label:'Age (years)', type:'number', min:18, max:100, step:'1' },
    { name:'ards', label:'ARDS (PaO2/FiO2 <300)', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (1)', value:'1' }] },
    { name:'arf', label:'Acute Renal Failure (Cr >2.5)', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (1)', value:'1' }] },
    { name:'giAnticoag', label:'GI Bleed on Anticoagulants', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (1)', value:'1' }] },
    { name:'lactic', label:'Lactic Acid (>5 mmol/L)', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (1)', value:'1' }] },
    { name:'baseDeficit', label:'Base Deficit (-5 to -10 mEq/L)', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (1)', value:'1' }] }
  ],
  compute: (v) => { const a=parseInt(v.age)||45; let agePts=0; if(a>=70) agePts=2; else if(a>=55) agePts=1; const ards=parseInt(v.ards||'0'); const arf=parseInt(v.arf||'0'); const gi=parseInt(v.giAnticoag||'0'); const lac=parseInt(v.lactic||'0'); const bd=parseInt(v.baseDeficit||'0'); const score=agePts+ards+arf+gi+lac+bd; let sev='Mild'; if(score>=5) sev='Severe'; else if(score>=3) sev='Moderate'; return { result:score, label:'Glasgow-IMS Score', unit:'/8', steps:[{ label:'Age Points', value:agePts+'/2' },{ label:'Organ Failure Points', value:(ards+arf+gi+lac+bd)+'/6' },{ label:'Glasgow-IMS Score', value:score+'/8' }] } },
  description: 'Glasgow-IMS (Imrie Modified Score) for acute pancreatitis severity assessment.',
  formula: 'Age>55(1)/>70(2) + ARDS + ARF + GI bleed + Lactic >5 + Base deficit. Range 0-8.',
  interpretation: '0-2 Mild pancreatitis, 3-4 Moderate, ≥5 Severe with higher morbidity/mortality.'
}
export default calcDef
