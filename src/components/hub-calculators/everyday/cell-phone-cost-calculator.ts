import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ phonePrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), monthlyPlan: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), monthsOwned: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), accessories: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'phonePrice', label: 'Phone Purchase Price ($)', type: 'number', min: 100, step: '100' },
    { name: 'monthlyPlan', label: 'Monthly Plan ($)', type: 'number', min: 10, step: '10' },
    { name: 'monthsOwned', label: 'Months You Keep It', type: 'number', min: 12, step: '6' },
    { name: 'accessories', label: 'Accessories (case/screen protector) ($)', type: 'number', min: 0, step: '10' },
  ],
  compute: (v) => {
    const planTotal = v.monthlyPlan * v.monthsOwned
    const totalCost = v.phonePrice + planTotal + v.accessories
    const costPerMonth = totalCost / v.monthsOwned
    return { result: costPerMonth, label: 'Cost per Month', unit: '$', steps: [{ label: 'Phone Cost', value: `$${v.phonePrice.toFixed(0)}` }, { label: 'Plan Total', value: `$${planTotal.toFixed(0)}` }, { label: 'Accessories', value: `$${v.accessories.toFixed(0)}` }, { label: 'Total Cost', value: `$${totalCost.toFixed(0)}` }, { label: 'Per Month', value: `$${costPerMonth.toFixed(2)}/mo` }] }
  },
  description: 'Calculate the true monthly cost of owning a cell phone including purchase price, plan fees, and accessories over the time you keep the device.',
  formula: 'Cost/Month = (Phone + Plan × Months + Accessories) / Months',
  interpretation: 'Average US cell phone cost: $50-100/mo for the plan + device financing. Keeping a phone 3+ years instead of 2 saves $200-500/year. Buying unlocked vs financed saves on interest.'
}

export default calcDef
