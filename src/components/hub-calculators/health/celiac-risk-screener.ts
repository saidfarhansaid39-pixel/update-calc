import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ symptoms: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), familyHistory: z.enum(['yes','no']), autoimmune: z.enum(['yes','no']) }),
  fields: [{ name:'symptoms', label:'GI Symptom Score (0-10)', type:'number', min:0, max:10, step:'1' }, { name:'familyHistory', label:'Family History of Celiac', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'autoimmune', label:'Personal Autoimmune Disease', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }],
  compute: (v) => { const s=parseInt(v.symptoms)||0; const f=v.familyHistory||'no'; const a=v.autoimmune||'no'; const score=s+(f==='yes'?3:0)+(a==='yes'?2:0); const rec=score>=8?'High - tTG-IgA serology strongly recommended':score>=5?'Moderate - consider celiac panel':'Low - celiac unlikely'; return { result:score, label:'Celiac Risk Score', unit:'', steps:[{ label:'Symptoms', value:s.toString() },{ label:'Family History', value:(f==='yes'?3:0).toString() },{ label:'Autoimmune', value:(a==='yes'?2:0).toString() },{ label:'Total', value:score.toString() }] } },
  description: 'Celiac disease risk screening using symptoms, family history, and autoimmune comorbidity.',
  formula: 'Score = GI Sx(0-10) + Family Hx(3) + Autoimmune(2). tTG-IgA is first-line test.',
  interpretation: 'Low <5: celiac unlikely. Moderate 5-7: consider serology. High ≥8: tTG-IgA strongly recommended.'
}

export default calcDef
