import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ conceptionDate: z.string().min(1,'Required') }),
  fields: [{ name:'conceptionDate', label:'Conception Date', type:'number', min:1, max:365, step:'1' }],
  compute: (v) => { const cd=parseInt(v.conceptionDate)||1; const dueDate=cd+266; const dueMonth=Math.floor((dueDate-1)/30.4); const dueDay=Math.round((dueDate-1)%30.4+1); return { result:dueDate, label:'Day of Year', unit:'', steps:[{ label:'Conception + 266 days', value:'Day '+dueDate.toString() },{ label:'Approx Due Date', value:'Month '+(dueMonth+1).toString()+', Day '+dueDay.toString() }] } },
  description: 'Due date calculated from conception date (conception + 266 days).',
  formula: 'EDD = Conception Date + 266 days(38 weeks). Alternative: LMP + 280 days.',
  interpretation: 'Accurate if conception date known precisely (e.g., IVF). Due date ±7 days in either direction.'
}

export default calcDef
