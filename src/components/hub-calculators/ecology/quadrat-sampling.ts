import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ counts: z.string().min(1).refine(v => v.split(',').every(s => parseInt(s) >= 0), 'CSV ≥0'), quadratSize: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'counts', label: 'Counts per quadrat (CSV)', type: 'number' },
    { name: 'quadratSize', label: 'Quadrat area (m²)', type: 'number', min: 0.01, step: '0.01' },
  ],
  compute: (v) => { const counts = v.counts.split(',').map((s:string)=>parseInt(s.trim())).filter((n:number)=>!isNaN(n)); const size = parseFloat(v.quadratSize); const mean = counts.reduce((a:number,b:number)=>a+b,0)/counts.length; const variance = counts.map((c:number)=>(c-mean)**2).reduce((a:number,b:number)=>a+b,0)/(counts.length-1); const density = mean/size; const dispersion = mean>0?variance/mean:1; return { result: density, label: 'Population Density', unit: 'ind/m²', steps: [{ label: 'Quadrat count', value: `${counts.length}` }, { label: 'Mean count', value: mean.toFixed(2) }, { label: 'Variance', value: variance.toFixed(2) }, { label: 'Density', value: `${density.toFixed(4)} ind/m²` }, { label: 'Dispersion (V/M)', value: dispersion.toFixed(2) }, { label: 'Pattern', value: dispersion>1.5?'Clumped':dispersion<0.7?'Uniform':'Random' }] } },
  description: 'Quadrat sampling estimates population density and dispersion pattern by counting individuals within randomly placed quadrats.',
  formula: 'Density = Mean count / Quadrat area | Dispersion = Variance / Mean',
  interpretation: 'Variance/Mean = 1: random dispersion, >1: clumped, <1: uniform. Clumped distribution requires more quadrats for precise density estimates.'
}

export default calcDef
