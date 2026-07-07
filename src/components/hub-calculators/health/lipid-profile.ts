import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalCholesterol: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), hdl: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), triglycerides: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'totalCholesterol', label:'Total Cholesterol (mg/dL)', type:'number', min:0, step:'1' }, { name:'hdl', label:'HDL Cholesterol (mg/dL)', type:'number', min:0, step:'1' }, { name:'triglycerides', label:'Triglycerides (mg/dL)', type:'number', min:0, step:'1' }],
  compute: (v) => { const tc=parseFloat(v.totalCholesterol)||200; const hdl=parseFloat(v.hdl)||50; const tg=parseFloat(v.triglycerides)||150; const ldl=tc-hdl-tg/5; const ratio=tc/hdl; const nonHdl=tc-hdl; return { result:ldl, label:'LDL Cholesterol', unit:'mg/dL', steps:[{ label:'Total Cholesterol', value:tc.toFixed(0)+' mg/dL' },{ label:'HDL', value:hdl.toFixed(0)+' mg/dL' },{ label:'Triglycerides', value:tg.toFixed(0)+' mg/dL' },{ label:'LDL (Friedewald)', value:ldl.toFixed(0)+' mg/dL' },{ label:'Non-HDL', value:nonHdl.toFixed(0)+' mg/dL' },{ label:'TC/HDL Ratio', value:ratio.toFixed(1) }] } },
  description: 'Lipid profile calculates LDL, non-HDL cholesterol, and TC/HDL ratio for cardiovascular risk assessment.',
  formula: 'LDL = Total Cholesterol - HDL - (Triglycerides/5) (Friedewald equation, valid for TG <400 mg/dL). Non-HDL = TC - HDL.',
  interpretation: 'LDL: Optimal <100 mg/dL, Near optimal 100-129, Borderline 130-159, High 160-189, Very high ≥190. HDL: <40 (male)/<50 (female) mg/dL is low. Non-HDL: target <130 mg/dL.'
}

export default calcDef
