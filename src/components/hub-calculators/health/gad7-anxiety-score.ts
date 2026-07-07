import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ q1: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), q2: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), q3: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), q4: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), q5: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), q6: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), q7: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'q1', label:'Nervousness (0-3)', type:'number', min:0, max:3, step:'1' }, { name:'q2', label:'Unable to Stop Worrying (0-3)', type:'number', min:0, max:3, step:'1' }, { name:'q3', label:'Worrying Too Much (0-3)', type:'number', min:0, max:3, step:'1' }, { name:'q4', label:'Trouble Relaxing (0-3)', type:'number', min:0, max:3, step:'1' }, { name:'q5', label:'Restless (0-3)', type:'number', min:0, max:3, step:'1' }, { name:'q6', label:'Irritable (0-3)', type:'number', min:0, max:3, step:'1' }, { name:'q7', label:'Afraid Something Awful (0-3)', type:'number', min:0, max:3, step:'1' }],
  compute: (v) => { const t=[1,2,3,4,5,6,7].reduce((s,i)=>s+(parseInt(v['q'+i])||0),0); const sev=t<=4?'Minimal':t<=9?'Mild':t<=14?'Moderate':'Severe'; return { result:t, label:'GAD-7 Score', unit:'', steps:[{ label:'Total (0-21)', value:t.toString() },{ label:'Severity', value:sev }] } },
  description: 'Generalized Anxiety Disorder 7-item (GAD-7) scale for anxiety screening.',
  formula: 'Sum of 7 items (0-3 each). Total 0-21. Score ≥10: further evaluation warranted.',
  interpretation: '0-4: Minimal; 5-9: Mild; 10-14: Moderate; ≥15: Severe. Cut-off ≥10: sensitivity 89%, specificity 82%.'
}

export default calcDef
