import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ heartRate: z.string().min(1,'Required').refine(v=>parseFloat(v)>=20,'≥20'), strokeVolumeMl: z.string().min(1,'Required').refine(v=>parseFloat(v)>=10,'≥10') }),
  fields: [{ name:'heartRate', label:'Heart Rate (bpm)', type:'number', min:20, max:300, step:'1' }, { name:'strokeVolumeMl', label:'Stroke Volume (mL)', type:'number', min:10, max:250, step:'1' }],
  compute: (v) => { const hr=parseFloat(v.heartRate)||70; const sv=parseFloat(v.strokeVolumeMl)||70; const co=hr*sv/1000; return { result:co, label:'Cardiac Output', unit:'L/min', steps:[{ label:'CO = HR × SV', value:co.toFixed(2) }] } },
  description: 'Cardiac output (Fick principle) from heart rate and stroke volume.',
  formula: 'CO (L/min) = HR (bpm) × SV (mL) / 1000. Normal: 4-8 L/min at rest.',
  interpretation: 'Low CO: heart failure, hypovolemia. High CO: sepsis, anemia, hyperthyroidism, AV fistula.'
}

export default calcDef
