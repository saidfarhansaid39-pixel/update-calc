import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ ageClasses: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'CSV'), fertility: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'CSV'), survival: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'CSV'), years: z.string().optional() }),
  fields: [
    { name: 'ageClasses', label: 'Current counts per age class (CSV)', type: 'number' },
    { name: 'fertility', label: 'Fertility rates per age class (CSV)', type: 'number' },
    { name: 'survival', label: 'Survival rates per class (CSV)', type: 'number' },
    { name: 'years', label: 'Projection years (optional)', type: 'number', min: 1, step: '1' },
    ],
  presets: [
    { label: 'r-selected (mouse)', values: { lifespan: '1', fecundity: '60', ageFirstRepro: '0.2' } },
    { label: 'K-selected (elephant)', values: { lifespan: '60', fecundity: '6', ageFirstRepro: '12' } },
    { label: 'Intermediate (deer)', values: { lifespan: '15', fecundity: '20', ageFirstRepro: '2' } },
    { label: 'Loggerhead turtle', values: { lifespan: '50', fecundity: '100', ageFirstRepro: '25' } },
    { label: 'Dandelion (r-strategist)', values: { lifespan: '1', fecundity: '2000', ageFirstRepro: '0.3' } }
    ],
  compute: (v) => { const N0 = v.ageClasses.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const F = v.fertility.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const P = v.survival.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const t = parseInt(v.years)||10; const n = Math.min(N0.length, F.length, P.length+1); let N = [...N0]; for(let yr=0; yr<t; yr++){ const recruits = F.reduce((s:number,f:number,i:number)=>s+f*N[i],0); const next = [recruits]; for(let i=0; i<n-1; i++){ next.push(P[i]*N[i]); } N = next; } const total = N.reduce((a:number,b:number)=>a+b,0); const lambda = total/N0.reduce((a:number,b:number)=>a+b,0); return { result: total, label: 'Projected Total Population', unit: '', steps: [{ label: 'Initial total', value: `${N0.reduce((a:number,b:number)=>a+b,0)}` }, { label: 'Projected after {t} yr', value: `${Math.round(total)}` }, { label: 'λ (growth rate)', value: lambda.toFixed(4) }, { label: 'Status', value: lambda>1.01?'Increasing':lambda<0.99?'Declining':'Stable' }] ,
    extras: [
      { label: "Environmental Context", value: "r/K selection theory describes life-history trade-offs. r-selected species thrive in disturbed habitats; K-selected species dominate stable environments." },
      { label: "Measurement Method", value: "Life-history parameters from long-term population studies. Matrix projection models integrate survival, growth, and fecundity across size/stage classes." },
      { label: "Conservation Note", value: "K-selected species (large, slow, low fecundity) are more vulnerable to extinction. Stage-structured models identify critical life stages for conservation action." },
      { label: "Typical Ranges", value: "r-selected: high fecundity (>1000 eggs), short lifespan (<1 yr), small body size. K-selected: low fecundity (<10 offspring), long lifespan (>10 yr), large body size." },
      { label: "Related Concepts", value: "Life-history strategies, demographic modeling, elasticity analysis, lottery model, Grime's CSR theory for plants." }
    ]} },
  description: 'Leslie matrix projection models age-structured population dynamics using age-specific fertility and survival rates to project future population size.',
  formula: 'n(t+1) = L × n(t) | L = Leslie matrix (fertility row + survival subdiagonal)',
  interpretation: 'λ > 1 = growing, λ = 1 = stable, λ < 1 = declining. Stable age distribution emerges from repeated multiplication.'
}

export default calcDef
