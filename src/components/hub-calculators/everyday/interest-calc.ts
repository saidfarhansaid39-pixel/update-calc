import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ principal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), years: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  defaults: { principal: '10000', rate: '7', years: '10' },
  presets: [
    { label: '10K @ 7% / 10yr', values: { principal: '10000', rate: '7', years: '10' } },
    { label: 'Savings Account ($10K @ 4%)', values: { principal: '10000', rate: '4', years: '5' } },
    { label: 'Long Term ($50K @ 9%)', values: { principal: '50000', rate: '9', years: '30' } },
  ],
  fields: [
    { name: 'principal', label: 'Principal ($)', type: 'number', min: 1, step: '500' },
    { name: 'rate', label: 'Annual Interest Rate (%)', type: 'number', min: 0.1, step: '0.5' },
    { name: 'years', label: 'Time (years)', type: 'number', min: 0.5, step: '1' },
  ],
  compute: (v) => { const p = parseFloat(v.principal)||0; const r = parseFloat(v.rate)||0 / 100; const y = parseFloat(v.years)||0; const simpleInterest = p * r * y; const simpleTotal = p + simpleInterest; const compoundTotal = p * Math.pow(1 + r, y); const compoundInterest = compoundTotal - p; const monthlySimple = simpleInterest / (y * 12); return { result: simpleInterest, label: 'Simple Interest', unit: '$', steps: [
    { label: '1. Simple Interest Formula', value: `I = $${p.toFixed(0)} × ${(r*100).toFixed(1)}% × ${y}yr` },
    { label: '2. Simple Interest Earned', value: `$${p.toFixed(0)} × ${(r).toFixed(4)} × ${y} = $${simpleInterest.toFixed(2)}` },
    { label: '3. Simple Total', value: `$${p.toFixed(0)} + $${simpleInterest.toFixed(2)} = $${simpleTotal.toFixed(2)}` },
    { label: '4. Compound Total Formula', value: `A = $${p.toFixed(0)} × (1 + ${(r).toFixed(4)})^${y}` },
    { label: '5. Compound Total', value: `$${p.toFixed(0)} × ${(Math.pow(1+r, y)).toFixed(4)} = $${compoundTotal.toFixed(2)}` },
    { label: '6. Compound Interest', value: `$${compoundTotal.toFixed(2)} - $${p.toFixed(0)} = $${compoundInterest.toFixed(2)}` },
    { label: '7. Compounding Advantage', value: `Compound interest exceeds simple by $${(compoundInterest - simpleInterest).toFixed(2)}` },
  ] ,
    extras: [
      { label: 'Compounding Frequency', value: 'Annual compounding: $10,000 at 7% for 30yr = $76,123. Monthly: $81,330. Daily: $82,319. More frequent compounding increases returns but differences narrow above monthly.' },
      { label: 'Rule of 72', value: `At ${parseFloat(v.rate)}%, money doubles every ${(72 / parseFloat(v.rate)).toFixed(1)} years (72 ÷ ${parseFloat(v.rate)}). At 7%, doubling every 10.3 years. At 10%, every 7.2 years.` },
      { label: 'Simple vs Compound', value: 'Simple interest: same amount earned each year ($700/yr on $10K at 7%). Compound: interest earns interest — year 1: $700, year 10: $1,345, year 20: $2,675, year 30: $5,329.' },
      { label: 'Real Interest = Nominal - Inflation', value: 'If you earn 7% and inflation is 3%, real return is 3.88% (1.07/1.03 − 1). After 30 years at 7%, $10K buys $76,123 — but adjusted for 3% inflation, real value is ~$31,500.' },
      { label: 'Bond vs Stock Returns', value: 'US Treasury (10yr): ~4-5% annually. S&P 500 (long-term avg): ~10%. Savings account: 0.5-5%. High-yield savings: 4-5% (2024). CDs: 4-5.5% for 1yr.' },
      { label: 'Tax Impact on Interest', value: 'Interest income is taxed as ordinary income (up to 37% federal + state). Tax-exempt municipal bonds earn 3-4% tax-free. A 7% taxable bond = 4.9% after 30% tax bracket.' },
      { label: 'Compound Growth Visual', value: `$${(p).toFixed(0)} at ${parseFloat(v.rate)}% over ${parseFloat(v.years)}yr: total = $${compoundTotal.toFixed(2)}. Earnings: $${(compoundInterest).toFixed(2)} (${(compoundInterest / compoundTotal * 100).toFixed(0)}% of final value).` },
      { label: 'The Cost of Waiting', value: 'Starting 10 years later dramatically reduces final value: $10K at 7% for 30yr = $76,123. For 20yr = $38,697. Half the time = half the growth (actually less due to compounding).' },
    ]} },
  description: 'Calculate both simple and compound interest on any principal amount. Compare how compounding accelerates growth over time with the Rule of 72 and frequency impact.',
  formula: 'Simple Interest = P × r × t. Simple Total = P + I. Compound Total = P × (1+r)^t. Compound Interest = Total − P. Rule of 72: Years to Double = 72 / Rate.',
  interpretation: 'Compounding is the most powerful force in finance. At 7% over 30 years, $10,000 grows to $76,123 (compounded annually) vs $31,000 (simple) — the compounding bonus is $45,123. The longer the time horizon, the more dramatic the compounding effect. Start early and let time work for you.'
}

export default calcDef
