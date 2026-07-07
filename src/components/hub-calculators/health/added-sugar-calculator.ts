import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), gender: z.enum(['male','female']), calories: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:1, step:'1' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }, { name:'calories', label:'Daily Calories', type:'number', min:500, step:'50' }],
  compute: (v) => { const cal=parseFloat(v.calories)||2000; const maxG=cal*0.1/4; const tsp=maxG/4.2; return { result:maxG, label:'Max Added Sugar', unit:'g', steps:[{ label:'10% of Calories', value:(cal*0.1).toFixed(0) },{ label:'Grams (÷4)', value:maxG.toFixed(1) },{ label:'Teaspoons (÷4.2)', value:tsp.toFixed(1) }] } },
  description: 'Maximum recommended daily added sugar per WHO (<10% of total calories).',
  formula: 'Max Added Sugar (g) = Daily Calories×0.10/4. 1 tsp = 4.2 g.',
  interpretation: 'Excess added sugar (>10% calories) linked to obesity, diabetes, and CVD. Ideal: <5% of calories.'
}

export default calcDef
