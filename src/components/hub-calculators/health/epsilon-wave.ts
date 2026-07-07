import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ecgFindings: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), syncope: z.enum(['yes','no']), familyHx: z.enum(['yes','no']), pvcBurden: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'ecgFindings', label:'ECG Score (0-5)', type:'number', min:0, max:5, step:'1' }, { name:'syncope', label:'Syncope History', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'familyHx', label:'Family Hx of ARVC/SCD', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }, { name:'pvcBurden', label:'PVC Burden % (24h Holter)', type:'number', min:0, max:50, step:'1' }],
  compute: (v) => { const ecg=parseInt(v.ecgFindings)||0; const s=v.syncope||'no'; const f=v.familyHx||'no'; const pvc=parseFloat(v.pvcBurden)||0; const score=ecg+(s==='yes'?3:0)+(f==='yes'?2:0)+(pvc>10?2:pvc>5?1:0); const risk=score>=8?'High ARVC probability - cardiac MRI/EMB':score>=5?'Intermediate - advanced imaging':'Low - monitoring'; return { result:score, label:'ARVC Risk Score', unit:'', steps:[{ label:'ECG', value:ecg.toString() },{ label:'Syncope', value:(s==='yes'?3:0).toString() },{ label:'Family Hx', value:(f==='yes'?2:0).toString() },{ label:'PVC Burden', value:(pvc>10?2:pvc>5?1:0).toString() },{ label:'Total', value:score.toString() }] } },
  description: 'Arrhythmogenic RV cardiomyopathy (ARVC) risk screening using epsilon wave criteria.',
  formula: 'Score = ECG(0-5)+Syncope(3)+FamilyHx(2)+PVCs>10%(2)/>5%(1). TFC 2010 criteria.',
  interpretation: '<5: Low. 5-7: Consider MRI. ≥8: High probability - cardiology referral. Epsilon wave in V1-V3.'
}

export default calcDef
