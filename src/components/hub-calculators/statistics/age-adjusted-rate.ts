import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ageGroups: z.string().min(1, 'Required'), rates: z.string().min(1, 'Required'), stdPop: z.string().min(1, 'Required') }),
  fields: [{ name: 'ageGroups', label: 'Age Group Labels (comma separated)', type: 'number', step: 'any' }, { name: 'rates', label: 'Crude Rates per group (comma separated)', type: 'number', step: 'any' }, { name: 'stdPop', label: 'Standard Population (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const rates = parseList(v.rates); const stdPop = parseList(v.stdPop); if (rates.length !== stdPop.length || rates.length < 1) return { result: 'Mismatched lengths', label: '', unit: '', steps: [] }; const totalStd = stdPop.reduce((a, b) => a + b, 0); const adjRate = rates.reduce((acc, r, i) => acc + r * stdPop[i], 0) / totalStd; return { result: adjRate, label: 'Age-Adjusted Rate', unit: 'per 100k', steps: [{ label: 'Total std pop', value: `${totalStd}` }, { label: 'Weighted sum', value: `${rates.reduce((acc, r, i) => acc + r * stdPop[i], 0).toFixed(4)}` }, { label: 'Adj rate per 100k', value: `${adjRate.toFixed(4)}` }] } },
  description: 'Age-adjusted rate uses direct standardization to compare rates across populations with different age distributions.',
  formula: 'Adjusted Rate = Σ(rᵢ × wᵢ) / Σwᵢ, where wᵢ = standard population weights',
  interpretation: 'Age adjustment removes confounding by age. The adjusted rate represents what the rate would be if the population had the standard age distribution.'
}

export default calcDef
