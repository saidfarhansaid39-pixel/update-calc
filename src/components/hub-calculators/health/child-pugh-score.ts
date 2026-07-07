import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bilirubin: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), albumin: z.string().min(1,'Required').refine(v=>parseFloat(v)>=1,'≥1'), inr: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0.5,'≥0.5'), ascites: z.enum(['none','mild','moderate']), encephalopathy: z.enum(['none','grade1-2','grade3-4']) }),
  fields: [{ name:'bilirubin', label:'Bilirubin (mg/dL)', type:'number', min:0, max:50, step:'0.1' }, { name:'albumin', label:'Albumin (g/dL)', type:'number', min:1, max:6, step:'0.1' }, { name:'inr', label:'INR', type:'number', min:0.5, max:10, step:'0.1' }, { name:'ascites', label:'Ascites', type:'select', options:[{ label:'None', value:'none' },{ label:'Mild', value:'mild' },{ label:'Moderate', value:'moderate' }] }, { name:'encephalopathy', label:'Encephalopathy', type:'select', options:[{ label:'None', value:'none' },{ label:'Grade 1-2', value:'grade1-2' },{ label:'Grade 3-4', value:'grade3-4' }] }],
  compute: (v) => { const b=parseFloat(v.bilirubin)||1; const a=parseFloat(v.albumin)||3.5; const i=parseFloat(v.inr)||1.2; const asc=v.ascites||'none'; const enc=v.encephalopathy||'none'; const bPts=b<2?1:b<=3?2:3; const aPts=a>3.5?1:a>=2.8?2:3; const iPts=i<1.7?1:i<=2.3?2:3; const ascPts=asc==='none'?1:asc==='mild'?2:3; const encPts=enc==='none'?1:enc==='grade1-2'?2:3; const total=bPts+aPts+iPts+ascPts+encPts; const cls=total<=6?'A':total<=9?'B':'C'; return { result:total, label:'Child-Pugh Score', unit:'', steps:[{ label:'Total', value:total.toString() },{ label:'Class '+cls, value:'' }] } },
  description: 'Quantitative Child-Pugh score with numerical input for cirrhosis staging.',
  formula: 'Each component 1-3 points. Total 5-15. Class A:5-6, B:7-9, C:10-15.',
  interpretation: 'Class A: good surgical tolerance. Class B: moderate risk. Class C: poor prognosis, transplant evaluation.'
}

export default calcDef
