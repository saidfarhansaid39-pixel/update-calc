import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ adoption: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), foodMonthly: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), vetAnnual: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), suppliesMonthly: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), insuranceMonthly: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), groomingMonthly: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), training: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), years: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'adoption', label: 'Adoption/Purchase Cost ($)', type: 'number', min: 0, step: '100' },
    { name: 'foodMonthly', label: 'Monthly Food ($)', type: 'number', min: 0, step: '20' },
    { name: 'vetAnnual', label: 'Annual Vet Cost ($)', type: 'number', min: 0, step: '100' },
    { name: 'suppliesMonthly', label: 'Monthly Supplies ($)', type: 'number', min: 0, step: '10' },
    { name: 'insuranceMonthly', label: 'Monthly Insurance ($)', type: 'number', min: 0, step: '10' },
    { name: 'groomingMonthly', label: 'Monthly Grooming ($)', type: 'number', min: 0, step: '10' },
    { name: 'training', label: 'One-Time Training ($)', type: 'number', min: 0, step: '100' },
    { name: 'years', label: 'Expected Lifespan (years)', type: 'number', min: 1, step: '5' },
  ],
  defaults: { adoption: '300', foodMonthly: '70', vetAnnual: '400', suppliesMonthly: '30', insuranceMonthly: '35', groomingMonthly: '40', training: '200', years: '13' },
  presets: [
    { label: 'Medium Dog (50 lbs)', values: { adoption: '300', foodMonthly: '70', vetAnnual: '450', suppliesMonthly: '30', insuranceMonthly: '40', groomingMonthly: '40', training: '200', years: '13' } },
    { label: 'Adult Cat (10 lbs)', values: { adoption: '100', foodMonthly: '40', vetAnnual: '300', suppliesMonthly: '25', insuranceMonthly: '20', groomingMonthly: '10', training: '0', years: '16' } },
    { label: 'Small Dog (15 lbs)', values: { adoption: '500', foodMonthly: '35', vetAnnual: '350', suppliesMonthly: '20', insuranceMonthly: '25', groomingMonthly: '30', training: '150', years: '15' } },
    { label: 'Large Dog (80 lbs)', values: { adoption: '200', foodMonthly: '100', vetAnnual: '600', suppliesMonthly: '40', insuranceMonthly: '55', groomingMonthly: '60', training: '300', years: '11' } },
  ],
  compute: (v) => { const monthlyTotal = v.foodMonthly + v.suppliesMonthly + v.insuranceMonthly + v.groomingMonthly; const annualRecurring = monthlyTotal * 12 + v.vetAnnual; const firstYear = v.adoption + annualRecurring + v.training; const lifetime = v.adoption + annualRecurring * v.years + v.training; const avgAnnual = lifetime / v.years; return { result: firstYear, label: 'First Year Cost', unit: '$',
    steps: [
      { label: 'One-Time: Adoption', value: `$${v.adoption.toFixed(0)}` },
      { label: 'One-Time: Training', value: `$${v.training.toFixed(0)}` },
      { label: 'Monthly: Food', value: `$${v.foodMonthly.toFixed(0)}` },
      { label: 'Monthly: Supplies + Insurance + Grooming', value: `$${(v.suppliesMonthly + v.insuranceMonthly + v.groomingMonthly).toFixed(0)}` },
      { label: 'Monthly Subtotal', value: `$${v.foodMonthly} + $${v.suppliesMonthly} + $${v.insuranceMonthly} + $${v.groomingMonthly} = $${monthlyTotal.toFixed(0)}/mo` },
      { label: 'Annual Recurring', value: `$${monthlyTotal.toFixed(0)} × 12 + $${v.vetAnnual} vet = $${annualRecurring.toFixed(0)}/yr` },
      { label: 'First Year Total', value: `$${v.adoption} + $${annualRecurring} + $${v.training} = $${firstYear.toFixed(0)}` },
      { label: 'Lifetime (${v.years} yrs)', value: `$${firstYear.toFixed(0)} + $${annualRecurring.toFixed(0)} × ${v.years - 1} = $${lifetime.toFixed(0)}` },
      { label: 'Average Annual Cost', value: `$${lifetime.toFixed(0)} ÷ ${v.years} = $${avgAnnual.toFixed(0)}/yr` },
      { label: 'Monthly Lifetime Average', value: `$${(avgAnnual / 12).toFixed(0)}/mo` },
    ],
    extras: [
      { label: '🐶 Dog Lifetime Cost', value: 'Average dog lifetime cost (ASPCA): Small dog $14,000-16,000. Medium dog $16,000-20,000. Large dog $20,000-30,000. Costs vary by region — urban areas cost 25-50% more for vet care and services.' },
      { label: '🐱 Cat Lifetime Cost', value: 'Average cat lifetime cost: $10,000-20,000 over 15-18 years. Cats are generally cheaper than dogs but hidden costs include litter ($15-25/month) and more frequent vet visits in senior years (7+).' },
      { label: '💵 Adoption vs Breeder Cost', value: 'Shelter adoption: $50-350 (includes spay/neuter, shots, microchip). Breeder: $800-5,000 (purebred) — does NOT include initial medical. Adopting saves $200-2,000 upfront and gives a home to a pet in need.' },
      { label: '🏥 Pet Insurance Reality', value: 'Pet insurance: $20-60/month for dogs, $10-35 for cats. Average claim reimbursement: 70-90% after deductible ($250-500). Breakeven: if your pet has 1 major incident or 2-3 minor incidents in its lifetime, insurance pays for itself.' },
      { label: '🩺 Emergency Vet Fund', value: 'Set aside $1,000-5,000 for emergency vet care. Common emergencies: foreign body ingestion ($2,000-5,000), hit by car ($1,500-5,000), poisoning ($500-2,000). A pet emergency fund is as important as insurance.' },
      { label: '📅 First Year Cost Spike', value: 'First year is always the most expensive: adoption fees, spay/neuter ($200-600), initial vaccinations ($100-300), microchip ($25-60), training classes ($100-500), supplies (crate, bed, bowls, toys — $200-500).' },
      { label: '💊 Senior Pet Medical Costs', value: 'Pets over 7 years old need twice-yearly vet visits. Senior blood panels: $100-250. Dental cleaning: $200-700. Chronic conditions (arthritis, kidney disease, diabetes) cost $500-2,000/year to manage with medication.' },
      { label: '⚰️ End-of-Life Care', value: 'Euthanasia: $50-300. Cremation: $100-400 (private) or $50-150 (communal). Burial: varied. Many vets offer palliative care packages for terminal pets — $200-500/month for pain management and hospice support.' },
    ]
  } },
  description: 'Estimate total pet ownership costs including adoption, food, vet care, supplies, insurance, grooming, and training. Get first-year, lifetime, and average annual cost projections with monthly breakdowns.',
  formula: 'Monthly Recurring = Food + Supplies + Insurance + Grooming | Annual Recurring = (Monthly × 12) + Vet | First Year = Adoption + Annual Recurring + Training | Lifetime = Adoption + (Annual Recurring × Years) + Training | Avg Annual = Lifetime ÷ Years',
  interpretation: 'The first year of pet ownership is the most expensive due to upfront costs (adoption, spay/neuter, vaccinations, training, supplies). For a medium dog: first year ~$2,500-4,000, then $1,500-2,500/year thereafter. Lifetime cost for a medium dog (13 years): $16,000-25,000. Cats are 30-40% cheaper: first year ~$1,500-2,500, then $800-1,500/year. Pet insurance ($20-55/month) and an emergency fund ($2,000-5,000) are strongly recommended. Senior pets (7+ years) require more frequent and expensive veterinary care.'
}

export default calcDef
