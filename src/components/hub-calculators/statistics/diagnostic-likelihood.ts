import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ sensitivity: z.string().min(1).refine(v => { const s = parseFloat(v); return s > 0 && s < 100 }, '0-100'), specificity: z.string().min(1).refine(v => { const s = parseFloat(v); return s > 0 && s < 100 }, '0-100') }),
  fields: [{ name: 'sensitivity', label: 'Sensitivity (%)', type: 'number', min: 0.1, max: 99.9, step: '1' }, { name: 'specificity', label: 'Specificity (%)', type: 'number', min: 0.1, max: 99.9, step: '1' }],
  compute: (v) => { const sens = n(v.sensitivity) / 100; const spec = n(v.specificity) / 100; const lrPos = (1 - spec) > 0 ? sens / (1 - spec) : Infinity; const lrNeg = spec > 0 ? (1 - sens) / spec : Infinity; const dor = lrNeg > 0 && lrNeg !== Infinity ? lrPos / lrNeg : Infinity; return { result: lrPos, label: 'LR⁺', unit: '', steps: [{ label: 'LR⁺', value: lrPos === Infinity ? '∞' : lrPos.toFixed(4) }, { label: 'LR⁻', value: lrNeg === Infinity ? '∞' : lrNeg.toFixed(4) }, { label: 'DOR', value: dor === Infinity ? '∞' : dor.toFixed(4) }] } },
  description: 'Likelihood ratios quantify how much a test result changes the odds of disease. LR⁺ = sens/(1-spec), LR⁻ = (1-sens)/spec.',
  formula: 'LR⁺ = Sensitivity / (1 - Specificity), LR⁻ = (1 - Sensitivity) / Specificity',
  interpretation: 'LR⁺ > 10: strong diagnostic evidence. LR⁺ > 5: moderate. LR⁻ < 0.1 rules out disease. Pre-test odds × LR = post-test odds.'
}

export default calcDef
