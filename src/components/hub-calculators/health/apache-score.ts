import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ temperature: z.string().min(1,'Required').refine(v=>parseFloat(v)>=30,'≥30'), heartRate: z.string().min(1,'Required').refine(v=>parseFloat(v)>=20,'≥20'), respiratoryRate: z.string().min(1,'Required').refine(v=>parseFloat(v)>=5,'≥5'), gcs: z.string().min(1,'Required').refine(v=>parseFloat(v)>=3,'≥3'), creatinine: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18') }),
  fields: [{ name:'temperature', label:'Temperature (°C)', type:'number', min:30, max:45, step:'0.1' }, { name:'heartRate', label:'Heart Rate (bpm)', type:'number', min:20, max:300, step:'1' }, { name:'respiratoryRate', label:'Resp Rate', type:'number', min:5, max:100, step:'1' }, { name:'gcs', label:'GCS', type:'number', min:3, max:15, step:'1' }, { name:'creatinine', label:'Creatinine (mg/dL)', type:'number', min:0.1, max:20, step:'0.1' }, { name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }],
  compute: (v) => { const t=parseFloat(v.temperature)||37; const hr=parseFloat(v.heartRate)||80; const rr=parseFloat(v.respiratoryRate)||16; const g=parseFloat(v.gcs)||15; const cr=parseFloat(v.creatinine)||1; const a=parseFloat(v.age)||40; let pts=0; pts+=t<33||t>40.9?4:t<36||t>38.4?2:0; pts+=hr<40||hr>179?4:hr<55||hr>139?3:hr<70||hr>109?2:0; pts+=rr<6||rr>49?4:rr<10||rr>39?3:rr<12||rr>29?2:0; pts+=15-g; pts+=cr>3.4?4:cr>1.9?3:cr>1.4?2:0; const aPts=a<45?0:a<55?2:a<65?3:a<75?5:6; pts+=aPts; return { result:pts, label:'APACHE II Score', unit:'', steps:[{ label:'Physiology Points', value:(pts-aPts).toString() },{ label:'Age Points', value:aPts.toString() },{ label:'Total', value:pts.toString() }] } },
  description: 'APACHE II ICU mortality prediction score from acute physiology and age.',
  formula: 'APACHE II = 12 physiology variable points + age points + chronic health points. Range 0-71.',
  interpretation: 'Score 0-4: 4% mortality; 5-9: 8%; 10-14: 15%; 15-19: 25%; 20-24: 40%; ≥25: >50%.'
}

export default calcDef
