import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ current25ohd: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), target25ohd: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), durationWeeks: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'current25ohd', label:'Current 25(OH)D (ng/mL)', type:'number', min:0, step:'0.5' }, { name:'target25ohd', label:'Target 25(OH)D (ng/mL)', type:'number', min:0, step:'0.5' }, { name:'weight', label:'Weight (kg)', type:'number', min:20, step:'0.1' }, { name:'durationWeeks', label:'Duration (weeks)', type:'number', min:2, max:52, step:'1' }],
  compute: (v) => { const cur=parseFloat(v.current25ohd)||20; const tgt=parseFloat(v.target25ohd)||50; const w=parseFloat(v.weight)||70; const dur=parseFloat(v.durationWeeks)||12; const diff=tgt-cur; const totalIU=diff*w*100; const weeklyIU=totalIU/dur; const dailyIU=weeklyIU/7; const maintenanceIU=2000; return { result:weeklyIU, label:'Weekly Vitamin D Dose', unit:'IU/week', steps:[{ label:'Total Needed', value:totalIU.toFixed(0)+' IU' },{ label:'Weekly Dose', value:weeklyIU.toFixed(0)+' IU' },{ label:'Daily Equivalent', value:dailyIU.toFixed(0)+' IU/day' },{ label:'Maintenance (~2000/day)', value:maintenanceIU+' IU/day' }] } },
  description: 'Calculates Vitamin D3 loading dose to achieve target 25(OH)D levels over a specified duration.',
  formula: 'Total IU = (Target - Current) × Weight × 100. Weekly dose = Total / Weeks. Maintenance: 2000 IU/day.',
  interpretation: 'Loading doses of 50,000 IU/week are common for deficiency. Adjust duration: 8-16 weeks typically. Recheck levels after loading.'
}
export default calcDef