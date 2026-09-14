import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ groomFrequency: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), costPerGroom: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tipPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), travelFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'groomFrequency', label: 'Grooming Visits per Year', type: 'number', min: 1, step: '1' },
    { name: 'costPerGroom', label: 'Cost per Grooming ($)', type: 'number', min: 0, step: '10' },
    { name: 'tipPct', label: 'Tip (%)', type: 'number', min: 0, step: '5' },
    { name: 'travelFee', label: 'Travel/Pickup Fee ($)', type: 'number', min: 0, step: '5' },
  ],
  defaults: { groomFrequency: '8', costPerGroom: '55', tipPct: '15', travelFee: '0' },
  presets: [
    { label: 'Small Dog (e.g. Shih Tzu)', values: { groomFrequency: '8', costPerGroom: '45', tipPct: '15', travelFee: '0' } },
    { label: 'Medium Dog (e.g. Golden)', values: { groomFrequency: '6', costPerGroom: '65', tipPct: '20', travelFee: '0' } },
    { label: 'Large Dog with Mobile Groomer', values: { groomFrequency: '8', costPerGroom: '85', tipPct: '15', travelFee: '15' } },
    { label: 'Long-Haired Cat', values: { groomFrequency: '6', costPerGroom: '60', tipPct: '15', travelFee: '0' } },
  ],
  compute: (v) => { const tipAmount = v.costPerGroom * (v.tipPct / 100); const perVisit = v.costPerGroom + tipAmount + v.travelFee; const annual = perVisit * v.groomFrequency; const monthly = annual / 12; return { result: annual, label: 'Annual Grooming Cost', unit: '$',
    steps: [
      { label: 'Base Grooming Cost', value: `$${v.costPerGroom.toFixed(0)} per visit` },
      { label: 'Tip Amount', value: `${v.tipPct}% of $${v.costPerGroom} = $${tipAmount.toFixed(2)}` },
      { label: 'Travel/Pickup Fee', value: `$${v.travelFee.toFixed(0)}` },
      { label: 'Cost per Visit', value: `$${v.costPerGroom} + $${tipAmount.toFixed(2)} + $${v.travelFee} = $${perVisit.toFixed(2)}` },
      { label: 'Annual Cost', value: `$${perVisit.toFixed(2)} × ${v.groomFrequency} visits = $${annual.toFixed(2)}` },
      { label: 'Monthly Equivalent', value: `$${annual.toFixed(2)} ÷ 12 = $${monthly.toFixed(2)}/mo` },
      { label: 'Per-Week Equivalent', value: `$${(annual / 52).toFixed(2)}/wk` },
      { label: 'Grooming Interval', value: `Every ${Math.round(52 / v.groomFrequency)} weeks` },
    ],
    extras: [
      { label: '🐩 Pricing by Breed Size', value: 'Small dogs (<20 lbs): $30-55. Medium (21-50 lbs): $45-70. Large (51-90 lbs): $60-90. Giant (90+ lbs): $75-120. Cats: $40-80. Add $10-20 for matted coat or aggressive behavior.' },
      { label: '✂️ What\'s Included in a Full Groom', value: 'Bath with shampoo/conditioner, blow-dry, brush/comb out, nail trim, ear cleaning, sanitary trim, and hair cut/style. Some include teeth brushing and gland expression for an extra fee.' },
      { label: '📅 Recommended Grooming Frequency', value: 'Short-haired breeds: every 8-12 weeks. Long-haired breeds: every 4-8 weeks. Double-coated breeds (Husky, Golden): every 8-10 weeks + daily brushing. Cats: every 6-8 weeks for long hair.' },
      { label: '💰 Mobile Grooming vs Salon', value: 'Mobile groomers (van comes to you): $20-40 more per session but save 1-2 hrs of your time. Less stressful for anxious pets. Mobile grooming is the fastest-growing segment of the pet grooming industry.' },
      { label: '🔄 Grooming Packages & Memberships', value: 'PetSmart and Petco offer prepaid packages (6 visits for price of 5, save 15-20%). Some mobile groomers offer membership plans ($40-70/month includes monthly grooming). Great for regular customers.' },
      { label: '🧴 DIY Grooming Savings', value: 'DIY with professional tools (clippers $50-150, shears $20-80, table $50-200). Breakeven: ~3-5 grooms for small dogs, ~2-3 for large dogs. Demand skill and patience — a bad DIY cut can require professional fixing.' },
      { label: '🎄 Holiday & Peak Pricing', value: 'Grooming prices increase 15-30% during holiday season (Nov-Dec). Book 2-3 weeks ahead. Prices also rise before summer (shedding season). Early morning appointments are sometimes discounted $5-10.' },
      { label: '🏥 Health Benefits of Grooming', value: 'Regular grooming detects lumps, skin issues, ear infections, and dental problems early. Groomers notice changes in coat quality that may indicate health problems. Nail trimming prevents joint issues in senior pets.' },
    ]
  } },
  description: 'Estimate annual pet grooming expenses including service cost, tips, and travel fees. Get per-visit breakdown, monthly and weekly equivalents, and breed-specific pricing insights.',
  formula: 'Tip Amount = Cost per Groom × (Tip % ÷ 100) | Cost per Visit = Base Cost + Tip + Travel Fee | Annual = Cost per Visit × Visits per Year | Monthly = Annual ÷ 12',
  interpretation: 'Professional grooming costs $30-120 per session depending on breed, size, coat condition, and services. Dogs need grooming every 4-12 weeks depending on coat type; long-haired cats every 6-8 weeks. A typical medium-sized dog on an 8-week schedule costs $500-700/year including tip (15-20%). Mobile grooming costs 30-50% more but saves time and reduces pet stress. Pre-paid packages save 15-20%. DIY grooming has a breakeven of 3-5 sessions but requires skill and equipment investment.'
}

export default calcDef
