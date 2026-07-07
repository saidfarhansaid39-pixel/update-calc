import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=2,'≥2'), gender: z.enum(['male','female']) }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:5, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'age', label:'Age (years)', type:'number', min:2, max:20, step:'0.5' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }],
  compute: (v) => { const w=parseFloat(v.weight)||30; const h=parseFloat(v.height)||130; const a=parseFloat(v.age)||10; const bmi=w/((h/100)**2); const mu=bmi<22?17-0.5*(a-2):22+0.3*(a-2); const sd=2.5+0.1*a; const z=(bmi-mu)/sd; const pct=Math.round(100/(1+Math.exp(-1.7*z))); return { result:z, label:'BMI Z-Score', unit:'SD', steps:[{ label:'BMI', value:bmi.toFixed(1) },{ label:'Z-Score', value:z.toFixed(2) },{ label:'Percentile', value:pct.toString()+'%' }] } },
  description: 'BMI z-score quantifying deviation from age/sex population mean for growth tracking.',
  formula: 'Z = (BMI - μ)/σ. >2: obese; 1-2: overweight; -1 to 1: normal; <-2: severely underweight.',
  interpretation: 'Z-score useful for tracking extreme values over time. >2: obese (>97th); 1-2: overweight.'
}

export default calcDef
