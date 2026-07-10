import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ triglycerides: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), hdl: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'triglycerides', label:'Triglycerides (mg/dL)', type:'number', min:20, max:2000, step:'1' }, { name:'hdl', label:'HDL Cholesterol (mg/dL)', type:'number', min:10, max:150, step:'1' }],
  compute: (v) => { const tg=parseFloat(v.triglycerides)||150; const hdl=parseFloat(v.hdl)||50; const ratio=tg/hdl; return { result:ratio, label:'Triglyceride/HDL Ratio', steps:[{ label:'Triglycerides', value:tg.toFixed(0)+' mg/dL' },{ label:'HDL', value:hdl.toFixed(0)+' mg/dL' },{ label:'TG/HDL Ratio', value:ratio.toFixed(2) }] } },
  description: 'The triglyceride-to-HDL ratio is a marker of insulin resistance and atherogenic dyslipidemia.',
  formula: 'TG/HDL Ratio = Triglycerides (mg/dL) / HDL Cholesterol (mg/dL)',
  interpretation: 'Optimal: <2.0. >3.0 suggests insulin resistance. >4.0 indicates high atherogenic risk. This ratio is a strong predictor of coronary heart disease, often superior to LDL alone.'
}
export default calcDef
