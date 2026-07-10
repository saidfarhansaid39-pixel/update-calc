import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ systolicBP: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), diastolicBP: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'systolicBP', label:'Systolic BP (mmHg)', type:'number', min:0, step:'1' }, { name:'diastolicBP', label:'Diastolic BP (mmHg)', type:'number', min:0, step:'1' }],
  compute: (v) => { const sys=parseFloat(v.systolicBP)||120; const dia=parseFloat(v.diastolicBP)||80; const pp=sys-dia; return { result:pp, label:'Pulse Pressure', unit:'mmHg', steps:[{ label:'Systolic', value:sys.toFixed(0)+' mmHg' },{ label:'Diastolic', value:dia.toFixed(0)+' mmHg' },{ label:'Pulse Pressure', value:pp.toFixed(0)+' mmHg' }] } },
  description: 'Pulse pressure is the difference between systolic and diastolic blood pressure.',
  formula: 'PP = Systolic BP - Diastolic BP',
  interpretation: 'Normal pulse pressure: 30-50 mmHg. Wide PP >60 mmHg may indicate arterial stiffness, aortic insufficiency, or hyperthyroidism. Narrow PP <25 mmHg may indicate cardiac tamponade or severe heart failure.'
}
export default calcDef
