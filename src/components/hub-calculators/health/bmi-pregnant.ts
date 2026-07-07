import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ preWeight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), week: z.string().min(1,'Required').refine(v=>parseFloat(v)>=1,'≥1') }),
  fields: [{ name:'preWeight', label:'Pre-Pregnancy Weight (kg)', type:'number', min:30, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:100, step:'0.1' }, { name:'week', label:'Gestational Week', type:'number', min:1, max:42, step:'1' }],
  compute: (v) => { const pw=parseFloat(v.preWeight)||60; const h=parseFloat(v.height)||165; const w=parseFloat(v.week)||20; const bmi=pw/((h/100)**2); let rec=''; if(bmi<18.5) rec='12.5-18 kg'; else if(bmi<25) rec='11.5-16 kg'; else if(bmi<30) rec='7-11.5 kg'; else rec='5-9 kg'; return { result:bmi, label:'Pre-Preg BMI', unit:'kg/m²', steps:[{ label:'BMI', value:bmi.toFixed(1) },{ label:'IOM Gain Rec', value:rec }] } },
  description: 'Pre-pregnancy BMI with IOM gestational weight gain recommendations.',
  formula: 'BMI = prepregnancy weight(kg)/height(m)² per IOM 2009 guidelines.',
  interpretation: 'Excessive gain: macrosomia, C-section risk. Inadequate gain: SGA, preterm birth. Follow IOM by trimester.'
}

export default calcDef
