import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ trGradient: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), rap: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0') }),
  fields: [{ name:'trGradient', label:'TR Gradient (mmHg)', type:'number', min:10, max:100, step:'1' }, { name:'rap', label:'Estimated RAP (mmHg)', type:'number', min:0, max:20, step:'1' }],
  compute: (v) => { const tr=parseFloat(v.trGradient)||30; const rap=parseFloat(v.rap)||5; const pasp=tr+rap; return { result:pasp, label:'Pulmonary Artery Systolic Pressure', unit:'mmHg', steps:[{ label:'TR Gradient', value:tr.toFixed(0)+' mmHg' },{ label:'RAP', value:rap.toFixed(0)+' mmHg' },{ label:'PASP', value:pasp.toFixed(0)+' mmHg' }] } },
  description: 'Pulmonary artery systolic pressure is estimated from tricuspid regurgitation gradient plus right atrial pressure.',
  formula: 'PASP = TR Gradient + RAP. RAP estimated by IVC size and collapse (5 mmHg normal, 10 borderline, 15 elevated).',
  interpretation: 'Normal: 15-25 mmHg. Mild PH: 25-35 mmHg. Moderate PH: 35-45 mmHg. Severe PH: >45 mmHg. PASP >40 suggests pulmonary hypertension. Confirm with right heart catheterization.'
}
export default calcDef
