import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ sugarG: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), calories: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'sugarG', label:'Added Sugar (g/day)', type:'number', min:0, step:'1' }, { name:'calories', label:'Total Daily Calories (kcal)', type:'number', min:500, step:'50' }],
  compute: (v) => { const s=parseFloat(v.sugarG)||50; const c=parseFloat(v.calories)||2000; const pct=(s*4/c)*100; const maxRec=10; const status=pct>maxRec?'Exceeds recommendation':'Within recommendation'; return { result:pct, label:'Sugar % of Calories', unit:'%', steps:[{ label:'Sugar (g)', value:s.toFixed(0)+' g' },{ label:'Sugar Calories', value:(s*4).toFixed(0)+' kcal' },{ label:'% of Total', value:pct.toFixed(1)+'%' },{ label:'Status', value:status }] } },
  description: 'Calculates what percentage of daily calorie intake comes from added sugar.',
  formula: 'Added Sugar % = (Sugar g × 4 kcal/g) / Total Calories × 100. WHO recommends <10% of total energy.',
  interpretation: 'WHO recommends <10% of calories from added sugar. Ideally <5% (<25g/day for adults) for additional health benefits.'
}
export default calcDef