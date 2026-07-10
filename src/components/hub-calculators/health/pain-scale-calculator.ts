import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ painIntensity: z.string().min(1), painFrequency: z.string().min(1), painDuration: z.string().min(1), activityImpact: z.string().min(1), sleepImpact: z.string().min(1), painQuality: z.string().min(1) }),
  fields: [
    { name:'painIntensity', label:'Average Pain Intensity (0=none, 10=worst)', type:'number', min:0, max:10, step:'1' },
    { name:'painFrequency', label:'Pain Frequency', type:'select', options:[{ label:'Occasionally (1)', value:'1' },{ label:'Several times/week (2)', value:'2' },{ label:'Daily (3)', value:'3' },{ label:'Constant (4)', value:'4' }] },
    { name:'painDuration', label:'Pain Duration', type:'select', options:[{ label:'<1 month (1)', value:'1' },{ label:'1-3 months (2)', value:'2' },{ label:'3-6 months (3)', value:'3' },{ label:'>6 months (4)', value:'4' }] },
    { name:'activityImpact', label:'Impact on Daily Activities (0=none, 10=severe)', type:'number', min:0, max:10, step:'1' },
    { name:'sleepImpact', label:'Impact on Sleep (0=none, 10=severe)', type:'number', min:0, max:10, step:'1' },
    { name:'painQuality', label:'Pain Quality', type:'select', options:[{ label:'Aching/Dull (1)', value:'1' },{ label:'Stabbing (2)', value:'2' },{ label:'Burning (3)', value:'3' },{ label:'Throbbing (4)', value:'4' }] }
  ],
  compute: (v) => { const intensity=parseInt(v.painIntensity)||5; const freq=parseInt(v.painFrequency)||2; const dur=parseInt(v.painDuration)||2; const activity=parseInt(v.activityImpact)||5; const sleep=parseInt(v.sleepImpact)||5; const quality=parseInt(v.painQuality)||2; const score=intensity+freq+dur+Math.round(activity/3)+Math.round(sleep/3)+quality; let sev='Mild'; if(score>=20) sev='Severe'; else if(score>=12) sev='Moderate'; return { result:score, label:'Pain Score', unit:'/32', steps:[{ label:'Pain Score', value:score+'/32' },{ label:'Severity', value:sev }] } },
  description: 'Multi-dimensional pain assessment scoring intensity, frequency, duration, and impact.',
  formula: 'Score = intensity + frequency + duration + activity/3 + sleep/3 + quality. Range 2-32.',
  interpretation: '2-11 Mild pain, 12-19 Moderate pain, 20-32 Severe pain requiring intervention.'
}
export default calcDef
