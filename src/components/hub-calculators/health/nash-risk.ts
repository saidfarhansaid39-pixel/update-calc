import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), bmi: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), alt: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), ast: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), diabetesPresent: z.string().min(1,'Required') }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:18, max:120, step:'1' }, { name:'bmi', label:'BMI (kg/m²)', type:'number', min:10, max:80, step:'0.1' }, { name:'alt', label:'ALT (U/L)', type:'number', min:0, step:'1' }, { name:'ast', label:'AST (U/L)', type:'number', min:0, step:'1' }, { name:'diabetesPresent', label:'Type 2 Diabetes?', type:'select', options:[{value:'yes',label:'Yes'},{value:'no',label:'No'}] }],
  compute: (v) => { const age=parseFloat(v.age)||45; const bmi=parseFloat(v.bmi)||30; const alt=parseFloat(v.alt)||40; const ast=parseFloat(v.ast)||30; const dm=v.diabetesPresent||'no'; const astAlt=ast/alt; let risk='Low'; let score=0; if(age>45)score+=1; if(bmi>30)score+=1; if(alt>40)score+=1; if(astAlt>1)score+=1; if(dm==='yes')score+=1; if(score>=3)risk='High (NASH likely, consider biopsy)'; else if(score>=2)risk='Moderate (consider further evaluation)'; return { result:risk, label:'NASH Risk', unit:'', steps:[{ label:'Age', value:age.toFixed(0)+' years' },{ label:'BMI', value:bmi.toFixed(1)+' kg/m²' },{ label:'ALT', value:alt.toFixed(0)+' U/L' },{ label:'AST', value:ast.toFixed(0)+' U/L' },{ label:'AST/ALT Ratio', value:astAlt.toFixed(2) },{ label:'Diabetes', value:dm==='yes'?'Present':'Absent' },{ label:'Risk Factors Met', value:score.toFixed(0)+'/5' },{ label:'NASH Risk', value:risk }] } },
  description: 'NASH (non-alcoholic steatohepatitis) risk assessment using clinical and biochemical markers.',
  formula: 'Risk based on age >45, BMI >30, ALT >40, AST/ALT >1, and diabetes. Composite risk scoring.',
  interpretation: 'High (≥3 factors): NASH likely—consider liver biopsy. Moderate (2 factors): Further workup (FibroScan, NAFLD fibrosis score). Low (<2 factors): Lifestyle modification, monitor LFTs.'
}

export default calcDef
