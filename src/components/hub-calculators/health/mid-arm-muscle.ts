import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ armCircumference: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), tricepsSkinfold: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0') }),
  fields: [{ name:'armCircumference', label:'Mid-Arm Circumference (cm)', type:'number', min:0, step:'0.1' }, { name:'tricepsSkinfold', label:'Triceps Skinfold (mm)', type:'number', min:0, step:'0.1' }],
  compute: (v) => { const ac=parseFloat(v.armCircumference)||30; const tsf=parseFloat(v.tricepsSkinfold)||10; const mac=ac-Math.PI*tsf/10; const ama=mac**2/(4*Math.PI); const amma=ama-6.5; return { result:amma, label:'Mid-Arm Muscle Area', unit:'cm²', steps:[{ label:'Arm Circumference', value:ac.toFixed(1)+' cm' },{ label:'Triceps Skinfold', value:tsf.toFixed(1)+' mm' },{ label:'Muscle Circumference', value:mac.toFixed(1)+' cm' },{ label:'Muscle Area (corrected)', value:amma.toFixed(1)+' cm²' }] } },
  description: 'Mid-arm muscle area estimates somatic protein stores and nutritional status (Heymsfield method).',
  formula: 'MAC = Arm Circ - π × (TSF/10). AMA = MAC²/(4π). Corrected AMA = AMA - 6.5 (bone area correction).',
  interpretation: 'Low percentiles (<5th) indicate protein-calorie malnutrition. Used in serial nutritional assessment.'
}

export default calcDef
