import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ siteA: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'CSV'), siteB: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'CSV') }),
  fields: [
    { name: 'siteA', label: 'Site A abundances (comma-separated)', type: 'number' },
    { name: 'siteB', label: 'Site B abundances (comma-separated)', type: 'number' },
  ],
  compute: (v) => { const a = v.siteA.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const b = v.siteB.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const minLen = Math.min(a.length,b.length); let sumMin=0,sumA=0,sumB=0; const contribs:number[]=[]; for(let i=0;i<minLen;i++){ sumMin+=Math.min(a[i],b[i]); sumA+=a[i]; sumB+=b[i]; } const bc = 1-2*sumMin/(sumA+sumB); for(let i=0;i<minLen;i++){ const p = 100*2*Math.min(a[i],b[i])/(sumA+sumB); contribs.push(p); } const avgContrib = contribs.length>0?contribs.reduce((s,n)=>s+n,0)/contribs.length:0; return { result: (1-bc)*100, label: 'Similarity Percentage', unit: '%', steps: [{ label: 'Bray-Curtis dissimilarity', value: bc.toFixed(4) }, { label: 'Percentage similarity', value: `${((1-bc)*100).toFixed(1)}%` }, { label: 'Avg species contribution', value: `${avgContrib.toFixed(2)}%` }] } },
  description: 'SIMPER (Similarity Percentage) analysis identifies species contributing most to community similarity or dissimilarity between sites.',
  formula: 'Sim% = 100 × (1 - BC) | Species contribution = 200 × min(nᵢ₁, nᵢ₂) / Σ(n₁+n₂)',
  interpretation: 'Species with highest contribution percentages are the best discriminating taxa between groups.'
}

export default calcDef
