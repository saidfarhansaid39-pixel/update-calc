import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ gamma: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), alpha: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'gamma', label: 'Gamma diversity (total species)', type: 'number', min: 1, step: '1' },
    { name: 'alpha', label: 'Mean alpha diversity (mean species/site)', type: 'number', min: 0.1, step: '0.1' },
    ],
  presets: [
    { label: 'Tropical rainforest', values: { species: '45,32,28,15,12,8,6,4,3,2,1' } },
    { label: 'Temperate forest', values: { species: '20,15,12,8,5,3,2,1' } },
    { label: 'Disturbed site', values: { species: '85,12,3' } },
    { label: 'Coral reef', values: { species: '30,25,22,18,15,12,10,8,6,4' } },
    { label: 'Agricultural monoculture', values: { species: '95,3,2' } }
    ],
  compute: (v) => { const g = parseFloat(v.gamma); const a = parseFloat(v.alpha); const betaW = g/a; const betaAdd = g - a; const betaRatio = g>0?(g-a)/g*100:0; const turnover = a>0?(g/a-1)/(g/a)*100:0; return { result: betaW, label: 'Whittaker\u2019s \u03B2_w', unit: '', steps: [{ label: 'Gamma (\u03B3)', value: `${g}` }, { label: 'Mean alpha (\u03B1\u0304)', value: a.toFixed(2) }, { label: '\u03B2_w = \u03B3 / \u03B1\u0304', value: betaW.toFixed(2) }, { label: 'Beta additive (\u03B3 - \u03B1\u0304)', value: betaAdd.toFixed(2) }, { label: 'Turnover %', value: `${turnover.toFixed(1)}%` }] ,
    extras: [
      { label: "Environmental Context", value: "Diversity indices are fundamental tools for quantifying community structure and comparing biodiversity across habitats, regions, or time periods." },
      { label: "Measurement Method", value: "Data collected via field surveys (quadrats, transects), eDNA metabarcoding, or citizen science platforms. Abundance data should represent counts or biomass per species." },
      { label: "Conservation Note", value: "Low diversity often indicates habitat degradation, pollution, or invasive species pressure. High diversity signals ecosystem health and resilience." },
      { label: "Typical Ranges", value: "Shannon H': 0.5-1.5 (disturbed), 1.5-3.5 (moderate), 3.5-4.5 (pristine). Simpson D: 0-1 (higher = more diverse)." },
      { label: "Related Concepts", value: "Species richness, evenness, rarefaction curves, beta diversity, Hill numbers, rank-abundance curves." }
    ]} },
  description: 'Beta diversity measures species turnover between habitats. Whittaker\'s β_w = γ/α, the ratio of total to mean local diversity.',
  formula: 'β_w = γ / ᾱ | β_add = γ - ᾱ',
  interpretation: 'β_w = 1 when all sites identical. Higher β_w = more species turnover. β_w > 5 indicates high heterogeneity across sites.'
}

export default calcDef
