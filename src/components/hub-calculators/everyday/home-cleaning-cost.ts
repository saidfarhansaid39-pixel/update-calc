import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ cleanBedrooms: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), cleanBathrooms: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), cleanSqft: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), cleanFrequency: z.string().min(1), cleanExtras: z.string().min(1) }),
  fields: [
    { name: 'cleanBedrooms', label: 'Bedrooms', type: 'number', min: 0, step: '1' },
    { name: 'cleanBathrooms', label: 'Bathrooms', type: 'number', min: 0, step: '1' },
    { name: 'cleanSqft', label: 'Home Size (sq ft)', type: 'number', min: 200, step: '100' },
    { name: 'cleanFrequency', label: 'Cleaning Frequency', type: 'select', options: [{ label: 'Weekly', value: 'weekly' }, { label: 'Biweekly', value: 'biweekly' }, { label: 'Monthly', value: 'monthly' }, { label: 'One-Time Deep Clean', value: 'onetime' }] },
    { name: 'cleanExtras', label: 'Extras (fridge, oven, windows)', type: 'select', options: [{ label: 'None', value: 'none' }, { label: 'Fridge + Oven', value: 'appliances' }, { label: 'Windows (inside)', value: 'windows' }, { label: 'Full Package', value: 'full' }] },
  ],
  compute: (v) => {
    const baseRate = 0.12
    const baseCost = v.cleanSqft * baseRate
    const bedroomCost = v.cleanBedrooms * 15
    const bathroomCost = v.cleanBathrooms * 20
    const extrasCosts: Record<string, number> = { none: 0, appliances: 40, windows: 50, full: 80 }
    const extras = extrasCosts[v.cleanExtras as keyof typeof extrasCosts] || 0
    const perCleaning = baseCost + bedroomCost + bathroomCost + extras
    const freqMultipliers: Record<string, number> = { weekly: 4.33, biweekly: 2.17, monthly: 1, onetime: 1 }
    const freq = freqMultipliers[v.cleanFrequency as keyof typeof freqMultipliers] || 1
    const monthlyEstimate = perCleaning * freq
    return { result: monthlyEstimate, label: 'Monthly Cleaning Cost', unit: '$', steps: [{ label: 'Base (sq ft)', value: `$${baseCost.toFixed(2)}` }, { label: 'Bedrooms', value: `$${bedroomCost.toFixed(2)}` }, { label: 'Bathrooms', value: `$${bathroomCost.toFixed(2)}` }, { label: 'Extras', value: `$${extras.toFixed(2)}` }, { label: 'Per Cleaning', value: `$${perCleaning.toFixed(2)}` }, { label: 'Monthly Estimate', value: `$${monthlyEstimate.toFixed(2)}` }] }
  },
  description: 'Estimate professional home cleaning costs based on home size, number of rooms, cleaning frequency, and additional services.',
  formula: 'Cost = (Sqft × $0.12) + (Bedrooms × $15) + (Bathrooms × $20) + Extras × Frequency',
  interpretation: 'Average cleaning cost: $0.10-0.15/sq ft. Weekly service costs less per visit but more per month. Deep cleaning costs 2-3× regular cleaning. Tip 15-20% for good service.'
}

export default calcDef
