import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), activity: z.enum(['sedentary','light','moderate','active','very-active']) }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:20, step:'0.1' }, { name:'activity', label:'Activity Level', type:'select', options:[{ label:'Sedentary', value:'sedentary' },{ label:'Light', value:'light' },{ label:'Moderate', value:'moderate' },{ label:'Active', value:'active' },{ label:'Very Active', value:'very-active' }] }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const act=v.activity||'moderate'; const gpk:{[k:string]:number}={sedentary:0.8,light:0.8,moderate:1,active:1.1,'very-active':1.2}; const g=w*gpk[act]; const minG=w*0.5; const maxG=w*1.5; return { result:g, label:'Daily Fat', unit:'g', steps:[{ label:'Weight', value:w.toString() },{ label:'Multiplier', value:gpk[act].toString()+' g/kg' },{ label:'Fat Need', value:g.toFixed(0)+' g' },{ label:'Min (0.5g/kg)-Max (1.5g/kg)', value:minG.toFixed(0)+'-'+maxG.toFixed(0)+' g' }] } },
  description: 'Daily fat intake recommendation based on body weight and activity level.',
  formula: 'Fat (g) = weight × g/kg. 0.5-1.5 g/kg range. 20-35% of total calories from fat.',
  interpretation: 'Prioritize unsaturated fats (MUFA, PUFA). Limit saturated fat <10% calories. Avoid trans fats.'
}

export default calcDef
