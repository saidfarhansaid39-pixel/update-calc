import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ observed: z.string().min(1, 'Required'), expected: z.string().min(1, 'Required') }),
  fields: [{ name: 'observed', label: 'Observed (comma separated)', type: 'number', step: 'any' }, { name: 'expected', label: 'Expected (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const obs = parseList(v.observed); const exp = parseList(v.expected); if (obs.length !== exp.length || obs.length < 2) return { result: 'Need ≥2 categories', label: '', unit: '', steps: [] }; const chi2 = obs.reduce((acc, o, i) => acc + ((o - exp[i]) ** 2) / exp[i], 0); const df = obs.length - 1; return { result: chi2, label: 'χ² Statistic', unit: '', steps: [{ label: 'χ²', value: `${chi2.toFixed(4)}` }, { label: 'DF', value: `${df}` }] } },
  description: 'Chi-square goodness-of-fit test compares observed frequencies to expected frequencies.',
  formula: 'χ² = Σ((Oᵢ - Eᵢ)² / Eᵢ) with df = k - 1',
  interpretation: 'A large χ² indicates poor fit. Expected frequencies should be ≥ 5 for each category for the test to be valid.'
}

export default calcDef
