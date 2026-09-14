import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ afterTaxIncome: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'), needsPct: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 100, '0-100'), wantsPct: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 100, '0-100'), savingsPct: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 100, '0-100') }),
  fields: [{ name: 'afterTaxIncome', label: 'After-Tax Monthly Income ($)', type: 'number', min: 0, step: '100' }, { name: 'needsPct', label: 'Needs (%)', type: 'number', min: 0, max: 100, step: '1' }, { name: 'wantsPct', label: 'Wants (%)', type: 'number', min: 0, max: 100, step: '1' }, { name: 'savingsPct', label: 'Savings/Debt (%)', type: 'number', min: 0, max: 100, step: '1' }],
  defaults: { afterTaxIncome: '5000', needsPct: '50', wantsPct: '30', savingsPct: '20' },
  presets: [
    { label: 'Single Renter (City)', values: { afterTaxIncome: '4200', needsPct: '55', wantsPct: '25', savingsPct: '20' } },
    { label: 'Family of Four', values: { afterTaxIncome: '7500', needsPct: '60', wantsPct: '20', savingsPct: '20' } },
    { label: 'High-Income Maximizer', values: { afterTaxIncome: '15000', needsPct: '40', wantsPct: '25', savingsPct: '35' } },
    { label: 'Debt Repayment Focus', values: { afterTaxIncome: '5000', needsPct: '50', wantsPct: '15', savingsPct: '35' } },
    { label: 'Student Budget', values: { afterTaxIncome: '2800', needsPct: '55', wantsPct: '30', savingsPct: '15' } },
  ],
  compute: (v) => { const inc = parseFloat(v.afterTaxIncome) || 0; const np = parseFloat(v.needsPct) || 50; const wp = parseFloat(v.wantsPct) || 30; const sp = parseFloat(v.savingsPct) || 20; const needs = inc * (np / 100); const wants = inc * (wp / 100); const savings = inc * (sp / 100); const total = needs + wants + savings; const balance = inc - total; const isIdeal = Math.abs(np - 50) <= 5 && Math.abs(wp - 30) <= 5 && Math.abs(sp - 20) <= 5; return { result: needs, label: 'Needs Budget', unit: '$', steps: [{ label: 'After-tax monthly income', value: `$${inc.toFixed(2)}` }, { label: 'Needs allocation (housing, food, utilities)', value: `$${needs.toFixed(2)} (${np.toFixed(0)}%)` }, { label: 'Wants allocation (dining, travel, shopping)', value: `$${wants.toFixed(2)} (${wp.toFixed(0)}%)` }, { label: 'Savings & debt repayment', value: `$${savings.toFixed(2)} (${sp.toFixed(0)}%)` }, { label: 'Remaining balance after budget', value: `$${balance.toFixed(2)}`, status: isIdeal ? 'Following 50/30/20!' : 'Adjust percentages' }] ,
    extras: [
      { label: 'Strategy Note', value: 'The 50/30/20 rule is a guideline, not a strict law. High-cost-of-living areas may need 60/20/20. Adjust categories to fit your life while keeping savings at 20%.' },
      { label: 'Tax Consideration', value: 'Use after-tax income for the 50/30/20 calculation. Pre-tax retirement contributions reduce your taxable income and thus lower your "needs" burden.' },
      { label: 'Risk Note', value: 'The 50/30/20 rule does not explicitly build an emergency fund. Ensure the 20% savings category includes 3–6 months of expenses before aggressive investing.' },
      { label: 'Comparison', value: 'Vs. 80/20 rule: simpler (save 20%, spend 80% freely) but less structured. Vs. zero-based budget: more flexible but less precise. Vs. envelope system: less tracking overhead.' },
      { label: 'Real-World Example', value: 'Take-home pay of $5,000/mo → $2,500 needs (rent $1,200 + bills $600 + groceries $700), $1,500 wants, $1,000 savings. Over 30 years at 7%: savings alone grows to $1.1M.' },
    ]} },
  description: 'The 50/30/20 budget rule allocates after-tax income to three categories: 50% for needs, 30% for wants, and 20% for savings and debt repayment.',
  formula: 'Needs = Income × 50% | Wants = Income × 30% | Savings = Income × 20%',
  interpretation: 'The 50/30/20 rule is a simple budgeting framework. Needs include housing, utilities, groceries, and minimum debt payments. Wants are discretionary. Savings includes retirement and emergency fund.'
}

export default calcDef
