import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ cvp: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), map: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), co: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'cvp', label:'CVP (mmHg)', type:'number', min:0, max:30, step:'0.5' }, { name:'map', label:'MAP (mmHg)', type:'number', min:20, max:200, step:'1' }, { name:'co', label:'Cardiac Output (L/min)', type:'number', min:1, max:20, step:'0.1' }],
  compute: (v) => { const cvp=parseFloat(v.cvp)||5; const map=parseFloat(v.map)||90; const co=parseFloat(v.co)||5; const svr=(map-cvp)/co*80; return { result:svr, label:'Systemic Vascular Resistance', unit:'dyn·s/cm⁵', steps:[{ label:'CVP', value:cvp.toFixed(1) },{ label:'MAP', value:map.toFixed(0) },{ label:'CO', value:co.toFixed(1) },{ label:'SVR = (MAP-CVP)/CO×80', value:svr.toFixed(0) }] } },
  description: 'Central venous pressure assessment with SVR calculation for hemodynamic monitoring.',
  formula: 'SVR = (MAP-CVP)/CO×80. Normal: 800-1200 dyn·s/cm⁵. CVP normal: 2-8 mmHg.',
  interpretation: 'Low CVP + low CO: hypovolemia. High CVP + low CO: heart failure. High CVP + high CO: sepsis.'
}

export default calcDef
