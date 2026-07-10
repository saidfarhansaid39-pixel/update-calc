import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ duration: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), exHR: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), restHR: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), maxHR: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'duration', label:'Exercise Duration (min)', type:'number', min:1, step:'1' }, { name:'exHR', label:'Exercise HR (bpm)', type:'number', min:50, max:250, step:'1' }, { name:'restHR', label:'Resting HR (bpm)', type:'number', min:30, max:120, step:'1' }, { name:'maxHR', label:'Max HR (bpm)', type:'number', min:100, max:250, step:'1' }],
  compute: (v) => { const d=parseFloat(v.duration)||30; const ex=parseFloat(v.exHR)||140; const rest=parseFloat(v.restHR)||70; const max=parseFloat(v.maxHR)||190; const trimp=d*(ex-rest)/(max-rest); return { result:trimp, label:'Training Impulse (TRIMP)', steps:[{ label:'Duration', value:d.toFixed(0)+' min' },{ label:'HR Reserve Used', value:((ex-rest)/(max-rest)*100).toFixed(1)+'%' },{ label:'TRIMP Score', value:trimp.toFixed(1) }] } },
  description: 'Training impulse quantifies the cardiovascular training load of a session using heart rate reserve.',
  formula: 'TRIMP = Duration × (HRex - HRrest) / (HRmax - HRrest)',
  interpretation: 'Higher TRIMP values indicate greater training load. Values vary by individual fitness. Track trends over time. A spike >30% above baseline suggests increased injury/overtraining risk.'
}
export default calcDef
