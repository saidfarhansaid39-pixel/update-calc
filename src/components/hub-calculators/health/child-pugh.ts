import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bilirubin: z.enum(['under2','2to3','over3']), albumin: z.enum(['over3.5','2.8to3.5','under2.8']), inr: z.enum(['under1.7','1.7to2.3','over2.3']), ascites: z.enum(['none','mild','moderate']), encephalopathy: z.enum(['none','grade1-2','grade3-4']) }),
  fields: [{ name:'bilirubin', label:'Bilirubin (mg/dL)', type:'select', options:[{ label:'<2', value:'under2' },{ label:'2-3', value:'2to3' },{ label:'>3', value:'over3' }] }, { name:'albumin', label:'Albumin (g/dL)', type:'select', options:[{ label:'>3.5', value:'over3.5' },{ label:'2.8-3.5', value:'2.8to3.5' },{ label:'<2.8', value:'under2.8' }] }, { name:'inr', label:'INR', type:'select', options:[{ label:'<1.7', value:'under1.7' },{ label:'1.7-2.3', value:'1.7to2.3' },{ label:'>2.3', value:'over2.3' }] }, { name:'ascites', label:'Ascites', type:'select', options:[{ label:'None', value:'none' },{ label:'Mild', value:'mild' },{ label:'Moderate/Severe', value:'moderate' }] }, { name:'encephalopathy', label:'Encephalopathy', type:'select', options:[{ label:'None', value:'none' },{ label:'Grade 1-2', value:'grade1-2' },{ label:'Grade 3-4', value:'grade3-4' }] }],
  compute: (v) => { const pts: Record<string, number> = {under2:1,'2to3':2,over3:3,over3p5:1,'2.8to3.5':2,under2p8:3,under1p7:1,'1.7to2.3':2,over2p3:3,none:1,mild:2,moderate:3,'grade1-2':2,'grade3-4':3}; const b=pts[v.bilirubin]||1; const a=pts[v.albumin==='over3.5'?'over3p5':v.albumin==='2.8to3.5'?'2.8to3.5':'under2p8']||1; const i=pts[v.inr==='under1.7'?'under1p7':v.inr==='1.7to2.3'?'1.7to2.3':'over2p3']||1; const as=pts[v.ascites]||1; const e=pts[v.encephalopathy]||1; const total=b+a+i+as+e; const cls=total<=6?'Child A (well-compensated)':total<=9?'Child B (significant impairment)':'Child C (decompensated)'; return { result:total, label:'Child-Pugh Score', unit:'', steps:[{ label:'Bilirubin', value:b.toString() },{ label:'Albumin', value:a.toString() },{ label:'INR', value:i.toString() },{ label:'Ascites', value:as.toString() },{ label:'Encephalopathy', value:e.toString() },{ label:'Total', value:total.toString() },{ label:'Class', value:cls }] } },
  description: 'Child-Pugh score for cirrhosis severity and prognosis.',
  formula: 'Bilirubin(1-3)+Albumin(1-3)+INR(1-3)+Ascites(1-3)+Encephalopathy(1-3). Range 5-15.',
  interpretation: 'A (5-6): well-compensated, 1yr survival ~100%. B (7-9): significant impairment, ~80%. C (10-15): decompensated, ~45%.'
}

export default calcDef
