import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18'), gender: z.string().min(1,'Required'), skinfold1: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), skinfold2: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), skinfold3: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:18, max:80, step:'1' }, { name:'gender', label:'Gender', type:'select', options:[{value:'male',label:'Male'},{value:'female',label:'Female'}] }, { name:'skinfold1', label:'Skinfold 1 (mm)', type:'number', min:3, max:60, step:'1' }, { name:'skinfold2', label:'Skinfold 2 (mm)', type:'number', min:3, max:60, step:'1' }, { name:'skinfold3', label:'Skinfold 3 (mm)', type:'number', min:3, max:60, step:'1' }],
  compute: (v) => { const age=parseFloat(v.age)||30; const gender=v.gender||'male'; const sf1=parseFloat(v.skinfold1)||0; const sf2=parseFloat(v.skinfold2)||0; const sf3=parseFloat(v.skinfold3)||0; const sum=sf1+sf2+sf3; let bd; if(gender==='female'){bd=1.099421-0.0009929*sum+0.0000023*sum*sum-0.0001392*age} else {bd=1.10938-0.0008267*sum+0.0000016*sum*sum-0.0002574*age}; const bf=(4.570/bd-4.142)*100; return { result:bf, label:'Body Fat', unit:'%', steps:[{ label:'Gender', value:gender==='male'?'Male':'Female' },{ label:'Sum Skinfolds', value:sum.toFixed(1) },{ label:'Body Density (Jackson-Pollock)', value:bd.toFixed(4) },{ label:'Body Fat % (Brozek)', value:bf.toFixed(1) }] } },
  description: 'Estimate body density using Jackson & Pollock 3-site skinfold method for men (chest, abdomen, thigh) and women (triceps, suprailiac, thigh). Uses the Brozek formula to convert body density to body fat percentage.',
  formula: 'Men: BD = 1.10938 - 0.0008267×S + 0.0000016×S² - 0.0002574×Age. Women: BD = 1.099421 - 0.0009929×S + 0.0000023×S² - 0.0001392×Age. Brozek: BF% = (4.570/BD - 4.142)×100',
  interpretation: 'Essential 8-15%, Athletes 6-13%, Fitness 14-17%, Average 18-24%, Obese >25%.'
}

export default calcDef
