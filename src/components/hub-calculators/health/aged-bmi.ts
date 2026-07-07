import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:20, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const h=parseFloat(v.height)||170; const a=parseFloat(v.age)||30; const bmi=w/((h/100)**2); const ageAdj=a>65?bmi+0.5:bmi; return { result:ageAdj, label:'Age-Adjusted BMI', unit:'kg/m²', steps:[{ label:'Standard BMI', value:bmi.toFixed(1) },{ label:'Age-Adjusted', value:ageAdj.toFixed(1) }] } },
  description: 'BMI adjusted for age-related body composition changes in older adults.',
  formula: 'BMI = W/H². Over 65: adjusted upward by 0.5 for optimal risk assessment.',
  interpretation: 'For >65 years, slightly higher BMI (24-27) may be protective. Traditional cutoffs may not apply to elderly.'
}

export default calcDef
