import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ pain: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), stiffness: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), function: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'pain', label:'Pain (0-10)', type:'number', min:0, max:10, step:'1' }, { name:'stiffness', label:'Stiffness (0-10)', type:'number', min:0, max:10, step:'1' }, { name:'function', label:'Functional Impairment (0-10)', type:'number', min:0, max:10, step:'1' }],
  compute: (v) => { const p=parseInt(v.pain)||0; const s=parseInt(v.stiffness)||0; const f=parseInt(v.function)||0; const total=p+s+f; const sev=total<=5?'Minimal':total<=10?'Mild':total<=18?'Moderate':'Severe'; return { result:total, label:'Arthritis Severity', unit:'', steps:[{ label:'Pain', value:p.toString() },{ label:'Stiffness', value:s.toString() },{ label:'Function', value:f.toString() },{ label:'Total (0-30)', value:total.toString() }] } },
  description: 'Composite arthritis severity combining pain, morning stiffness, and functional limitation.',
  formula: 'ASI = Pain(0-10) + Stiffness(0-10) + Function(0-10). Range 0-30.',
  interpretation: '0-5: Minimal; 6-10: Mild; 11-18: Moderate - consider escalation; 19-30: Severe - rheumatology referral.'
}

export default calcDef
