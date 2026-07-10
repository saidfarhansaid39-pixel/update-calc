import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ q1: z.string().min(1), q2: z.string().min(1), q3: z.string().min(1), q4: z.string().min(1), q5: z.string().min(1), q6: z.string().min(1), q7: z.string().min(1), q8: z.string().min(1), q9: z.string().min(1) }),
  fields: [
    { name:'q1', label:'Little interest or pleasure in doing things', type:'select', options:[{ label:'Not at all (0)', value:'0' },{ label:'Several days (1)', value:'1' },{ label:'More than half the days (2)', value:'2' },{ label:'Nearly every day (3)', value:'3' }] },
    { name:'q2', label:'Feeling down, depressed, or hopeless', type:'select', options:[{ label:'Not at all (0)', value:'0' },{ label:'Several days (1)', value:'1' },{ label:'More than half the days (2)', value:'2' },{ label:'Nearly every day (3)', value:'3' }] },
    { name:'q3', label:'Trouble falling/staying asleep or sleeping too much', type:'select', options:[{ label:'Not at all (0)', value:'0' },{ label:'Several days (1)', value:'1' },{ label:'More than half the days (2)', value:'2' },{ label:'Nearly every day (3)', value:'3' }] },
    { name:'q4', label:'Feeling tired or having little energy', type:'select', options:[{ label:'Not at all (0)', value:'0' },{ label:'Several days (1)', value:'1' },{ label:'More than half the days (2)', value:'2' },{ label:'Nearly every day (3)', value:'3' }] },
    { name:'q5', label:'Poor appetite or overeating', type:'select', options:[{ label:'Not at all (0)', value:'0' },{ label:'Several days (1)', value:'1' },{ label:'More than half the days (2)', value:'2' },{ label:'Nearly every day (3)', value:'3' }] },
    { name:'q6', label:'Feeling bad about yourself or that you are a failure', type:'select', options:[{ label:'Not at all (0)', value:'0' },{ label:'Several days (1)', value:'1' },{ label:'More than half the days (2)', value:'2' },{ label:'Nearly every day (3)', value:'3' }] },
    { name:'q7', label:'Trouble concentrating on things', type:'select', options:[{ label:'Not at all (0)', value:'0' },{ label:'Several days (1)', value:'1' },{ label:'More than half the days (2)', value:'2' },{ label:'Nearly every day (3)', value:'3' }] },
    { name:'q8', label:'Moving/speaking slowly or being fidgety/restless', type:'select', options:[{ label:'Not at all (0)', value:'0' },{ label:'Several days (1)', value:'1' },{ label:'More than half the days (2)', value:'2' },{ label:'Nearly every day (3)', value:'3' }] },
    { name:'q9', label:'Thoughts you would be better off dead or harming yourself', type:'select', options:[{ label:'Not at all (0)', value:'0' },{ label:'Several days (1)', value:'1' },{ label:'More than half the days (2)', value:'2' },{ label:'Nearly every day (3)', value:'3' }] }
  ],
  compute: (v) => { const s=[0,1,2,3,4,5,6,7,8].reduce((acc,i)=>acc+parseInt(v['q'+(i+1)])||0,0); let sev='Minimal'; if(s>=20) sev='Severe'; else if(s>=15) sev='Moderately Severe'; else if(s>=10) sev='Moderate'; else if(s>=5) sev='Mild'; return { result:s, label:'PHQ-9 Score', unit:'/27', steps:[{ label:'Total Score', value:s+'/27' },{ label:'Severity', value:sev }] } },
  description: 'PHQ-9 depression screening tool with 9 items scored 0-3 for past 2 weeks.',
  formula: 'Sum of 9 items (0-3 each). Total range 0-27. Higher scores indicate greater depression severity.',
  interpretation: '0-4 Minimal, 5-9 Mild, 10-14 Moderate, 15-19 Moderately Severe, 20-27 Severe depression.'
}
export default calcDef
