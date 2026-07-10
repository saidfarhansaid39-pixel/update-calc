import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ peakHR: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), after1minHR: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'peakHR', label:'Peak Exercise HR (bpm)', type:'number', min:60, max:250, step:'1' }, { name:'after1minHR', label:'HR After 1 Min Rest (bpm)', type:'number', min:30, max:250, step:'1' }],
  compute: (v) => { const peak=parseFloat(v.peakHR)||160; const after=parseFloat(v.after1minHR)||130; const rec=peak-after; return { result:rec, label:'Recovery Heart Rate', unit:'bpm drop', steps:[{ label:'Peak HR', value:peak.toFixed(0)+' bpm' },{ label:'HR after 1 min', value:after.toFixed(0)+' bpm' },{ label:'HR Drop', value:rec.toFixed(0)+' bpm' }] } },
  description: 'Heart rate recovery is the decrease in heart rate after peak exercise, reflecting parasympathetic reactivation.',
  formula: 'HRR = HRpeak - HR@1min recovery',
  interpretation: 'Normal HRR: >18 bpm drop at 1 min. <12 bpm drop is abnormal and associated with increased cardiovascular mortality. Abnormal HRR is a strong predictor of all-cause mortality.'
}
export default calcDef
