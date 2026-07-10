import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ waist: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), sex: z.string().min(1,'Required'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18') }),
  fields: [{ name:'waist', label:'Waist Circumference (cm)', type:'number', min:30, step:'0.1' }, { name:'sex', label:'Sex', type:'select', options:[{value:'male',label:'Male'},{value:'female',label:'Female'}] }, { name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }],
  compute: (v) => { const w=parseFloat(v.waist)||80; const s=v.sex||'male'; const a=parseFloat(v.age)||30; const means:{[k:string]:number}={
male:88,female:82}; const sds:{[k:string]:number}={male:10,female:12}; const mean=means[s]||80; const sd=sds[s]||10; const zScore=(w-mean)/sd; const pct=Math.round((1/(1+Math.exp(-1.701*zScore)))*100); const cutoff=s==='male'?102:88; const risk=w>cutoff?'High':'Normal'; return { result:pct, label:'Waist Circumference Percentile', unit:'%', steps:[{ label:'Your Waist', value:w.toFixed(1)+' cm' },{ label:'Population Mean', value:mean.toFixed(0)+' cm' },{ label:'Z-Score', value:zScore.toFixed(2) },{ label:'Percentile', value:pct+'%' },{ label:'Risk (ATP III)', value:risk }] } },
  description: 'Waist circumference percentile relative to population norms, a component of metabolic syndrome criteria.',
  formula: 'Percentile ≈ logistic(CDF) relative to sex-specific NHANES reference population means and SDs.',
  interpretation: 'Waist >102 cm (male) or >88 cm (female) = increased metabolic syndrome risk per ATP III criteria.'
}
export default calcDef