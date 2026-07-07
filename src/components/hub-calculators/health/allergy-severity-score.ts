import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ symptoms: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), duration: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), impact: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'symptoms', label:'Symptom Severity (0-10)', type:'number', min:0, max:10, step:'1' }, { name:'duration', label:'Duration Score (0-5)', type:'number', min:0, max:5, step:'1' }, { name:'impact', label:'Daily Impact (0-5)', type:'number', min:0, max:5, step:'1' }],
  compute: (v) => { const s=parseInt(v.symptoms)||0; const d=parseInt(v.duration)||0; const i=parseInt(v.impact)||0; const total=s+d+i; const sev=total<=5?'Mild':total<=10?'Moderate':total<=15?'Severe':'Very Severe'; return { result:total, label:'Allergy Severity', unit:'', steps:[{ label:'Symptoms', value:s.toString() },{ label:'Duration', value:d.toString() },{ label:'Impact', value:i.toString() },{ label:'Total (0-20)', value:total.toString() }] } },
  description: 'Composite allergy severity score across symptoms, duration, and functional impact.',
  formula: 'Score = Symptoms(0-10) + Duration(0-5) + Impact(0-5). Range 0-20.',
  interpretation: '0-5: Mild; 6-10: Moderate; 11-15: Severe, consider specialist; 16-20: Very severe.'
}

export default calcDef
