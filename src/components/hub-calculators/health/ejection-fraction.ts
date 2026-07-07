import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ edv: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), esv: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'edv', label:'End-Diastolic Volume (mL)', type:'number', min:50, max:300, step:'5' }, { name:'esv', label:'End-Systolic Volume (mL)', type:'number', min:10, max:250, step:'5' }],
  compute: (v) => { const edv=parseFloat(v.edv)||120; const esv=parseFloat(v.esv)||50; const sv=edv-esv; const ef=edv>0?sv/edv*100:0; const status=ef>=55?'Normal':ef>=50?'Low Normal':ef>=40?'Mildly Reduced':ef>=30?'Moderately Reduced':'Severely Reduced'; return { result:ef, label:'Ejection Fraction', unit:'%', steps:[{ label:'EDV', value:edv.toString() },{ label:'ESV', value:esv.toString() },{ label:'SV = EDV-ESV', value:sv.toString() },{ label:'EF = SV/EDV×100', value:ef.toFixed(1)+'%' },{ label:'Classification', value:status }] } },
  description: 'Left ventricular ejection fraction (EF) from echocardiographic volumes.',
  formula: 'EF (%) = (EDV-ESV)/EDV × 100. Normal ≥55%. HFpEF: ≥50%, HFmrEF: 40-49%, HFrEF: <40%.',
  interpretation: '<35%: ICD candidate. 35-40%: CRT-D consider. 40-50%: HFmrEF, treat underlying cause. ≥50%: HFpEF.'
}

export default calcDef
