import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ prereprod: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), reprod: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), postreprod: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0') }),
  fields: [
    { name: 'prereprod', label: 'Pre-reproductive individuals', type: 'number', min: 0, step: '1' },
    { name: 'reprod', label: 'Reproductive individuals', type: 'number', min: 0, step: '1' },
    { name: 'postreprod', label: 'Post-reproductive individuals', type: 'number', min: 0, step: '1' },
    ],
  presets: [
    { label: 'White-tailed deer (US)', values: { initial: '1000', birthRate: '35', deathRate: '25', years: '10' } },
    { label: 'Endangered wolf', values: { initial: '50', birthRate: '20', deathRate: '15', immig: '5', emig: '2', years: '20' } },
    { label: 'Invasive species', values: { initial: '100', birthRate: '80', deathRate: '30', years: '5' } },
    { label: 'Human population (global)', values: { initial: '8000000000', birthRate: '18', deathRate: '7', years: '50' } },
    { label: 'Sea otter recovery', values: { initial: '200', birthRate: '25', deathRate: '8', years: '15' } }
    ],
  compute: (v) => { const pre = parseInt(v.prereprod); const rep = parseInt(v.reprod); const post = parseInt(v.postreprod); const total = pre+rep+post; const prePct = total>0?pre/total*100:0; const repPct = total>0?rep/total*100:0; const postPct = total>0?post/total*100:0; const shape = pre>rep && pre>post?'Expanding (pyramid)':rep>pre && rep>post?'Stable (column)':'Declining (urn)'; return { result: prePct, label: 'Pre-reproductive %', unit: '%', steps: [{ label: 'Pre-reproductive', value: `${pre} (${prePct.toFixed(1)}%)` }, { label: 'Reproductive', value: `${rep} (${repPct.toFixed(1)}%)` }, { label: 'Post-reproductive', value: `${post} (${postPct.toFixed(1)}%)` }, { label: 'Age structure shape', value: shape }] ,
    extras: [
      { label: "Environmental Context", value: "Population growth rates determine species persistence, extinction risk, and the carrying capacity of ecosystems under environmental change." },
      { label: "Measurement Method", value: "Census data, mark-recapture, or remote sensing. Vital rates estimated from longitudinal studies, life tables, or matrix models." },
      { label: "Conservation Note", value: "Declining populations (r < 0) indicate extinction risk. Minimum viable population sizes typically range from 50 (short-term) to 500 (long-term)." },
      { label: "Typical Ranges", value: "Mammal r: 0.01-0.5/yr. Human ~1.1%/yr. Endangered species often have r < 0.02/yr. Doubling time = 70/r (%) in years." },
      { label: "Related Concepts", value: "Carrying capacity (K), logistic growth, Allee effect, source-sink dynamics, density dependence, metapopulation theory." }
    ]} },
  description: 'Age structure pyramids show the distribution of individuals across age classes, indicating whether a population is expanding, stable, or declining.',
  formula: 'Pre-reproductive % = Pre/Total × 100 | Pyramid: many young = growing',
  interpretation: 'Broad base (many young) = expanding population. Uniform columns = stable. Narrow base = declining. Age structure influences future growth.'
}

export default calcDef
