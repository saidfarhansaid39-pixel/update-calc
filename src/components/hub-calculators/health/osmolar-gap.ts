import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ measuredOsm: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), sodium: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), glucose: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), bun: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0') }),
  fields: [{ name:'measuredOsm', label:'Measured Serum Osmolality (mOsm/kg)', type:'number', min:200, max:400, step:'1' }, { name:'sodium', label:'Serum Sodium (mEq/L)', type:'number', min:100, max:170, step:'1' }, { name:'glucose', label:'Glucose (mg/dL)', type:'number', min:0, step:'1' }, { name:'bun', label:'BUN (mg/dL)', type:'number', min:0, step:'1' }],
  compute: (v) => { const mo=parseFloat(v.measuredOsm)||300; const na=parseFloat(v.sodium)||140; const glu=parseFloat(v.glucose)||100; const bun=parseFloat(v.bun)||15; const calcOsm=2*na+glu/18+bun/2.8; const gap=mo-calcOsm; return { result:gap, label:'Osmolar Gap', unit:'mOsm/kg', steps:[{ label:'Measured Osm', value:mo.toFixed(0)+' mOsm/kg' },{ label:'Calculated Osm (2Na + Glu/18 + BUN/2.8)', value:calcOsm.toFixed(0)+' mOsm/kg' },{ label:'Osmolar Gap', value:gap.toFixed(0)+' mOsm/kg' }] } },
  description: 'Osmolar gap detects the presence of unmeasured osmotically active substances in serum.',
  formula: 'Calculated Osm = 2 × Na + Glucose/18 + BUN/2.8. Osmolar Gap = Measured - Calculated.',
  interpretation: 'Normal gap: <10 mOsm/kg. Elevated gap suggests toxic alcohols (methanol, ethylene glycol, isopropanol), mannitol, or ketoacidosis. Gap >20 strongly suggests toxic alcohol ingestion.'
}
export default calcDef
