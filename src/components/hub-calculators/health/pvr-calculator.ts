import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ papMean: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), pcwp: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), cardiacOutput: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'papMean', label:'Mean PAP (mmHg)', type:'number', min:0, max:100, step:'1' }, { name:'pcwp', label:'Pulmonary Capillary Wedge Pressure (mmHg)', type:'number', min:0, max:50, step:'1' }, { name:'cardiacOutput', label:'Cardiac Output (L/min)', type:'number', min:1, step:'0.1' }],
  compute: (v) => { const pap=parseFloat(v.papMean)||25; const pcwp=parseFloat(v.pcwp)||10; const co=parseFloat(v.cardiacOutput)||5; const pvr=(pap-pcwp)/co*80; return { result:pvr, label:'Pulmonary Vascular Resistance', unit:'dyn·s/cm⁵', steps:[{ label:'Mean PAP', value:pap.toFixed(0)+' mmHg' },{ label:'PCWP', value:pcwp.toFixed(0)+' mmHg' },{ label:'PVR', value:pvr.toFixed(0)+' dyn·s/cm⁵' }] } },
  description: 'Pulmonary vascular resistance measures right ventricular afterload in the pulmonary circulation.',
  formula: 'PVR = (Mean PAP - PCWP) / CO × 80',
  interpretation: 'Normal PVR: 100-250 dyn·s/cm⁵. Elevated: >250. PVR >400 indicates significant pulmonary hypertension. Wood units: PVR/80 = 1.25-3.0 WU (normal).'
}
export default calcDef
