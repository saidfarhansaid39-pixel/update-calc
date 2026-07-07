import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), bodyFat: z.string().min(1,'Required').refine(v=>parseFloat(v)>=3,'≥3'), activity: z.string().min(1,'Required'), goal: z.string().min(1,'Required') }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:0, step:'0.1' }, { name:'bodyFat', label:'Body Fat (%)', type:'number', min:3, max:60, step:'0.1' }, { name:'activity', label:'Activity Level', type:'select', options:[{value:'1.2',label:'Sedentary (1.2)'},{value:'1.375',label:'Light (1.375)'},{value:'1.55',label:'Moderate (1.55)'},{value:'1.725',label:'Active (1.725)'},{value:'1.9',label:'Very Active (1.9)'}] }, { name:'goal', label:'Goal', type:'select', options:[{value:'lose',label:'Weight Loss (-20%)'},{value:'maintain',label:'Maintenance'},{value:'gain',label:'Weight Gain (+15%)'}] }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const bf=parseFloat(v.bodyFat)||20; const act=parseFloat(v.activity)||1.2; const lbm=w*(1-bf/100); const bmr=370+21.6*lbm; const tdee=bmr*act; const gf=({lose:0.8,maintain:1,gain:1.15} as Record<string, number>)[v.goal]||1; const gc=tdee*gf; return { result:bmr, label:'BMR (Katch-McArdle)', unit:'kcal/day', steps:[{ label:'Body Weight', value:w.toFixed(1)+' kg' },{ label:'Body Fat', value:bf.toFixed(1)+'%' },{ label:'Lean Body Mass', value:lbm.toFixed(1)+' kg' },{ label:'BMR', value:bmr.toFixed(0)+' kcal/day' },{ label:'TDEE', value:tdee.toFixed(0)+' kcal/day' },{ label:'Goal Calories', value:gc.toFixed(0)+' kcal/day' }] } },
  description: 'Katch-McArdle BMR formula using lean body mass for precise resting energy expenditure estimation.',
  formula: 'BMR = 370 + 21.6 × LBM (kg). LBM = Weight × (1 - Body Fat % / 100). TDEE = BMR × Activity factor.',
  interpretation: 'Most accurate BMR formula as it uses LBM not just weight. Activity factors: sedentary 1.2, light 1.375, moderate 1.55, active 1.725, very active 1.9.'
}

export default calcDef
