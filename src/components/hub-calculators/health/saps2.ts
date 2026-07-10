import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'>=0'), heartRate: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'>=0'), sbp: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'>=0'), temp: z.string().min(1,'Required').refine(v=>parseFloat(v)>=30,'>=30'), rr: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'>=0'), vent: z.string().min(1), pao2Fio2: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), bili: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), bun: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), wbc: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), potassium: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), sodium: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), bicarb: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0') }),
  fields: [
    { name:'age', label:'Age (years)', type:'number', min:0, max:120, step:'1' },
    { name:'heartRate', label:'Heart Rate (bpm)', type:'number', min:0, max:300, step:'1' },
    { name:'sbp', label:'Systolic BP (mmHg)', type:'number', min:0, max:300, step:'1' },
    { name:'temp', label:'Temperature (°C)', type:'number', min:30, max:45, step:'0.1' },
    { name:'rr', label:'Respiratory Rate (/min)', type:'number', min:0, max:80, step:'1' },
    { name:'vent', label:'On Ventilator / CPAP?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes', value:'1' }] },
    { name:'pao2Fio2', label:'PaO2/FiO2 Ratio', type:'number', min:0, max:700, step:'1' },
    { name:'bili', label:'Bilirubin (mg/dL)', type:'number', min:0, max:50, step:'0.1' },
    { name:'bun', label:'BUN (mg/dL)', type:'number', min:0, max:200, step:'1' },
    { name:'wbc', label:'WBC (×10³/µL)', type:'number', min:0, max:200, step:'0.1' },
    { name:'potassium', label:'Potassium (mEq/L)', type:'number', min:0, max:10, step:'0.1' },
    { name:'sodium', label:'Sodium (mEq/L)', type:'number', min:100, max:180, step:'1' },
    { name:'bicarb', label:'Bicarbonate (mEq/L)', type:'number', min:0, max:50, step:'1' }
  ],
  compute: (v) => { const age=parseInt(v.age)||50; let ageScore=0; if(age<40) ageScore=0; else if(age<60) ageScore=7; else if(age<70) ageScore=12; else if(age<75) ageScore=15; else if(age<80) ageScore=16; else ageScore=18; const hr=parseInt(v.heartRate)||80; let hrScore=0; if(hr<40) hrScore=11; else if(hr<70) hrScore=2; else if(hr<120) hrScore=0; else if(hr<160) hrScore=4; else hrScore=7; const sbp=parseInt(v.sbp)||120; let sbpScore=0; if(sbp<70) sbpScore=13; else if(sbp<100) sbpScore=5; else if(sbp<200) sbpScore=0; else sbpScore=2; const temp=parseFloat(v.temp)||37; let tempScore=0; if(temp<39) tempScore=0; else if(temp<41) tempScore=2; else tempScore=3; const rr=parseInt(v.rr)||16; let rrScore=0; if(rr<6) rrScore=11; else if(rr<12) rrScore=1; else if(rr<25) rrScore=0; else if(rr<35) rrScore=6; else rrScore=9; const vent=parseInt(v.vent||'0')?6:0; const pf=parseFloat(v.pao2Fio2)||400; let pfScore=0; if(pf<100) pfScore=11; else if(pf<200) pfScore=9; else if(pf<300) pfScore=6; else if(pf<400) pfScore=2; else pfScore=0; const bili=parseFloat(v.bili)||1; let biliScore=0; if(bili<4) biliScore=0; else if(bili<6) biliScore=4; else biliScore=5; const bun=parseFloat(v.bun)||15; let bunScore=0; if(bun<28) bunScore=0; else if(bun<84) bunScore=6; else bunScore=10; const wbc=parseFloat(v.wbc)||8; let wbcScore=0; if(wbc<1) wbcScore=12; else if(wbc<20) wbcScore=0; else wbcScore=3; const k=parseFloat(v.potassium)||4; let kScore=0; if(k<3) kScore=3; else if(k<5) kScore=0; else kScore=3; const na=parseFloat(v.sodium)||140; let naScore=0; if(na<125) naScore=5; else if(na<145) naScore=0; else naScore=1; const bicarb=parseFloat(v.bicarb)||24; let bicarbScore=0; if(bicarb<15) bicarbScore=6; else if(bicarb<20) bicarbScore=2; else bicarbScore=0; const total=ageScore+hrScore+sbpScore+tempScore+rrScore+vent+pfScore+biliScore+bunScore+wbcScore+kScore+naScore+bicarbScore; const logit=-7.7631+0.0737*total; const mortality=Math.round(Math.exp(logit)/(1+Math.exp(logit))*100)/100; return { result:total, label:'SAPS II Score', steps:[{ label:'Age Score', value:ageScore+'' },{ label:'Physiology Score', value:(total-ageScore)+'' },{ label:'Total SAPS II', value:total+'' },{ label:'Predicted Mortality', value:(mortality*100).toFixed(1)+'%' }] } },
  description: 'Simplified Acute Physiology Score (SAPS II) for ICU mortality risk prediction.',
  formula: 'Weighted scoring of 12 physiology + age variables. Logit-based mortality prediction.',
  interpretation: 'Higher scores indicate greater severity. Scores range 0-163. Mortality ranges <1% to >95%.'
}
export default calcDef
