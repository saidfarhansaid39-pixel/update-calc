import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tdee: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), surplusPct: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'tdee', label:'TDEE (kcal)', type:'number', min:500, max:10000, step:'50' }, { name:'surplusPct', label:'Surplus % (0-30)', type:'number', min:0, max:30, step:'1' }],
  compute: (v) => { const tdee=parseFloat(v.tdee)||2500; const sp=parseFloat(v.surplusPct)||10; const sur=tdee*sp/100; const cal=tdee+sur; const musWk=sur*7/5500; return { result:cal, label:'Target Calories', unit:'kcal/day', steps:[{ label:'TDEE', value:tdee.toString() },{ label:'Surplus', value:sur.toFixed(0) },{ label:'Target', value:cal.toFixed(0) },{ label:'Muscle Gain/Wk Est.', value:musWk.toFixed(2)+' kg' }] } },
  description: 'Calorie surplus for lean muscle gain above maintenance.',
  formula: 'Target = TDEE×(1+S%). Lean bulk: 5-15% surplus. Protein: 1.6-2.2 g/kg.',
  interpretation: '5-10%: lean gain. 10-15%: moderate. >15%: excess fat gain likely.'
}

export default calcDef
