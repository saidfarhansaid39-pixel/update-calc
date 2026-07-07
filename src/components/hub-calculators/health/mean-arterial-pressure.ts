import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ systolicBP: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), diastolicBP: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'systolicBP', label:'Systolic BP (mmHg)', type:'number', min:0, step:'1' }, { name:'diastolicBP', label:'Diastolic BP (mmHg)', type:'number', min:0, step:'1' }],
  compute: (v) => { const sys=parseFloat(v.systolicBP)||120; const dia=parseFloat(v.diastolicBP)||80; const map=dia+(sys-dia)/3; const pp=sys-dia; return { result:map, label:'Mean Arterial Pressure', unit:'mmHg', steps:[{ label:'Systolic', value:sys.toFixed(0)+' mmHg' },{ label:'Diastolic', value:dia.toFixed(0)+' mmHg' },{ label:'MAP', value:map.toFixed(0)+' mmHg' },{ label:'Pulse Pressure', value:pp.toFixed(0)+' mmHg' }] } },
  description: 'Mean arterial pressure represents average arterial pressure during one cardiac cycle.',
  formula: 'MAP = Diastolic BP + (Systolic BP - Diastolic BP) / 3. Pulse Pressure = Systolic - Diastolic.',
  interpretation: 'Normal MAP: 70-100 mmHg. MAP ≥65 mmHg required for organ perfusion. MAP >100 mmHg indicates hypertension.'
}

export default calcDef
