import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ nausea: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), tremor: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), sweats: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), anxiety: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), agitation: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), orientation: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'nausea', label:'Nausea/Vomiting (0-7)', type:'number', min:0, max:7, step:'1' }, { name:'tremor', label:'Tremor (0-7)', type:'number', min:0, max:7, step:'1' }, { name:'sweats', label:'Paroxysmal Sweats (0-7)', type:'number', min:0, max:7, step:'1' }, { name:'anxiety', label:'Anxiety (0-7)', type:'number', min:0, max:7, step:'1' }, { name:'agitation', label:'Agitation (0-7)', type:'number', min:0, max:7, step:'1' }, { name:'orientation', label:'Orientation (0-4)', type:'number', min:0, max:4, step:'1' }],
  compute: (v) => { const n=parseInt(v.nausea)||0; const t=parseInt(v.tremor)||0; const s=parseInt(v.sweats)||0; const ax=parseInt(v.anxiety)||0; const ag=parseInt(v.agitation)||0; const o=parseInt(v.orientation)||0; const total=n+t+s+ax+ag+o; const sev=total<=8?'Mild withdrawal':total<=15?'Moderate withdrawal':total<=20?'Severe withdrawal':'Very severe'; const rec=total<8?'Monitor, supportive care':total<15?'Consider benzodiazepine protocol':total<20?'Benzodiazepine protocol indicated':'ICU-level care recommended'; return { result:total, label:'CIWA-Ar Score', unit:'', steps:[{ label:'Score (0-39)', value:total.toString() },{ label:'Severity', value:sev },{ label:'Recommendation', value:rec }] } },
  description: 'Clinical Institute Withdrawal Assessment for Alcohol - Revised (CIWA-Ar).',
  formula: 'Sum of 10 items (6 summarized). ≥8: mild; 15: moderate; ≥20: severe withdrawal.',
  interpretation: '<8: Monitor. 8-15: Symptom-triggered benzodiazepines. >15: Protocol-driven. >20: ICU.'
}

export default calcDef
