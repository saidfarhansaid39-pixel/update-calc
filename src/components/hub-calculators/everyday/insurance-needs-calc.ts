import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ annualIncome: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), yearsNeeded: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), currentSavings: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), debts: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'annualIncome', label: 'Annual Income ($)', type: 'number', min: 10000, step: '10000' },
    { name: 'yearsNeeded', label: 'Years of Income to Replace', type: 'number', min: 1, step: '1' },
    { name: 'currentSavings', label: 'Current Savings ($)', type: 'number', min: 0, step: '10000' },
    { name: 'debts', label: 'Outstanding Debts ($)', type: 'number', min: 0, step: '5000' },
  ],
  compute: (v) => { const inc = parseFloat(v.annualIncome)||0; const yrs = parseFloat(v.yearsNeeded)||0; const save = parseFloat(v.currentSavings)||0; const debt = parseFloat(v.debts)||0; const incomeReplacement = inc * yrs; const totalNeed = incomeReplacement + debt - save; const perSpouse = totalNeed * 0.5; return { result: totalNeed, label: 'Life Insurance Needed', unit: '$', steps: [{ label: 'Income Replacement', value: `$${incomeReplacement.toFixed(0)} (${yrs} yrs × $${inc.toFixed(0)})` }, { label: 'Plus Debts', value: `+$${debt.toFixed(0)}` }, { label: 'Minus Savings', value: `-$${save.toFixed(0)}` }, { label: 'Total Coverage Needed', value: `$${totalNeed.toFixed(0)}` }] } },
  description: 'Estimate life insurance coverage needs based on income replacement, debts, and existing savings. Use for term life insurance planning.',
  formula: 'Coverage = (Annual Income × Years) + Debts − Savings',
  interpretation: 'Standard rule: 10-12× annual income. Adjust for specific needs: college costs, mortgage payoff, special needs dependents. Term insurance is cheaper and recommended for most families.'
}

export default calcDef
