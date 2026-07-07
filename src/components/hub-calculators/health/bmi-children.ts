import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=2,'≥2'), gender: z.enum(['male','female']) }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:5, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'age', label:'Age (years)', type:'number', min:2, max:20, step:'0.5' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }],
  compute: (v) => { const w=parseFloat(v.weight)||30; const h=parseFloat(v.height)||130; const bmi=w/((h/100)**2); return { result:bmi, label:'Children BMI', unit:'kg/m²', steps:[{ label:'BMI', value:bmi.toFixed(1) },{ label:'Plot on CDC growth chart', value:'Percentile-based' }] } },
  description: 'Children BMI (2-20yr) calculated for CDC growth chart percentile plotting.',
  formula: 'BMI = W/H². Overweight: ≥85th, Obese: ≥95th percentile on CDC charts.',
  interpretation: 'Children BMI uses percentiles not fixed cutoffs. Track trends over time for accurate assessment.'
}

export default calcDef
