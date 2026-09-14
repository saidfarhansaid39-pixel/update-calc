import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ nightlyRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), nights: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), additionalServices: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), pickupFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'nightlyRate', label: 'Nightly Boarding Rate ($)', type: 'number', min: 0, step: '10' },
    { name: 'nights', label: 'Number of Nights', type: 'number', min: 1, step: '1' },
    { name: 'additionalServices', label: 'Additional Services ($)', type: 'number', min: 0, step: '10' },
    { name: 'pickupFee', label: 'Admin/Pickup Fee ($)', type: 'number', min: 0, step: '10' },
  ],
  defaults: { nightlyRate: '45', nights: '5', additionalServices: '20', pickupFee: '0' },
  presets: [
    { label: 'Weekend Getaway (2 nights)', values: { nightlyRate: '40', nights: '2', additionalServices: '0', pickupFee: '0' } },
    { label: 'Week Vacation (7 nights)', values: { nightlyRate: '50', nights: '7', additionalServices: '30', pickupFee: '0' } },
    { label: 'Two-Week Vacation (14 nights)', values: { nightlyRate: '45', nights: '14', additionalServices: '50', pickupFee: '0' } },
    { label: 'Holiday Boarding (premium)', values: { nightlyRate: '75', nights: '4', additionalServices: '25', pickupFee: '15' } },
  ],
  compute: (v) => { const base = v.nightlyRate * v.nights; const total = base + v.additionalServices + v.pickupFee; const dailyAvg = total / v.nights; return { result: total, label: 'Total Boarding Cost', unit: '$',
    steps: [
      { label: 'Nightly Rate', value: `$${v.nightlyRate.toFixed(0)}/night` },
      { label: 'Base Boarding Cost', value: `${v.nights} nights × $${v.nightlyRate} = $${base.toFixed(0)}` },
      { label: 'Additional Services', value: `$${v.additionalServices.toFixed(0)} (walks, playtime, meds)` },
      { label: 'Admin/Pickup Fees', value: `$${v.pickupFee.toFixed(0)}` },
      { label: 'Total Boarding Cost', value: `$${base.toFixed(0)} + $${v.additionalServices.toFixed(0)} + $${v.pickupFee.toFixed(0)} = $${total.toFixed(0)}` },
      { label: 'Average per Night', value: `$${total.toFixed(0)} ÷ ${v.nights} = $${dailyAvg.toFixed(2)}/night` },
      { label: 'Total per Week (7 nights)', value: `$${((v.nightlyRate * 7) + v.additionalServices + v.pickupFee).toFixed(0)}` },
      { label: 'Cost Comparison: In-Home Sitter', value: `In-home sitter: typically $${(v.nightlyRate * v.nights * 0.7).toFixed(0)} (30% less)` },
    ],
    extras: [
      { label: '🏨 Boarding vs In-Home Sitting', value: 'Kennel boarding: $25-85/night (facility). In-home sitter: $40-75/night (sitter stays at your home). In-home is less stressful for pets — familiar environment, no exposure to kennel diseases. Boarding is better for social dogs who enjoy playtime.' },
      { label: '💵 Holiday Rate Premiums', value: 'Holiday rates are 25-50% higher — Thanksgiving, Christmas, New Year\'s, July 4, Spring Break. Some facilities also require minimum stays (3-5 night minimum during holidays) and non-refundable deposits.' },
      { label: '🐾 Additional Service Pricing', value: 'Extra walk: $10-15/15 min. Playtime session: $10-20. Grooming (bath + brush): $25-50. Medication administration: $5-10/day. Webcam access: $5-10/day. Report card: often free.' },
      { label: '📋 Required Vaccinations for Boarding', value: 'Most facilities require: Rabies (1-3 year), DHPP (distemper) within 1-3 years, Bordetella (kennel cough) within 6 months, Canine Influenza within 1 year, negative fecal test within 6 months. No proof = no boarding.' },
      { label: '🆕 Trial Run Recommendation', value: 'Before a long stay, do a trial run: 1-night stay or daycare day. It\'s less stressful for your pet and you. Many facilities offer a free "meet and greet" to assess temperament and compatibility.' },
      { label: '🛌 What to Bring', value: 'Food (portioned for full stay + 1 extra day), medications, leash/collar with ID tags, bed/blanket with familiar scent, favorite toys (avoid stuffies that could be ingested), vaccination records. Most facilities provide bowls and bedding.' },
      { label: '💲 Discounts and Packages', value: 'Multi-pet discount: 10-20% off for second pet. Extended stay discount: 10-15% for 10+ nights. Pre-paid packages: buy 10 nights, get 1 free. Membership programs (Petco Vital Care, etc.): 5-20% off boarding.' },
      { label: '🏥 Health and Safety Concerns', value: 'Kennel cough (Bordetella) is common — 15-20% of boarded dogs contract it even when vaccinated. Ask about: cleaning protocols, staff-to-pet ratio (should be 1:15 or better), 24-hr supervision, emergency vet transport plan.' },
    ]
  } },
  description: 'Calculate total pet boarding cost including nightly rate, additional services, and admin fees. Get per-night averages, week-long estimates, and compare to in-home sitter costs.',
  formula: 'Total = (Nights × Nightly Rate) + Additional Services + Pickup Fee | Average per Night = Total ÷ Nights | In-Home Sitter Est. = Base × 0.7 (30% cheaper typically)',
  interpretation: 'Pet boarding costs $25-85/night for dogs and $15-40/night for cats depending on facility quality, location, and services. Holiday rates are 25-50% higher with minimum stay requirements. Additional services (extra walks, playtime, grooming) add $10-50 per stay. The total bill for a 7-night vacation: $300-600 for standard boarding. In-home pet sitters typically cost more per night ($40-75) but are less stressful for pets and don\'t require vaccination proof (though recommended). Boarding facilities also save you from having a stranger in your home.'
}

export default calcDef
