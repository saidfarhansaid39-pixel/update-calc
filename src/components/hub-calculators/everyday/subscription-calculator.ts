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
    return { result: avgMonthly, label: 'Average Monthly Cost', unit: '$', steps: [{ label: 'Total Over Period', value: `$${total.toFixed(2)}` }, { label: 'Avg per Month', value: `$${avgMonthly.toFixed(2)}` }, { label: 'Years', value: `${v.yearsSubscribed}` }, { label: 'Includes Price Hikes', value: `${v.priceIncreasePct}%/yr` }] }
  },
  description: 'Calculate total subscription costs including monthly fees, annual fees, and projected price increases over multiple years.',
  formula: 'Total = Σ(Years) (Monthly×12 + Annual) × (1+Increase%)^Year | Avg/Month = Total/(Years×12)',
  interpretation: 'Subscriptions often increase 5-10%/year. The average American spends $200-300/mo on subscriptions. Annual billing saves 10-20% vs monthly. Review all subscriptions quarterly and cancel unused ones.'
}

export default calcDef
