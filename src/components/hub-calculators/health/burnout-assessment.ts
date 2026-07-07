import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ exhaustion: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), cynicism: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), efficacy: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'exhaustion', label:'Exhaustion (0-10)', type:'number', min:0, max:10, step:'1' }, { name:'cynicism', label:'Cynicism (0-10)', type:'number', min:0, max:10, step:'1' }, { name:'efficacy', label:'Efficacy (0-10)', type:'number', min:0, max:10, step:'1' }],
  compute: (v) => { const e=parseInt(v.exhaustion)||0; const c=parseInt(v.cynicism)||0; const ef=parseInt(v.efficacy)||0; const total=e+c+(10-ef); const sev=total<=5?'Low':total<=10?'Mild':total<=15?'Moderate':total<=20?'High':'Severe'; return { result:total, label:'Burnout Score', unit:'', steps:[{ label:'Exhaustion', value:e.toString() },{ label:'Cynicism', value:c.toString() },{ label:'Inverted Efficacy', value:(10-ef).toString() },{ label:'Total (0-30)', value:total.toString() }] } },
  description: 'Burnout assessment via Maslach dimensions: exhaustion, cynicism, efficacy.',
  formula: 'Score = Exhaustion + Cynicism + (10-Efficacy). Higher = greater burnout risk.',
  interpretation: '0-5: Low; 6-10: Monitor; 11-15: Moderate - intervene; 16-20: High - seek support; >20: Severe - professional help.'
}

export default calcDef
