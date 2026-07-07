import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ folate: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), hemoglobin: z.string().min(1,'Required').refine(v=>parseFloat(v)>=5,'≥5'), mcv: z.string().min(1,'Required').refine(v=>parseFloat(v)>=50,'≥50') }),
  fields: [{ name:'folate', label:'Serum Folate (ng/mL)', type:'number', min:0, max:50, step:'0.1' }, { name:'hemoglobin', label:'Hemoglobin (g/dL)', type:'number', min:5, max:20, step:'0.1' }, { name:'mcv', label:'MCV (fL)', type:'number', min:50, max:150, step:'1' }],
  compute: (v) => { const f=parseFloat(v.folate)||0; const hb=parseFloat(v.hemoglobin)||14; const mcv=parseFloat(v.mcv)||90; const deficient=f<3; const borderline=f>=3&&f<5; const macrocytic=mcv>100; const pattern=deficient&&macrocytic?'Folate deficiency macrocytic anemia':deficient?macrocytic?'Folate deficiency without anemia':'Isolated low folate - check B12':'Normal folate'; return { result:f, label:'Folate Level', unit:'ng/mL', steps:[{ label:'Folate', value:f.toFixed(1) },{ label:'MCV', value:mcv.toFixed(0)+' fL' },{ label:'Assessment', value:pattern }] } },
  description: 'Folate level interpretation with macrocytic anemia correlation.',
  formula: 'Normal: 5-20 ng/mL. Folate deficiency: <3 ng/mL. MCV >100 fL suggests macrocytosis.',
  interpretation: 'Low folate + macrocytosis: folate deficiency anemia. Treat with folic acid 1 mg daily. Low B12 can also cause macrocytosis.'
}

export default calcDef
