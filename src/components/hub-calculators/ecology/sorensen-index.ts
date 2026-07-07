import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ siteA: z.string().min(1).refine(v => v.split(',').every((s:string) => !isNaN(parseFloat(s.trim()))), 'Comma-separated'), siteB: z.string().min(1).refine(v => v.split(',').every((s:string) => !isNaN(parseFloat(s.trim()))), 'Comma-separated') }),
  fields: [
    { name: 'siteA', label: 'Site A species codes (1 present, 0 absent, CSV)', type: 'number' },
    { name: 'siteB', label: 'Site B species codes (CSV)', type: 'number' },
  ],
  compute: (v) => { const a = v.siteA.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const b = v.siteB.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const minLen = Math.min(a.length, b.length); let shared = 0; for (let i=0; i<minLen; i++) { if (a[i]>0 && b[i]>0) shared++; } const aSpp = a.reduce((s:number,n:number)=>s+(n>0?1:0),0); const bSpp = b.reduce((s:number,n:number)=>s+(n>0?1:0),0); const cc = aSpp+bSpp>0?2*shared/(aSpp+bSpp):0; return { result: cc, label: "Sørensen's Coefficient", unit: '', steps: [{ label: 'Shared species', value: `${shared}` }, { label: 'Species in A', value: `${aSpp}` }, { label: 'Species in B', value: `${bSpp}` }, { label: 'CC = 2C/(S₁+S₂)', value: cc.toFixed(4) }] } },
  description: "Sørensen-Dice coefficient (\u00d8rensen's index) measures similarity between two ecological communities based on presence-absence data.",
  formula: 'CC = 2C / (S₁ + S₂)',
  interpretation: 'CC ranges from 0 (no overlap) to 1 (identical). Less sensitive to outliers than Jaccard. CC > 0.5 = high similarity.'
}

export default calcDef
