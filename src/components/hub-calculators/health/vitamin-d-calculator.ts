import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ current25ohd: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), target25ohd: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), dailyIntake: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'current25ohd', label:'Current 25(OH)D (ng/mL)', type:'number', min:0, step:'0.5' }, { name:'target25ohd', label:'Target 25(OH)D (ng/mL)', type:'number', min:0, step:'0.5' }, { name:'weight', label:'Weight (kg)', type:'number', min:20, step:'0.1' }, { name:'dailyIntake', label:'Current Daily Intake (IU)', type:'number', min:0, step:'100' }],
  compute: (v) => { const cur=parseFloat(v.current25ohd)||20; const tgt=parseFloat(v.target25ohd)||50; const w=parseFloat(v.weight)||70; const di=parseFloat(v.dailyIntake)||400; const diff=tgt-cur; const loadingIU=diff*w*40; const loadingDays=60; const dailyIU=loadingIU/loadingDays+di; const status=cur<12?'Deficient':cur<20?'Insufficient':cur<50?'Sufficient':'Optimal'; return { result:dailyIU, label:'Daily Vitamin D (IU)', unit:'IU', steps:[{ label:'Current Level', value:cur.toFixed(1)+' ng/mL ('+status+')' },{ label:'Target Level', value:tgt.toFixed(0)+' ng/mL' },{ label:'Loading Dose (total)', value:loadingIU.toFixed(0)+' IU' },{ label:'Daily Supplement', value:Math.max(0,dailyIU-di).toFixed(0)+' IU' },{ label:'Status', value:status }] } },
  description: 'Calculates Vitamin D3 supplementation needed to reach target 25(OH)D levels based on body weight.',
  formula: 'Total IU needed = (Target - Current) × weight × 100. Daily dose = Total/60 + current daily intake.',
  interpretation: 'Vitamin D: <12 deficient, 12-20 inadequate, 20-50 sufficient, >50 ng/mL optimal. Upper limit: 4000 IU/day without monitoring.'
}
export default calcDef