import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ totalFatG: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), calories: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'totalFatG', label:'Saturated Fat (g/day)', type:'number', min:0, step:'0.1' }, { name:'calories', label:'Total Daily Calories (kcal)', type:'number', min:500, step:'50' }],
  compute: (v) => { const f=parseFloat(v.totalFatG)||20; const c=parseFloat(v.calories)||2000; const pct=(f*9/c)*100; const maxRec=10; const status=pct>maxRec?'Above recommendation':'Within recommendation'; const maxG=(c*0.1)/9; return { result:pct, label:'Saturated Fat % of Calories', unit:'%', steps:[{ label:'Saturated Fat (g)', value:f.toFixed(1)+' g' },{ label:'Fat Calories', value:(f*9).toFixed(0)+' kcal' },{ label:'% of Total', value:pct.toFixed(1)+'%' },{ label:'Max Allowed', value:maxG.toFixed(1)+' g' },{ label:'Status', value:status }] } },
  description: 'Calculates the percentage of calories from saturated fat, a key cardiovascular health metric.',
  formula: '% Saturated Fat = (Saturated Fat g × 9 kcal/g) / Total Calories × 100. Limit: <10% of total energy.',
  interpretation: 'AHA recommends <7% of calories from saturated fat for cardiovascular risk reduction. <10% is general guideline.'
}
export default calcDef