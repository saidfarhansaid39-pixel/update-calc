import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ qtInterval: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), rrInterval: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'qtInterval', label:'QT Interval (ms)', type:'number', min:200, max:600, step:'1' }, { name:'rrInterval', label:'RR Interval (ms)', type:'number', min:400, max:2000, step:'1' }],
  compute: (v) => { const qt=parseFloat(v.qtInterval)||400; const rr=parseFloat(v.rrInterval)||800; const qti=qt/Math.sqrt(rr/1000)*100/100; return { result:qti, label:'QTI', steps:[{ label:'QT Interval', value:qt.toFixed(0)+' ms' },{ label:'RR Interval', value:rr.toFixed(0)+' ms' },{ label:'QTI = QT/√RR', value:qti.toFixed(2) }] } },
  description: 'The QTI (QT Index) is a heart rate-corrected QT measurement used in clinical ECG interpretation.',
  formula: 'QTI = QT / √RR (Bazett correction)',
  interpretation: 'Normal QTI: 0.8-1.1. QTI >1.1 indicates prolonged repolarization. QTI >1.2 significantly increases arrhythmia risk. Values correlate with QTc but expressed as a dimensionless index.'
}
export default calcDef
