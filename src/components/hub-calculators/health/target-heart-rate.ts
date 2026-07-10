import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), intensity: z.string().min(1,'Required').refine(v=>parseFloat(v)>=50&&parseFloat(v)<=100,'50-100%') }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:1, max:120, step:'1' }, { name:'intensity', label:'Target Intensity (%)', type:'number', min:50, max:100, step:'1' }],
  compute: (v) => { const a=parseFloat(v.age)||30; const i=parseFloat(v.intensity)||70; const hrmax=220-a; const thr=hrmax*(i/100); return { result:thr, label:'Target Heart Rate', unit:'bpm', steps:[{ label:'Max HR (220 - Age)', value:hrmax.toFixed(0)+' bpm' },{ label:'Intensity', value:i.toFixed(0)+'%' },{ label:'Target HR', value:thr.toFixed(0)+' bpm' }] } },
  description: 'Target heart rate estimates the ideal exercise heart rate based on age and intensity.',
  formula: 'THR = (220 - Age) × (Intensity / 100). Also known as the Fox formula.',
  interpretation: 'Moderate intensity: 50-70% of max HR. Vigorous intensity: 70-85% of max HR. For fitness, aim for 64-76% of HRmax. Always consult a physician before starting exercise.'
}
export default calcDef
