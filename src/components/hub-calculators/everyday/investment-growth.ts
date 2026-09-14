import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ principal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), years: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), monthly: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  defaults: { principal: '10000', rate: '8', years: '30', monthly: '500' },
  presets: [
    { label: 'Retirement (30yr)', values: { principal: '25000', rate: '8', years: '30', monthly: '500' } },
    { label: 'College Fund (18yr)', values: { principal: '5000', rate: '7', years: '18', monthly: '200' } },
    { label: 'Short Term (5yr)', values: { principal: '50000', rate: '5', years: '5', monthly: '1000' } },
  ],
  fields: [
    { name: 'principal', label: 'Initial Investment ($)', type: 'number', min: 0, step: '100' },
    { name: 'monthly', label: 'Monthly Contribution ($)', type: 'number', min: 0, step: '50' },
    { name: 'rate', label: 'Annual Return Rate (%)', type: 'number', min: 0.1, step: '0.5' },
    { name: 'years', label: 'Years', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const P = parseFloat(v.principal)||0; const R = parseFloat(v.rate)||0; const Y = parseFloat(v.years)||0; const M = parseFloat(v.monthly)||0
    const r = R / 100 / 12
    const n = Y * 12
    const fv = P * Math.pow(1 + r, n) + M * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
    const totalContrib = P + M * n
    const earnings = fv - totalContrib
    return { result: fv, label: 'Future Value', unit: '$', steps: [
      { label: '1. Monthly Rate', value: `${R}% / 12 = ${(r * 100).toFixed(4)}%` },
      { label: '2. Total Months', value: `${Y} years × 12 = ${n} months` },
      { label: '3. Total Contributions', value: `$${P.toFixed(0)} + ($${M.toFixed(0)} × ${n}) = $${totalContrib.toFixed(0)}` },
      { label: '4. Compound on Principal', value: `$${P.toFixed(0)} × (1.${(r*100).toFixed(4).split('.')[0]})^${n} = $${(P * Math.pow(1 + r, n)).toFixed(0)}` },
      { label: '5. Total Future Value', value: `$${fv.toFixed(0)}` },
      { label: '6. Earnings (Growth)', value: `$${fv.toFixed(0)} - $${totalContrib.toFixed(0)} = $${earnings.toFixed(0)}` },
    ] ,
    extras: [
      { label: 'Rule of 72', value: `At ${R}% return, money doubles every ${(72 / R).toFixed(1)} years (72 ÷ ${R}). Your $${P.toFixed(0)} would become ~$${(P * Math.pow(2, Math.floor(72/R))).toFixed(0)} in ${Math.floor(72/R)} years.` },
      { label: 'Inflation Impact', value: 'At 3% inflation, $1 today is worth $0.42 in 30 years. Real return = nominal return − inflation. If you earn 8% and inflation is 3%, real return is 4.85%.' },
      { label: 'Early Start Advantage', value: 'Starting at 25 vs 35 with $500/mo at 8%: at 65, $1,745,000 vs $745,000 — the 10-year head start is worth $1,000,000. Time is your greatest asset.' },
      { label: 'Tax-Advantaged Accounts', value: '401(k): $23,000/yr (2024) + employer match 3-6%. IRA: $7,000/yr. Roth IRA: after-tax contributions, tax-free withdrawals. HSA: triple tax-free for medical expenses.' },
      { label: 'Dollar Cost Averaging', value: 'Investing a fixed amount monthly (DCA) reduces timing risk. In volatile markets, DCA buys more shares when prices are low. Studies show DCA beats lump sum 40-60% of the time.' },
      { label: 'S&P 500 Historical Returns', value: 'Average annual return (1957-2023): ~10.3%. Best year: +38% (1995). Worst: -38% (2008). 5-year rolling returns: -2% to +28%. Stay invested through downturns.' },
      { label: 'Compound Growth Visual', value: 'The first $100K is the hardest — then compounding accelerates. At 8%, $500/mo reaches $100K in ~11 years, $500K in ~25 years, $1M in ~33 years.' },
      { label: 'Rebalancing Strategy', value: 'Rebalance portfolio annually to target allocation. Example: 70% stocks / 30% bonds. Stocks grow faster → sell some stocks, buy bonds. Rebalancing improves risk-adjusted returns by 0.5-1%/yr.' },
    ]}
  },
  description: 'Project the future value of an investment with compound interest and recurring monthly contributions. Uses future value of annuity formula with monthly compounding.',
  formula: 'FV = PV×(1+r)^n + PMT×[((1+r)^n−1)/r]×(1+r) where r = AnnualRate/12/100, n = Years×12. Total = Contributions + Growth. Rule of 72: Years to Double = 72 / Rate.',
  interpretation: 'Higher returns and earlier contributions dramatically increase final value due to compound interest. $10,000 initial + $500/mo at 8% for 30 years = ~$788,000 ($190K contributed, $598K growth). Start early — delaying 10 years costs $1,000,000+ in potential growth. Use tax-advantaged accounts (401k, IRA) to maximize returns.'
}

export default calcDef
