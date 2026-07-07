import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18'), heartRate: z.string().min(1,'Required').refine(v=>parseFloat(v)>=20,'≥20'), meanBP: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), temperature: z.string().min(1,'Required').refine(v=>parseFloat(v)>=30,'≥30'), respiratoryRate: z.string().min(1,'Required').refine(v=>parseFloat(v)>=5,'≥5'), gcs: z.string().min(1,'Required').refine(v=>parseFloat(v)>=3,'≥3'), creatinine: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), agePoints: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }, { name:'heartRate', label:'Heart Rate (bpm)', type:'number', min:20, max:300, step:'1' }, { name:'meanBP', label:'MAP (mmHg)', type:'number', min:20, max:200, step:'1' }, { name:'temperature', label:'Temperature (°C)', type:'number', min:30, max:45, step:'0.1' }, { name:'respiratoryRate', label:'Respiratory Rate', type:'number', min:5, max:100, step:'1' }, { name:'gcs', label:'GCS', type:'number', min:3, max:15, step:'1' }, { name:'creatinine', label:'Creatinine (mg/dL)', type:'number', min:0.1, max:20, step:'0.1' }, { name:'agePoints', label:'Age Points (0-6)', type:'number', min:0, max:6, step:'1' }],
  compute: (v) => { const hr=parseFloat(v.heartRate)||80; const t=parseFloat(v.temperature)||37; const rr=parseFloat(v.respiratoryRate)||16; const g=parseFloat(v.gcs)||15; const cr=parseFloat(v.creatinine)||1; const ap=parseFloat(v.agePoints)||0; let hrP=hr<40||hr>179?4:hr<55||hr>139?3:hr<70||hr>109?2:0; let tP=t<33||t>40.9?3:t<36||t>38.4?1:0; let rrP=rr<6||rr>49?4:rr<12||rr>29?2:0; let gP=15-g; let crP=cr>3.4?4:cr>1.9?3:cr>1.4?2:0; const total=ap+hrP+tP+rrP+gP+crP; const mort=total<5?1:total<10?5:total<15?15:total<20?35:total<25?55:75; return { result:total, label:'APACHE IV', unit:'', steps:[{ label:'Total Score', value:total.toString() },{ label:'Est. Mortality', value:mort+'%' }] } },
  description: 'APACHE IV ICU mortality prediction from physiology, age, and chronic health.',
  formula: 'APACHE IV = physiology points + age points + chronic health. Higher score = higher mortality.',
  interpretation: 'Score predicts ICU mortality: <5→1%, 5-9→5%, 10-14→15%, 15-19→35%, 20-24→55%, ≥25→75%.'
}

export default calcDef
