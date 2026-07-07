import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ rmssd: z.string().min(1,'Required').refine(v=>parseFloat(v)>=1,'≥1'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18') }),
  fields: [{ name:'rmssd', label:'RMSSD (ms)', type:'number', min:1, max:500, step:'1' }, { name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }],
  compute: (v) => { const rmssd=parseFloat(v.rmssd)||40; const a=parseFloat(v.age)||40; const expected=50-a*0.3; const pct=rmssd/expected*100; const status=pct>=80?'Good HRV (>80% of expected)':pct>=50?'Moderate HRV':'Low HRV (<50% of expected)'; return { result:rmssd, label:'RMSSD', unit:'ms', steps:[{ label:'RMSSD', value:rmssd.toString() },{ label:'Expected for Age', value:expected.toFixed(0)+' ms' },{ label:'% of Expected', value:pct.toFixed(0)+'%' },{ label:'Status', value:status }] } },
  description: 'Heart rate variability (HRV) assessment via RMSSD for autonomic function.',
  formula: 'RMSSD (root mean square of successive differences). Higher = better vagal tone. Expected ~50-age×0.3 ms.',
  interpretation: 'High HRV: good cardiovascular fitness, stress resilience. Low HRV: stress, overtraining, CVD risk.'
}

export default calcDef
