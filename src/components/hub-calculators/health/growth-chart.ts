import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), gender: z.enum(['male','female']) }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:1, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:30, step:'0.1' }, { name:'age', label:'Age (months for <2yr, years for 2+)', type:'number', min:0, max:240, step:'1' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }],
  compute: (v) => { const w=parseFloat(v.weight)||3; const h=parseFloat(v.height)||50; const a=parseFloat(v.age)||0; const g=v.gender||'male'; const bmi=w/((h/100)**2); return { result:bmi, label:'Growth BMI', unit:'kg/m²', steps:[{ label:'Weight', value:w.toFixed(1)+' kg' },{ label:'Height', value:h.toFixed(1)+' cm' },{ label:'BMI', value:bmi.toFixed(1) },{ label:'Plot on', value:'WHO (<2yr) or CDC (≥2yr) growth chart' }] } },
  description: 'Growth chart parameters for pediatric growth monitoring (WHO/CDC standards).',
  formula: 'BMI = W/H². Plot on WHO growth standards (<24mo) or CDC growth charts (≥2yr).',
  interpretation: 'Weight-for-age, Height-for-age, BMI-for-age percentiles. Crossing percentiles requires evaluation.'
}

export default calcDef
