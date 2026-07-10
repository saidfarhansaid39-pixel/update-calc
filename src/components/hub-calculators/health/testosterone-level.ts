import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ totalTest: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), shbg: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), albumin: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18') }),
  fields: [{ name:'totalTest', label:'Total Testosterone (ng/dL)', type:'number', min:0, step:'1' }, { name:'shbg', label:'SHBG (nmol/L)', type:'number', min:0, step:'0.5' }, { name:'albumin', label:'Albumin (g/dL)', type:'number', min:0, step:'0.1' }, { name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }],
  compute: (v) => { const tt=parseFloat(v.totalTest)||500; const shbg=parseFloat(v.shbg)||35; const alb=parseFloat(v.albumin)||4.5; const a=parseFloat(v.age)||30; const ttNm=tt*0.0347; const ft=ttNm/(1+(shbg-ttNm)*0.0006+alb*0.0008); const ftNgdl=ft*28.84; const ageAdj=Math.pow(0.97,a-30); const adjFt=ftNgdl*ageAdj; const range=tt>300?'Normal':'Low'; return { result:ft, label:'Free Testosterone', unit:'nmol/L', steps:[{ label:'Total T', value:tt.toFixed(0)+' ng/dL' },{ label:'SHBG', value:shbg.toFixed(1)+' nmol/L' },{ label:'Free T', value:ft.toFixed(3)+' nmol/L' },{ label:'Free T (ng/dL)', value:ftNgdl.toFixed(2)+' ng/dL' },{ label:'Age-Adj Free T', value:adjFt.toFixed(2)+' ng/dL' }] } },
  description: 'Calculates free and bioavailable testosterone from total testosterone, SHBG, and albumin using Vermeulen equation.',
  formula: 'Free T (nmol/L) via Vermeulen equation: Total T / (1 + (SHBG - TotalT)×Kshbg + Alb×Kalb). Normal total T: 300-1000 ng/dL.',
  interpretation: 'Free T <6.5 ng/dL suggests hypogonadism. Total T <300 ng/dL warrants evaluation. SHBG affects free T availability.'
}
export default calcDef