import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ systolic: z.string().min(1,'Required').refine(v=>parseFloat(v)>=50,'≥50'), diastolic: z.string().min(1,'Required').refine(v=>parseFloat(v)>=20,'≥20') }),
  fields: [{ name:'systolic', label:'Systolic (mmHg)', type:'number', min:50, max:300, step:'1' }, { name:'diastolic', label:'Diastolic (mmHg)', type:'number', min:20, max:200, step:'1' }],
  compute: (v) => { const sys=parseFloat(v.systolic)||120; const dia=parseFloat(v.diastolic)||80; const map=dia+(sys-dia)/3; const pp=sys-dia; let cat='Normal'; if(sys>=180||dia>=120) cat='Crisis'; else if(sys>=140||dia>=90) cat='Stage 2 HTN'; else if(sys>=130||dia>=80) cat='Stage 1 HTN'; else if(sys>=120) cat='Elevated'; return { result:sys, label:'Systolic BP', unit:'mmHg', steps:[{ label:'BP', value:sys+'/'+dia },{ label:'MAP', value:map.toFixed(0) },{ label:'PP', value:pp.toFixed(0) },{ label:'Category', value:cat }] } },
  description: 'BP categorization per ACC/AHA with MAP and pulse pressure.',
  formula: 'MAP = DBP+1/3(SBP-DBP). PP = SBP-DBP. Normal <120/<80.',
  interpretation: 'Normal <120/<80; Elevated 120-129/<80; Stage 1: 130-139/80-89; Stage 2: ≥140/≥90; Crisis ≥180/≥120.'
}

export default calcDef
