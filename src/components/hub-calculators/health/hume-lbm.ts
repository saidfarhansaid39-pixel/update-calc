import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), gender: z.string().min(1,'Required') }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:0, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:0, step:'0.1' }, { name:'gender', label:'Gender', type:'select', options:[{value:'male',label:'Male'},{value:'female',label:'Female'}] }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const h=parseFloat(v.height)||170; const lbm=v.gender==='male'?0.32810*w+0.33929*h-29.5336:0.29569*w+0.41813*h-43.2933; const bf=((w-lbm)/w)*100; return { result:lbm, label:'Lean Body Mass', unit:'kg', steps:[{ label:'Weight', value:w.toFixed(1)+' kg' },{ label:'Height', value:h.toFixed(1)+' cm' },{ label:'LBM', value:lbm.toFixed(1)+' kg' },{ label:'Body Fat', value:bf.toFixed(1)+'%' }] } },
  description: 'Hume formula for lean body mass estimation from weight, height, and gender.',
  formula: 'Male: 0.32810×W + 0.33929×H - 29.5336. Female: 0.29569×W + 0.41813×H - 43.2933.',
  interpretation: 'LBM used for chemotherapy dosing, nutritional assessment, and BMR calculation. Body fat % = (W - LBM)/W × 100.'
}

export default calcDef
