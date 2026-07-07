import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ initial: z.string().min(1).refine(v => parseInt(v) > 0, '>0'), survivors: z.string().min(1).refine(v => v.split(',').every(s => parseInt(s) >= 0), 'CSV ≥0') }),
  fields: [
    { name: 'initial', label: 'Initial cohort size', type: 'number', min: 1, step: '1' },
    { name: 'survivors', label: 'Survivors per age interval (CSV)', type: 'number' },
  ],
  compute: (v) => { const init = parseInt(v.initial); const surv = v.survivors.split(',').map((s:string)=>parseInt(s.trim())).filter((n:number)=>!isNaN(n)); const logSurv = surv.map((s:number)=>s>0?Math.log(s/init):-99); const slopes = logSurv.slice(0,-1).map((ls:number,i:number)=>(logSurv[i+1]-ls)); const avgSlope = slopes.length>0?slopes.reduce((a:number,b:number)=>a+b,0)/slopes.length:0; const curveType = avgSlope>=-0.2?'Type I (late loss)':avgSlope>=-0.8?'Type II (constant)':'Type III (early loss)'; return { result: avgSlope, label: 'Avg Mortality Slope', unit: '', steps: surv.map((s:number,i:number)=>({label:`Age ${i}`,value:`${s} (${(s/init*100).toFixed(1)}%)`})).concat([{label:'Curve type',value:curveType}]) } },
  description: 'Survivorship curves plot the log number of survivors against age to classify mortality patterns as Type I (late loss), Type II (constant), or Type III (early loss).',
  formula: 'lx = log(number surviving) vs age | Type determined by mortality concentration',
  interpretation: 'Type I: humans/mammals (high juvenile survival). Type II: birds/some reptiles (constant mortality). Type III: fish/trees (high early mortality).'
}

export default calcDef
