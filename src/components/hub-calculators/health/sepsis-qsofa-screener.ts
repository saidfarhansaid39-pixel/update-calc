import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ rr: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), sbp: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), alteredMentation: z.string().min(1,'Required') }),
  fields: [{ name:'rr', label:'Respiratory Rate (breaths/min)', type:'number', min:5, max:60, step:'1' }, { name:'sbp', label:'Systolic BP (mmHg)', type:'number', min:40, max:250, step:'1' }, { name:'alteredMentation', label:'Altered Mentation (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }],
  compute: (v) => { const rr=parseFloat(v.rr)||18; const sbp=parseFloat(v.sbp)||120; const ams=parseFloat(v.alteredMentation)||0; const score=(rr>=22?1:0)+(sbp<=100?1:0)+ams; return { result:score, label:'qSOFA Score', steps:[{ label:'RR≥22', value:(rr>=22?'1':'0') },{ label:'SBP≤100', value:(sbp<=100?'1':'0') },{ label:'Altered Mentation', value:(ams?'1':'0') },{ label:'Total', value:score.toFixed(0)+'/3' }] } },
  description: 'Quick SOFA (qSOFA) identifies patients at high risk of poor outcomes from suspected sepsis outside the ICU.',
  formula: 'Score = RR≥22(1) + SBP≤100(1) + Altered mentation(1). Range 0-3.',
  interpretation: 'Score ≥2: high risk of sepsis-related mortality (OR 3-14). Immediate assessment of organ dysfunction, lactate measurement, and consider ICU transfer. Score <2: lower risk, continue monitoring.'
}
export default calcDef
