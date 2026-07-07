import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalCarbs: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), fiber: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), sugarAlcohols: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'totalCarbs', label:'Total Carbs (g)', type:'number', min:0, step:'0.5' }, { name:'fiber', label:'Fiber (g)', type:'number', min:0, step:'0.5' }, { name:'sugarAlcohols', label:'Sugar Alcohols (g)', type:'number', min:0, step:'0.5' }],
  compute: (v) => { const tc=parseFloat(v.totalCarbs)||0; const f=parseFloat(v.fiber)||0; const sa=parseFloat(v.sugarAlcohols)||0; const net=tc-f-sa/2; const insulin=net>0?Math.round(net/10):0; return { result:net, label:'Net Carbs', unit:'g', steps:[{ label:'Total', value:tc.toFixed(1) },{ label:'-Fiber', value:'-'+f.toFixed(1) },{ label:'-½ Sugar Alcohols', value:'-'+(sa/2).toFixed(1) },{ label:'Net Carbs', value:net.toFixed(1) },{ label:'Est. Insulin (1u/10g)', value:insulin.toString()+' units' }] } },
  description: 'Net carb counting subtracting fiber and half sugar alcohols for diabetes management.',
  formula: 'Net Carbs = Total - Fiber - (Sugar Alcohols/2). ICR typically 1:10-15.',
  interpretation: 'Net carbs impact blood glucose. Used for insulin bolus. Individual insulin sensitivity varies.'
}

export default calcDef
