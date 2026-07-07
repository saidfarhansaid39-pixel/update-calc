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
  compute: (v) => { const monthlyTotal = v.foodMonthly + v.suppliesMonthly + v.insuranceMonthly + v.groomingMonthly; const annualRecurring = monthlyTotal * 12 + v.vetAnnual; const firstYear = v.adoption + annualRecurring + v.training; const lifetime = v.adoption + annualRecurring * v.years + v.training; const avgAnnual = lifetime / v.years; return { result: firstYear, label: 'First Year Cost', unit: '$', steps: [{ label: 'Adoption', value: `$${v.adoption.toFixed(0)}` }, { label: 'Monthly Recurring', value: `$${monthlyTotal.toFixed(0)}/mo` }, { label: 'Annual Recurring', value: `$${annualRecurring.toFixed(0)}/yr` }, { label: 'First Year Total', value: `$${firstYear.toFixed(0)}` }, { label: 'Lifetime (${v.years} yrs)', value: `$${lifetime.toFixed(0)}` }, { label: 'Average Annual', value: `$${avgAnnual.toFixed(0)}` }] } },
  description: 'Estimate total pet ownership costs including adoption, food, vet care, supplies, insurance, grooming, and training over the pet\'s lifetime.',
  formula: 'First Year = Adoption + (Food + Supplies + Insurance + Grooming) × 12 + Vet + Training | Lifetime = First Year + Annual Recurring × (Lifespan − 1)',
  interpretation: 'Average dog lifetime cost: $15,000-30,000. Cat: $10,000-20,000. First year is most expensive due to adoption fees, spay/neuter, and initial vaccinations. Pet insurance costs $20-60/month.'
}

export default calcDef
