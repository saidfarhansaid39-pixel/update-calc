import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ fiO2: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0.21,'≥0.21'), paCO2: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), paO2: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'fiO2', label:'FiO₂', type:'number', min:0.21, max:1, step:'0.01' }, { name:'paCO2', label:'PaCO₂ (mmHg)', type:'number', min:10, max:150, step:'1' }, { name:'paO2', label:'PaO₂ (mmHg)', type:'number', min:20, max:700, step:'1' }, { name:'age', label:'Age (years)', type:'number', min:1, max:110, step:'1' }],
  compute: (v) => { const f=parseFloat(v.fiO2)||0.21; const pc=parseFloat(v.paCO2)||40; const po=parseFloat(v.paO2)||100; const ag=parseFloat(v.age)||30; const pAO2=f*(760-47)-pc/0.8; const grad=pAO2-po; const exp=ag/4+4; return { result:grad, label:'A-a Gradient', unit:'mmHg', steps:[{ label:'Alveolar PO₂', value:pAO2.toFixed(1) },{ label:'A-a Gradient', value:grad.toFixed(1) },{ label:'Expected Max', value:exp.toFixed(1) }] } },
  description: 'Alveolar-arterial gradient for hypoxemia workup.',
  formula: 'A-a = (FiO₂×(760-47)-PaCO₂/0.8)-PaO₂; Expected = Age/4+4.',
  interpretation: 'Widened gradient suggests V/Q mismatch, shunt, or diffusion defect. Normal <10-20 mmHg on room air.'
}

export default calcDef
