import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ fev1: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), fvc: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), predictedFev1: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), predictedFvc: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'fev1', label:'FEV₁ (L)', type:'number', min:0.5, max:6, step:'0.01' }, { name:'fvc', label:'FVC (L)', type:'number', min:0.5, max:8, step:'0.01' }, { name:'predictedFev1', label:'Predicted FEV₁ (L)', type:'number', min:1, max:6, step:'0.01' }, { name:'predictedFvc', label:'Predicted FVC (L)', type:'number', min:1, max:8, step:'0.01' }],
  compute: (v) => { const fev1=parseFloat(v.fev1)||3; const fvc=parseFloat(v.fvc)||4; const pfev1=parseFloat(v.predictedFev1)||3.5; const pfvc=parseFloat(v.predictedFvc)||4.5; const ratio=fev1/fvc*100; const fev1pct=fev1/pfev1*100; const fvcpct=fvc/pfvc*100; let pattern=''; if(ratio<70){ pattern='Obstructive' }else if(fvcpct<80){ pattern='Restrictive' }else{ pattern='Normal' }; return { result:ratio, label:'FEV₁/FVC Ratio', unit:'%', steps:[{ label:'FEV₁', value:fev1.toFixed(2)+' L' },{ label:'FVC', value:fvc.toFixed(2)+' L' },{ label:'FEV₁/FVC', value:ratio.toFixed(1)+'%' },{ label:'FEV₁ % Predicted', value:fev1pct.toFixed(1)+'%' },{ label:'Pattern', value:pattern }] } },
  description: 'Pulmonary function test interpretation classifies lung function as normal, obstructive, or restrictive.',
  formula: 'FEV₁/FVC ratio × 100. FEV₁% predicted = measured/predicted × 100. FVC% predicted = measured/predicted × 100.',
  interpretation: 'Obstructive: FEV₁/FVC <70% (COPD, asthma). Restrictive: FEV₁/FVC normal or high + FVC <80% predicted (fibrosis, chest wall). Mixed: both reduced. Severity by FEV₁: mild ≥80%, mod 50-79%, severe 30-49%.'
}
export default calcDef
