import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), restHR: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:18, max:100, step:'1' }, { name:'restHR', label:'Resting Heart Rate (bpm)', type:'number', min:30, max:120, step:'1' }],
  compute: (v) => { const a=parseFloat(v.age)||30; const rhr=parseFloat(v.restHR)||70; const hrmax=208-0.7*a; const vo2=15.3*(hrmax/rhr); return { result:vo2, label:'Estimated VO₂max', unit:'mL/kg/min', steps:[{ label:'Max HR', value:hrmax.toFixed(0)+' bpm' },{ label:'Resting HR', value:rhr.toFixed(0)+' bpm' },{ label:'VO₂max', value:vo2.toFixed(1)+' mL/kg/min' }] } },
  description: 'VO₂max is the maximum rate of oxygen consumption during exercise, a key measure of cardiorespiratory fitness.',
  formula: 'HRmax = 208 - 0.7 × Age (Tanaka). VO₂max = 15.3 × (HRmax / HRrest) (Uth-Nymann).',
  interpretation: 'VO₂max >40 mL/kg/min is good for men >40. VO₂max >35 for women >40. Elite athletes: 60-80. Higher values indicate better cardiovascular fitness.'
}
export default calcDef
