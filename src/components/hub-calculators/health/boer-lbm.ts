import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), gender: z.enum(['male','female']) }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:20, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:50, step:'0.1' }, { name:'gender', label:'Gender', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const h=parseFloat(v.height)||170; const g=v.gender||'male'; const lbm=g==='male'?0.407*w+0.267*h-19.2:0.252*w+0.473*h-48.3; return { result:lbm, label:'LBM (Boer)', unit:'kg', steps:[{ label:'LBM', value:lbm.toFixed(1) }] } },
  description: 'Boer lean body mass formula for drug dosing and metabolic assessment.',
  formula: 'Male: 0.407W+0.267H-19.2. Female: 0.252W+0.473H-48.3.',
  interpretation: 'LBM represents metabolically active tissue. Low LBM suggests sarcopenia. Used for CrCl and anesthetic dosing.'
}

export default calcDef
