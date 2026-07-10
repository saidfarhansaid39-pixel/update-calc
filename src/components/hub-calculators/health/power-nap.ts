import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ napLength: z.string().min(1,'Required').refine(v=>parseInt(v)>=5&&parseInt(v)<=120,'5-120'), purpose: z.string().min(1) }),
  fields: [{ name:'napLength', label:'Nap Length (minutes)', type:'number', min:5, max:120, step:'5' }, { name:'purpose', label:'Nap Purpose', type:'select', options:[{ label:'Quick Energy', value:'energy' },{ label:'Creativity', value:'creativity' },{ label:'Physical Recovery', value:'recovery' },{ label:'Learning/Memory', value:'learning' }] }],
  compute: (v) => { const n=parseInt(v.napLength)||20; const p=v.purpose||'energy'; let stage='', benefit='', feeling=''; if(n<=20){ stage='N1/N2'; benefit='Alertness boost, no sleep inertia'; feeling='Refreshed' }else if(n<=30){ stage='N2'; benefit='Memory consolidation, moderate boost'; feeling='Moderate inertia possible' }else if(n<=60){ stage='N2/SWS'; benefit='Creativity, hormone release'; feeling='Some inertia' }else{ stage='SWS/REM'; benefit='Full cycle, emotional processing'; feeling='Significant inertia likely' }; const ideal=n>=10&&n<=20||n==90; return { result:n, label:'Nap Duration', unit:'min', steps:[{ label:'Nap Stage', value:stage },{ label:'Expected Benefit', value:benefit },{ label:'Upon Waking', value:feeling }] } },
  description: 'Recommends optimal nap duration based on purpose and available time.',
  formula: 'Power nap phases: 10-20 min (N1/N2), 30-60 min (SWS), 90 min (full cycle).',
  interpretation: 'Short naps (10-20 min) prevent sleep inertia. Full 90-min naps include REM but cause grogginess.'
}
export default calcDef
