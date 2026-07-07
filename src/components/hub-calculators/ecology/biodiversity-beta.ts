import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ gamma: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), alpha: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'gamma', label: 'Gamma diversity (total species)', type: 'number', min: 1, step: '1' },
    { name: 'alpha', label: 'Mean alpha diversity (mean species/site)', type: 'number', min: 0.1, step: '0.1' },
  ],
  compute: (v) => { const g = parseFloat(v.gamma); const a = parseFloat(v.alpha); const betaW = g/a; const betaAdd = g - a; const betaRatio = g>0?(g-a)/g*100:0; const turnover = a>0?(g/a-1)/(g/a)*100:0; return { result: betaW, label: "Whittaker's β_w", unit: '', steps: [{ label: 'Gamma (γ)', value: `${g}` }, { label: 'Mean alpha (ᾱ)', value: a.toFixed(2) }, { label: "β_w = γ / ᾱ", value: betaW.toFixed(2) }, { label: 'Beta additive (γ - ᾱ)', value: betaAdd.toFixed(2) }, { label: 'Turnover %', value: `${turnover.toFixed(1)}%` }] } },
  description: 'Beta diversity measures species turnover between habitats. Whittaker\'s β_w = γ/α, the ratio of total to mean local diversity.',
  formula: 'β_w = γ / ᾱ | β_add = γ - ᾱ',
  interpretation: 'β_w = 1 when all sites identical. Higher β_w = more species turnover. β_w > 5 indicates high heterogeneity across sites.'
}

export default calcDef
