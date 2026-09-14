import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ currentBalance: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), monthlyContrib: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), returnRate: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 30, '0-30'), yearsUntil: z.string().min(1, 'Required').refine(v => parseInt(v) > 0 && parseInt(v) <= 25, '1-25'), stateTaxDed: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 15, '0-15') }),
  fields: [{ name: 'currentBalance', label: 'Current 529 Balance ($)', type: 'number', min: 0, step: '100' }, { name: 'monthlyContrib', label: 'Monthly Contribution ($)', type: 'number', min: 0, step: '50' }, { name: 'returnRate', label: 'Expected Annual Return (%)', type: 'number', min: 0, max: 30, step: '0.1' }, { name: 'yearsUntil', label: 'Years Until Withdrawal', type: 'number', min: 1, max: 25, step: '1' }, { name: 'stateTaxDed', label: 'State Tax Deduction Rate (%)', type: 'number', min: 0, max: 15, step: '0.5' }],
  defaults: { currentBalance: '5000', monthlyContrib: '200', returnRate: '6', yearsUntil: '15', stateTaxDed: '5' },
  presets: [
    { label: 'Newborn Saver (18 yr)', values: { currentBalance: '0', monthlyContrib: '150', returnRate: '7', yearsUntil: '18', stateTaxDed: '5' } },
    { label: 'Age-10 Catch-Up', values: { currentBalance: '12000', monthlyContrib: '400', returnRate: '6', yearsUntil: '8', stateTaxDed: '0' } },
    { label: 'Grandparent Gift Plan', values: { currentBalance: '10000', monthlyContrib: '100', returnRate: '5', yearsUntil: '12', stateTaxDed: '7' } },
    { label: 'Two-Child Max', values: { currentBalance: '25000', monthlyContrib: '500', returnRate: '7', yearsUntil: '10', stateTaxDed: '5' } },
    { label: 'Late Start Aggressive', values: { currentBalance: '50000', monthlyContrib: '1000', returnRate: '8', yearsUntil: '5', stateTaxDed: '3' } },
  ],
  compute: (v) => { const cb = parseFloat(v.currentBalance) || 0; const mc = parseFloat(v.monthlyContrib) || 0; const rr = parseFloat(v.returnRate) || 0; const y = parseInt(v.yearsUntil) || 1; const std = parseFloat(v.stateTaxDed) || 0; const mr = rr / 100 / 12; const m = y * 12; let fv = cb; if (mr > 0) fv = cb * Math.pow(1 + mr, m) + mc * ((Math.pow(1 + mr, m) - 1) / mr); else fv = cb + mc * m; const annualTaxSavings = mc * 12 * (std / 100); return { result: fv, label: 'Projected 529 Value', unit: '$', steps: [{ label: 'Current 529 plan balance', value: `$${cb.toFixed(2)}` }, { label: 'Total contributions over savings period', value: `$${(cb + mc * m).toFixed(2)}` }, { label: 'Projected 529 plan value at withdrawal', value: `$${fv.toFixed(2)}` }, { label: 'Estimated annual state tax savings', value: `$${annualTaxSavings.toFixed(2)}` }] ,
    extras: [
      { label: 'Strategy Note', value: 'Many states offer a state income tax deduction for 529 contributions (typically $2k–$10k per beneficiary per year). Front-loading contributions maximizes compound growth.' },
      { label: 'Tax Consideration', value: 'Earnings grow federal tax-free. Qualified withdrawals for tuition, room, board, and fees are tax-free. The SECURE Act expanded 529 use for apprenticeship programs.' },
      { label: 'Risk Note', value: '529 plans can reduce financial aid eligibility (up to 5.64% of parental assets). Market downturns near college age can significantly reduce balances — consider age-based glide paths.' },
      { label: 'Comparison', value: 'Vs. prepaid tuition plan: savings plans are more flexible (any school, any state) but risk market volatility. Vs. UTMA/UGMA: 529 has less impact on financial aid.' },
      { label: 'Real-World Example', value: 'Starting with $5k, adding $200/mo at 6% for 15 years = ~$63k. With 5% state tax deduction on $2,400/yr contributions, save $120/yr in state taxes too.' },
    ]} },
  description: 'A 529 savings plan is a tax-advantaged education savings vehicle. Earnings grow tax-free and withdrawals for qualified education expenses are tax-free.',
  formula: 'FV = PV(1+r)^n + PMT × ((1+r)^n - 1)/r | State tax deduction = contributions × state rate',
  interpretation: '529 plans offer federal tax-free growth and often state tax deductions. The earlier you start and the higher the return, the more your education savings grow tax-free.'
}

export default calcDef
