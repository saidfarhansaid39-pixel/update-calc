import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ species: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'CSV') }),
  fields: [{ name: 'species', label: 'Species abundances (comma-separated)', type: 'number' }],
  compute: (v) => { const counts = v.species.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const total = counts.reduce((a:number,b:number)=>a+b,0); const sorted = [...counts].sort((a,b)=>b-a); const bpDominance = total>0?sorted[0]/total:0; const twoSpecies = total>0&&sorted.length>1?(sorted[0]+sorted[1])/total:0; const mcInnes = total>0?sorted.filter((c,i)=>i<2).reduce((a,b)=>a+b,0)/total:0; return { result: bpDominance*100, label: 'Berger-Parker Dominance', unit: '%', steps: [{ label: 'Most abundant species', value: `${sorted[0]}` }, { label: 'Total individuals', value: `${total}` }, { label: 'Berger-Parker d', value: bpDominance.toFixed(4) }, { label: 'Top 2 species share', value: `${(twoSpecies*100).toFixed(1)}%` }] } },
  description: 'Berger-Parker dominance index measures the proportional abundance of the most common species (d = Nmax/N).',
  formula: 'd = N_max / N',
  interpretation: 'd ranges from 0 (equal abundances) to 1 (single species). d > 0.5 indicates strong dominance by one species.'
}

export default calcDef
