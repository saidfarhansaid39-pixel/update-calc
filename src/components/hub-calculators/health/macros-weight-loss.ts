import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), sex: z.string().min(1,'Required'), activity: z.string().min(1,'Required') }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:0, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:0, step:'0.1' }, { name:'age', label:'Age (years)', type:'number', min:18, max:120, step:'1' }, { name:'sex', label:'Sex', type:'select', options:[{value:'male',label:'Male'},{value:'female',label:'Female'}] }, { name:'activity', label:'Activity Level', type:'select', options:[{value:'1.2',label:'Sedentary (1.2)'},{value:'1.375',label:'Light (1.375)'},{value:'1.55',label:'Moderate (1.55)'},{value:'1.725',label:'Active (1.725)'},{value:'1.9',label:'Very Active (1.9)'}] }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const h=parseFloat(v.height)||175; const age=parseFloat(v.age)||30; const sex=v.sex||'male'; const act=parseFloat(v.activity)||1.55; const bmr=sex==='male'?10*w+6.25*h-5*age+5:10*w+6.25*h-5*age-161; const tdee=bmr*act; const def=tdee*0.8; const protein=Math.round(w*1.6); const fat=Math.round(w*0.7); const carbs=Math.round((def-protein*4-fat*9)/4); return { result:def, label:'Calories (Weight Loss)', unit:'kcal/day', steps:[{ label:'BMR (Mifflin)', value:bmr.toFixed(0)+' kcal/day' },{ label:'TDEE', value:tdee.toFixed(0)+' kcal/day' },{ label:'Deficit (-20%)', value:def.toFixed(0)+' kcal/day' },{ label:'Protein', value:protein+' g (1.6g/kg)' },{ label:'Fat', value:fat+' g (0.7g/kg)' },{ label:'Carbs', value:carbs+' g' }] } },
  description: 'Calculate macronutrient targets for weight loss with a 20% caloric deficit.',
  formula: 'Protein: 1.6 g/kg bodyweight. Fat: 0.7 g/kg. Carbs: remaining calories. Caloric deficit: TDEE × 0.8.',
  interpretation: 'Aim for 0.5-1 kg weight loss per week. Higher protein preserves lean mass during deficit.'
}

export default calcDef
