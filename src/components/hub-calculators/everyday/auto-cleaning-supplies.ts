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
  defaults: { acsSqft: '1500', acsBedrooms: '3', acsBathrooms: '2', acsEcoFriendly: 'standard', acsPetOwner: 'no' },
  presets: [
    { label: 'Small Apartment', values: { acsSqft: '750', acsBedrooms: '1', acsBathrooms: '1', acsEcoFriendly: 'diy', acsPetOwner: 'yes' } },
    { label: 'Family Home', values: { acsSqft: '2000', acsBedrooms: '4', acsBathrooms: '3', acsEcoFriendly: 'standard', acsPetOwner: 'yes' } },
    { label: 'Eco-Conscious', values: { acsSqft: '1200', acsBedrooms: '2', acsBathrooms: '2', acsEcoFriendly: 'eco', acsPetOwner: 'no' } },
    { label: 'DIY Minimalist', values: { acsSqft: '900', acsBedrooms: '2', acsBathrooms: '1', acsEcoFriendly: 'diy', acsPetOwner: 'no' } },
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
    const sqftCost = sqftFactor * 15
    const roomCost = bedroomSupplies + bathroomSupplies
    return { result: monthlyTotal, label: 'Monthly Cleaning Supply Cost', unit: '$', steps: [{ label: 'Sq Ft Factor', value: `${v.acsSqft} / 1000 × $15 = $${sqftCost.toFixed(2)}` }, { label: 'Bedroom Supplies', value: `${v.acsBedrooms} × $3 = $${bedroomSupplies.toFixed(2)}` }, { label: 'Bathroom Supplies', value: `${v.acsBathrooms} × $5 = $${bathroomSupplies.toFixed(2)}` }, { label: 'Base Monthly', value: `$${sqftCost.toFixed(2)} + $${roomCost.toFixed(2)} = $${baseMonthly.toFixed(2)}` }, { label: 'Eco/DIY Adjustment', value: `${ecoMultiplier.toFixed(1)}× = $${(baseMonthly * ecoMultiplier).toFixed(2)}` }, { label: 'Pet Surcharge', value: `$${petSurcharge.toFixed(2)}` }, { label: 'Monthly Total', value: `$${monthlyTotal.toFixed(2)}` }, { label: 'Annual Total', value: `$${annualTotal.toFixed(2)}` }] ,
    extras: [
      { label: 'Eco vs Standard Cost Trade-Off', value: `Eco-friendly costs ${((1.2 - 1) * 100).toFixed(0)}% more but reduces VOCs and chemical exposure. DIY (vinegar/baking soda) cuts costs by ${((1 - 0.5) * 100).toFixed(0)}% — best for tight budgets.` },
      { label: 'Pet Stain Management', value: 'Enzymatic cleaners ($8-12/bottle) are essential for pet households. Weekly carpet deodorizer ($5-7) adds to the pet surcharge. Professional steam cleaning ($100-200/year) reduces long-term carpet wear.' },
      { label: 'Bathroom vs Kitchen Splits', value: `Bathrooms cost $${v.acsBathrooms * 5}/month each (tile cleaner, toilet cleaner, glass spray). Kitchens are covered by the sq ft factor. Bathrooms are the most product-intensive rooms per sq ft.` },
      { label: 'Concentrate Math', value: 'Lysol/Clorox concentrates ($8-12) make 6-8 spray bottles at $0.10-0.15/oz vs pre-mixed $0.35-0.50/oz. A $10 concentrate + reusable spray bottles saves $30-50/year.' },
      { label: 'Allergies and Cleaners', value: 'Fragrance-free cleaners cost 10-15% more but reduce allergy triggers. If household members have asthma or sensitivities, budget extra for hypoallergenic brands like Seventh Generation or Branch Basics.' },
      { label: 'Declutter = Less Cleaning', value: 'Every surface you clear reduces dusting and wiping time. A clutter-free 1500 sq ft home needs 30% less cleaning product than a cluttered one of the same size.' },
      { label: 'Seasonal Deep Clean Budget', value: 'Spring and fall deep cleans require additional supplies (grout cleaner, oven cleaner, window spray). Budget an extra $20-40 twice per year beyond the monthly estimate.' },
    ]}
  },
  description: 'Estimate your monthly and annual cleaning supplies budget based on home square footage, bedroom and bathroom count, eco-preference, and pet ownership. Compare standard, eco-friendly, and DIY cleaning approaches.',
  formula: 'Monthly = ((Sqft ÷ 1000 × $15 + Bedrooms × $3 + Bathrooms × $5) × Eco Factor) + Pet Surcharge | Eco: 1.2×, Standard: 1.0×, DIY: 0.5× | Pet: +$10/mo',
  interpretation: 'Standard cleaning supplies cost $30-60/month for a typical 1500 sq ft, 3-bed, 2-bath home. Eco-friendly products cost 20% more but eliminate harsh chemicals — ideal for families with young children. DIY cleaners (vinegar, baking soda, castile soap) slash costs by 50% to ~$15-25/month. Pet owners add $10/month for enzymatic cleaners and deodorizers. Bathrooms consume the most product per square foot — budget accordingly.'
}

export default calcDef
