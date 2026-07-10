import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ sodiumMg: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'sodiumMg', label:'Daily Sodium Intake (mg)', type:'number', min:0, step:'10' }],
  compute: (v) => { const s=parseFloat(v.sodiumMg)||2300; const rec=2300; const ideal=1500; const pctRec=(s/rec)*100; const status=s>rec?'Above recommendation':s>ideal?'Above ideal but within limit':'Within ideal range'; return { result:s, label:'Sodium Intake', unit:'mg', steps:[{ label:'Your Intake', value:s.toFixed(0)+' mg' },{ label:'vs. Limit (2300mg)', value:pctRec.toFixed(0)+'%' },{ label:'Ideal (<1500mg)', value:'---' },{ label:'Status', value:status }] } },
  description: 'Assesses daily sodium intake against recommended limits for cardiovascular health.',
  formula: 'AHA recommends <2,300 mg/day (ideal: <1,500 mg/day). Most adults consume ~3,400 mg/day.',
  interpretation: 'Reduce sodium to <2,300 mg/day. Ideal is <1,500 mg/day (esp. for hypertension, >51 years, or African American).'
}
export default calcDef