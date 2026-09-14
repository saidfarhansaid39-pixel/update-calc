import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), dosePerKg: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'weight', label:'Weight (kg)', type:'number', min:1, step:'0.1' }, { name:'dosePerKg', label:'Dose per kg (mg/kg)', type:'number', min:0.1, step:'0.1' }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const dpk=parseFloat(v.dosePerKg)||2; const dose=w*dpk; return { result:dose, label:'Calculated Dose', unit:'mg', steps:[{ label:'Weight', value:w.toString()+' kg' },{ label:'× Dose/kg', value:dpk.toString()+' mg/kg' },{ label:'= Total Dose', value:dose.toFixed(1)+' mg' }] ,
    extras: [
      { label: "Medical disclaimer", value: "This is for informational purposes only. Consult a healthcare provider." },
      { label: "Individual variation", value: "Results may vary by age, sex, ethnicity, and medical history." },
      { label: "Trend note", value: "Track measurements over time rather than relying on a single reading." }
    ]} },
  description: 'Weight-based drug dosage calculation for individualized pharmacotherapy.',
  formula: 'Dose (mg) = Weight (kg) × Dose/kg (mg/kg). Max dose limits apply per drug.',
  interpretation: 'Verify against max dose. Consider ideal body weight for obese patients. Adjust for renal function.'
}

export default calcDef
