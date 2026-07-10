import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ bun: z.string().min(1), impairedMental: z.string().min(1), sirs: z.string().min(1), age: z.string().min(1), pleuralEffusion: z.string().min(1) }),
  fields: [
    { name:'bun', label:'BUN >25 mg/dL', type:'select', options:[{ label:'No (0)', value:'0' },{ label:'Yes (1)', value:'1' }] },
    { name:'impairedMental', label:'Impaired Mental Status', type:'select', options:[{ label:'No (0)', value:'0' },{ label:'Yes (1)', value:'1' }] },
    { name:'sirs', label:'SIRS Criteria Present (≥2)', type:'select', options:[{ label:'No (0)', value:'0' },{ label:'Yes (1)', value:'1' }] },
    { name:'age', label:'Age >60 years', type:'select', options:[{ label:'No (0)', value:'0' },{ label:'Yes (1)', value:'1' }] },
    { name:'pleuralEffusion', label:'Pleural Effusion on Imaging', type:'select', options:[{ label:'No (0)', value:'0' },{ label:'Yes (1)', value:'1' }] }
  ],
  compute: (v) => { const score=parseInt(v.bun||'0')+parseInt(v.impairedMental||'0')+parseInt(v.sirs||'0')+parseInt(v.age||'0')+parseInt(v.pleuralEffusion||'0'); let mortality='<1%'; if(score>=4) mortality='>15%'; else if(score>=3) mortality='8-15%'; else if(score>=2) mortality='3-8%'; return { result:score, label:'BISAP Score', unit:'/5', steps:[{ label:'BISAP Score', value:score+'/5' },{ label:'Predicted Mortality', value:mortality }] } },
  description: 'BISAP (Bedside Index for Severity in Acute Pancreatitis) 5-point scoring system.',
  formula: '1 point each: BUN>25, Impaired Mental Status, SIRS≥2, Age>60, Pleural Effusion. Range 0-5.',
  interpretation: '0-1: <1% mortality. 2: 3% mortality. 3: 8% mortality. 4: 15% mortality. 5: >20% mortality.'
}
export default calcDef
