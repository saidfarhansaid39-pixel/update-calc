import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ sodium: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), potassium: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'sodium', label:'Serum Sodium (mEq/L)', type:'number', min:100, max:170, step:'1' }, { name:'potassium', label:'Serum Potassium (mEq/L)', type:'number', min:2, max:9, step:'0.1' }],
  compute: (v) => { const na=parseFloat(v.sodium)||140; const k=parseFloat(v.potassium)||4.5; const ratio=na/k; return { result:ratio, label:'Sodium-Potassium Ratio', steps:[{ label:'Sodium', value:na.toFixed(0)+' mEq/L' },{ label:'Potassium', value:k.toFixed(1)+' mEq/L' },{ label:'Na/K Ratio', value:ratio.toFixed(2) }] } },
  description: 'Sodium-potassium ratio is a marker of dietary electrolyte balance and cardiovascular risk.',
  formula: 'Na/K Ratio = Serum Sodium / Serum Potassium',
  interpretation: 'Normal ratio: ~30-35. Lower Na/K ratios (<30) are associated with lower BP and better cardiovascular outcomes. Higher ratios (>35) suggest high sodium or low potassium intake. Spot urine Na/K also used.'
}
export default calcDef
