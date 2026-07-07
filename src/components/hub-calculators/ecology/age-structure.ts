import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ prereprod: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), reprod: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), postreprod: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0') }),
  fields: [
    { name: 'prereprod', label: 'Pre-reproductive individuals', type: 'number', min: 0, step: '1' },
    { name: 'reprod', label: 'Reproductive individuals', type: 'number', min: 0, step: '1' },
    { name: 'postreprod', label: 'Post-reproductive individuals', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => { const pre = parseInt(v.prereprod); const rep = parseInt(v.reprod); const post = parseInt(v.postreprod); const total = pre+rep+post; const prePct = total>0?pre/total*100:0; const repPct = total>0?rep/total*100:0; const postPct = total>0?post/total*100:0; const shape = pre>rep && pre>post?'Expanding (pyramid)':rep>pre && rep>post?'Stable (column)':'Declining (urn)'; return { result: prePct, label: 'Pre-reproductive %', unit: '%', steps: [{ label: 'Pre-reproductive', value: `${pre} (${prePct.toFixed(1)}%)` }, { label: 'Reproductive', value: `${rep} (${repPct.toFixed(1)}%)` }, { label: 'Post-reproductive', value: `${post} (${postPct.toFixed(1)}%)` }, { label: 'Age structure shape', value: shape }] } },
  description: 'Age structure pyramids show the distribution of individuals across age classes, indicating whether a population is expanding, stable, or declining.',
  formula: 'Pre-reproductive % = Pre/Total × 100 | Pyramid: many young = growing',
  interpretation: 'Broad base (many young) = expanding population. Uniform columns = stable. Narrow base = declining. Age structure influences future growth.'
}

export default calcDef
