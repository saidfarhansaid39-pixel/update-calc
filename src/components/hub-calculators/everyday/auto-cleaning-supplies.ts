import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ acsSqft: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), acsBedrooms: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), acsBathrooms: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), acsEcoFriendly: z.string().min(1), acsPetOwner: z.string().min(1) }),
  fields: [
    { name: 'acsSqft', label: 'Home Size (sq ft)', type: 'number', min: 200, step: '100' },
    { name: 'acsBedrooms', label: 'Bedrooms', type: 'number', min: 0, max: 10, step: '1' },
    { name: 'acsBathrooms', label: 'Bathrooms', type: 'number', min: 0, max: 10, step: '1' },
    { name: 'acsEcoFriendly', label: 'Cleaning Product Preference', type: 'select', options: [{ label: 'Standard', value: 'standard' }, { label: 'Eco-Friendly (+20%)', value: 'eco' }, { label: 'DIY (vinegar/baking soda)', value: 'diy' }] },
    { name: 'acsPetOwner', label: 'Pet Owner', type: 'select', options: [{ label: 'Yes (add $10/mo)', value: 'yes' }, { label: 'No', value: 'no' }] },
  ],
  compute: (v) => {
    const sqftFactor = v.acsSqft / 1000
    const bedroomSupplies = v.acsBedrooms * 3
    const bathroomSupplies = v.acsBathrooms * 5
    const baseMonthly = sqftFactor * 15 + bedroomSupplies + bathroomSupplies
    let ecoMultiplier = 1
    if (v.acsEcoFriendly === 'eco') { ecoMultiplier = 1.2 }
    if (v.acsEcoFriendly === 'diy') { ecoMultiplier = 0.5 }
    const petSurcharge = v.acsPetOwner === 'yes' ? 10 : 0
    const monthlyTotal = baseMonthly * ecoMultiplier + petSurcharge
    const annualTotal = monthlyTotal * 12
    return { result: monthlyTotal, label: 'Monthly Cleaning Supply Cost', unit: '$', steps: [{ label: 'Base Monthly', value: `$${baseMonthly.toFixed(2)}` }, { label: 'Eco/DIY Adjustment', value: `${ecoMultiplier.toFixed(1)}×` }, { label: 'Pet Surcharge', value: `$${petSurcharge.toFixed(2)}` }, { label: 'Monthly Total', value: `$${monthlyTotal.toFixed(2)}` }, { label: 'Annual Total', value: `$${annualTotal.toFixed(2)}` }] }
  },
  description: 'Estimate your monthly and annual cleaning supplies budget based on home size, rooms, eco-preference, and pet ownership.',
  formula: 'Monthly = (Sqft/1000 × $15 + Bedrooms×$3 + Bathrooms×$5) × Eco Factor + Pet Surcharge',
  interpretation: 'Standard cleaning supplies cost $30-60/month for a typical home. Eco-friendly products cost 20% more but reduce chemical exposure. DIY cleaners (vinegar, baking soda) cut costs by 50%. Pet owners spend $5-15 more on enzymatic cleaners.'
}

export default calcDef
