import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=20&&parseFloat(v)<=100,'20-100'), ast: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), alt: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), platelets: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [
    { name:'age', label:'Age (years)', type:'number', min:20, max:100, step:'1' },
    { name:'ast', label:'AST (U/L)', type:'number', min:0, max:2000, step:'1' },
    { name:'alt', label:'ALT (U/L)', type:'number', min:0, max:2000, step:'1' },
    { name:'platelets', label:'Platelets (×10³/µL)', type:'number', min:0, max:1000, step:'1' }
  ],
  compute: (v) => { const age=parseFloat(v.age)||50; const ast=parseFloat(v.ast)||40; const alt=parseFloat(v.alt)||40; const plt=parseFloat(v.platelets)||200; const fib4=(age*ast)/((plt**0.5)*(alt**0.5+1)); let stage='Indeterminate'; if(fib4>3.25) stage='Advanced Fibrosis (F3-F4)'; else if(fib4<1.45) stage='No/Minimal Fibrosis (F0-F1)'; return { result:parseFloat(fib4.toFixed(2)), label:'FIB-4 Score', steps:[{ label:'Score', value:fib4.toFixed(2) },{ label:'Fibrosis Stage', value:stage }] } },
  description: 'FIB-4 index for non-invasive liver fibrosis assessment using routine lab values.',
  formula: 'FIB-4 = (Age × AST) / (Platelets^0.5 × (ALT^0.5 + 1)).',
  interpretation: '<1.45: F0-F1 (no/minimal fibrosis). 1.45-3.25: Indeterminate. >3.25: F3-F4 (advanced fibrosis).'
}
export default calcDef
