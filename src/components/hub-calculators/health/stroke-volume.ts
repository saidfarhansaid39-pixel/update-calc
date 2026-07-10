import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ cardiacOutput: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), heartRate: z.string().min(1,'Required').refine(v=>parseFloat(v)>30,'>30') }),
  fields: [{ name:'cardiacOutput', label:'Cardiac Output (L/min)', type:'number', min:1, step:'0.1' }, { name:'heartRate', label:'Heart Rate (bpm)', type:'number', min:30, max:220, step:'1' }],
  compute: (v) => { const co=parseFloat(v.cardiacOutput)||5; const hr=parseFloat(v.heartRate)||70; const sv=(co/hr)*1000; return { result:sv, label:'Stroke Volume', unit:'mL/beat', steps:[{ label:'Cardiac Output', value:co.toFixed(2)+' L/min' },{ label:'Heart Rate', value:hr.toFixed(0)+' bpm' },{ label:'Stroke Volume', value:sv.toFixed(1)+' mL/beat' }] } },
  description: 'Stroke volume is the amount of blood ejected by the left ventricle per beat.',
  formula: 'SV = (CO / HR) × 1000',
  interpretation: 'Normal stroke volume: 60-120 mL/beat at rest. Low SV may indicate heart failure, hypovolemia, or cardiomyopathy. High SV may indicate athletic heart or hyperdynamic circulation.'
}
export default calcDef
