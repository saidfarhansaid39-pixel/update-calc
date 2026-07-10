import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ epaMg: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), dhaMg: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'epaMg', label:'EPA Intake (mg/day)', type:'number', min:0, step:'50' }, { name:'dhaMg', label:'DHA Intake (mg/day)', type:'number', min:0, step:'50' }, { name:'weight', label:'Weight (kg)', type:'number', min:20, step:'0.1' }],
  compute: (v) => { const epa=parseFloat(v.epaMg)||500; const dha=parseFloat(v.dhaMg)||500; const w=parseFloat(v.weight)||70; const totalO3=epa+dha; const o3Index=3.5+0.007*totalO3; const cat=o3Index<4?'Very Low (High Risk)':o3Index<6?'Low (Moderate Risk)':o3Index<8?'Moderate':o3Index<10?'Optimal':'Ideal'; const target=o3Index<8?Math.ceil((8-3.5)/0.007):0; return { result:o3Index, label:'Omega-3 Index', unit:'%', steps:[{ label:'EPA+DHA (mg)', value:totalO3.toFixed(0)+' mg' },{ label:'Weight', value:w.toFixed(1)+' kg' },{ label:'Omega-3 Index', value:o3Index.toFixed(1)+'%' },{ label:'Category', value:cat },{ label:'Additional EPA+DHA needed', value:target>0?target.toFixed(0)+' mg/day':'Adequate' }] } },
  description: 'Estimates Omega-3 Index (EPA+DHA in RBC membranes) from dietary intake of EPA and DHA.',
  formula: 'Omega-3 Index ≈ 3.5 + 0.007 × (EPA+DHA mg/day). Target ≥8% for cardioprotection.',
  interpretation: 'Omega-3 Index: <4% high risk, 4-6% moderate risk, 6-8% low risk, >8% cardioprotective. Target: 8-12%.'
}
export default calcDef