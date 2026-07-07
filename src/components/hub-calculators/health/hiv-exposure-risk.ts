import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ exposureType: z.string().min(1,'Required'), sourceStatus: z.string().min(1,'Required'), woundSeverity: z.string().min(1,'Required'), hoursSinceExposure: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'exposureType', label:'Exposure Type', type:'select', options:[{value:'needlestick',label:'Needlestick'},{value:'mucous',label:'Mucous Membrane'},{value:'skin',label:'Non-intact Skin'},{value:'sexual',label:'Sexual Exposure'}] }, { name:'sourceStatus', label:'Source HIV Status', type:'select', options:[{value:'unknown',label:'Unknown'},{value:'positive-low',label:'HIV+ Low VL'},{value:'positive-high',label:'HIV+ High VL'},{value:'negative',label:'HIV Negative'}] }, { name:'woundSeverity', label:'Severity', type:'select', options:[{value:'superficial',label:'Superficial'},{value:'moderate',label:'Moderate'},{value:'deep',label:'Deep/Large Volume'}] }, { name:'hoursSinceExposure', label:'Hours Since Exposure', type:'number', min:0, max:72, step:'1' }],
  compute: (v) => { const typeRisk=({needlestick:0.3,mucous:0.09,skin:0.1,sexual:0.08} as Record<string, number>)[v.exposureType]||0.1; const sourceRisk=({unknown:0.5,'positive-low':0.3,'positive-high':0.9,negative:0.01} as Record<string, number>)[v.sourceStatus]||0.5; const sev=({superficial:1,moderate:2,deep:3} as Record<string, number>)[v.woundSeverity]||1; const hr=parseFloat(v.hoursSinceExposure)||0; const eff=hr<=4?95:hr<=24?80:hr<=48?60:hr<=72?20:5; const risk=(typeRisk*sourceRisk*sev/10)*100; return { result:risk, label:'Transmission Risk', unit:'%', steps:[{ label:'Exposure Risk', value:typeRisk+'%' },{ label:'Source Factor', value:'×'+sourceRisk },{ label:'Severity', value:'×'+sev },{ label:'PEP Efficacy', value:eff+'% if started' },{ label:'Estimated Risk', value:risk.toFixed(3)+'%' }] } },
  description: 'HIV exposure risk assessment for post-exposure prophylaxis (PEP) decision-making per CDC guidelines.',
  formula: 'Risk = Exposure probability × Source VL factor × Severity factor. PEP efficacy: 95% if ≤4h, 80% if ≤24h, 60% if ≤48h, 20% if ≤72h.',
  interpretation: 'Risk >0.1%: recommend 3-drug PEP. Risk 0.01-0.1%: consider 2-drug PEP. Risk <0.01%: PEP not indicated. Start within 72h.'
}

export default calcDef
