import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bilirubin: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), albumin: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), inr: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), ascites: z.string().min(1,'Required'), encephalopathy: z.string().min(1,'Required') }),
  fields: [{ name:'bilirubin', label:'Bilirubin (mg/dL)', type:'number', min:0, step:'0.1' }, { name:'albumin', label:'Albumin (g/dL)', type:'number', min:0, step:'0.1' }, { name:'inr', label:'INR', type:'number', min:0, step:'0.1' }, { name:'ascites', label:'Ascites', type:'select', options:[{value:'none',label:'None'},{value:'mild',label:'Mild'},{value:'moderate',label:'Moderate/Severe'}] }, { name:'encephalopathy', label:'Encephalopathy', type:'select', options:[{value:'none',label:'None'},{value:'grade1-2',label:'Grade I-II'},{value:'grade3-4',label:'Grade III-IV'}] }],
  compute: (v) => { const b=parseFloat(v.bilirubin)||1; const a=parseFloat(v.albumin)||4; const i=parseFloat(v.inr)||1; const ascMap: Record<string, number> = {none:1,mild:2,moderate:3}; const encMap: Record<string, number> = {none:1,'grade1-2':2,'grade3-4':3}; const asc=ascMap[v.ascites]||1; const enc=encMap[v.encephalopathy]||1; const bp=b<2?1:b<=3?2:3; const ap=a>3.5?1:a>=2.8?2:3; const ip=i<1.7?1:i<=2.2?2:3; const t=bp+ap+ip+asc+enc; const cls=t<=6?'Child-Pugh A (compensated)':t<=9?'Child-Pugh B (significant)':'Child-Pugh C (decompensated)'; return { result:t, label:'Child-Pugh Score', unit:'', steps:[{ label:'Bilirubin', value:bp.toString() },{ label:'Albumin', value:ap.toString() },{ label:'INR', value:ip.toString() },{ label:'Ascites', value:asc.toString() },{ label:'Encephalopathy', value:enc.toString() },{ label:'Total (5-15)', value:t.toString() },{ label:'Class', value:cls }] } },
  description: 'Child-Pugh severity index for chronic liver disease and cirrhosis prognosis classification.',
  formula: 'Bilirubin <2=1, 2-3=2, >3=3. Albumin >3.5=1, 2.8-3.5=2, <2.8=3. INR <1.7=1, 1.7-2.2=2, >2.2=3. Ascites/Encephalopathy: none=1, mild=2, severe=3.',
  interpretation: 'Class A (5-6): good prognosis, tolerate surgery; B (7-9): moderate, consider TIPS; C (10-15): poor, transplant evaluation.'
}

export default calcDef
