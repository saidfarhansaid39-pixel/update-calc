import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalChol: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), hdl: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), ldl: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), triglycerides: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18') }),
  fields: [{ name:'totalChol', label:'Total Cholesterol (mg/dL)', type:'number', min:50, max:500, step:'1' }, { name:'hdl', label:'HDL (mg/dL)', type:'number', min:10, max:150, step:'1' }, { name:'ldl', label:'LDL (mg/dL)', type:'number', min:0, max:400, step:'1' }, { name:'triglycerides', label:'Triglycerides (mg/dL)', type:'number', min:0, max:2000, step:'1' }, { name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }],
  compute: (v) => { const tc=parseFloat(v.totalChol)||200; const h=parseFloat(v.hdl)||50; const l=parseFloat(v.ldl)||100; const tg=parseFloat(v.triglycerides)||150; const a=parseFloat(v.age)||40; const nonHdl=tc-h; const tcHdlRatio=tc/h; let risk=''; if(tc>240||l>160) risk='High cholesterol - lifestyle + consider statin'; else if(tc>200||l>130||nonHdl>160) risk='Borderline - monitor, lifestyle modification'; else if(h<40) risk='Low HDL - increased CV risk'; else risk='Desirable range'; return { result:tc, label:'Total Cholesterol', unit:'mg/dL', steps:[{ label:'TC', value:tc.toString() },{ label:'LDL', value:l.toString() },{ label:'HDL', value:h.toString() },{ label:'TG', value:tg.toString() },{ label:'Non-HDL', value:nonHdl.toFixed(0) },{ label:'TC/HDL Ratio', value:tcHdlRatio.toFixed(1) }] } },
  description: 'Comprehensive lipid panel interpretation with cardiovascular risk markers.',
  formula: 'Non-HDL = TC-HDL. TC/HDL ratio <3.5 desirable. LDL targets: <100 (low risk), <70 (high risk).',
  interpretation: 'Desirable: TC<200, LDL<100, HDL>40(M)/50(F), TG<150. Non-HDL<130. Ratio <3.5 optimal.'
}

export default calcDef
