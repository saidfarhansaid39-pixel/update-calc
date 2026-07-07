import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ssEffect: z.string().min(1).refine(v => parseFloat(v) >= 0, '≥0'), ssError: z.string().min(1).refine(v => parseFloat(v) >= 0, '≥0'), ssTotal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), dfEffect: z.string().min(1).refine(v => parseInt(v) >= 1, '≥1'), dfError: z.string().min(1).refine(v => parseInt(v) >= 1, '≥1') }),
  fields: [{ name: 'ssEffect', label: 'SS (effect)', type: 'number', min: 0, step: 'any' }, { name: 'ssError', label: 'SS (error)', type: 'number', min: 0, step: 'any' }, { name: 'ssTotal', label: 'SS (total)', type: 'number', min: 0.001, step: 'any' }, { name: 'dfEffect', label: 'DF (effect)', type: 'number', min: 1, step: '1' }, { name: 'dfError', label: 'DF (error)', type: 'number', min: 1, step: '1' }],
  compute: (v) => { const ssE = n(v.ssEffect); const ssR = n(v.ssError); const ssT = n(v.ssTotal); const dfE = Math.round(n(v.dfEffect)); const dfR = Math.round(n(v.dfError)); const msError = ssR / dfR; const omega2 = (ssT + msError) > 0 ? (ssE - dfE * msError) / (ssT + msError) : 0; return { result: Math.max(0, omega2), label: 'ω²', unit: '', steps: [{ label: 'SS effect', value: `${ssE.toFixed(4)}` }, { label: 'MS error', value: `${msError.toFixed(4)}` }, { label: 'ω²', value: `${Math.max(0, omega2).toFixed(4)}` }] } },
  description: 'Omega-squared (ω²) is a less biased alternative to eta-squared for estimating population effect size in ANOVA.',
  formula: 'ω² = (SS_effect - df_effect × MS_error) / (SS_total + MS_error)',
  interpretation: 'ω² = 0.01: small, 0.06: medium, 0.14: large. ω² is less biased than η², especially for small samples or many factors.'
}

export default calcDef
