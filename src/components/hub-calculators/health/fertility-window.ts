import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ cycleLength: z.string().min(1,'Required').refine(v=>parseFloat(v)>=21,'≥21'), periodLength: z.string().min(1,'Required').refine(v=>parseFloat(v)>=1,'≥1') }),
  fields: [{ name:'cycleLength', label:'Cycle Length (days)', type:'number', min:21, max:45, step:'1' }, { name:'periodLength', label:'Period Length (days)', type:'number', min:1, max:15, step:'1' }],
  compute: (v) => { const cl=parseFloat(v.cycleLength)||28; const pl=parseFloat(v.periodLength)||5; const ovDay=cl-14; const windowStart=Math.max(1,ovDay-5); const windowEnd=ovDay+1; return { result:ovDay, label:'Ovulation Day', unit:'', steps:[{ label:'Cycle Length', value:cl.toString() },{ label:'Ovulation = Cycle - 14', value:'Day '+ovDay.toString() },{ label:'Fertile Window (Day '+(ovDay-5)+' to '+(ovDay+1)+')', value:'Days '+windowStart+'-'+windowEnd }] } },
  description: 'Fertile window identification for conception timing and family planning.',
  formula: 'Ovulation = cycle length - 14 days. Fertile window = ovulation-5 to ovulation+1 days.',
  interpretation: 'Sperm survive 5 days in cervical mucus. Egg viable 12-24h. Best intercourse timing: daily during fertile window.'
}

export default calcDef
