import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ pH: z.string().min(1,'Required').refine(v=>parseFloat(v)>=6.5,'≥6.5'), paCO2: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), paO2: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), bicarbonate: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'pH', label:'pH', type:'number', min:6.5, max:8, step:'0.01' }, { name:'paCO2', label:'PaCO₂ (mmHg)', type:'number', min:10, max:150, step:'1' }, { name:'paO2', label:'PaO₂ (mmHg)', type:'number', min:20, max:700, step:'1' }, { name:'bicarbonate', label:'HCO₃⁻ (mEq/L)', type:'number', min:1, max:60, step:'1' }],
  compute: (v) => { const pH=parseFloat(v.pH)||7.4; const pc=parseFloat(v.paCO2)||40; const po=parseFloat(v.paO2)||100; const hco3=parseFloat(v.bicarbonate)||24; let ab='Normal'; if(pH<7.35&&pc>45) ab='Respiratory acidosis'; else if(pH<7.35&&hco3<22) ab='Metabolic acidosis'; else if(pH>7.45&&pc<35) ab='Respiratory alkalosis'; else if(pH>7.45&&hco3>26) ab='Metabolic alkalosis'; return { result:pH, label:'pH', unit:'', steps:[{ label:'pH', value:pH.toFixed(2) },{ label:'PaCO₂', value:pc.toFixed(0) },{ label:'PaO₂', value:po.toFixed(0) },{ label:'HCO₃⁻', value:hco3.toFixed(1) },{ label:'Interpretation', value:ab }] } },
  description: 'Arterial blood gas interpretation for acid-base and oxygenation status.',
  formula: 'Normal: pH 7.35-7.45, PaCO₂ 35-45, HCO₃ 22-26, PaO₂ 80-100. Winters: PaCO₂=1.5×HCO₃+8±2.',
  interpretation: 'Resp acidosis: ↓pH, ↑PaCO₂. Met acidosis: ↓pH, ↓HCO₃. Resp alkalosis: ↑pH, ↓PaCO₂. Met alkalosis: ↑pH, ↑HCO₃.'
}

export default calcDef
