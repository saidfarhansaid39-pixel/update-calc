import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=13,'≥13'), gender: z.enum(['male','female']) }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:20, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:100, step:'0.1' }, { name:'age', label:'Age (years)', type:'number', min:13, max:19, step:'0.5' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }],
  compute: (v) => { const w=parseFloat(v.weight)||60; const h=parseFloat(v.height)||165; const a=parseFloat(v.age)||15; const bmi=w/((h/100)**2); const pct=Math.round(100/(1+Math.exp(-0.6*(bmi-((a-13)*0.3+20))))); const cat=pct>=95?'Obese':pct>=85?'Overweight':pct>=5?'Normal':'Underweight'; return { result:bmi, label:'Teen BMI', unit:'kg/m²', steps:[{ label:'BMI', value:bmi.toFixed(1) },{ label:'Approx Percentile', value:pct.toString() },{ label:'Category', value:cat }] } },
  description: 'Adolescent BMI (13-19yr) with age/sex percentile reference.',
  formula: 'BMI = W/H². Classification: <5th underweight; 5-84th healthy; 85-94th overweight; ≥95th obese.',
  interpretation: 'Track percentile trend over time. Body image and eating disorder screening important in teens.'
}

export default calcDef
