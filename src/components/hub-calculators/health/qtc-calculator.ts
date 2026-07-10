import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ qtInterval: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), rrInterval: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'qtInterval', label:'QT Interval (ms)', type:'number', min:200, max:600, step:'1' }, { name:'rrInterval', label:'RR Interval (ms)', type:'number', min:400, max:2000, step:'1' }],
  compute: (v) => { const qt=parseFloat(v.qtInterval)||400; const rr=parseFloat(v.rrInterval)||800; const qtc=qt/Math.sqrt(rr/1000); return { result:qtc, label:'QTc (Bazett)', unit:'ms', steps:[{ label:'QT Interval', value:qt.toFixed(0)+' ms' },{ label:'RR Interval', value:rr.toFixed(0)+' ms' },{ label:'QTc', value:qtc.toFixed(0)+' ms' }] } },
  description: 'QTc corrects the QT interval for heart rate using Bazett formula, important for arrhythmia risk assessment.',
  formula: 'QTc = QT / √(RR). Bazett formula.',
  interpretation: 'Normal QTc: men <450 ms, women <460 ms. Prolonged QTc (men ≥450, women ≥460) increases risk of torsades de pointes. QTc >500 ms indicates significant arrhythmia risk.'
}
export default calcDef
