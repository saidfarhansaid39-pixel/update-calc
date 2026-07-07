import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ cough: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), phlegm: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), dyspnea: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), activity: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), confidence: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), sleep: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), energy: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'cough', label:'Cough (0-5)', type:'number', min:0, max:5, step:'1' }, { name:'phlegm', label:'Phlegm (0-5)', type:'number', min:0, max:5, step:'1' }, { name:'dyspnea', label:'Dyspnea (0-5)', type:'number', min:0, max:5, step:'1' }, { name:'activity', label:'Activity Limitation (0-5)', type:'number', min:0, max:5, step:'1' }, { name:'confidence', label:'Confidence Leaving Home (0-5)', type:'number', min:0, max:5, step:'1' }, { name:'sleep', label:'Sleep (0-5)', type:'number', min:0, max:5, step:'1' }, { name:'energy', label:'Energy (0-5)', type:'number', min:0, max:5, step:'1' }],
  compute: (v) => { const c=parseInt(v.cough)||0; const p=parseInt(v.phlegm)||0; const d=parseInt(v.dyspnea)||0; const a=parseInt(v.activity)||0; const conf=parseInt(v.confidence)||0; const sl=parseInt(v.sleep)||0; const e=parseInt(v.energy)||0; const total=c+p+d+a+conf+sl+e; const sev=total<=10?'Low impact':total<=20?'Medium impact':total<=30?'High impact':'Very high impact'; return { result:total, label:'CAT Score', unit:'', steps:[{ label:'8 items (0-5 each)', value:total.toString()+'/40' },{ label:'Impact', value:sev }] } },
  description: 'COPD Assessment Test (CAT) quantifying COPD impact on daily life.',
  formula: 'CAT = Sum of 8 items scored 0-5. Total 0-40. MCID: 2-point change.',
  interpretation: '<10: Low; 10-20: Medium; 21-30: High; >30: Very high impact. Guide therapy escalation.'
}

export default calcDef
