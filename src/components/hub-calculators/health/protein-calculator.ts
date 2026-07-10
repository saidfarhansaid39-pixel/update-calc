import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), activity: z.string().min(1,'Required') }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:20, step:'0.1' }, { name:'activity', label:'Activity Level', type:'select', options:[{value:'sedentary',label:'Sedentary (0.8)'},{value:'moderate',label:'Moderately Active (1.2-1.5)'},{value:'active',label:'Active (1.6-1.8)'},{value:'athlete',label:'Athlete (1.8-2.2)'}] }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const act=v.activity||'sedentary'; const factors:{[k:string]:number}={sedentary:0.8,moderate:1.35,active:1.7,athlete:2.0}; const f=factors[act]||0.8; const protein=w*f; return { result:protein, label:'Daily Protein Needs', unit:'g', steps:[{ label:'Weight', value:w.toFixed(1)+' kg' },{ label:'Factor', value:f.toFixed(1)+' g/kg' },{ label:'Protein', value:protein.toFixed(0)+' g' }] } },
  description: 'Estimates daily protein requirements based on body weight and activity level.',
  formula: 'Protein (g) = Weight (kg) × Activity Factor. Sedentary: 0.8, Moderate: 1.2-1.5, Active: 1.6-1.8, Athlete: 1.8-2.2 g/kg.',
  interpretation: 'RDA is 0.8 g/kg. Athletes need 1.6-2.2 g/kg. Upper limit: 2.5 g/kg without medical supervision.'
}
export default calcDef