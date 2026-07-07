import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ heartRate: z.string().min(1,'Required').refine(v=>parseFloat(v)>=20,'≥20'), strokeVolumeMl: z.string().min(1,'Required').refine(v=>parseFloat(v)>=10,'≥10'), bsa: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'heartRate', label:'Heart Rate (bpm)', type:'number', min:20, max:300, step:'1' }, { name:'strokeVolumeMl', label:'Stroke Volume (mL)', type:'number', min:10, max:250, step:'1' }, { name:'bsa', label:'BSA (m²)', type:'number', min:0.5, max:3, step:'0.01' }],
  compute: (v) => { const hr=parseFloat(v.heartRate)||70; const sv=parseFloat(v.strokeVolumeMl)||70; const bsa=parseFloat(v.bsa)||1.8; const co=hr*sv/1000; const ci=co/bsa; return { result:ci, label:'Cardiac Index', unit:'L/min/m²', steps:[{ label:'CO = HR×SV', value:co.toFixed(2) },{ label:'CI = CO/BSA', value:ci.toFixed(2) }] } },
  description: 'Cardiac index (CI) normalizing cardiac output to body surface area.',
  formula: 'CO = HR×SV. CI = CO/BSA. Normal: 2.6-4.2 L/min/m².',
  interpretation: 'Low CI (<2.2): cardiogenic shock. High CI (>4.2): sepsis, hyperdynamic state.'
}

export default calcDef
