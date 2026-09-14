import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ collegeCost: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'), currentSavings: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), monthlyContrib: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), expectedReturn: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 30, '0-30'), yearsUntil: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0 && parseInt(v) <= 25, '0-25') }),
  fields: [{ name: 'collegeCost', label: 'Estimated College Cost ($)', type: 'number', min: 0, step: '1000' }, { name: 'currentSavings', label: 'Current Savings ($)', type: 'number', min: 0, step: '100' }, { name: 'monthlyContrib', label: 'Monthly Contribution ($)', type: 'number', min: 0, step: '50' }, { name: 'expectedReturn', label: 'Expected Return (%)', type: 'number', min: 0, max: 30, step: '0.1' }, { name: 'yearsUntil', label: 'Years Until College', type: 'number', min: 0, max: 25, step: '1' }],
  defaults: { collegeCost: '50000', currentSavings: '10000', monthlyContrib: '200', expectedReturn: '6', yearsUntil: '10' },
  presets: [
    { label: 'Newborn Starter (18 years)', values: { collegeCost: '60000', currentSavings: '0', monthlyContrib: '150', expectedReturn: '7', yearsUntil: '18' } },
    { label: 'Mid-Start Age 8', values: { collegeCost: '80000', currentSavings: '15000', monthlyContrib: '300', expectedReturn: '6', yearsUntil: '10' } },
    { label: 'Late Start Age 14', values: { collegeCost: '100000', currentSavings: '20000', monthlyContrib: '500', expectedReturn: '5', yearsUntil: '4' } },
    { label: 'Grandparent Gift Fund', values: { collegeCost: '40000', currentSavings: '25000', monthlyContrib: '100', expectedReturn: '6', yearsUntil: '8' } },
    { label: 'Aggressive Max-Out', values: { collegeCost: '120000', currentSavings: '50000', monthlyContrib: '800', expectedReturn: '8', yearsUntil: '12' } },
  ],
  compute: (v) => { const cost = parseFloat(v.collegeCost) || 0; const cs = parseFloat(v.currentSavings) || 0; const mc = parseFloat(v.monthlyContrib) || 0; const rr = parseFloat(v.expectedReturn) || 0; const y = parseInt(v.yearsUntil) || 1; const mr = rr / 100 / 12; const m = y * 12; let fv = cs; if (mr > 0) fv = cs * Math.pow(1 + mr, m) + mc * ((Math.pow(1 + mr, m) - 1) / mr); else fv = cs + mc * m; const gap = Math.max(0, cost - fv); return { result: fv, label: 'Projected College Fund', unit: '$', steps: [{ label: 'Estimated college cost', value: `$${cost.toFixed(2)}` }, { label: 'Current 529 savings balance', value: `$${cs.toFixed(2)}` }, { label: 'Projected savings at college start', value: `$${fv.toFixed(2)}` }, { label: 'Remaining funding gap', value: `$${gap.toFixed(2)}` }, { label: 'Funding status', value: fv >= cost ? 'On track!' : 'Underfunded — consider increasing contributions' }] ,
    extras: [
      { label: 'Strategy Note', value: 'Start early to maximize compound growth. Even $100/mo from birth at 7% grows to ~$42k by age 18. Many states offer tax deductions for 529 contributions.' },
      { label: 'Tax Consideration', value: 'Earnings grow federal tax-free and withdrawals for qualified education expenses are tax-free. State tax deductions vary — some offer $5k–$10k deduction per beneficiary.' },
      { label: 'Risk Note', value: '529 funds count as parental assets for FAFSA (up to 5.64%), reducing aid eligibility less than student-owned accounts. Non-qualified withdrawals face 10% penalty + income tax on earnings.' },
      { label: 'Comparison', value: 'Vs. prepaid tuition plan: 529 savings plans offer more flexibility (any school, any state) but no tuition rate lock. Vs. Coverdell ESA: higher limits ($235k vs. $2k).' },
      { label: 'Real-World Example', value: 'Starting with $10k at birth, adding $200/mo at 6% return → $84k by age 18. At a $50k/yr public university (4 yr = $200k), still need scholarships or other funding.' },
    ]} },
  description: '529 college savings calculator helps you determine if your current savings and contributions will cover future education costs.',
  formula: 'FV = PV(1+r)^n + PMT × ((1+r)^n - 1)/r | Gap = Cost - Projected Value',
  interpretation: 'Compare your projected 529 savings against estimated college costs. If there is a gap, consider increasing contributions or exploring other education funding options.'
}

export default calcDef
