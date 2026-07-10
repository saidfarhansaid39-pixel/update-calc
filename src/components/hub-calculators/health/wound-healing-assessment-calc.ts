import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ woundSize: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), depth: z.string().min(1,'Required').refine(v=>parseInt(v)>=1&&parseInt(v)<=4,'1-4'), exudate: z.string().min(1,'Required').refine(v=>parseInt(v)>=1&&parseInt(v)<=4,'1-4'), tissueType: z.string().min(1,'Required').refine(v=>parseInt(v)>=1&&parseInt(v)<=4,'1-4'), infectionSigns: z.string().min(1,'Required').refine(v=>parseInt(v)>=1&&parseInt(v)<=4,'1-4'), edges: z.string().min(1,'Required').refine(v=>parseInt(v)>=1&&parseInt(v)<=4,'1-4') }),
  fields: [
    { name:'woundSize', label:'Wound Size (cm²)', type:'number', min:0.1, max:500, step:'0.1' },
    { name:'depth', label:'Depth (1=superficial, 2=partial, 3=full, 4=cavity)', type:'number', min:1, max:4, step:'1' },
    { name:'exudate', label:'Exudate Level (1=none, 2=minimal, 3=moderate, 4=heavy)', type:'number', min:1, max:4, step:'1' },
    { name:'tissueType', label:'Tissue Type (1=epithelial, 2=granulation, 3=slough, 4=necrotic)', type:'number', min:1, max:4, step:'1' },
    { name:'infectionSigns', label:'Infection Signs (1=none, 2=mild, 3=moderate, 4=severe)', type:'number', min:1, max:4, step:'1' },
    { name:'edges', label:'Wound Edges (1=closed, 2=open, 3=maceration, 4=undermining)', type:'number', min:1, max:4, step:'1' }
  ],
  compute: (v) => { const size=parseFloat(v.woundSize)||5; const depth=parseInt(v.depth)||2; const exudate=parseInt(v.exudate)||2; const tissue=parseInt(v.tissueType)||2; const infection=parseInt(v.infectionSigns)||2; const edges=parseInt(v.edges)||2; const sizeScore=size<=1?1:size<=10?2:size<=50?3:4; const total=sizeScore+depth+exudate+tissue+infection+edges; const pct=Math.round(total/24*100); let status='Poor'; if(pct<=30) status='Good healing'; else if(pct<=55) status='Moderate healing'; else if(pct<=75) status='Delayed healing'; return { result:pct, label:'Wound Healing Score', unit:'%', steps:[{ label:'Raw Score', value:total+'/24' },{ label:'Healing Assessment', value:status }] } },
  description: 'Wound healing assessment scoring size, depth, exudate, tissue, infection, and edge condition.',
  formula: 'Total score = size + depth + exudate + tissue + infection + edges. Normalized to percentage.',
  interpretation: '≤30% Good healing progression, 31-55% Moderate, 56-75% Delayed, >75% Requires intervention.'
}
export default calcDef
