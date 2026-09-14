import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ sqft: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bathrooms: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), cleaningFreq: z.string().min(1), pets: z.string().min(1), ecoFriendly: z.string().min(1) }),
  fields: [
    { name: 'sqft', label: 'Home Size (sq ft)', type: 'number', min: 200, step: '100' },
    { name: 'bathrooms', label: 'Number of Bathrooms', type: 'number', min: 1, step: '1' },
    { name: 'cleaningFreq', label: 'Cleaning Frequency', type: 'select', options: [{ label: 'Weekly', value: 'weekly' }, { label: 'Biweekly', value: 'biweekly' }, { label: 'Monthly', value: 'monthly' }] },
    { name: 'pets', label: 'Pets', type: 'select', options: [{ label: 'No Pets', value: 'none' }, { label: 'Dogs', value: 'dogs' }, { label: 'Cats', value: 'cats' }, { label: 'Both', value: 'both' }] },
    { name: 'ecoFriendly', label: 'Cleaning Preference', type: 'select', options: [{ label: 'Standard', value: 'standard' }, { label: 'Eco-Friendly', value: 'eco' }, { label: 'DIY (vinegar/baking soda)', value: 'diy' }] },
  ],
  defaults: { sqft: '1500', bathrooms: '2', cleaningFreq: 'weekly', pets: 'none', ecoFriendly: 'standard' },
  presets: [
    { label: 'Small Apartment (No Pets)', values: { sqft: '700', bathrooms: '1', cleaningFreq: 'weekly', pets: 'none', ecoFriendly: 'standard' } },
    { label: 'Family Home with Dogs', values: { sqft: '2200', bathrooms: '3', cleaningFreq: 'weekly', pets: 'dogs', ecoFriendly: 'standard' } },
    { label: 'Eco-Friendly Duplex', values: { sqft: '1400', bathrooms: '2', cleaningFreq: 'biweekly', pets: 'cats', ecoFriendly: 'eco' } },
    { label: 'DIY Cleaners Only', values: { sqft: '1800', bathrooms: '2', cleaningFreq: 'weekly', pets: 'both', ecoFriendly: 'diy' } },
  ],
  compute: (v) => {
    const baseSupplies = v.sqft < 1000 ? 15 : v.sqft < 2000 ? 25 : 40
    const bathSupplies = v.bathrooms * 5
    const petSurcharge = v.pets === 'dogs' ? 8 : v.pets === 'cats' ? 6 : v.pets === 'both' ? 12 : 0
    const ecoMultiplier = v.ecoFriendly === 'eco' ? 1.3 : v.ecoFriendly === 'diy' ? 0.3 : 1
    const totalPerSession = (baseSupplies + bathSupplies + petSurcharge) * ecoMultiplier
    const freqMultiplier = v.cleaningFreq === 'weekly' ? 4.33 : v.cleaningFreq === 'biweekly' ? 2.17 : 1
    const monthlyCost = totalPerSession * freqMultiplier
    const annualCost = monthlyCost * 12
    const costPerSqFt = monthlyCost / v.sqft
    const yearlySavingDIY = v.ecoFriendly !== 'diy' ? (monthlyCost - monthlyCost * 0.3) * 12 : 0
    return { result: monthlyCost, label: 'Monthly Cleaning Supplies', unit: '$', steps: [
      { label: 'Base Cleaning Kit', value: `$${baseSupplies.toFixed(2)} (sqft tier: ${v.sqft < 1000 ? 'under 1000' : v.sqft < 2000 ? '1000-2000' : '2000+'})` },
      { label: 'Bathroom Supplies', value: `${v.bathrooms} bath × $5 = $${bathSupplies.toFixed(2)}` },
      { label: 'Pet Surcharge', value: v.pets !== 'none' ? `$${petSurcharge.toFixed(2)} (${v.pets}: fur removal, enzymatic cleaners)` : '$0 (no pets)' },
      { label: `Eco/DIY ${ecoMultiplier > 1 ? 'Premium' : 'Discount'}`, value: v.ecoFriendly === 'eco' ? 'Eco brands cost 30% more' : v.ecoFriendly === 'diy' ? 'DIY ~70% cheaper' : 'Standard pricing' },
      { label: 'Cost per Cleaning Session', value: `$${totalPerSession.toFixed(2)}` },
      { label: `Monthly (${v.cleaningFreq})`, value: `$${totalPerSession.toFixed(2)} × ${freqMultiplier.toFixed(2)} = $${monthlyCost.toFixed(2)}` },
      { label: 'Annual Supply Budget', value: `$${annualCost.toFixed(2)}` },
      { label: 'Cost per Sq Ft', value: `$${costPerSqFt.toFixed(3)}/sq ft/mo` },
    ] ,
    extras: [
      { label: 'Pet-Specific Cleaning Impact', value: v.pets !== 'none' ? `Pets add $${petSurcharge.toFixed(2)}/session ($$${(petSurcharge * freqMultiplier).toFixed(2)}/mo) for enzymatic stain removers, lint rollers, and odor eliminators. Fur buildup also clogs vacuum filters 2× faster — budget $20-30/yr for replacements.` : 'Without pets, you save $6-12/session on enzymatic cleaners and fur removal tools, saving $100-200/year vs pet-owning households.' },
      { label: 'Eco-Friendly Premium or Savings', value: v.ecoFriendly === 'eco' ? `Eco-friendly brands cost 25-40% more upfront but use concentrated formulas — 1 bottle lasts 2-3× longer. Your $${monthlyCost.toFixed(2)}/mo includes a $${(monthlyCost - monthlyCost / ecoMultiplier).toFixed(2)} premium for plant-based, biodegradable ingredients.` : v.ecoFriendly === 'diy' ? 'DIY cleaning (vinegar, baking soda, castile soap) costs $0.10-0.30/session vs $3-8 for commercial products. Annual savings: $' + `${(monthlyCost * 12 - monthlyCost * 0.3 * 12).toFixed(0)}` + '. Plus zero plastic waste.' : 'Standard cleaners cost $3-8 per session. Switching to concentrate refills (e.g., Grove Collaborative, Blueland) cuts cost by 30-50% and plastic waste by 80%.' },
      { label: 'Bulk Buying Strategy', value: 'Buy cleaning supplies in bulk every 3-6 months at warehouse clubs (Costco, Sam\'s Club) saves 20-40%. A $50-80 stock-up covers 3-6 months. Avoid brand-name sprays — generic at 1/3 the cost clean just as well. Dilute concentrates 2:1 for daily use to stretch bottles further.' },
      { label: 'Reusable Swap Economics', value: 'Swap paper towels for reusable microfiber cloths ($10 for 24-pack). Each cloth lasts 300+ washes ($0.03/use) vs paper towels ($0.02/sheet but 3-5 sheets per cleaning = $0.10-0.25/use). Microfiber: cleans better, zero waste, saves $40-80/year.' },
      { label: 'Room-by-Room Allocation', value: `Kitchen cleaners: 30% of supply budget (degreasers, disinfectants). Bathroom: 35% ($$${(bathSupplies * freqMultiplier).toFixed(0)}/mo for ${v.bathrooms} baths). Living areas: 20% (all-purpose, dusting). Floors: 15% (mop solution, vacuum bags). Adjust ratios if you have specialty surfaces (granite, hardwood, stainless steel).` },
      { label: 'Seasonal Deep Clean Buildup', value: 'Spring and fall deep cleans require 2-3× the normal supply quantity (carpet shampoo, oven cleaner, window spray, grout cleaner). Budget $30-60 extra each for spring & fall cleanings = $60-120/year beyond your routine monthly spend.' },
      { label: 'Cost per Sq Foot Benchmark', value: `At $${costPerSqFt.toFixed(3)}/sq ft/mo, your supply cost is ${costPerSqFt > 0.02 ? 'above' : 'below'} the national average of $0.012/sq ft/mo. This ${costPerSqFt > 0.02 ? 'might indicate premium products or overstocking' : 'suggests efficient supply management'}.` },
      { label: 'Reusable Mop System ROI', value: 'A spin mop system ($30-40 upfront) replaces 50+ disposable mop heads per year ($1-3 each = $50-150/yr). Breakeven: 4-8 months. After that, $0.02/mop vs $0.50/mop. On your schedule, that\'s $' + `${(freqMultiplier > 2 ? 80 : 40).toFixed(0)}` + '/year saved.' },
    ]}
  },
  description: 'Estimate monthly and annual spending on cleaning supplies based on home size, number of bathrooms, cleaning frequency, pets, and eco-friendliness preference. Compare standard vs DIY costs and get bulk-buying recommendations.',
  formula: 'Monthly = [(Base(by sqft tier) + Bathroom($5/bath) + Pet surcharge($6-12)) × Eco multiplier(1.0/1.3/0.3)] × Frequency factor(4.33/2.17/1). Annual = Monthly × 12.',
  interpretation: 'Budget $15-40 per cleaning session for supplies. Eco-friendly brands cost 25-40% more but use concentrated formulas. DIY cleaners (vinegar, baking soda, castile soap) cut costs 70% and eliminate plastic waste. Stocking up on sales and using concentrate refills can cut costs 30-50%. Pet owners spend $100-200/year more on enzymatic cleaners and fur removal tools. Reusable cloths and mop systems save $80-150/year vs disposable alternatives.'
}

export default calcDef
