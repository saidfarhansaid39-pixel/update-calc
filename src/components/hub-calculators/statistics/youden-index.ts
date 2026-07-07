import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ sens: z.string().min(1).refine(v => { const s = parseFloat(v); return s > 0 && s < 100 }, '0-100'), spec: z.string().min(1).refine(v => { const s = parseFloat(v); return s > 0 && s < 100 }, '0-100') }),
  fields: [{ name: 'sens', label: 'Sensitivity (%)', type: 'number', min: 0.1, max: 99.9, step: '1' }, { name: 'spec', label: 'Specificity (%)', type: 'number', min: 0.1, max: 99.9, step: '1' }],
  compute: (v) => { const sens = n(v.sens) / 100; const spec = n(v.spec) / 100; const j = sens + spec - 1; return { result: j, label: "Youden's J", unit: '', steps: [{ label: 'Sensitivity', value: `${(sens * 100).toFixed(1)}%` }, { label: 'Specificity', value: `${(spec * 100).toFixed(1)}%` }, { label: 'J', value: `${j.toFixed(4)}` }, { label: 'Optimal cutoff criterion', value: 'Maximize J = sens + spec - 1' }] } },
  description: 'Youden\'s Index (J) evaluates diagnostic test performance and identifies the optimal cutoff threshold.',
  formula: 'J = Sensitivity + Specificity - 1, ranges from 0 (worthless) to 1 (perfect)',
  interpretation: 'J = 0: no diagnostic information. J = 1: perfect test. The cutoff maximizing J balances sensitivity and specificity.'
}

export default calcDef
