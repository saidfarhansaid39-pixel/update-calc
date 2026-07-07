import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ apob: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'apob', label:'ApoB (mg/dL)', type:'number', min:10, max:300, step:'1' }, { name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }],
  compute: (v) => { const apob=parseFloat(v.apob)||0; const a=parseFloat(v.age)||40; const target=a<40?80:60; const optimal=apob<target; return { result:apob, label:'Apolipoprotein B', unit:'mg/dL', steps:[{ label:'Measured ApoB', value:apob.toFixed(1) },{ label:'Target <'+target.toString(), value:optimal?'Achieved':(apob-target).toFixed(1)+' above' }] } },
  description: 'Apolipoprotein B as superior cardiovascular risk marker over LDL-C.',
  formula: 'Target: <80 mg/dL (low risk), <60 mg/dL (high risk) per ACC/AHA.',
  interpretation: 'Each 10 mg/dL ApoB reduction lowers CVD risk ~20%. ApoB captures all atherogenic particles.'
}

export default calcDef
