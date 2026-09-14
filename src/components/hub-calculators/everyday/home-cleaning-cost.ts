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
  defaults: { cleanBedrooms: "3", cleanBathrooms: "2", cleanSqft: "1800", cleanFrequency: "biweekly", cleanExtras: "none" },
  presets: [
    { label: "1-Bedroom Apartment", values: { cleanBedrooms: "1", cleanBathrooms: "1", cleanSqft: "700", cleanFrequency: "monthly", cleanExtras: "none" } },
    { label: "3BR Family Home", values: { cleanBedrooms: "3", cleanBathrooms: "2", cleanSqft: "1800", cleanFrequency: "biweekly", cleanExtras: "none" } },
    { label: "Move-Out Deep Clean", values: { cleanBedrooms: "2", cleanBathrooms: "2", cleanSqft: "1200", cleanFrequency: "onetime", cleanExtras: "full" } },
    { label: "Weekly Maintenance", values: { cleanBedrooms: "4", cleanBathrooms: "3", cleanSqft: "2600", cleanFrequency: "weekly", cleanExtras: "appliances" } },
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
    const annualEstimate = monthlyEstimate * 12
    const perVisitSqft = perCleaning / v.cleanSqft
    return { result: monthlyEstimate, label: 'Monthly Cleaning Cost', unit: '$', steps: [{ label: 'Base (sq ft × $0.12)', value: `$${baseCost.toFixed(2)}` }, { label: 'Bedroom Surcharge', value: `$${bedroomCost.toFixed(2)} (${v.cleanBedrooms} × $15)` }, { label: 'Bathroom Surcharge', value: `$${bathroomCost.toFixed(2)} (${v.cleanBathrooms} × $20)` }, { label: 'Extras (appliances/windows)', value: `$${extras.toFixed(2)}` }, { label: 'Cost per Cleaning', value: `$${perCleaning.toFixed(2)} ($${perVisitSqft.toFixed(2)}/sq ft)` }, { label: 'Monthly × Frequency', value: `$${monthlyEstimate.toFixed(2)} (${v.cleanFrequency})` }, { label: 'Annual Projection', value: `$${annualEstimate.toFixed(0)}/year` }] ,
    extras: [
      { label: "Pricing by Square Footage", value: "Average range: $0.10-0.15/sq ft. Small homes cost more per sq ft; larger homes benefit from efficiency." },
      { label: "Deep Clean Premium", value: "First-time or deep cleaning costs 2-3× regular maintenance. Includes baseboards, blinds, inside cabinets, and detailed scrubbing." },
      { label: "Tipping Etiquette", value: "15-20% of the cleaning fee is customary for regular service, or $20-40 per cleaner for holiday bonuses." },
      { label: "Green Cleaning Options", value: "Eco-friendly cleaning typically adds $10-30 per visit. Many companies now use non-toxic, biodegradable products." },
      { label: "Frequency Impact Analysis", value: "Weekly: most expensive monthly total, but each visit is quicker (less buildup). Monthly: less total cost but each visit is more intensive." },
      { label: "Included vs. Excluded", value: "Standard cleaning includes dusting, vacuuming, mopping, bathrooms, kitchen. Excludes: interior windows, oven, fridge, ceiling fans (these are extras)." },
      { label: "Regional Cost Differences", value: "Midwest/South: $25-40/hr per cleaner | Northeast/West Coast: $40-65/hr. Check local rates before booking." },
      { label: "Background Check Value", value: "Bonded and insured cleaners cost 10-20% more but cover damages and theft. Always verify insurance before hiring independent cleaners." },
    ]}
  },
  description: 'Get a detailed professional home cleaning estimate based on your home size, room count, service frequency, and add-on services. Compare weekly, biweekly, monthly, and one-time deep cleaning costs.',
  formula: 'Per Visit = (Sqft × $0.12) + (Bedrooms × $15) + (Bathrooms × $20) + Extras | Monthly = Per Visit × Frequency Factor (Weekly: 4.33, Biweekly: 2.17, Monthly: 1)',
  interpretation: 'Professional home cleaning averages $0.12-0.15 per square foot, with bedrooms adding $15 each and bathrooms $20 each. Weekly service costs about 10-15% less per visit than monthly because there is less accumulated grime, but the monthly total is naturally higher. A one-time deep clean costs 2-3 times a regular visit because cleaners do detailed work (baseboards, blinds, inside cabinets). For a typical 3BR/2BA home of 1,800 sq ft on biweekly service without extras, expect about $100-130 per visit or $220-280 per month.'
}

export default calcDef
