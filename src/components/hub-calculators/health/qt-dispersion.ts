import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ qtMax: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), qtMin: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'qtMax', label:'Maximum QT Interval (ms)', type:'number', min:300, max:700, step:'1' }, { name:'qtMin', label:'Minimum QT Interval (ms)', type:'number', min:200, max:600, step:'1' }],
  compute: (v) => { const max=parseFloat(v.qtMax)||450; const min=parseFloat(v.qtMin)||380; const disp=max-min; return { result:disp, label:'QT Dispersion', unit:'ms', steps:[{ label:'Max QT', value:max.toFixed(0)+' ms' },{ label:'Min QT', value:min.toFixed(0)+' ms' },{ label:'QT Dispersion', value:disp.toFixed(0)+' ms' }] } },
  description: 'QT dispersion reflects regional heterogeneity of ventricular repolarization.',
  formula: 'QTd = QTmax - QTmin (measured across 12-lead ECG)',
  interpretation: 'Normal: <40 ms. Borderline: 40-60 ms. Abnormal: >60 ms. Increased QT dispersion is associated with ventricular arrhythmias and sudden cardiac death risk.'
}
export default calcDef
