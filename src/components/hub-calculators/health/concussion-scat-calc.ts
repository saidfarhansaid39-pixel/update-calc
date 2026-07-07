import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ symptoms: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), cognition: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), balance: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'symptoms', label:'Symptom Severity (0-132)', type:'number', min:0, max:132, step:'1' }, { name:'cognition', label:'Cognitive Score (0-30)', type:'number', min:0, max:30, step:'1' }, { name:'balance', label:'Balance Error Score (0-30)', type:'number', min:0, max:30, step:'1' }],
  compute: (v) => { const sym=parseInt(v.symptoms)||0; const cog=parseInt(v.cognition)||0; const bal=parseInt(v.balance)||0; const total=sym+cog+bal; const sev=total<=20?'Mild':total<=50?'Moderate':'Severe'; return { result:total, label:'SCAT Score', unit:'', steps:[{ label:'Symptom Score', value:sym.toString() },{ label:'Cognitive Score', value:cog.toString() },{ label:'Balance Errors', value:bal.toString() },{ label:'Total', value:total.toString() }] } },
  description: 'Sport Concussion Assessment Tool (SCAT) composite scoring.',
  formula: 'SCAT = Symptom severity (0-132) + Cognitive (0-30) + Balance (0-30).',
  interpretation: 'Higher score = greater concussion severity. Immediate removal from play. No return-to-play until asymptomatic at rest and exertion.'
}

export default calcDef
