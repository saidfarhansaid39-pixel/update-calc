import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ast: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), alt: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'ast', label:'AST (U/L)', type:'number', min:1, step:'1' }, { name:'alt', label:'ALT (U/L)', type:'number', min:1, step:'1' }],
  compute: (v) => { const ast=parseFloat(v.ast)||0; const alt=parseFloat(v.alt)||0; const ratio=alt>0?ast/alt:0; let pat=ratio>=2?'Alcoholic liver disease':ratio>1?'Cirrhosis or non-hepatic':ratio<0.8?'Acute hepatitis/NAFLD':'Indeterminate'; return { result:ratio, label:'AST/ALT Ratio', unit:'', steps:[{ label:'AST/ALT', value:ratio.toFixed(2) },{ label:'Pattern', value:pat }] ,
    extras: [
      { label: "Medical disclaimer", value: "This is for informational purposes only. Consult a healthcare provider." },
      { label: "Individual variation", value: "Results may vary by age, sex, ethnicity, and medical history." },
      { label: "Trend note", value: "Track measurements over time rather than relying on a single reading." }
    ]} },
  description: 'De Ritis ratio (AST/ALT) for differential diagnosis of liver enzyme elevation.',
  formula: 'AST/ALT = AST(U/L) / ALT(U/L). Normal ~1.15.',
  interpretation: '≥2: Alcoholic liver disease; 1-2: Cirrhosis; <0.8: Acute viral hepatitis or NAFLD.'
}

export default calcDef
