import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ fasting: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), glucose1h: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), glucose2h: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'fasting', label:'Fasting Glucose (mg/dL)', type:'number', min:30, step:'1' }, { name:'glucose1h', label:'1-Hour Glucose (mg/dL)', type:'number', min:30, step:'1' }, { name:'glucose2h', label:'2-Hour Glucose (mg/dL)', type:'number', min:30, step:'1' }],
  compute: (v) => { const f=parseFloat(v.fasting)||100; const g1=parseFloat(v.glucose1h)||140; const g2=parseFloat(v.glucose2h)||120; const normF=f<100;const norm1=g1<180;const norm2=g2<140; const status=!normF||!norm1||!norm2?'Impaired':'Normal'; const auc=(f+g1*2+g2)*0.5; return { result:auc, label:'OGTT AUC', unit:'mg·h/dL', steps:[{ label:'Fasting', value:f.toFixed(0)+' mg/dL'+(f<100?' ✓':f<126?' ⚠':' ✗') },{ label:'1-Hour', value:g1.toFixed(0)+' mg/dL'+(g1<180?' ✓':' ✗') },{ label:'2-Hour', value:g2.toFixed(0)+' mg/dL'+(g2<140?' ✓':' ✗') },{ label:'Status', value:status },{ label:'AUC', value:auc.toFixed(0)+' mg·h/dL' }] } },
  description: 'Oral Glucose Tolerance Test interpretation with AUC calculation for diabetes screening.',
  formula: 'Normal: Fasting <100, 1h <180, 2h <140 mg/dL. AUC = (F + 2×G1 + G2) × 0.5.',
  interpretation: 'Fasting ≥126 or 2h ≥200 = diabetes. Fasting 100-125 or 2h 140-199 = pre-diabetic. Normal if all values below thresholds.'
}
export default calcDef