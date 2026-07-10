import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalChol: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), hdl: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'totalChol', label:'Total Cholesterol (mg/dL)', type:'number', min:100, max:500, step:'1' }, { name:'hdl', label:'HDL Cholesterol (mg/dL)', type:'number', min:10, max:150, step:'1' }],
  compute: (v) => { const tc=parseFloat(v.totalChol)||200; const hdl=parseFloat(v.hdl)||50; const nhdl=tc-hdl; return { result:nhdl, label:'Non-HDL Cholesterol', unit:'mg/dL', steps:[{ label:'Total Cholesterol', value:tc.toFixed(0)+' mg/dL' },{ label:'HDL', value:hdl.toFixed(0)+' mg/dL' },{ label:'Non-HDL', value:nhdl.toFixed(0)+' mg/dL' }] } },
  description: 'Non-HDL cholesterol includes all pro-atherogenic lipoproteins (VLDL, IDL, LDL).',
  formula: 'Non-HDL = Total Cholesterol - HDL Cholesterol',
  interpretation: 'Optimal: <130 mg/dL. Above 130: borderline high. Above 160: high. Above 190: very high. Non-HDL is a better predictor of CVD risk than LDL alone in patients with diabetes or metabolic syndrome.'
}
export default calcDef
