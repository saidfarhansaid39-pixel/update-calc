import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ initial: z.string().min(1).refine(v => parseInt(v) > 0, '>0'), survivors: z.string().min(1).refine(v => v.split(',').every(s => parseInt(s) >= 0), 'CSV ≥0') }),
  fields: [
    { name: 'initial', label: 'Initial cohort size', type: 'number', min: 1, step: '1' },
    { name: 'survivors', label: 'Survivors per age interval (CSV)', type: 'number' },
    ],
  presets: [
    { label: 'White-tailed deer (US)', values: { initial: '1000', birthRate: '35', deathRate: '25', years: '10' } },
    { label: 'Endangered wolf', values: { initial: '50', birthRate: '20', deathRate: '15', immig: '5', emig: '2', years: '20' } },
    { label: 'Invasive species', values: { initial: '100', birthRate: '80', deathRate: '30', years: '5' } },
    { label: 'Human population (global)', values: { initial: '8000000000', birthRate: '18', deathRate: '7', years: '50' } },
    { label: 'Sea otter recovery', values: { initial: '200', birthRate: '25', deathRate: '8', years: '15' } }
    ],
  compute: (v) => { const init = parseInt(v.initial); const surv = v.survivors.split(',').map((s:string)=>parseInt(s.trim())).filter((n:number)=>!isNaN(n)); const logSurv = surv.map((s:number)=>s>0?Math.log(s/init):-99); const slopes = logSurv.slice(0,-1).map((ls:number,i:number)=>(logSurv[i+1]-ls)); const avgSlope = slopes.length>0?slopes.reduce((a:number,b:number)=>a+b,0)/slopes.length:0; const curveType = avgSlope>=-0.2?'Type I (late loss)':avgSlope>=-0.8?'Type II (constant)':'Type III (early loss)'; return { result: avgSlope, label: 'Avg Mortality Slope', unit: '', steps: surv.map((s:number,i:number)=>({label:`Age ${i}`,value:`${s} (${(s/init*100).toFixed(1)}%)`})).concat([{label:'Curve type',value:curveType}]) ,
    extras: [
      { label: "Environmental Context", value: "Population growth rates determine species persistence, extinction risk, and the carrying capacity of ecosystems under environmental change." },
      { label: "Measurement Method", value: "Census data, mark-recapture, or remote sensing. Vital rates estimated from longitudinal studies, life tables, or matrix models." },
      { label: "Conservation Note", value: "Declining populations (r < 0) indicate extinction risk. Minimum viable population sizes typically range from 50 (short-term) to 500 (long-term)." },
      { label: "Typical Ranges", value: "Mammal r: 0.01-0.5/yr. Human ~1.1%/yr. Endangered species often have r < 0.02/yr. Doubling time = 70/r (%) in years." },
      { label: "Related Concepts", value: "Carrying capacity (K), logistic growth, Allee effect, source-sink dynamics, density dependence, metapopulation theory." }
    ]} },
  description: 'Survivorship curves plot the log number of survivors against age to classify mortality patterns as Type I (late loss), Type II (constant), or Type III (early loss).',
  formula: 'lx = log(number surviving) vs age | Type determined by mortality concentration',
  interpretation: 'Type I: humans/mammals (high juvenile survival). Type II: birds/some reptiles (constant mortality). Type III: fish/trees (high early mortality).'
}

export default calcDef
