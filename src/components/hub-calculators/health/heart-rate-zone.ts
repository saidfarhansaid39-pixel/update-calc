import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=1,'≥1'), restHR: z.string().min(1,'Required').refine(v=>parseFloat(v)>=30,'≥30') }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:1, max:120, step:'1' }, { name:'restHR', label:'Resting HR (bpm)', type:'number', min:30, max:150, step:'1' }],
  compute: (v) => { const a=parseFloat(v.age)||30; const r=parseFloat(v.restHR)||70; const maxHR=220-a; const hrr=maxHR-r; const z1={low:Math.round(hrr*0.5+r),high:Math.round(hrr*0.6+r),name:'Zone 1 (Recovery)'}; const z2={low:Math.round(hrr*0.6+r),high:Math.round(hrr*0.7+r),name:'Zone 2 (Fat Burn)'}; const z3={low:Math.round(hrr*0.7+r),high:Math.round(hrr*0.8+r),name:'Zone 3 (Aerobic)'}; const z4={low:Math.round(hrr*0.8+r),high:Math.round(hrr*0.9+r),name:'Zone 4 (Threshold)'}; const z5={low:Math.round(hrr*0.9+r),high:maxHR,name:'Zone 5 (Maximal)'}; return { result:maxHR, label:'Max HR (220-age)', unit:'bpm', steps:[{ label:z1.name, value:z1.low+'-'+z1.high+' bpm' },{ label:z2.name, value:z2.low+'-'+z2.high+' bpm' },{ label:z3.name, value:z3.low+'-'+z3.high+' bpm' },{ label:z4.name, value:z4.low+'-'+z4.high+' bpm' },{ label:z5.name, value:z5.low+'-'+z5.high+' bpm' }] } },
  description: 'Heart rate training zones using Karvonen formula for exercise prescription.',
  formula: 'Zone = (HRR × % + RHR). HRR = (220-age)-RHR. Z1:50-60%, Z2:60-70%, Z3:70-80%, Z4:80-90%, Z5:90-100%.',
  interpretation: 'Zone 2: fat oxidation, endurance base. Zone 3: aerobic capacity. Zone 4-5: high-intensity, VO2max.'
}

export default calcDef
