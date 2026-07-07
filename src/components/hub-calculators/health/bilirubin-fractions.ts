import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalBilirubin: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), directBilirubin: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'totalBilirubin', label:'Total Bilirubin (mg/dL)', type:'number', min:0, max:50, step:'0.1' }, { name:'directBilirubin', label:'Direct (Conjugated, mg/dL)', type:'number', min:0, max:50, step:'0.1' }],
  compute: (v) => { const tb=parseFloat(v.totalBilirubin)||0; const db=parseFloat(v.directBilirubin)||0; const ib=tb-db; const dbPct=tb>0?db/tb*100:0; const type=dbPct>50?'Direct (obstructive/hepatocellular)':ib>1?'Indirect (hemolysis/Gilbert)':'Normal'; return { result:ib, label:'Indirect Bilirubin', unit:'mg/dL', steps:[{ label:'Total', value:tb.toFixed(1) },{ label:'Direct', value:db.toFixed(1) },{ label:'Indirect', value:ib.toFixed(1) },{ label:'Direct %', value:dbPct.toFixed(1)+'%' },{ label:'Type', value:type }] } },
  description: 'Fractionates bilirubin into direct/indirect to classify hyperbilirubinemia.',
  formula: 'Indirect = Total - Direct. Direct >50% of total = obstructive/hepatocellular pattern.',
  interpretation: 'Indirect: hemolysis, Gilbert, Crigler-Najjar. Direct: biliary obstruction, hepatitis, drug-induced.'
}

export default calcDef
