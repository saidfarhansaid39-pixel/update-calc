import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), hemoglobin: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), targetHb: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), ferritin: z.string().min(1,'Required'), ironProduct: z.string().min(1,'Required') }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:0, step:'0.1' }, { name:'hemoglobin', label:'Hemoglobin (g/dL)', type:'number', min:0, step:'0.1' }, { name:'targetHb', label:'Target Hb (g/dL)', type:'number', min:0, step:'0.1' }, { name:'ferritin', label:'Ferritin (ng/mL)', type:'number', min:0, step:'1' }, { name:'ironProduct', label:'Iron Product', type:'select', options:[{value:'iron-sucrose',label:'Iron Sucrose (Venofer)'},{value:'ferric-carboxy',label:'Ferric Carboxymaltose (Injectafer)'},{value:'iron-dextran',label:'Iron Dextran (INFeD)'},{value:'ferric-gluconate',label:'Ferric Gluconate (Ferrlecit)'}] }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const hb=parseFloat(v.hemoglobin)||10; const tgt=parseFloat(v.targetHb)||13; const fer=parseFloat(v.ferritin)||50; const deficit=w*(tgt-hb)*2.4+500; const reps=({'iron-sucrose':100,'ferric-carboxy':750,'iron-dextran':100,'ferric-gluconate':62.5} as Record<string, number>)[v.ironProduct]||100; const doses=Math.ceil(deficit/reps); return { result:deficit, label:'Total Iron Deficit', unit:'mg', steps:[{ label:'Hb Deficit', value:(tgt-hb).toFixed(1)+' g/dL' },{ label:'Iron Deficit', value:deficit.toFixed(0)+' mg' },{ label:'Per Dose', value:reps+' mg' },{ label:'Doses Needed', value:doses.toString() }] } },
  description: 'Iron deficiency anemia dosing calculator using Ganzoni formula for total iron deficit and product-specific doses.',
  formula: 'Total iron deficit (mg) = Weight (kg) × (Target Hb - Actual Hb) × 2.4 + 500 (stores). Ganzoni formula standard for IV iron replacement.',
  interpretation: 'Ferritin <30: absolute depletion. Ferritin 30-100 + TSAT <20%: functional deficiency. Administer IV iron over 1-3 sessions. Recheck Hb at 4 weeks.'
}

export default calcDef
