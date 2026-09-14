import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1).refine(v => v.split(',').every(s => parseInt(s) >= 0), '≥0 CSV'), survivors: z.string().min(1).refine(v => v.split(',').every(s => parseInt(s) >= 0), '≥0 CSV'), births: z.string().optional() }),
  fields: [
    { name: 'age', label: 'Age classes (CSV)', type: 'number' },
    { name: 'survivors', label: 'Survivors per age class (CSV)', type: 'number' },
    { name: 'births', label: 'Births per age class (CSV, optional)', type: 'number' },
    ],
  presets: [
    { label: 'White-tailed deer (US)', values: { initial: '1000', birthRate: '35', deathRate: '25', years: '10' } },
    { label: 'Endangered wolf', values: { initial: '50', birthRate: '20', deathRate: '15', immig: '5', emig: '2', years: '20' } },
    { label: 'Invasive species', values: { initial: '100', birthRate: '80', deathRate: '30', years: '5' } },
    { label: 'Human population (global)', values: { initial: '8000000000', birthRate: '18', deathRate: '7', years: '50' } },
    { label: 'Sea otter recovery', values: { initial: '200', birthRate: '25', deathRate: '8', years: '15' } }
    ],
  compute: (v) => { const age = v.age.split(',').map((s:string)=>parseInt(s.trim())).filter((n:number)=>!isNaN(n)); const surv = v.survivors.split(',').map((s:string)=>parseInt(s.trim())).filter((n:number)=>!isNaN(n)); const birth = v.births?v.births.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)):[]; const n = Math.min(age.length,surv.length); const lx = surv.map((s:number)=>s/surv[0]); const dx = lx.slice(0,-1).map((l:number,i:number)=>l-lx[i+1]); const qx = lx.slice(0,-1).map((l:number,i:number)=>l>0?dx[i]/l:0); const Lx = lx.slice(0,-1).map((l:number,i:number)=>(l+lx[i+1])/2); const Tx = Lx.map((_:number,i:number)=>Lx.slice(i).reduce((a:number,b:number)=>a+b,0)); const ex = Tx.map((t:number,i:number)=>t/lx[i]); const R0 = birth.length>0?birth.slice(0,n).map((b:number,i:number)=>b*lx[i]).reduce((a:number,b:number)=>a+b,0):0; return { result: ex[0], label: 'Life Expectancy at Birth', unit: 'years', steps: age.slice(0,n).map((a:number,i:number)=>({label:`Age ${a}`,value:`lx=${lx[i].toFixed(3)}, ex=${ex[i]!==undefined?ex[i].toFixed(1):'—'}`})).concat(birth.length>0?[{label:'R₀ (net reprod. rate)',value:R0.toFixed(2)}]:[]) ,
    extras: [
      { label: "Environmental Context", value: "Population growth rates determine species persistence, extinction risk, and the carrying capacity of ecosystems under environmental change." },
      { label: "Measurement Method", value: "Census data, mark-recapture, or remote sensing. Vital rates estimated from longitudinal studies, life tables, or matrix models." },
      { label: "Conservation Note", value: "Declining populations (r < 0) indicate extinction risk. Minimum viable population sizes typically range from 50 (short-term) to 500 (long-term)." },
      { label: "Typical Ranges", value: "Mammal r: 0.01-0.5/yr. Human ~1.1%/yr. Endangered species often have r < 0.02/yr. Doubling time = 70/r (%) in years." },
      { label: "Related Concepts", value: "Carrying capacity (K), logistic growth, Allee effect, source-sink dynamics, density dependence, metapopulation theory." }
    ]} },
  description: 'Life tables summarize age-specific survival and fecundity schedules. Key outputs include survivorship (lx), mortality (qx), and life expectancy (ex).',
  formula: 'lx = Sx/S₀ | qx = dx/lx | ex = Tx/lx | R₀ = Σ(bx × lx)',
  interpretation: 'Life expectancy at birth (e₀) summarizes mortality schedule. R₀ = net reproductive rate. R₀ > 1 = growing population. Generation time = Σ(x·lx·bx)/R₀.'
}

export default calcDef
