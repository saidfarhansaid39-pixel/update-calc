import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseInt(v)>=40,'>=40'), gender: z.string().min(1), weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), priorFracture: z.string().min(1), parentHipFracture: z.string().min(1), smoking: z.string().min(1), glucocorticoids: z.string().min(1), rheumatoidArthritis: z.string().min(1), secondaryOsteoporosis: z.string().min(1), alcohol: z.string().min(1), femoralNeckBmd: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0') }),
  fields: [
    { name:'age', label:'Age (years)', type:'number', min:40, max:100, step:'1' },
    { name:'gender', label:'Gender', type:'select', options:[{ label:'Female', value:'female' },{ label:'Male', value:'male' }] },
    { name:'weight', label:'Weight (kg)', type:'number', min:20, max:200, step:'0.1' },
    { name:'height', label:'Height (cm)', type:'number', min:100, max:220, step:'0.1' },
    { name:'priorFracture', label:'Prior Fragility Fracture?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes', value:'1' }] },
    { name:'parentHipFracture', label:'Parent had Hip Fracture?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes', value:'1' }] },
    { name:'smoking', label:'Current Smoker?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes', value:'1' }] },
    { name:'glucocorticoids', label:'Oral Glucocorticoids >3 months?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes', value:'1' }] },
    { name:'rheumatoidArthritis', label:'Rheumatoid Arthritis?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes', value:'1' }] },
    { name:'secondaryOsteoporosis', label:'Secondary Osteoporosis (type 1 diabetes, hyperthyroidism, etc)?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes', value:'1' }] },
    { name:'alcohol', label:'Alcohol ≥3 units/day?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes', value:'1' }] },
    { name:'femoralNeckBmd', label:'Femoral Neck BMD (T-score)', type:'number', min:-5, max:5, step:'0.1' }
  ],
  compute: (v) => { const age=parseInt(v.age)||60; const gender=v.gender||'female'; const wt=parseFloat(v.weight)||70; const ht=parseFloat(v.height)||165; const bmi=wt/((ht/100)**2); const priorFx=parseInt(v.priorFracture||'0'); const parentFx=parseInt(v.parentHipFracture||'0'); const smoke=parseInt(v.smoking||'0'); const gc=parseInt(v.glucocorticoids||'0'); const ra=parseInt(v.rheumatoidArthritis||'0'); const secOp=parseInt(v.secondaryOsteoporosis||'0'); const alc=parseInt(v.alcohol||'0'); const bmd=parseFloat(v.femoralNeckBmd)||0; const baseRisk=bmi>=25?0.05:0.08; const ageFactor=gender==='female'?Math.exp((age-60)*0.03):Math.exp((age-60)*0.025); const bmdFactor=Math.exp(bmd*(-0.5)); const fxCount=priorFx+parentFx+smoke+gc+ra+secOp+alc; const clinicalFactor=Math.exp(fxCount*0.2); const majorOsteo=Math.min(50,Math.round(baseRisk*ageFactor*bmdFactor*clinicalFactor*100*100)/100); const hipFx=majorOsteo*(gender==='female'?0.4:0.25); return { result:majorOsteo, label:'Major Osteoporotic Fracture Risk (FRAX-style)', unit:'% 10-year', steps:[{ label:'10-Year MOF Risk', value:majorOsteo+'%' },{ label:'10-Year Hip Fracture Risk', value:hipFx.toFixed(1)+'%' },{ label:'BMI', value:bmi.toFixed(1) },{ label:'Risk Factors Present', value:fxCount+'/7' },{ label:'BMD T-Score', value:bmd.toFixed(1) }] } },
  description: 'Osteoporosis fracture risk assessment (FRAX-style) estimating 10-year probability of major osteoporotic fracture.',
  formula: '10-year risk = baseline × age factor × BMD factor × clinical risk factors. Baseline varies by BMI and gender.',
  interpretation: '≥20% MOF risk or ≥3% hip fracture risk suggests pharmacologic treatment per NOF guidelines.'
}
export default calcDef
