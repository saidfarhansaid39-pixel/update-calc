import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), sex: z.string().min(1,'Required') }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:0, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:0, step:'0.1' }, { name:'sex', label:'Sex', type:'select', options:[{value:'male',label:'Male'},{value:'female',label:'Female'}] }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const h=parseFloat(v.height)||175; const sex=v.sex||'male'; const lbm=sex==='male'?0.407*w+0.267*h-19.2:0.252*w+0.473*h-48.3; return { result:lbm, label:'Lean Body Mass', unit:'kg', steps:[{ label:'LBM (Boer Formula)', value:lbm.toFixed(1)+' kg' }] } },
  description: 'Lean body mass estimated via the Boer formula (1991), used for drug dosing and metabolic assessment.',
  formula: 'Male: LBM = 0.407W + 0.267H - 19.2. Female: LBM = 0.252W + 0.473H - 48.3.',
  interpretation: 'LBM is total body weight minus fat mass. Used for creatinine clearance estimation, chemotherapy dosing, and anesthesia.'
}

export default calcDef
