import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), ethnicity: z.enum(['white','asian','black','hispanic']) }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:20, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'ethnicity', label:'Ethnicity', type:'select', options:[{ label:'White', value:'white' },{ label:'Asian', value:'asian' },{ label:'Black', value:'black' },{ label:'Hispanic', value:'hispanic' }] }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const h=parseFloat(v.height)||170; const e=v.ethnicity||'white'; const bmi=w/((h/100)**2); const obCut=e==='asian'?27:30; const owCut=e==='asian'?23:25; const status=bmi>=obCut?'Obese':bmi>=owCut?'Overweight':bmi>=18.5?'Normal':'Underweight'; return { result:bmi, label:'BMI', unit:'kg/m²', steps:[{ label:'BMI', value:bmi.toFixed(1) },{ label:'Ethnic Obesity ≥'+obCut.toString(), value:status }] } },
  description: 'Ethnicity-adjusted BMI using WHO Asian-specific cutoffs.',
  formula: 'Asian: overweight ≥23, obese ≥27. Others: overweight ≥25, obese ≥30.',
  interpretation: 'Asians have higher metabolic risk at lower BMIs. Standard cutoffs underestimate diabetes risk in Asians.'
}

export default calcDef
