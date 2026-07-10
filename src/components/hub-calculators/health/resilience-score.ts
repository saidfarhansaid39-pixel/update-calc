import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ adapt: z.string().min(1), bounceBack: z.string().min(1), stressHandle: z.string().min(1), stayFocused: z.string().min(1), positiveOutlook: z.string().min(1) }),
  fields: [
    { name:'adapt', label:'Able to adapt to change', type:'select', options:[{ label:'Not true (0)', value:'0' },{ label:'Rarely true (1)', value:'1' },{ label:'Sometimes true (2)', value:'2' },{ label:'Often true (3)', value:'3' },{ label:'True nearly all the time (4)', value:'4' }] },
    { name:'bounceBack', label:'Can bounce back after hard times', type:'select', options:[{ label:'Not true (0)', value:'0' },{ label:'Rarely true (1)', value:'1' },{ label:'Sometimes true (2)', value:'2' },{ label:'Often true (3)', value:'3' },{ label:'True nearly all the time (4)', value:'4' }] },
    { name:'stressHandle', label:'Able to handle unpleasant feelings', type:'select', options:[{ label:'Not true (0)', value:'0' },{ label:'Rarely true (1)', value:'1' },{ label:'Sometimes true (2)', value:'2' },{ label:'Often true (3)', value:'3' },{ label:'True nearly all the time (4)', value:'4' }] },
    { name:'stayFocused', label:'Stay focused under pressure', type:'select', options:[{ label:'Not true (0)', value:'0' },{ label:'Rarely true (1)', value:'1' },{ label:'Sometimes true (2)', value:'2' },{ label:'Often true (3)', value:'3' },{ label:'True nearly all the time (4)', value:'4' }] },
    { name:'positiveOutlook', label:'Tend to find something positive', type:'select', options:[{ label:'Not true (0)', value:'0' },{ label:'Rarely true (1)', value:'1' },{ label:'Sometimes true (2)', value:'2' },{ label:'Often true (3)', value:'3' },{ label:'True nearly all the time (4)', value:'4' }] }
  ],
  compute: (v) => { const s=parseInt(v.adapt||'2')+parseInt(v.bounceBack||'2')+parseInt(v.stressHandle||'2')+parseInt(v.stayFocused||'2')+parseInt(v.positiveOutlook||'2'); const pct=s/20*100; let level='Low'; if(pct>=75) level='High'; else if(pct>=50) level='Moderate'; return { result:Math.round(pct), label:'Resilience Score', unit:'%', steps:[{ label:'Raw Score', value:s+'/20' },{ label:'Resilience Level', value:level }] } },
  description: 'Brief resilience scale assessing ability to bounce back from stress and adversity.',
  formula: 'Sum of 5 items (0-4 each). Score converted to percentage. Higher = greater resilience.',
  interpretation: '>75% High resilience, 50-74% Moderate, <50% Low resilience. May benefit from resilience training.'
}
export default calcDef
