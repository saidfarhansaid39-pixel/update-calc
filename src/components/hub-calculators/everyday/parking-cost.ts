import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ dailyRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), daysPerWeek: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), additionalFees: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'dailyRate', label: 'Daily Parking Rate ($)', type: 'number', min: 0, step: '2' },
    { name: 'daysPerWeek', label: 'Days Parked per Week', type: 'number', min: 0, step: '1' },
    { name: 'additionalFees', label: 'Additional Monthly Fees ($)', type: 'number', min: 0, step: '10' },
  ],
  compute: (v) => { const weekly = v.dailyRate * v.daysPerWeek; const monthly = weekly * 4.33 + v.additionalFees; const annual = monthly * 12; const yearlyTotal = weekly * 52 + v.additionalFees * 12; return { result: annual, label: 'Annual Parking Cost', unit: '$', steps: [{ label: 'Weekly', value: `$${weekly.toFixed(2)}` }, { label: 'Monthly incl. fees', value: `$${monthly.toFixed(2)}` }, { label: 'Annual', value: `$${annual.toFixed(2)}` }] } },
  description: 'Calculate total parking costs including daily rates, frequency, and additional monthly fees on a weekly, monthly, and annual basis.',
  formula: 'Annual = (Daily Rate × Days/Week × 52) + (Additional Fees × 12)',
  interpretation: 'Downtown parking ranges from $10-50/day. Monthly passes (if available) cost 15-25 daily rates. Consider transit or parking farther out to save significantly.'
}

export default calcDef
