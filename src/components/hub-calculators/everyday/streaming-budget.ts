import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ streamingServices: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), costPerService: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hboCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), sportsPkg: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'streamingServices', label: 'Number of Basic Services', type: 'number', min: 1, step: '1' },
    { name: 'costPerService', label: 'Avg Cost per Service ($)', type: 'number', min: 5, step: '5' },
    { name: 'hboCost', label: 'Premium Add-on ($)', type: 'number', min: 0, step: '5' },
    { name: 'sportsPkg', label: 'Sports/Live TV ($)', type: 'number', min: 0, step: '10' },
  ],
  compute: (v) => {
    const basicTotal = v.streamingServices * v.costPerService
    const monthlyTotal = basicTotal + v.hboCost + v.sportsPkg
    const annualTotal = monthlyTotal * 12
    const cableAvg = 120
    const savingsVsCable = cableAvg - monthlyTotal
    return { result: monthlyTotal, label: 'Monthly Streaming Cost', unit: '$', steps: [{ label: 'Basic Services', value: `${v.streamingServices} × $${v.costPerService.toFixed(2)} = $${basicTotal.toFixed(2)}` }, { label: 'Premium Add-ons', value: `+$${v.hboCost.toFixed(2)}` }, { label: 'Sports/Live TV', value: `+$${v.sportsPkg.toFixed(2)}` }, { label: 'Monthly Total', value: `$${monthlyTotal.toFixed(2)}` }, { label: 'Annual Total', value: `$${annualTotal.toFixed(2)}` }, { label: savingsVsCable >= 0 ? 'Savings vs Cable' : 'More than Cable', value: savingsVsCable >= 0 ? `Save $${savingsVsCable.toFixed(2)}/mo` : `$${Math.abs(savingsVsCable).toFixed(2)}/mo more than cable` }] }
  },
  description: 'Calculate total monthly and annual streaming service costs including premium add-ons and sports packages. Compare to cable TV.',
  formula: 'Monthly = Services×Cost/Service + Premium + Sports | Annual = Monthly×12',
  interpretation: 'Average US household spends $50-80/mo on 3-4 streaming services. Cable averages $120+/mo. Rotating services (subscribe for 1-2 months at a time) saves 30-50%. Student/military discounts available on most platforms.'
}

export default calcDef
