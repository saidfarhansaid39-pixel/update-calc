import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hcg1: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), hcg2: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), daysBetween: z.string().min(1,'Required').refine(v=>parseFloat(v)>=1,'≥1') }),
  fields: [{ name:'hcg1', label:'First hCG (mIU/mL)', type:'number', min:1, step:'1' }, { name:'hcg2', label:'Second hCG (mIU/mL)', type:'number', min:1, step:'1' }, { name:'daysBetween', label:'Days Between Tests', type:'number', min:1, max:14, step:'1' }],
  compute: (v) => { const h1=parseFloat(v.hcg1)||0; const h2=parseFloat(v.hcg2)||0; const d=parseFloat(v.daysBetween)||0; const dt=h1>0&&h2>h1?d*Math.log(2)/Math.log(h2/h1):0; const normal=dt>1.4&&dt<3.5; const interp=dt<=0?'Decreasing (nonviable likely)':dt>3.5?'Slow rise - ectopic/abnormal possible':dt<1.4?'Fast rise - molar pregnancy possible':'Normal rise'; return { result:dt, label:'Doubling Time', unit:'days', steps:[{ label:'1st hCG', value:h1.toString() },{ label:'2nd hCG', value:h2.toString() },{ label:'Doubling Time', value:dt>0?dt.toFixed(2)+' days':'N/A (decreasing)' },{ label:'Expected: 1.4-3.5 days', value:interp }] } },
  description: 'hCG doubling time calculation for early pregnancy viability assessment.',
  formula: 'Doubling Time = Δdays × ln(2) / ln(hCG2/hCG1). Normal: 1.4-3.5 days in first trimester.',
  interpretation: 'Normal: 48-72h doubling in early pregnancy. Slow: ectopic or abnormal. Decreasing: nonviable.'
}

export default calcDef
