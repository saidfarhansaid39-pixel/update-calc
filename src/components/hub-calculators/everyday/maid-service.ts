import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bedrooms: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bathrooms: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), sqft: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), frequency: z.string().min(1) }),
  defaults: { bedrooms: '3', bathrooms: '2', sqft: '1500', frequency: 'biweekly' },
  presets: [
    { label: 'Small Apartment', values: { bedrooms: '1', bathrooms: '1', sqft: '750', frequency: 'monthly' } },
    { label: 'Family Home', values: { bedrooms: '4', bathrooms: '2', sqft: '2200', frequency: 'biweekly' } },
    { label: 'Deep Clean Move-Out', values: { bedrooms: '2', bathrooms: '1', sqft: '1000', frequency: 'onetime' } },
  ],
  fields: [
    { name: 'bedrooms', label: 'Bedrooms', type: 'number', min: 1, step: '1' },
    { name: 'bathrooms', label: 'Bathrooms', type: 'number', min: 1, step: '1' },
    { name: 'sqft', label: 'Square Footage', type: 'number', min: 300, step: '200' },
    { name: 'frequency', label: 'Service Frequency', type: 'select', options: [{ label: 'Weekly', value: 'weekly' }, { label: 'Bi-Weekly', value: 'biweekly' }, { label: 'Monthly', value: 'monthly' }, { label: 'One-Time (Deep Clean)', value: 'onetime' }] },
  ],
  compute: (v) => {
    const bd = parseFloat(v.bedrooms)||0; const ba = parseFloat(v.bathrooms)||0; const sf = parseFloat(v.sqft)||0
    const baseRate = 80
    const bedroomCost = bd * 25
    const bathroomCost = ba * 30
    const sqftCost = sf * 0.05
    const frequencyMultipliers: Record<string, number> = { weekly: 1, biweekly: 1.1, monthly: 1.3, onetime: 1.8 }
    const totalPerVisit = (baseRate + bedroomCost + bathroomCost + sqftCost) * frequencyMultipliers[v.frequency as keyof typeof frequencyMultipliers]
    const annualCost = v.frequency === 'weekly' ? totalPerVisit * 52 : v.frequency === 'biweekly' ? totalPerVisit * 26 : v.frequency === 'monthly' ? totalPerVisit * 12 : totalPerVisit
    return { result: totalPerVisit, label: 'Cost per Visit', unit: '$', steps: [
      { label: '1. Base Rate', value: `${baseRate} (minimum visit charge)` },
      { label: '2. Bedroom Add', value: `${bd} × $25 = $${bedroomCost.toFixed(2)}` },
      { label: '3. Bathroom Add', value: `${ba} × $30 = $${bathroomCost.toFixed(2)}` },
      { label: '4. Sq Ft Surcharge', value: `${sf} × $0.05 = $${sqftCost.toFixed(2)}` },
      { label: '5. Subtotal', value: `$${(baseRate + bedroomCost + bathroomCost + sqftCost).toFixed(2)}` },
      { label: '6. Frequency ×', value: `${v.frequency}: ×${frequencyMultipliers[v.frequency as keyof typeof frequencyMultipliers]}` },
      { label: '7. Cost per Visit', value: `$${totalPerVisit.toFixed(2)}` },
      { label: '8. Annual Estimate', value: v.frequency !== 'onetime' ? `$${annualCost.toFixed(2)}/year` : 'One-time only' },
    ] ,
    extras: [
      { label: 'Tipping', value: 'Tip cleaners 15-20% or $20-40 per person per visit. For deep cleans, tip on the higher end.' },
      { label: 'What\'s Included', value: 'Standard clean: dusting, vacuuming, mopping, kitchen/bathroom scrub, trash removal. Not included: inside oven, fridge, windows, or walls.' },
      { label: 'Deep Clean Add-ons', value: 'Inside fridge ($25-50), oven ($30-60), window washing ($5-15/window), wall washing ($0.50-1/sq ft).' },
      { label: 'Supplies', value: 'Most companies bring their own supplies. Ask about eco-friendly options if needed. Some charge $10-20 for specialty products.' },
      { label: 'Insurance Check', value: 'Verify the service is bonded and insured. Ask for proof of liability insurance — it protects you if a cleaner is injured or something is damaged.' },
      { label: 'Frequency Savings', value: 'Weekly or bi-weekly service often comes at a 10-20% discount vs monthly. The less grime buildup, the faster (cheaper) the clean.' },
      { label: 'First Visit Premium', value: 'First-time clean costs 1.5-2× regular because of initial deep buildup. Ask if your provider charges a first-clean premium.' },
      { label: 'Cancellation Policy', value: 'Standard is 24-48 hour notice. Last-minute cancellations may incur 50-100% charge. Some offer flexible scheduling apps.' },
    ]}
  },
  description: 'Estimate maid or cleaning service costs based on home size, number of rooms, and service frequency. Includes tipping guidance and what to expect from standard vs deep clean services.',
  formula: 'Cost = ($80 Base + Bedrooms×$25 + Bathrooms×$30 + sqft×$0.05) × FrequencyMultiplier. Weekly=×1, Biweekly=×1.1, Monthly=×1.3, One-Time=×1.8.',
  interpretation: 'US average: $100-200 for a standard 3BR/2BA home. Deep clean costs 1.5-2× standard. Weekly/bi-weekly service saves 10-20% vs monthly. Tip 15-20% per visit. Annual cost for bi-weekly service averages $3,000-5,000.'
}

export default calcDef
