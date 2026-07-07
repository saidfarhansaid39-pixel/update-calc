import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ siteA: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'Comma-separated'), siteB: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'Comma-separated') }),
  fields: [
    { name: 'siteA', label: 'Site A abundances (comma-separated)', type: 'number' },
    { name: 'siteB', label: 'Site B abundances (comma-separated)', type: 'number' },
  ],
  compute: (v) => { const a = v.siteA.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const b = v.siteB.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const minLen = Math.min(a.length, b.length); const sumMin = Array.from({length: minLen}, (_,i)=>Math.min(a[i],b[i])).reduce((s:number,n:number)=>s+n,0); const sumA = a.reduce((s:number,n:number)=>s+n,0); const sumB = b.reduce((s:number,n:number)=>s+n,0); const bc = 1 - (2*sumMin)/(sumA+sumB); return { result: bc, label: 'Bray-Curtis Dissimilarity', unit: '', steps: [{ label: 'Sum site A', value: `${sumA}` }, { label: 'Sum site B', value: `${sumB}` }, { label: '2 × Σmin', value: `${(2*sumMin).toFixed(2)}` }, { label: 'Bray-Curtis', value: bc.toFixed(4) }, { label: 'Similarity', value: `${((1-bc)*100).toFixed(1)}%` }] } },
  description: 'Bray-Curtis dissimilarity measures community composition differences between two sites (0 = identical, 1 = completely different).',
  formula: 'BC = 1 - 2C/(S₁ + S₂) where C = sum of shared minimum abundances',
  interpretation: 'Values near 0 indicate similar communities; values near 1 indicate very different communities.'
}

export default calcDef
