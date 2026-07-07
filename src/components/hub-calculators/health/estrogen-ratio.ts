import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ estradiol: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), estrone: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), estriol: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), phase: z.enum(['follicular','ovulatory','luteal','postmenopausal']) }),
  fields: [{ name:'estradiol', label:'Estradiol (E2, pg/mL)', type:'number', min:0, max:2000, step:'1' }, { name:'estrone', label:'Estrone (E1, pg/mL)', type:'number', min:0, max:2000, step:'1' }, { name:'estriol', label:'Estriol (E3, pg/mL)', type:'number', min:0, max:500, step:'0.1' }, { name:'phase', label:'Cycle Phase', type:'select', options:[{ label:'Follicular', value:'follicular' },{ label:'Ovulatory', value:'ovulatory' },{ label:'Luteal', value:'luteal' },{ label:'Postmenopausal', value:'postmenopausal' }] }],
  compute: (v) => { const e2=parseFloat(v.estradiol)||0; const e1=parseFloat(v.estrone)||0; const e3=parseFloat(v.estriol)||0; const e1e2=e2>0?e1/e2:0; const total=e1+e2+e3; const e2Pct=total>0?e2/total*100:0; const balanced=e1e2>0.3&&e1e2<3; return { result:e1e2, label:'E1/E2 Ratio', unit:'', steps:[{ label:'E1', value:e1.toFixed(1) },{ label:'E2', value:e2.toFixed(1) },{ label:'E3', value:e3.toFixed(1) },{ label:'E1/E2 Ratio', value:e1e2.toFixed(2) },{ label:'E2%', value:e2Pct.toFixed(1)+'%' },{ label:'Balance', value:balanced?'Normal balance':'Imbalanced - consider evaluation' }] } },
  description: 'Estrogen ratio analysis (E1/E2/E3) for hormonal balance assessment.',
  formula: 'E1:E2 ratio ideally 1:1-3:1. E2 dominant in reproductive years. Postmenopause: E1 dominant.',
  interpretation: 'High E1/E2 suggests unfavorable estrogen metabolism. Imbalance linked to estrogen-dominant conditions.'
}

export default calcDef
