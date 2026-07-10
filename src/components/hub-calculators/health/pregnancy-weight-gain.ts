import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ preBmi: z.string().min(1,'Required').refine(v=>parseFloat(v)>=10,'>=10'), weeksPregnant: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=42,'0-42'), currentWeight: z.string().min(1,'Required').refine(v=>parseFloat(v)>=20,'>=20'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>=50,'>=50') }),
  fields: [
    { name:'preBmi', label:'Pre-Pregnancy BMI (kg/m²)', type:'number', min:10, max:60, step:'0.1' },
    { name:'weeksPregnant', label:'Current Weeks Pregnant', type:'number', min:0, max:42, step:'1' },
    { name:'currentWeight', label:'Current Weight (kg)', type:'number', min:20, max:200, step:'0.1' },
    { name:'height', label:'Height (cm)', type:'number', min:50, max:250, step:'0.1' }
  ],
  compute: (v) => { const bmi=parseFloat(v.preBmi)||22; const weeks=parseInt(v.weeksPregnant)||20; const curWt=parseFloat(v.currentWeight)||65; const h=parseFloat(v.height)||165; const preWt=bmi*(h/100)**2; const gained=curWt-preWt; let recMin=0,recMax=0,recTotalMin=0,recTotalMax=0; if(bmi<18.5){ recTotalMin=12.7; recTotalMax=18.1; recMin=0.44; recMax=0.58 }else if(bmi<25){ recTotalMin=11.3; recTotalMax=15.9; recMin=0.35; recMax=0.50 }else if(bmi<30){ recTotalMin=6.8; recTotalMax=11.3; recMin=0.23; recMax=0.33 }else{ recTotalMin=5.0; recTotalMax=9.1; recMin=0.17; recMax=0.27 }; const recByWeekMin=recMin*weeks; const recByWeekMax=recMax*weeks; let onTrack='On track'; if(gained<recByWeekMin) onTrack='Below recommended'; else if(gained>recByWeekMax) onTrack='Above recommended'; return { result:parseFloat(gained.toFixed(1)), label:'Weight Gained', unit:'kg', steps:[{ label:'Pre-Pregnancy Weight', value:preWt.toFixed(1)+' kg' },{ label:'Current Weight', value:curWt.toFixed(1)+' kg' },{ label:'Weight Gained', value:gained.toFixed(1)+' kg' },{ label:'Recommended Range (this week)', value:recByWeekMin.toFixed(1)+'-'+recByWeekMax.toFixed(1)+' kg' },{ label:'Total Recommended Range', value:recTotalMin+'-'+recTotalMax+' kg' },{ label:'Assessment', value:onTrack }] } },
  description: 'Pregnancy weight gain tracker comparing current gain to IOM guidelines by pre-pregnancy BMI.',
  formula: 'IOM guidelines: Underweight 12.5-18kg, Normal 11.5-16kg, Overweight 7-11.5kg, Obese 5-9kg weekly rates vary.',
  interpretation: 'Compare weight gained to recommended range for gestational age by BMI category. On/above/below track.'
}
export default calcDef
