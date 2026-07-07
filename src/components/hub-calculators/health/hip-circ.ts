import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hipCircumference: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), gender: z.string().min(1,'Required') }),
  fields: [{ name:'hipCircumference', label:'Hip Circumference (cm)', type:'number', min:0, step:'0.1' }, { name:'gender', label:'Gender', type:'select', options:[{value:'female',label:'Female'},{value:'male',label:'Male'}] }],
  compute: (v) => { const h=parseFloat(v.hipCircumference)||100; const avg=v.gender==='female'?99:94; const z=(h-avg)/8; const pct=Math.round((1/(1+Math.exp(-1.7*z)))*100); return { result:h, label:'Hip Circumference', unit:'cm', steps:[{ label:'Measured', value:h.toFixed(1)+' cm' },{ label:'Gender Avg', value:avg.toString()+' cm' },{ label:'Percentile', value:pct.toString()+'%' }] } },
  description: 'Hip circumference measurement for body composition and metabolic risk assessment.',
  formula: 'WHO reference: Female 99±8 cm, Male 94±8 cm. Percentile via logistic approximation of normal distribution.',
  interpretation: 'Larger hip circumference correlates with lower cardiometabolic risk. Hip <80 cm (F) or <85 cm (M) warrants investigation.'
}

export default calcDef
