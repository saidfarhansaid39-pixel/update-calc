import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ chest: z.string().min(1,'Required').refine(v=>parseFloat(v)>=2,'≥2'), abdomen: z.string().min(1,'Required').refine(v=>parseFloat(v)>=2,'≥2'), thigh: z.string().min(1,'Required').refine(v=>parseFloat(v)>=2,'≥2'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18') }),
  fields: [{ name:'chest', label:'Chest (mm)', type:'number', min:2, max:60, step:'0.5' }, { name:'abdomen', label:'Abdomen (mm)', type:'number', min:2, max:60, step:'0.5' }, { name:'thigh', label:'Thigh (mm)', type:'number', min:2, max:60, step:'0.5' }, { name:'age', label:'Age (years)', type:'number', min:18, max:100, step:'1' }],
  compute: (v) => { const c=parseFloat(v.chest)||10; const a=parseFloat(v.abdomen)||10; const t=parseFloat(v.thigh)||10; const ag=parseFloat(v.age)||30; const sum=c+a+t; const bd=1.10938-0.0008267*sum+0.0000016*sum*sum-0.0002574*ag; const bf=495/bd-450; return { result:bf, label:'Body Fat %', unit:'%', steps:[{ label:'Sum Skinfolds', value:sum.toFixed(1) },{ label:'Body Fat %', value:bf.toFixed(1) }] } },
  description: 'Jackson-Pollock 3-site (chest, abdomen, thigh) body fat via caliper.',
  formula: 'Male BD = 1.10938-0.0008267×S+0.0000016×S²-0.0002574×A. BF% = 495/BD-450.',
  interpretation: 'Essential: 2-5%; Athletes: 6-13%; Fitness: 14-17%; Average: 18-24%; Obese: >25%.'
}

export default calcDef
