import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ paCO2: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), etCO2: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'paCO2', label:'PaCO₂ (mmHg)', type:'number', min:10, max:150, step:'1' }, { name:'etCO2', label:'EtCO₂ (mmHg)', type:'number', min:5, max:100, step:'1' }],
  compute: (v) => { const pa=parseFloat(v.paCO2)||40; const et=parseFloat(v.etCO2)||35; const vdRatio=(pa-et)/pa; return { result:vdRatio, label:'Dead Space Ratio', unit:'', steps:[{ label:'Vd/Vt = (PaCO₂-EtCO₂)/PaCO₂', value:vdRatio.toFixed(3) },{ label:'Normal', value:'0.2-0.4' }] } },
  description: 'Physiologic dead space ratio (Vd/Vt) from PaCO₂ and EtCO₂ gradient.',
  formula: 'Vd/Vt = (PaCO₂ - EtCO₂)/PaCO₂. Normal 0.2-0.4. Enghoff modification of Bohr equation.',
  interpretation: '>0.6: severe pulmonary embolism, COPD, ARDS. Increased dead space worsens ventilation efficiency.'
}

export default calcDef
