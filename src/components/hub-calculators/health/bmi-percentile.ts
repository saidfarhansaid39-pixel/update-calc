import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=2,'≥2'), gender: z.enum(['male','female']) }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:5, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'age', label:'Age (years)', type:'number', min:2, max:20, step:'0.5' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }],
  compute: (v) => { const w=parseFloat(v.weight)||30; const h=parseFloat(v.height)||130; const a=parseFloat(v.age)||10; const bmi=w/((h/100)**2); const approxPct=Math.round(100/(1+Math.exp(-0.5*(bmi-((a-2)*0.5+17))))); const cat=approxPct>=95?'Obese':approxPct>=85?'Overweight':approxPct>=5?'Normal':'Underweight'; return { result:approxPct, label:'BMI Percentile', unit:'%', steps:[{ label:'BMI', value:bmi.toFixed(1) },{ label:'Approx Percentile', value:approxPct.toString() },{ label:'Category', value:cat }] } },
  description: 'Estimated BMI percentile for children using age/sex reference.',
  formula: 'BMI → percentile. <5th: underweight; 5-84th: normal; 85-94th: overweight; ≥95th: obese.',
  interpretation: 'Crossing percentile lines upward may indicate excessive weight gain. Use with clinical assessment.'
}

export default calcDef
