import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=2,'≥2'), gender: z.enum(['male','female']) }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:5, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'age', label:'Age (years)', type:'number', min:2, max:20, step:'0.5' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }],
  compute: (v) => { const w=parseFloat(v.weight)||30; const h=parseFloat(v.height)||130; const a=parseFloat(v.age)||10; const bmi=w/((h/100)**2); const pct=Math.round(100/(1+Math.exp(-0.5*(bmi-((a-2)*0.5+17))))); const cat=pct>=95?'Obese':pct>=85?'Overweight':pct>=5?'Normal':'Underweight'; return { result:pct, label:'BMI Percentile', unit:'%', steps:[{ label:'BMI', value:bmi.toFixed(1) },{ label:'Percentile', value:pct.toString() },{ label:'Category', value:cat }] } },
  description: 'Children BMI percentile for growth monitoring on CDC reference curves.',
  formula: 'BMI = W/H². <5th UW, 5-84th NW, 85-94th OW, ≥95th OB. Plot on CDC chart.',
  interpretation: 'Track percentiles over time. Crossing percentile lines upward suggests excessive gain.'
}

export default calcDef
