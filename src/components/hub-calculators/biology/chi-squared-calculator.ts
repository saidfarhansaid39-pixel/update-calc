import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    observed: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, 'Must be >= 0'),
    expected: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    n: z.string().optional().refine(v => !v || parseInt(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'observed', label: 'Observed Count', type: 'number', min: 0, step: '1' },
    { name: 'expected', label: 'Expected Count', type: 'number', min: 0.1, step: '0.1' },
    { name: 'n', label: 'Number of Categories (optional)', type: 'number', min: 2, step: '1' },
  ],
  compute: (v) => {
    const n = v.n || 2
    const chi2 = v.expected > 0 ? ((v.observed - v.expected) ** 2) / v.expected : 0
    const df = n - 1
    const critical3_84 = chi2 > 3.84 ? 'Reject H0 (p < 0.05)' : 'Fail to reject H0'
    return {
      result: chi2, label: '?² Statistic', unit: '',
      steps: [
        { label: 'Observed (O)', value: `${v.observed}` },
        { label: 'Expected (E)', value: `${v.expected}` },
        { label: 'O–E', value: `${(v.observed - v.expected).toFixed(2)}` },
        { label: '(O–E)²/E', value: `${chi2.toFixed(4)}` },
        { label: 'Degrees of freedom', value: `${df}` },
        { label: 'At a=0.05 (3.84)', value: critical3_84 },
      ]
}
  },
  description: 'The chi-squared test compares observed and expected frequencies to test goodness of fit. Used in genetics to validate Mendelian ratios and experimental data.',
  formula: '?² = S(O – E)² / E | df = n – 1',
  interpretation: '?² > 3.84 (df=1, a=0.05) rejects the null hypothesis. For Mendelian 3:1 ratio with df=1, ?² < 3.84 indicates good fit.'
}

export default calcDef
