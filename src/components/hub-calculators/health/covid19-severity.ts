import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18'), oxygenSat: z.string().min(1,'Required').refine(v=>parseFloat(v)>=50,'≥50'), respiratoryRate: z.string().min(1,'Required').refine(v=>parseFloat(v)>=5,'≥5'), comorbidities: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), crp: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }, { name:'oxygenSat', label:'O₂ Saturation (%)', type:'number', min:50, max:100, step:'1' }, { name:'respiratoryRate', label:'Respiratory Rate', type:'number', min:5, max:80, step:'1' }, { name:'comorbidities', label:'Comorbidity Count', type:'number', min:0, max:10, step:'1' }, { name:'crp', label:'CRP (mg/L)', type:'number', min:0, max:500, step:'1' }],
  compute: (v) => { const a=parseFloat(v.age)||40; const spo2=parseFloat(v.oxygenSat)||98; const rr=parseFloat(v.respiratoryRate)||16; const com=parseFloat(v.comorbidities)||0; const crp=parseFloat(v.crp)||5; const sev=(a>65?2:a>50?1:0)+(spo2<90?3:spo2<94?2:0)+(rr>30?3:rr>24?2:rr>20?1:0)+(com>2?2:com>0?1:0)+(crp>100?3:crp>40?2:crp>10?1:0); const cat=sev<=3?'Mild - home monitoring':sev<=6?'Moderate - hospital admission':sev<=9?'Severe - oxygen+monitoring':'Critical - ICU indicated'; return { result:sev, label:'COVID-19 Severity', unit:'', steps:[{ label:'Age', value:(a>65?2:a>50?1:0).toString() },{ label:'SpO₂', value:(spo2<90?3:spo2<94?2:0).toString() },{ label:'RR', value:(rr>30?3:rr>24?2:rr>20?1:0).toString() },{ label:'Comorbidities', value:(com>2?2:com>0?1:0).toString() },{ label:'CRP', value:(crp>100?3:crp>40?2:crp>10?1:0).toString() },{ label:'Total', value:sev.toString() },{ label:'Category', value:cat }] } },
  description: 'COVID-19 severity stratification using age, oxygenation, inflammation, and comorbidities.',
  formula: 'Score = Age + SpO₂ + RR + Comorbidities + CRP. Adapted from WHO ordinal scale.',
  interpretation: '≤3: Mild, home. 4-6: Moderate, hospital. 7-9: Severe, O₂. ≥10: Critical, ICU.'
}

export default calcDef
