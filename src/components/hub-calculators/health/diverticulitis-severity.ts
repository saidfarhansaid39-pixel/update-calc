import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ pain: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), fever: z.string().min(1,'Required').refine(v=>parseFloat(v)>=35,'≥35'), wbc: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18'), comorbidity: z.enum(['none','mild','significant']) }),
  fields: [{ name:'pain', label:'Abdominal Pain (0-10)', type:'number', min:0, max:10, step:'1' }, { name:'fever', label:'Temperature (°C)', type:'number', min:35, max:42, step:'0.1' }, { name:'wbc', label:'WBC (×10³/µL)', type:'number', min:0, max:50, step:'0.1' }, { name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }, { name:'comorbidity', label:'Comorbidity', type:'select', options:[{ label:'None', value:'none' },{ label:'Mild', value:'mild' },{ label:'Significant', value:'significant' }] }],
  compute: (v) => { const p=parseInt(v.pain)||0; const t=parseFloat(v.fever)||37; const w=parseFloat(v.wbc)||8; const a=parseFloat(v.age)||40; const c=v.comorbidity||'none'; const sev=(p>6?2:p>3?1:0)+(t>38.5?2:t>38?1:0)+(w>12?2:w>10?1:0)+(a>65?2:a>50?1:0)+(c==='significant'?2:c==='mild'?1:0); const cat=sev<=3?'Mild - outpatient abx':sev<=6?'Moderate - admit for IV abx':'Severe - surgical consult'; return { result:sev, label:'Diverticulitis Severity', unit:'', steps:[{ label:'Score', value:sev.toString() },{ label:'Management', value:cat }] } },
  description: 'Acute diverticulitis severity for admission and antibiotic decision-making.',
  formula: 'Pain(0-2)+Fever(0-2)+WBC(0-2)+Age(0-2)+Comorbidity(0-2). Range 0-10.',
  interpretation: '≤3: Outpatient oral antibiotics. 4-6: IV antibiotics, admit. ≥7: Severe, surgical consultation.'
}

export default calcDef
