import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ heartRate: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), strokeVolume: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'heartRate', label:'Heart Rate (bpm)', type:'number', min:30, max:220, step:'1' }, { name:'strokeVolume', label:'Stroke Volume (mL/beat)', type:'number', min:20, max:200, step:'1' }],
  compute: (v) => { const hr=parseFloat(v.heartRate)||70; const sv=parseFloat(v.strokeVolume)||70; const co=hr*sv/1000; return { result:co, label:'Cardiac Output', unit:'L/min', steps:[{ label:'Heart Rate', value:hr.toFixed(0)+' bpm' },{ label:'Stroke Volume', value:sv.toFixed(0)+' mL' },{ label:'Cardiac Output', value:co.toFixed(2)+' L/min' }] } },
  description: 'Cardiac output is the volume of blood pumped by the heart per minute.',
  formula: 'CO = HR × SV / 1000',
  interpretation: 'Normal cardiac output: 4-8 L/min at rest. Low CO may indicate heart failure or hypovolemia. High CO may indicate sepsis, hyperthyroidism, or AV fistula. Cardiac index = CO/BSA (normal 2.5-4.0 L/min/m²).'
}
export default calcDef
