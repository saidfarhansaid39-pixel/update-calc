import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1).refine(v => v.split(',').every(s => parseInt(s) >= 0), '≥0 CSV'), survivors: z.string().min(1).refine(v => v.split(',').every(s => parseInt(s) >= 0), '≥0 CSV'), births: z.string().optional() }),
  fields: [
    { name: 'age', label: 'Age classes (CSV)', type: 'number' },
    { name: 'survivors', label: 'Survivors per age class (CSV)', type: 'number' },
    { name: 'births', label: 'Births per age class (CSV, optional)', type: 'number' },
  ],
  compute: (v) => { const age = v.age.split(',').map((s:string)=>parseInt(s.trim())).filter((n:number)=>!isNaN(n)); const surv = v.survivors.split(',').map((s:string)=>parseInt(s.trim())).filter((n:number)=>!isNaN(n)); const birth = v.births?v.births.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)):[]; const n = Math.min(age.length,surv.length); const lx = surv.map((s:number)=>s/surv[0]); const dx = lx.slice(0,-1).map((l:number,i:number)=>l-lx[i+1]); const qx = lx.slice(0,-1).map((l:number,i:number)=>l>0?dx[i]/l:0); const Lx = lx.slice(0,-1).map((l:number,i:number)=>(l+lx[i+1])/2); const Tx = Lx.map((_:number,i:number)=>Lx.slice(i).reduce((a:number,b:number)=>a+b,0)); const ex = Tx.map((t:number,i:number)=>t/lx[i]); const R0 = birth.length>0?birth.slice(0,n).map((b:number,i:number)=>b*lx[i]).reduce((a:number,b:number)=>a+b,0):0; return { result: ex[0], label: 'Life Expectancy at Birth', unit: 'years', steps: age.slice(0,n).map((a:number,i:number)=>({label:`Age ${a}`,value:`lx=${lx[i].toFixed(3)}, ex=${ex[i]!==undefined?ex[i].toFixed(1):'—'}`})).concat(birth.length>0?[{label:'R₀ (net reprod. rate)',value:R0.toFixed(2)}]:[]) } },
  description: 'Life tables summarize age-specific survival and fecundity schedules. Key outputs include survivorship (lx), mortality (qx), and life expectancy (ex).',
  formula: 'lx = Sx/S₀ | qx = dx/lx | ex = Tx/lx | R₀ = Σ(bx × lx)',
  interpretation: 'Life expectancy at birth (e₀) summarizes mortality schedule. R₀ = net reproductive rate. R₀ > 1 = growing population. Generation time = Σ(x·lx·bx)/R₀.'
}

export default calcDef
