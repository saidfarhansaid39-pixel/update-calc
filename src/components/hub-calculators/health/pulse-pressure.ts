import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ systolicBP: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), diastolicBP: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'systolicBP', label:'Systolic BP (mmHg)', type:'number', min:0, step:'1' }, { name:'diastolicBP', label:'Diastolic BP (mmHg)', type:'number', min:0, step:'1' }],
  compute: (v) => { const sys=parseFloat(v.systolicBP)||120; const dia=parseFloat(v.diastolicBP)||80; const pp=sys-dia; return { result:pp, label:'Pulse Pressure', unit:'mmHg', steps:[{ label:'Systolic', value:sys.toFixed(0)+' mmHg' },{ label:'Diastolic', value:dia.toFixed(0)+' mmHg' },{ label:'Pulse Pressure', value:pp.toFixed(0)+' mmHg' }] ,
    extras: [
      { label: "Medical disclaimer", value: "This is for informational purposes only. Consult a healthcare provider." },
      { label: "Individual variation", value: "Results may vary by age, sex, ethnicity, and medical history." },
      { label: "Trend note", value: "Track measurements over time rather than relying on a single reading." }
    ]} },
  description: 'Pulse pressure is the difference between systolic and diastolic blood pressure.',
  formula: 'PP = Systolic BP - Diastolic BP',
  interpretation: 'Normal pulse pressure: 30-50 mmHg. Wide PP >60 mmHg may indicate arterial stiffness, aortic insufficiency, or hyperthyroidism. Narrow PP <25 mmHg may indicate cardiac tamponade or severe heart failure.'
}
export default calcDef
