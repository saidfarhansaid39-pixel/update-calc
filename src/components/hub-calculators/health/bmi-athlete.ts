import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), height: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), bodyFatPct: z.string().min(1,'Required').refine(v=>parseFloat(v)>=2,'≥2') }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:30, step:'0.1' }, { name:'height', label:'Height (cm)', type:'number', min:100, step:'0.1' }, { name:'bodyFatPct', label:'Body Fat %', type:'number', min:2, max:60, step:'0.1' }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const h=parseFloat(v.height)||175; const bf=parseFloat(v.bodyFatPct)||15; const bmi=w/((h/100)**2); const ffmi=w*(1-bf/100)/((h/100)**2); return { result:bmi, label:'Athlete BMI', unit:'kg/m²', steps:[{ label:'Standard BMI', value:bmi.toFixed(1) },{ label:'FFMI', value:ffmi.toFixed(1) }] } },
  description: 'BMI interpretation for athletes considering high muscle mass.',
  formula: 'BMI = W/H². FFMI = fat-free mass/H². Male athlete FFMI: 18-25, female: 14-20.',
  interpretation: 'Standard BMI may overestimate body fat in athletes. Use FFMI to differentiate muscle from adiposity.'
}

export default calcDef
