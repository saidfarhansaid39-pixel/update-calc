import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ crp: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), unit: z.string().min(1,'Required') }),
  fields: [{ name:'crp', label:'CRP Value', type:'number', min:0.01, step:'0.01' }, { name:'unit', label:'Unit (1=mg/L, 0=mg/dL)', type:'number', min:0, max:1, step:'1' }],
  compute: (v) => { const val=parseFloat(v.crp)||1; const isMgL=parseFloat(v.unit)||0; const mgL=isMgL?val:val*10; const mgdL=isMgL?val/10:val; return { result:mgdL, label:'CRP', unit:'mg/dL', steps:[{ label:'Input Value', value:val.toFixed(2) },{ label:'mg/L', value:mgL.toFixed(2) },{ label:'mg/dL', value:mgdL.toFixed(2) }] } },
  description: 'C-reactive protein conversion between mg/dL and mg/L units for inflammation assessment.',
  formula: '1 mg/dL = 10 mg/L. mg/dL = mg/L / 10. mg/L = mg/dL × 10.',
  interpretation: 'Normal: <0.3 mg/dL (<3 mg/L). Low risk (CVD): <0.1 mg/dL. Moderate: 0.1-0.3 mg/dL. High risk: >0.3 mg/dL. Acute inflammation: >1 mg/dL. Markedly elevated >10 mg/dL suggests infection or severe inflammation.'
}
export default calcDef
