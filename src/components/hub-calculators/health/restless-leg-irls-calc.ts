import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ r1: z.string().min(1), r2: z.string().min(1), r3: z.string().min(1), r4: z.string().min(1), r5: z.string().min(1), r6: z.string().min(1), r7: z.string().min(1), r8: z.string().min(1), r9: z.string().min(1), r10: z.string().min(1) }),
  fields: [
    { name:'r1', label:'RLS tingling/creeping sensation in legs?', type:'select', options:[{ label:'None (0)', value:'0' },{ label:'Mild (1)', value:'1' },{ label:'Moderate (2)', value:'2' },{ label:'Severe (3)', value:'3' },{ label:'Very Severe (4)', value:'4' }] },
    { name:'r2', label:'Need to move legs due to sensations?', type:'select', options:[{ label:'None (0)', value:'0' },{ label:'Mild (1)', value:'1' },{ label:'Moderate (2)', value:'2' },{ label:'Severe (3)', value:'3' },{ label:'Very Severe (4)', value:'4' }] },
    { name:'r3', label:'Relief from movement?', type:'select', options:[{ label:'No relief (4)', value:'4' },{ label:'Slight relief (3)', value:'3' },{ label:'Moderate relief (2)', value:'2' },{ label:'Complete/mostly relieved (1)', value:'1' },{ label:'No RLS symptoms (0)', value:'0' }] },
    { name:'r4', label:'Sleep disturbance due to RLS?', type:'select', options:[{ label:'None (0)', value:'0' },{ label:'Mild (1)', value:'1' },{ label:'Moderate (2)', value:'2' },{ label:'Severe (3)', value:'3' },{ label:'Very Severe (4)', value:'4' }] },
    { name:'r5', label:'Daytime tiredness from RLS?', type:'select', options:[{ label:'None (0)', value:'0' },{ label:'Mild (1)', value:'1' },{ label:'Moderate (2)', value:'2' },{ label:'Severe (3)', value:'3' },{ label:'Very Severe (4)', value:'4' }] },
    { name:'r6', label:'Severity of RLS overall?', type:'select', options:[{ label:'None (0)', value:'0' },{ label:'Mild (1)', value:'1' },{ label:'Moderate (2)', value:'2' },{ label:'Severe (3)', value:'3' },{ label:'Very Severe (4)', value:'4' }] },
    { name:'r7', label:'Frequency of RLS symptoms?', type:'select', options:[{ label:'None (0)', value:'0' },{ label:'1-2 days/week (1)', value:'1' },{ label:'3-4 days/week (2)', value:'2' },{ label:'5-6 days/week (3)', value:'3' },{ label:'Daily (4)', value:'4' }] },
    { name:'r8', label:'When symptoms occur you rate intensity?', type:'select', options:[{ label:'None (0)', value:'0' },{ label:'Mild (1)', value:'1' },{ label:'Moderate (2)', value:'2' },{ label:'Severe (3)', value:'3' },{ label:'Very Severe (4)', value:'4' }] },
    { name:'r9', label:'Impact on daily activities?', type:'select', options:[{ label:'None (0)', value:'0' },{ label:'Mild (1)', value:'1' },{ label:'Moderate (2)', value:'2' },{ label:'Severe (3)', value:'3' },{ label:'Very Severe (4)', value:'4' }] },
    { name:'r10', label:'RLS mood disturbance (anxiety/depression)?', type:'select', options:[{ label:'None (0)', value:'0' },{ label:'Mild (1)', value:'1' },{ label:'Moderate (2)', value:'2' },{ label:'Severe (3)', value:'3' },{ label:'Very Severe (4)', value:'4' }] }
  ],
  compute: (v) => { const s=[1,2,3,4,5,6,7,8,9,10].reduce((acc,i)=>acc+parseInt(v['r'+i]||'0'),0); let sev='Mild'; if(s>=31) sev='Very Severe'; else if(s>=21) sev='Severe'; else if(s>=11) sev='Moderate'; return { result:s, label:'IRLS Score', unit:'/40', steps:[{ label:'Total Score', value:s+'/40' },{ label:'Severity', value:sev }] } },
  description: 'International Restless Legs Syndrome (IRLS) Rating Scale for symptom severity assessment.',
  formula: 'Sum of 10 questions scored 0-4 each. Range 0-40.',
  interpretation: '0-10 Mild, 11-20 Moderate, 21-30 Severe, 31-40 Very Severe RLS symptoms.'
}
export default calcDef
