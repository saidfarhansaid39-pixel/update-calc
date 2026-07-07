import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ feverPresent: z.string().min(1,'Required'), soreThroat: z.string().min(1,'Required'), lymphadenopathy: z.string().min(1,'Required'), fatigueDuration: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0') }),
  fields: [{ name:'feverPresent', label:'Fever Present?', type:'select', options:[{value:'yes',label:'Yes'},{value:'no',label:'No'}] }, { name:'soreThroat', label:'Severe Sore Throat?', type:'select', options:[{value:'yes',label:'Yes'},{value:'no',label:'No'}] }, { name:'lymphadenopathy', label:'Posterior Cervical LAD?', type:'select', options:[{value:'yes',label:'Yes'},{value:'no',label:'No'}] }, { name:'fatigueDuration', label:'Fatigue Duration (days)', type:'number', min:0, step:'1' }],
  compute: (v) => { const fever=v.feverPresent||'no'; const throat=v.soreThroat||'no'; const lad=v.lymphadenopathy||'no'; const fat=parseFloat(v.fatigueDuration)||0; let score=0; if(fever==='yes')score+=2; if(throat==='yes')score+=2; if(lad==='yes')score+=3; if(fat>7)score+=2; if(fat>14)score+=1; let risk='Low'; if(score>=6)risk='High'; else if(score>=4)risk='Moderate'; return { result:risk, label:'Mono Risk', unit:'', steps:[{ label:'Fever', value:fever==='yes'?'Present':'Absent' },{ label:'Sore Throat', value:throat==='yes'?'Severe':'Mild/None' },{ label:'Posterior Cervical LAD', value:lad==='yes'?'Present':'Absent' },{ label:'Fatigue Duration', value:fat.toFixed(0)+' days' },{ label:'Clinical Score', value:score.toFixed(0) },{ label:'Risk Level', value:risk }] } },
  description: 'Mononucleosis (EBV) risk assessment based on classic clinical triad: fever, pharyngitis, lymphadenopathy.',
  formula: 'Scoring: fever (+2), sore throat (+2), posterior cervical LAD (+3), fatigue >7d (+2), >14d (+1). ≥6: high risk.',
  interpretation: 'High (≥6): Strongly consider EBV serology (Monospot, EBV VCA IgM). Moderate (4-5): Consider testing. Low (<4): Alternative diagnoses likely.'
}

export default calcDef
