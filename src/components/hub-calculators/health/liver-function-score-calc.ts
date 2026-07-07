import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ albumin: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), bilirubin: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), inr: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0.5,'>=0.5') }),
  fields: [{ name:'albumin', label:'Albumin (g/dL)', type:'number', min:0, step:'0.1' }, { name:'bilirubin', label:'Total Bilirubin (mg/dL)', type:'number', min:0, step:'0.1' }, { name:'inr', label:'INR', type:'number', min:0.5, step:'0.1' }],
  compute: (v) => { const alb=parseFloat(v.albumin)||4; const bili=parseFloat(v.bilirubin)||0.5; const inr=parseFloat(v.inr)||1.1; const score=alb*0.5+bili*2+inr*3; return { result:score, label:'Liver Function Score', unit:'', steps:[{ label:'Albumin', value:alb.toFixed(1)+' g/dL' },{ label:'Bilirubin', value:bili.toFixed(1)+' mg/dL' },{ label:'INR', value:inr.toFixed(2) }] } },
  description: 'Liver function score composite from albumin, bilirubin, and INR—key synthetic function markers.',
  formula: 'Score = 0.5 × Albumin + 2 × Bilirubin + 3 × INR (composite index).',
  interpretation: 'Normal liver synthetic function: Albumin >3.5 g/dL, Bilirubin <1.2 mg/dL, INR ≤1.1. Abnormal values indicate hepatocellular dysfunction.'
}

export default calcDef
