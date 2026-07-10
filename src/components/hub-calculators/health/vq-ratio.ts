import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ventilation: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), perfusion: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'ventilation', label:'Alveolar Ventilation (L/min)', type:'number', min:1, max:20, step:'0.1' }, { name:'perfusion', label:'Pulmonary Perfusion (L/min)', type:'number', min:1, max:20, step:'0.1' }],
  compute: (v) => { const vent=parseFloat(v.ventilation)||4; const q=parseFloat(v.perfusion)||5; const ratio=vent/q; return { result:ratio, label:'V/Q Ratio', steps:[{ label:'Ventilation', value:vent.toFixed(1)+' L/min' },{ label:'Perfusion', value:q.toFixed(1)+' L/min' },{ label:'V/Q Ratio', value:ratio.toFixed(2) }] } },
  description: 'The ventilation/perfusion ratio reflects the efficiency of pulmonary gas exchange.',
  formula: 'V/Q = Alveolar Ventilation / Pulmonary Blood Flow (Perfusion)',
  interpretation: 'Normal: ~0.8-1.0. High V/Q (>1): dead space ventilation (PE, COPD). Low V/Q (<0.8): shunt effect (pneumonia, asthma, ARDS). Extreme 0: pure shunt. Extreme ∞: pure dead space.'
}
export default calcDef
