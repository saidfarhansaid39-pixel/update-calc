import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ overwhelmed: z.string().min(1), lossControl: z.string().min(1), nervous: z.string().min(1), confidence: z.string().min(1), thingsGoing: z.string().min(1), coping: z.string().min(1), irritability: z.string().min(1), sleepTrouble: z.string().min(1) }),
  fields: [
    { name:'overwhelmed', label:'Felt overwhelmed by demands?', type:'select', options:[{ label:'Never (0)', value:'0' },{ label:'Almost Never (1)', value:'1' },{ label:'Sometimes (2)', value:'2' },{ label:'Fairly Often (3)', value:'3' },{ label:'Very Often (4)', value:'4' }] },
    { name:'lossControl', label:'Felt unable to control things?', type:'select', options:[{ label:'Never (0)', value:'0' },{ label:'Almost Never (1)', value:'1' },{ label:'Sometimes (2)', value:'2' },{ label:'Fairly Often (3)', value:'3' },{ label:'Very Often (4)', value:'4' }] },
    { name:'nervous', label:'Felt nervous or stressed?', type:'select', options:[{ label:'Never (0)', value:'0' },{ label:'Almost Never (1)', value:'1' },{ label:'Sometimes (2)', value:'2' },{ label:'Fairly Often (3)', value:'3' },{ label:'Very Often (4)', value:'4' }] },
    { name:'confidence', label:'Felt confident handling problems?', type:'select', options:[{ label:'Very Often (0)', value:'0' },{ label:'Fairly Often (1)', value:'1' },{ label:'Sometimes (2)', value:'2' },{ label:'Almost Never (3)', value:'3' },{ label:'Never (4)', value:'4' }] },
    { name:'thingsGoing', label:'Felt things were going your way?', type:'select', options:[{ label:'Very Often (0)', value:'0' },{ label:'Fairly Often (1)', value:'1' },{ label:'Sometimes (2)', value:'2' },{ label:'Almost Never (3)', value:'3' },{ label:'Never (4)', value:'4' }] },
    { name:'coping', label:'Felt unable to cope with everything?', type:'select', options:[{ label:'Never (0)', value:'0' },{ label:'Almost Never (1)', value:'1' },{ label:'Sometimes (2)', value:'2' },{ label:'Fairly Often (3)', value:'3' },{ label:'Very Often (4)', value:'4' }] },
    { name:'irritability', label:'Felt irritable or angry?', type:'select', options:[{ label:'Never (0)', value:'0' },{ label:'Almost Never (1)', value:'1' },{ label:'Sometimes (2)', value:'2' },{ label:'Fairly Often (3)', value:'3' },{ label:'Very Often (4)', value:'4' }] },
    { name:'sleepTrouble', label:'Had trouble sleeping due to stress?', type:'select', options:[{ label:'Never (0)', value:'0' },{ label:'Almost Never (1)', value:'1' },{ label:'Sometimes (2)', value:'2' },{ label:'Fairly Often (3)', value:'3' },{ label:'Very Often (4)', value:'4' }] }
  ],
  compute: (v) => { const s=[0,1,2,3,4,5,6,7].reduce((acc,i)=>acc+parseInt(v['q'+(i+1)]||'0'),0)+(16-2*(parseInt(v.confidence||'0')+parseInt(v.thingsGoing||'0'))); let level='Low'; if(s>=27) level='High'; else if(s>=14) level='Moderate'; return { result:s, label:'Perceived Stress Score', unit:'/40', steps:[{ label:'Total Score', value:s+'/40' },{ label:'Stress Level', value:level }] } },
  description: 'Perceived Stress Scale (PSS) adapted assessment measuring stress levels over the past month.',
  formula: 'Four positively-worded items reverse-scored. Sum of all 8 items. Range 0-40.',
  interpretation: '0-13 Low stress, 14-26 Moderate stress, 27-40 High perceived stress.'
}
export default calcDef
