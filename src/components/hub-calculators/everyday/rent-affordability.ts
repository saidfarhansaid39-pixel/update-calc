import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ monthlyIncome: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), monthlyDebts: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), rulePct: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), utilities: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'monthlyIncome', label: 'Monthly Gross Income ($)', type: 'number', min: 500, step: '500' },
    { name: 'monthlyDebts', label: 'Monthly Debt Payments ($)', type: 'number', min: 0, step: '50' },
    { name: 'rulePct', label: 'Max Rent % of Income', type: 'number', min: 10, max: 50, step: '5' },
    { name: 'utilities', label: 'Estimated Utilities ($)', type: 'number', min: 0, step: '50' },
  ],
  defaults: { monthlyIncome: '5000', monthlyDebts: '500', rulePct: '30', utilities: '200' },
  presets: [
    { label: 'Starter Salary (30% rule)', values: { monthlyIncome: '3500', monthlyDebts: '200', rulePct: '30', utilities: '150' } },
    { label: 'Mid-Career (28% rule)', values: { monthlyIncome: '6000', monthlyDebts: '800', rulePct: '28', utilities: '250' } },
    { label: 'High Earner Conservative', values: { monthlyIncome: '10000', monthlyDebts: '1500', rulePct: '25', utilities: '300' } },
  ],
  compute: (v) => {
    const maxRent = v.monthlyIncome * (v.rulePct / 100)
    const afterDebts = maxRent - v.monthlyDebts
    const afterUtilities = afterDebts - v.utilities
    const safeRent = Math.max(0, afterDebts)
    const backEndRatio = ((safeRent + v.monthlyDebts) / v.monthlyIncome) * 100
    return { result: safeRent, label: 'Affordable Rent', unit: '$', steps: [{ label: 'Monthly Gross Income', value: `$${v.monthlyIncome.toFixed(0)}` }, { label: `Max Rent (${v.rulePct}% of income)`, value: `$${v.monthlyIncome.toFixed(0)} × ${v.rulePct}% = $${maxRent.toFixed(0)}` }, { label: 'Subtract Monthly Debts', value: `$${maxRent.toFixed(0)} - $${v.monthlyDebts.toFixed(0)} = $${afterDebts.toFixed(0)}` }, { label: 'Subtract Utilities', value: `$${afterDebts.toFixed(0)} - $${v.utilities.toFixed(0)} = $${afterUtilities.toFixed(0)}` }, { label: 'Safe Rent (shell)', value: `$${safeRent.toFixed(0)}/month` }, { label: 'Annual Income Needed', value: `$${(v.monthlyIncome * 12).toFixed(0)}/year` }, { label: 'Back-End DTI Ratio', value: `${backEndRatio.toFixed(0)}% (recommended ≤36%)` }] ,
    extras: [
      { label: 'The 30% Rule Explained', value: 'The 30% rule (spend ≤30% of gross income on housing) originated from 1969 US public housing policy. Modern financial advisors suggest 25-33% depending on your debt load. In high-cost cities (NYC, SF, LA), 40-50% is common but risky. The lower your rent %, the more you can save for financial goals.' },
      { label: 'Front-End vs Back-End DTI', value: 'Front-end DTI (this calculator): rent only ÷ income. Back-end DTI: (rent + all debts) ÷ income. Most landlords want front-end ≤30% and back-end ≤36% for standard approval. FHA loans allow back-end up to 43%. Over 50% back-end: high risk of missed payments.' },
      { label: 'Landlord Income Requirements', value: 'Most landlords require gross monthly income of 3× the rent. For a $1,500 apartment: need $4,500/month ($54,000/year). Some accept 2.5× with good credit. Self-employed: 2 years of tax returns. Students: co-signer or 6 months prepaid. Credit score minimum: usually 620-650.' },
      { label: 'Utility Cost Realities', value: 'Utilities add $100-400/month beyond rent: electric $50-150, gas $20-80, water/sewer $30-80, internet $50-80, trash $15-35. Some apartments include water/trash (check the lease). Budget $150-250/month for a 1BR, $200-350 for a 2-3BR house. Always ask about average utility costs before signing.' },
      { label: 'Hidden Rental Costs', value: 'Beyond rent + utilities: renters insurance ($15-30/month), parking ($50-300/month), pet fees ($25-100/month + $200-500 deposit), application fees ($30-75 each), security deposit (1-2 months rent), broker fee (NYC: 12-15% of annual rent). Factor these into total housing budget — they can add 10-20%.' },
      { label: 'Salary Needed for Rent', value: 'To afford $X/month rent at 30%: need $X ÷ 0.30 = monthly income. Examples: $1,000 rent → $3,333/mo ($40K/yr). $1,500 → $5,000/mo ($60K/yr). $2,000 → $6,667/mo ($80K/yr). $2,500 → $8,333/mo ($100K/yr). $3,000 → $10,000/mo ($120K/yr). Use these benchmarks for career planning.' },
      { label: 'Rent vs Income Trends', value: 'As of 2024: US median rent is $1,700 (30% = $5,667/mo or $68K/yr needed). Median household income: $75K. Gap: in 47 of 50 largest US cities, median rent exceeds the 30% guideline for median income households. Roommates or higher income are often necessary in expensive metros.' },
    ]}
  },
  description: 'Determine affordable monthly rent based on gross income, existing debts, and estimated utilities using the percentage-based rule. Get front-end and back-end DTI ratios for comprehensive affordability analysis.',
  formula: 'MaxRent = MonthlyIncome × (RulePct% ÷ 100). AffordableRent = MaxRent - MonthlyDebts. AfterUtilities = MaxRent - MonthlyDebts - Utilities. BackEndDTI = (AffordableRent + MonthlyDebts) ÷ MonthlyIncome × 100.',
  interpretation: 'With a $5,000/month gross income ($60K/yr), $500 in debts, and the 30% rule: max rent = $1,500. After debts: $1,000/month affordable rent. After $200 utilities: $800 for rent before utilities — meaning you can afford a $1,000/month apartment (rent + utilities = $1,200 = 24% of income, leaving $300 for other housing costs). Back-end DTI = (1,000 + 500) ÷ 5,000 = 30% — below the 36% maximum that most lenders prefer. This leaves some room for a car payment or credit card minimum increase. If you find a $1,200 apartment, your rent + utilities = $1,400 = 28% of income — still within guidelines, but total housing + debts = $1,900 = 38% — borderline high.'
}

export default calcDef
