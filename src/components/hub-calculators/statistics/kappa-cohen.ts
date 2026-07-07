import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ agree: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), n: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), chanceAgree: z.string().min(1).refine(v => parseFloat(v) >= 0, '≥0') }),
  fields: [{ name: 'agree', label: 'Observed Agreements', type: 'number', min: 0, step: '1' }, { name: 'n', label: 'Total Items', type: 'number', min: 1, step: '1' }, { name: 'chanceAgree', label: 'Agreement by Chance (%)', type: 'number', min: 0, max: 100, step: '1' }],
  compute: (v) => { const pObs = n(v.agree) / n(v.n); const pChance = n(v.chanceAgree) / 100; const kappa = 1 - pChance > 0 ? (pObs - pChance) / (1 - pChance) : 0; return { result: kappa, label: "Cohen's κ", unit: '', steps: [{ label: 'P(observed)', value: `${pObs.toFixed(4)}` }, { label: 'P(chance)', value: `${pChance.toFixed(4)}` }, { label: 'κ', value: `${kappa.toFixed(4)}` }, { label: 'Strength', value: kappa >= 0.81 ? 'Almost perfect' : kappa >= 0.61 ? 'Substantial' : kappa >= 0.41 ? 'Moderate' : kappa >= 0.21 ? 'Fair' : kappa >= 0 ? 'Slight' : 'Poor' }] } },
  description: "Cohen's kappa measures inter-rater agreement for categorical items, correcting for agreement by chance.",
  formula: 'κ = (P_obs - P_exp) / (1 - P_exp)',
  interpretation: 'κ = 1: perfect agreement, κ = 0: agreement equals chance, κ < 0: agreement worse than chance.'
}

export default calcDef
