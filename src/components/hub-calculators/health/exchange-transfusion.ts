import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), hct: z.string().min(1,'Required').refine(v=>parseFloat(v)>=10,'≥10'), targetHct: z.string().min(1,'Required').refine(v=>parseFloat(v)>=20,'≥20'), donorHct: z.string().min(1,'Required').refine(v=>parseFloat(v)>=30,'≥30') }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:0.5, step:'0.1' }, { name:'hct', label:'Current Hct (%)', type:'number', min:10, max:70, step:'1' }, { name:'targetHct', label:'Target Hct (%)', type:'number', min:20, max:65, step:'1' }, { name:'donorHct', label:'Donor Blood Hct (%)', type:'number', min:30, max:75, step:'1' }],
  compute: (v) => { const w=parseFloat(v.weight)||3; const h=parseFloat(v.hct)||40; const t=parseFloat(v.targetHct)||50; const d=parseFloat(v.donorHct)||60; const bv=w*85; const vol=bv*(t-h)/(d-h); return { result:vol, label:'Exchange Volume', unit:'mL', steps:[{ label:'Blood Volume = W×85', value:bv.toFixed(0)+' mL' },{ label:'Exchange Vol = BV×(T-H)/(D-H)', value:vol.toFixed(0)+' mL' }] } },
  description: 'Partial exchange transfusion volume calculation for polycythemia/neonatal hyperbilirubinemia.',
  formula: 'Volume = BV × (target Hct - current Hct)/(donor Hct - current Hct). BV = 85 mL/kg.',
  interpretation: 'Used in neonatal polycythemia (Hct>65) and severe hyperbilirubinemia. Monitor for complications.'
}

export default calcDef
