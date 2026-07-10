import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ unilateral: z.string().min(1), bilateral: z.string().min(1), axialPostural: z.string().min(1), disability: z.string().min(1), gaitFreezing: z.string().min(1), falls: z.string().min(1), wheelchair: z.string().min(1) }),
  fields: [
    { name:'unilateral', label:'Unilateral symptoms only (one side of body)?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'bilateral', label:'Bilateral symptoms, no balance impairment?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'axialPostural', label:'Mild-moderate bilateral with postural instability?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'disability', label:'Severe disability but can walk/stand independently?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'gaitFreezing', label:'Freezing of gait, requires assistance with walking?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'falls', label:'Frequent falls, unable to walk without assistance?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'wheelchair', label:'Wheelchair-bound / bedridden?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }
  ],
  compute: (v) => { let stage=1,desc='Unilateral symptoms only. Minimal functional impairment.'; if(v.wheelchair==='yes'){ stage=5; desc='Wheelchair-bound or bedridden. Complete dependence.' }else if(v.falls==='yes'){ stage=4; desc='Severe disability. Can walk only with assistance.' }else if(v.gaitFreezing==='yes'){ stage=4; desc='Freezing of gait. Requires assistance with daily activities.' }else if(v.disability==='yes'){ stage=3; desc='Moderate-severe bilateral. Postural instability but independent.' }else if(v.axialPostural==='yes'){ stage=3; desc='Mild-moderate bilateral with impaired balance/recovery.' }else if(v.bilateral==='yes'){ stage=2; desc='Bilateral symptoms. No balance impairment.' }else if(v.unilateral==='yes'){ stage=1; desc='Unilateral symptoms. Minimal functional impairment.' } return { result:stage, label:'Hoehn & Yahr Stage', steps:[{ label:'Stage', value:stage+'/5' },{ label:'Description', value:desc }] } },
  description: 'Hoehn and Yahr staging scale for Parkinson\'s disease progression assessment.',
  formula: 'Stage 1: Unilateral. Stage 2: Bilateral, no balance. Stage 3: Mild-mod bilateral, postural instability. Stage 4: Severe disability. Stage 5: Wheelchair-bound.',
  interpretation: 'Higher stages indicate greater disease progression. Stage 1-2: Early, Stage 3: Moderate, Stage 4-5: Advanced Parkinson\'s.'
}
export default calcDef
