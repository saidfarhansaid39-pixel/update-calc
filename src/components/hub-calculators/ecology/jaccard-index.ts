import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ siteA: z.string().min(1).refine(v => v.split(',').every((s:string) => !isNaN(parseFloat(s.trim()))), 'Comma-separated'), siteB: z.string().min(1).refine(v => v.split(',').every((s:string) => !isNaN(parseFloat(s.trim()))), 'Comma-separated') }),
  fields: [
    { name: 'siteA', label: 'Site A species codes (1 if present, 0 if absent, comma-separated)', type: 'number' },
    { name: 'siteB', label: 'Site B presence codes (comma-separated)', type: 'number' },
  ],
  compute: (v) => { const a = v.siteA.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const b = v.siteB.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const minLen = Math.min(a.length, b.length); let shared = 0; let either = 0; for (let i=0; i<minLen; i++) { if (a[i]>0 || b[i]>0) either++; if (a[i]>0 && b[i]>0) shared++; } const jaccard = either>0?shared/either:0; const sorensen = (a.length>0&&b.length>0)?2*shared/(a.reduce((s:number,n:number)=>s+(n>0?1:0),0)+b.reduce((s:number,n:number)=>s+(n>0?1:0),0)):0; return { result: jaccard, label: "Jaccard's Index", unit: '', steps: [{ label: 'Shared species', value: `${shared}` }, { label: 'Species in either site', value: `${either}` }, { label: "Jaccard's index", value: jaccard.toFixed(4) }, { label: "Sørensen's index", value: sorensen.toFixed(4) }] } },
  description: "Jaccard's similarity index compares species presence-absence between two sites. Ranges from 0 (no overlap) to 1 (identical composition).",
  formula: 'J = A∩B / A∪B',
  interpretation: 'J > 0.5 indicates high similarity. J < 0.2 indicates low similarity. Common threshold for distinct communities: J < 0.25.'
}

export default calcDef
