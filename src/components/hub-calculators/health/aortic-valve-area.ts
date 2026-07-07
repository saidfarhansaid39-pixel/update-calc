import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ lvotDiameter: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), lvotVTI: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), avVTI: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'lvotDiameter', label:'LVOT Diameter (cm)', type:'number', min:1, max:3, step:'0.1' }, { name:'lvotVTI', label:'LVOT VTI (cm)', type:'number', min:5, max:50, step:'0.5' }, { name:'avVTI', label:'Aortic Valve VTI (cm)', type:'number', min:10, max:200, step:'0.5' }],
  compute: (v) => { const ld=parseFloat(v.lvotDiameter)||2; const lv=parseFloat(v.lvotVTI)||20; const av=parseFloat(v.avVTI)||50; const lvotCSA=3.14159*(ld/2)**2; const sv=lvotCSA*lv; const ava=sv/av; const sev=ava<1?'Severe':ava<1.5?'Moderate':'Mild'; return { result:ava, label:'Aortic Valve Area', unit:'cm²', steps:[{ label:'LVOT CSA = π×(D/2)²', value:lvotCSA.toFixed(2) },{ label:'Stroke Volume', value:sv.toFixed(2) },{ label:'AVA = SV/AV-VTI', value:ava.toFixed(2) }] } },
  description: 'Aortic valve area via continuity equation for aortic stenosis severity.',
  formula: 'AVA = (LVOT CSA × LVOT VTI) / AV VTI. LVOT CSA = π × (D/2)².',
  interpretation: 'Normal 3-4 cm². Mild >1.5, Moderate 1.0-1.5, Severe <1.0 cm². Critical <0.8 cm².'
}

export default calcDef
