import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), ageMonths: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'>=0'), sex: z.string().min(1) }),
  fields: [
    { name:'weight', label:'Weight (kg)', type:'number', min:1, max:200, step:'0.1' },
    { name:'height', label:'Height / Length (cm)', type:'number', min:30, max:200, step:'0.1' },
    { name:'ageMonths', label:'Age (months)', type:'number', min:0, max:240, step:'1' },
    { name:'sex', label:'Sex', type:'select', options:[{ label:'Male', value:'male' },{ label:'Female', value:'female' }] }
  ],
  compute: (v) => { const w=parseFloat(v.weight)||10; const h=parseFloat(v.height)||75; const a=parseInt(v.ageMonths)||24; const sex=v.sex==='male'?'male':'female'; const bmi=w/((h/100)**2); const medians:Record<string,Record<number,{w:number;h:number}>>={male:{0:{w:3.5,h:50},24:{w:12.2,h:87},60:{w:18.9,h:110},120:{w:32.5,h:140},168:{w:55.5,h:170}},female:{0:{w:3.4,h:49},24:{w:11.8,h:86},60:{w:18.5,h:109},120:{w:32,h:139},168:{w:54,h:168}}}; const ages=[0,24,60,120,168]; let closest=ages.reduce((prev,curr)=>Math.abs(curr-a)<Math.abs(prev-a)?curr:prev); const ref=medians[sex]; const median=ref[closest]||ref[0]; const wRatio=w/median.w; const hRatio=h/median.h; const wPct=Math.min(100,Math.max(1,Math.round(wRatio*50*100)/100)); const hPct=Math.min(100,Math.max(1,Math.round(hRatio*50*100)/100)); const bmiPct=Math.min(100,Math.max(1,Math.round(bmi/(median.w/((median.h/100)**2))*50))); let status='Normal'; if(bmiPct>=95) status='Obese'; else if(bmiPct>=85) status='Overweight'; else if(bmiPct<5) status='Underweight'; return { result:parseFloat(bmi.toFixed(1)), label:'BMI', unit:'kg/m²', steps:[{ label:'Weight-for-Age Percentile', value:wPct+'th' },{ label:'Height-for-Age Percentile', value:hPct+'th' },{ label:'BMI Percentile', value:bmiPct+'th' },{ label:'Weight Status', value:status }] } },
  description: 'Weight, height, and BMI-for-age percentiles for pediatric growth assessment.',
  formula: 'Percentiles approximated from WHO/Centers for Disease Control reference medians. BMI = weight(kg)/height(m)².',
  interpretation: 'BMI <5th: Underweight, 5-84th: Normal, 85-94th: Overweight, ≥95th: Obese. Serial measurements track growth.'
}
export default calcDef
