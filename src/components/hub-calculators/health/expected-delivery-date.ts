import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ lmp: z.string().min(1,'Required'), cycleLength: z.string().min(1,'Required').refine(v=>parseFloat(v)>=21,'≥21') }),
  fields: [{ name:'lmp', label:'Day of LMP (1-365)', type:'number', min:1, max:365, step:'1' }, { name:'cycleLength', label:'Cycle Length (days)', type:'number', min:21, max:45, step:'1' }],
  compute: (v) => { const lmpDay=parseInt(v.lmp)||1; const cycle=parseFloat(v.cycleLength)||28; const due=lmpDay+280+(cycle-28); const dueMonth=Math.floor((due-1)/30.4); const dueDay=Math.round((due-1)%30.4+1); return { result:due, label:'EDD (Day of Year)', unit:'', steps:[{ label:'LMP Day '+lmpDay.toString(), value:'' },{ label:'Naegele: +280 + (cycle-28)', value:'Day '+due.toString() },{ label:'Approx', value:'Month '+(dueMonth+1).toString()+', Day '+dueDay.toString() }] } },
  description: 'Expected delivery date by Naegele rule accounting for cycle length variation.',
  formula: 'EDD = LMP + 280 days + (cycle length - 28). Naegele rule: LMP + 1yr - 3mo + 7d.',
  interpretation: 'Due date ±2 weeks is normal. Accurate LMP and regular cycles yield best estimate.'
}

export default calcDef
