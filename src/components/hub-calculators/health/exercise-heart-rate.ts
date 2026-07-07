import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=1,'≥1'), restHR: z.string().min(1,'Required').refine(v=>parseFloat(v)>=30,'≥30'), intensity: z.string().min(1,'Required').refine(v=>parseFloat(v)>=10,'≥10') }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:1, max:120, step:'1' }, { name:'restHR', label:'Resting HR (bpm)', type:'number', min:30, max:150, step:'1' }, { name:'intensity', label:'Intensity % (10-100)', type:'number', min:10, max:100, step:'5' }],
  compute: (v) => { const a=parseFloat(v.age)||30; const r=parseFloat(v.restHR)||70; const i=parseFloat(v.intensity)||70; const maxHR=220-a; const hrr=maxHR-r; const thr=hrr*i/100+r; const zone=i<50?'Very Light':i<60?'Light':i<70?'Moderate':i<80?'Vigorous':i<90?'Very Vigorous':'Maximal'; return { result:thr, label:'Target Heart Rate', unit:'bpm', steps:[{ label:'Max HR (220-age)', value:maxHR.toString() },{ label:'HR Reserve = MHR-RHR', value:hrr.toString() },{ label:'THR = HRR×I%+RHR', value:thr.toFixed(0) },{ label:'Zone', value:zone }] } },
  description: 'Target heart rate using Karvonen formula for exercise intensity prescription.',
  formula: 'THR = ((220-age)-RHR)×intensity% + RHR. Zone 2 (fat burn): 60-70%. Zone 4-5 (VO2max): 80-90%.',
  interpretation: '50-60%: warm-up/recovery. 60-70%: fat oxidation. 70-80%: aerobic fitness. 80-90%: anaerobic threshold.'
}

export default calcDef
