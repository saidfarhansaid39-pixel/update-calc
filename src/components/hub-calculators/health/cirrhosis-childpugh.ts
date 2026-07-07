import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bilirubin: z.enum(['under2','2to3','over3']), albumin: z.enum(['over3.5','2.8to3.5','under2.8']), inr: z.enum(['under1.7','1.7to2.3','over2.3']), ascites: z.enum(['none','mild','moderate']), encephalopathy: z.enum(['none','grade1-2','grade3-4']) }),
  fields: [{ name:'bilirubin', label:'Bilirubin', type:'select', options:[{ label:'<2', value:'under2' },{ label:'2-3', value:'2to3' },{ label:'>3', value:'over3' }] }, { name:'albumin', label:'Albumin', type:'select', options:[{ label:'>3.5', value:'over3.5' },{ label:'2.8-3.5', value:'2.8to3.5' },{ label:'<2.8', value:'under2.8' }] }, { name:'inr', label:'INR', type:'select', options:[{ label:'<1.7', value:'under1.7' },{ label:'1.7-2.3', value:'1.7to2.3' },{ label:'>2.3', value:'over2.3' }] }, { name:'ascites', label:'Ascites', type:'select', options:[{ label:'None', value:'none' },{ label:'Mild', value:'mild' },{ label:'Moderate', value:'moderate' }] }, { name:'encephalopathy', label:'Encephalopathy', type:'select', options:[{ label:'None', value:'none' },{ label:'Grade 1-2', value:'grade1-2' },{ label:'Grade 3-4', value:'grade3-4' }] }],
  compute: (v) => { const m:{[k:string]:number}={under2:1,'2to3':2,over3:3,over3p5:1,'2.8to3.5':2,under2p8:3,under1p7:1,'1.7to2.3':2,over2p3:3,none:1,mild:2,moderate:3,'grade1-2':2,'grade3-4':3}; const b=m[v.bilirubin]||1; const a=m[v.albumin==='over3.5'?'over3p5':v.albumin==='2.8to3.5'?'2.8to3.5':'under2p8']||1; const i=m[v.inr==='under1.7'?'under1p7':v.inr==='1.7to2.3'?'1.7to2.3':'over2p3']||1; const as=m[v.ascites]||1; const e=m[v.encephalopathy]||1; const t=b+a+i+as+e; const cls=t<=6?'A':t<=9?'B':'C'; return { result:t, label:'Child-Pugh Score', unit:'', steps:[{ label:'5 components scored 1-3', value:'Total: '+t.toString() },{ label:'Class '+cls, value:'' }] } },
  description: 'Child-Pugh classification for cirrhosis prognosis and management.',
  formula: 'Sum of 5 component scores (1-3 each). Total 5-15.',
  interpretation: 'Class A: 5-6, low surgical risk, 1yr survival ~100%. Class B: 7-9, moderate. Class C: 10-15, transplant eval.'
}

export default calcDef
