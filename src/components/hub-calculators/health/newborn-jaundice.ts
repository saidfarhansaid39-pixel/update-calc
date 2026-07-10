import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ bilirubin: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), hourOfLife: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), gestationalAge: z.string().min(1,'Required').refine(v=>parseInt(v)>=24,'>=24'), weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), riskFactors: z.string().min(1) }),
  fields: [
    { name:'bilirubin', label:'Total Serum Bilirubin (mg/dL)', type:'number', min:0, max:50, step:'0.1' },
    { name:'hourOfLife', label:'Hour of Life', type:'number', min:0, max:336, step:'1' },
    { name:'gestationalAge', label:'Gestational Age (weeks)', type:'number', min:24, max:42, step:'1' },
    { name:'weight', label:'Birth Weight (g)', type:'number', min:400, max:6000, step:'1' },
    { name:'riskFactors', label:'Neurotoxicity Risk Factors?', type:'select', options:[{ label:'None', value:'none' },{ label:'Low risk (≥38w, >2500g, no hemolysis)', value:'low' },{ label:'Medium risk (35-37w, 2000-2500g, some risks)', value:'medium' },{ label:'High risk (<35w, <2000g, hemolysis, sepsis, acidosis)', value:'high' }] }
  ],
  compute: (v) => { const bili=parseFloat(v.bilirubin)||5; const hour=parseFloat(v.hourOfLife)||48; const ga=parseInt(v.gestationalAge)||38; const wt=parseFloat(v.weight)||3000; const risk=v.riskFactors||'low'; const riskThreshold=risk==='high'?0.8:risk==='medium'?0.9:1.0; const lowRiskThresholds=[{h:24,t:8},{h:48,t:12},{h:72,t:15},{h:96,t:17},{h:120,t:18},{h:144,t:18.5},{h:168,t:19}]; const mediumRiskThresholds=[{h:24,t:6},{h:48,t:10},{h:72,t:13},{h:96,t:15},{h:120,t:16.5},{h:144,t:17},{h:168,t:17.5}]; const highRiskThresholds=[{h:24,t:5},{h:48,t:8},{h:72,t:11},{h:96,t:13},{h:120,t:14},{h:144,t:15},{h:168,t:15.5}]; const thresholds=risk==='high'?highRiskThresholds:risk==='medium'?mediumRiskThresholds:lowRiskThresholds; let threshold=mediumRiskThresholds.reduce((prev,curr)=>hour>=curr.h?curr:prev,mediumRiskThresholds[0]); if(risk==='low') threshold=lowRiskThresholds.reduce((prev,curr)=>hour>=curr.h?curr:prev,lowRiskThresholds[0]); if(risk==='high') threshold=highRiskThresholds.reduce((prev,curr)=>hour>=curr.h?curr:prev,highRiskThresholds[0]); const pctOfThreshold=bili/threshold.t*100; let action='No treatment needed'; if(bili>=threshold.t) action='Consider phototherapy'; if(bili>=threshold.t*1.5) action='Exchange transfusion may be indicated'; return { result:parseFloat(bili.toFixed(1)), label:'Total Bilirubin', unit:'mg/dL', steps:[{ label:'Bilirubin Level', value:bili.toFixed(1)+' mg/dL' },{ label:'Hour of Life', value:hour+'' },{ label:'Risk Threshold', value:threshold.t+' mg/dL' },{ label:'% of Threshold', value:pctOfThreshold.toFixed(0)+'%' },{ label:'Recommendation', value:action }] } },
  description: 'Newborn jaundice assessment using bilirubin level vs hour of life per Bhutani nomogram.',
  formula: 'Plot bilirubin vs hour of life on gestational age-specific Bhutani nomogram. Compare to phototherapy/exchange transfusion thresholds.',
  interpretation: 'Bilirubin above phototherapy threshold requires treatment. Risk factors (hemolysis, sepsis, acidosis) lower the threshold.'
}
export default calcDef
