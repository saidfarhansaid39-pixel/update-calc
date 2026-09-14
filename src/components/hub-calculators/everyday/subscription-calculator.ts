import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ monthlyFee: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), annualFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), yearsSubscribed: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), priceIncreasePct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'monthlyFee', label: 'Monthly Fee ($)', type: 'number', min: 1, step: '5' },
    { name: 'annualFee', label: 'Annual Fee ($)', type: 'number', min: 0, step: '10' },
    { name: 'yearsSubscribed', label: 'Years Subscribed', type: 'number', min: 1, step: '1' },
    { name: 'priceIncreasePct', label: 'Annual Price Increase (%)', type: 'number', min: 0, step: '1' },
  ],
  defaults: { monthlyFee: '15.99', annualFee: '0', yearsSubscribed: '3', priceIncreasePct: '5' },
  presets: [
    { label: 'Streaming Bundle', values: { monthlyFee: '15', annualFee: '0', yearsSubscribed: '5', priceIncreasePct: '8' } },
    { label: 'Gym Membership', values: { monthlyFee: '50', annualFee: '99', yearsSubscribed: '2', priceIncreasePct: '3' } },
    { label: 'Software SaaS', values: { monthlyFee: '30', annualFee: '0', yearsSubscribed: '3', priceIncreasePct: '10' } },
    { label: 'Insurance Premium', values: { monthlyFee: '120', annualFee: '0', yearsSubscribed: '10', priceIncreasePct: '6' } },
  ],
  compute: (v) => {
    let total = 0
    let monthlyBilling = 0
    let annualBilling = 0
    for (let y = 0; y < v.yearsSubscribed; y++) {
      const increase = Math.pow(1 + v.priceIncreasePct / 100, y)
      monthlyBilling = v.monthlyFee * 12 * increase
      annualBilling = v.annualFee * (y === 0 ? 1 : increase)
      total += monthlyBilling + annualBilling
    }
    const avgMonthly = total / (v.yearsSubscribed * 12)
    return { result: avgMonthly, label: 'Average Monthly Cost', unit: '$', steps: [{ label: 'Total Over Period', value: `$${total.toFixed(2)}` }, { label: 'Avg per Month', value: `$${avgMonthly.toFixed(2)}` }, { label: 'Years', value: `${v.yearsSubscribed}` }, { label: 'Includes Price Hikes', value: `${v.priceIncreasePct}%/yr` }] ,
    extras: [
      { label: 'Long-Term Cost Impact', value: 'A $15/mo service with 8% annual increases costs $981 over 5 years — $196 more than if prices stayed flat' },
      { label: 'Annual Billing Advantage', value: 'Annual billing typically saves 10-20% vs monthly. A $15/mo plan billed annually at $154 saves $26/year' },
      { label: 'Subscription Creep', value: 'The average American spends $200-300/mo on subscriptions. A quarterly audit of all active subscriptions can save $30-50/mo' },
      { label: 'Price Hike Patterns', value: 'Most subscription services raise prices 5-10% annually. Services like Netflix, Spotify, and gyms typically increase every 12-18 months' },
      { label: 'Introductory Pricing Trap', value: 'Many services offer low intro rates (50% off for 6-12 months) that then jump to full price. Factor this into your long-term cost' },
      { label: 'Family/Group Plans', value: 'Many services offer family plans for 2-6 people at 1.5-2x the individual price — can save 30-50% per person vs individual plans' },
      { label: 'Student/Military Discounts', value: 'Student discounts: Spotify+Hulu $4.99, Amazon Prime $7.49/mo, Apple Music $5.99. Military/veteran discounts available on most platforms' },
    ]}
  },
  description: 'Calculate the true long-term cost of subscription services including monthly and annual fees with compounding annual price increases over multiple years.',
  formula: 'Total = Σ[Year=0 to N−1] (MonthlyFee × 12 + AnnualFee) × (1 + Increase%)^Year. AvgMonthly = Total ÷ (Years × 12).',
  interpretation: 'Subscription inflation compounds significantly: a $15/mo service with 8% annual increases costs 37% more in year 5 than year 1. Over 10 years, that same service costs $2,650 total vs $1,800 without increases. Always check historical price trends before committing to long subscriptions. The average US household now spends $273/mo on subscriptions — up 40% from 2019. Annual billing and family plans remain the best ways to mitigate costs.'
}

export default calcDef
