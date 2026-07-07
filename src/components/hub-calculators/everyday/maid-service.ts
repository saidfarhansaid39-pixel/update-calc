import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bedrooms: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bathrooms: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), sqft: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), frequency: z.string().min(1) }),
  fields: [
    { name: 'bedrooms', label: 'Bedrooms', type: 'number', min: 1, step: '1' },
    { name: 'bathrooms', label: 'Bathrooms', type: 'number', min: 1, step: '1' },
    { name: 'sqft', label: 'Square Footage', type: 'number', min: 300, step: '200' },
    { name: 'frequency', label: 'Service Frequency', type: 'select', options: [{ label: 'Weekly', value: 'weekly' }, { label: 'Bi-Weekly', value: 'biweekly' }, { label: 'Monthly', value: 'monthly' }, { label: 'One-Time (Deep Clean)', value: 'onetime' }] },
  ],
  compute: (v) => {
    const baseRate = 80
    const bedroomCost = v.bedrooms * 25
    const bathroomCost = v.bathrooms * 30
    const sqftCost = v.sqft * 0.05
    const frequencyMultipliers: Record<string, number> = { weekly: 1, biweekly: 1.1, monthly: 1.3, onetime: 1.8 }
    const totalPerVisit = (baseRate + bedroomCost + bathroomCost + sqftCost) * frequencyMultipliers[v.frequency as keyof typeof frequencyMultipliers]
    const annualCost = v.frequency === 'weekly' ? totalPerVisit * 52 : v.frequency === 'biweekly' ? totalPerVisit * 26 : v.frequency === 'monthly' ? totalPerVisit * 12 : totalPerVisit
    return { result: totalPerVisit, label: 'Cost per Visit', unit: '$', steps: [{ label: 'Base Rate', value: `$${baseRate.toFixed(2)}` }, { label: 'Bedrooms', value: `+$${bedroomCost.toFixed(2)}` }, { label: 'Bathrooms', value: `+$${bathroomCost.toFixed(2)}` }, { label: 'Square Footage', value: `+$${sqftCost.toFixed(2)}` }, { label: 'Frequency Multiplier', value: `×${frequencyMultipliers[v.frequency as keyof typeof frequencyMultipliers]}` }, { label: 'Per Visit Total', value: `$${totalPerVisit.toFixed(2)}` }, { label: 'Annual Total', value: v.frequency !== 'onetime' ? `$${annualCost.toFixed(2)}/year` : 'One-time only' }] }
  },
  description: 'Estimate maid or cleaning service costs based on home size, number of rooms, and service frequency.',
  formula: 'Cost = (Base + Bedrooms×$25 + Bathrooms×$30 + sqft×$0.05) × FrequencyMultiplier',
  interpretation: 'US average: $100-200 for a standard home. Deep clean costs 1.5-2× standard. Weekly service often includes discounts. Tip: 15-20% or $20-40 per cleaner.'
}

export default calcDef
