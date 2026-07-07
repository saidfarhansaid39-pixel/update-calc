import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), glucose: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), targetGlucose: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), carbIntake: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), insulinType: z.string().min(1,'Required'), correctionFactor: z.string().min(1,'Required') }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:0, step:'0.1' }, { name:'glucose', label:'Current Glucose (mg/dL)', type:'number', min:0, step:'1' }, { name:'targetGlucose', label:'Target Glucose (mg/dL)', type:'number', min:0, step:'1' }, { name:'carbIntake', label:'Carbohydrate Intake (g)', type:'number', min:0, step:'1' }, { name:'insulinType', label:'Insulin Regimen', type:'select', options:[{value:'basal-bolus',label:'Basal-Bolus'},{value:'correction',label:'Correction Only'},{value:'sliding',label:'Sliding Scale'}] }, { name:'correctionFactor', label:'Correction Factor', type:'select', options:[{value:'1800',label:'1800 Rule (standard)'},{value:'1500',label:'1500 Rule (rapid)'},{value:'2000',label:'2000 Rule (sensitive)'}] }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const g=parseFloat(v.glucose)||150; const tg=parseFloat(v.targetGlucose)||100; const carb=parseFloat(v.carbIntake)||0; const cf=parseInt(v.correctionFactor)||1800; const tdi=w*0.55; const isf=tg>0?cf/tdi:0; const corr=Math.max(0,(g-tg)/isf); const icr=500/tdi; const meal=carb/icr; const tot=corr+meal; return { result:tot, label:'Total Insulin', unit:'units', steps:[{ label:'TDI (0.55×W)', value:tdi.toFixed(1)+' U' },{ label:'ISF', value:isf.toFixed(1)+' mg/dL/U' },{ label:'ICR', value:icr.toFixed(1)+' g/U' },{ label:'Meal Bolus', value:meal.toFixed(1)+' U' },{ label:'Correction', value:corr.toFixed(1)+' U' },{ label:'Total Dose', value:tot.toFixed(1)+' U' }] } },
  description: 'Insulin dose calculator using total daily insulin, correction factor, insulin-to-carb ratio, and 1800/1500/2000 rules.',
  formula: 'TDI = 0.5-0.6×W. ISF = 1800/TDI (mg/dL per unit). ICR = 500/TDI (g per unit). Correction = (BG-Target)/ISF. Meal = Carbs/ICR.',
  interpretation: 'Basal: 40-50% of TDI. Bolus: 50-60% split into meal (ICR) + correction (ISF). Adjust ISF/ICR based on 3-day glucose patterns.'
}

export default calcDef
