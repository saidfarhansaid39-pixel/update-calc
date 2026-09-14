import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ dailyRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), daysPerWeek: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), additionalFees: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'dailyRate', label: 'Daily Parking Rate ($)', type: 'number', min: 0, step: '2' },
    { name: 'daysPerWeek', label: 'Days Parked per Week', type: 'number', min: 0, step: '1' },
    { name: 'additionalFees', label: 'Additional Monthly Fees ($)', type: 'number', min: 0, step: '10' },
  ],
  defaults: { dailyRate: '25', daysPerWeek: '5', additionalFees: '50' },
  presets: [
    { label: 'Downtown Commuter', values: { dailyRate: '35', daysPerWeek: '5', additionalFees: '75' } },
    { label: 'Suburban Monthly', values: { dailyRate: '12', daysPerWeek: '5', additionalFees: '30' } },
    { label: 'Occasional Driver', values: { dailyRate: '20', daysPerWeek: '2', additionalFees: '10' } },
    { label: 'Premium Garage', values: { dailyRate: '50', daysPerWeek: '5', additionalFees: '150' } },
  ],
  compute: (v) => { const weekly = v.dailyRate * v.daysPerWeek; const monthly = weekly * 4.33 + v.additionalFees; const annual = monthly * 12; const yearlyTotal = weekly * 52 + v.additionalFees * 12; const dailyCost = v.dailyRate; const annualPerDay = annual / (v.daysPerWeek * 52); return { result: annual, label: 'Annual Parking Cost', unit: '$', steps: [
    { label: 'Weekly Base Cost', value: `${v.daysPerWeek} days × $${v.dailyRate.toFixed(2)} = $${weekly.toFixed(2)}` },
    { label: 'Monthly Base (×4.33 weeks)', value: `$${weekly.toFixed(2)} × 4.33 = $${(weekly * 4.33).toFixed(2)}` },
    { label: 'Plus Monthly Fees', value: `$${(weekly * 4.33).toFixed(2)} + $${v.additionalFees.toFixed(2)} = $${monthly.toFixed(2)}` },
    { label: 'Monthly Total', value: `$${monthly.toFixed(2)}` },
    { label: 'Annual Total', value: `$${annual.toFixed(2)}` },
    { label: 'Cost per Parking Day', value: `$${annualPerDay.toFixed(2)}` },
    { label: 'Daily Rate Alone', value: `$${dailyCost.toFixed(2)}/day` },
    { label: 'Annual without Fees', value: `$${(weekly * 52).toFixed(2)}` },
  ] ,
    extras: [
      { label: 'Monthly Pass Breakeven', value: 'If a monthly pass costs less than your monthly total (incl. fees), it saves money.' },
      { label: 'Transit Comparison', value: 'Monthly transit passes average $50-130 vs $500+/mo for daily downtown parking.' },
      { label: 'Tax Deduction', value: 'Employer-provided parking up to $300/month may be tax-free in some jurisdictions.' },
      { label: 'Peak vs Off-Peak', value: 'Many lots charge 30-50% less after 6 PM and on weekends.' },
      { label: 'Parking App Savings', value: 'Apps like SpotHero and ParkWhiz can save 30-60% vs drive-up rates.' },
      { label: 'Yearly Total', value: `$${yearlyTotal.toFixed(2)}` },
    ]} },
  description: 'Calculate total parking costs including daily rates, frequency, and additional monthly fees on a weekly, monthly, and annual basis. Compare parking scenarios to find the most cost-effective option for your commute.',
  formula: 'Annual = (DailyRate × DaysPerWeek × 52) + (AdditionalFees × 12) | Monthly = Weekly × 4.33 + Fees',
  interpretation: 'Downtown parking ranges from $10-50/day. Monthly passes (if available) cost 15-25 base daily rates. A daily downtown parker spending $35/day + $75 fees pays ~$9,860/year — often more than car insurance. Park-and-ride or transit can save $5,000-8,000 annually.'
}

export default calcDef
