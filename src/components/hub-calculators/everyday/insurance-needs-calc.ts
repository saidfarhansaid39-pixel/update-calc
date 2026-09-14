import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ annualIncome: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), yearsNeeded: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), currentSavings: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), debts: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  defaults: { annualIncome: '75000', yearsNeeded: '10', currentSavings: '50000', debts: '250000' },
  presets: [
    { label: 'Family w/ Mortgage', values: { annualIncome: '100000', yearsNeeded: '10', currentSavings: '100000', debts: '350000' } },
    { label: 'Single w/ Student Debt', values: { annualIncome: '65000', yearsNeeded: '5', currentSavings: '20000', debts: '50000' } },
    { label: 'Dual Income, No Kids', values: { annualIncome: '150000', yearsNeeded: '5', currentSavings: '200000', debts: '150000' } },
  ],
  fields: [
    { name: 'annualIncome', label: 'Annual Income ($)', type: 'number', min: 10000, step: '10000' },
    { name: 'yearsNeeded', label: 'Years of Income to Replace', type: 'number', min: 1, step: '1' },
    { name: 'currentSavings', label: 'Current Savings ($)', type: 'number', min: 0, step: '10000' },
    { name: 'debts', label: 'Outstanding Debts ($)', type: 'number', min: 0, step: '5000' },
  ],
  compute: (v) => { const inc = parseFloat(v.annualIncome)||0; const yrs = parseFloat(v.yearsNeeded)||0; const save = parseFloat(v.currentSavings)||0; const debt = parseFloat(v.debts)||0; const incomeReplacement = inc * yrs; const totalNeed = incomeReplacement + debt - save; return { result: totalNeed, label: 'Life Insurance Needed', unit: '$', steps: [
    { label: '1. Income Replacement', value: `$${inc.toFixed(0)} × ${yrs} yr = $${incomeReplacement.toFixed(0)}` },
    { label: '2. Add Outstanding Debts', value: `+ $${debt.toFixed(0)} (mortgage, loans, credit cards)` },
    { label: '3. Subtract Current Savings', value: `- $${save.toFixed(0)} (existing coverage)` },
    { label: '4. Total Coverage Needed', value: `$${totalNeed.toFixed(0)}` },
    { label: '5. Rule of Thumb', value: `$${totalNeed.toFixed(0)} = ${(totalNeed / inc).toFixed(1)}× annual income` },
  ] ,
    extras: [
      { label: 'Rule of Thumb: 10-12× Income', value: `At $${inc.toFixed(0)}/yr, 10-12× = $${(inc*10).toFixed(0)}-$${(inc*12).toFixed(0)}. Your need of $${totalNeed.toFixed(0)} is ${(totalNeed/inc).toFixed(1)}×.` },
      { label: 'Term Life vs Whole Life', value: 'Term life: 10-30 year coverage, cheapest option. $500K term for 30yr: $30-50/mo for healthy 30yr-old. Whole life: permanent, 10-20× more expensive. Term + invest the difference wins financially.' },
      { label: 'Mortgage Protection', value: 'Consider enough coverage to pay off the mortgage entirely. Average US mortgage: $250K-400K. Mortgage protection insurance is overpriced — a standard term policy is cheaper and more flexible.' },
      { label: 'College Costs', value: 'Add $100,000-200,000 per child for college if you want coverage to include education. 529 plans reduce the coverage gap. 4-year public: ~$100K (2024). Private: ~$200K+.' },
      { label: 'Stay-at-Home Parent Value', value: 'SAHP provides $50,000-100,000/yr of unpaid labor (childcare, cleaning, cooking, logistics). Insure SAHP for $250K-500K to cover replacement services.' },
      { label: 'Employer Life Insurance', value: 'Employer-provided: typically 1-2× salary, free or cheap. But you lose it if you leave. Supplement with an individual policy. Portability varies — check your plan.' },
      { label: 'Health Factors Matter', value: 'Rates depend on age, health, BMI, smoking status. A 30yr-old healthy non-smoker: $30-50/mo for $500K/30yr. A 50yr-old: $100-200/mo. Smokers pay 2-4× more.' },
      { label: 'Re-evaluate Every 5 Years', value: 'Review coverage after major life events: marriage, divorce, children, mortgage, job change, inheritance. Your insurance needs decrease as savings grow and debts shrink.' },
    ]} },
  description: 'Estimate life insurance coverage needs based on income replacement, debts, and existing savings. Uses the DIME (Debt, Income, Mortgage, Education) method plus savings adjustment.',
  formula: 'Coverage = (Annual Income × Years to Replace) + Debts − Savings. Standard rule: 10-12× annual income. DIME method: Debt + Income×Years + Mortgage + Education − Savings.',
  interpretation: 'Standard rule: 10-12× annual income in term life coverage. A $75K earner with $250K mortgage and $50K savings needs ~$900K (10 yr × $75K + $250K − $50K). Term life is the most cost-effective option — a 30yr-old healthy non-smoker pays ~$30-50/mo for $500K coverage. Re-evaluate every 5 years or after major life changes.'
}

export default calcDef
