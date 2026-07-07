import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ services: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), monthPrices: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), annualDiscount: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), monthsSubscribed: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), sharingWith: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'services', label: 'Number of Services', type: 'number', min: 1, step: '1' },
    { name: 'monthPrices', label: 'Avg Monthly Price ($)', type: 'number', min: 1, step: '5' },
    { name: 'annualDiscount', label: 'Annual Discount (%)', type: 'number', min: 0, max: 50, step: '5' },
    { name: 'monthsSubscribed', label: 'Months Subscribed per Year', type: 'number', min: 1, max: 12, step: '1' },
    { name: 'sharingWith', label: 'People Sharing Account', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const monthlyFull = v.services * v.monthPrices
    const annualFull = monthlyFull * v.monthsSubscribed
    const discountSavings = annualFull * (v.annualDiscount / 100)
    const afterDiscount = annualFull - discountSavings
    const perPerson = afterDiscount / v.sharingWith
    return { result: perPerson, label: 'Annual Cost per Person', unit: '$', steps: [{ label: 'Full Monthly', value: `$${monthlyFull.toFixed(2)}` }, { label: 'Annual (${v.monthsSubscribed} mo)', value: `$${annualFull.toFixed(2)}` }, { label: 'Annual Discount', value: `-$${discountSavings.toFixed(2)}` }, { label: 'Total per Year', value: `$${afterDiscount.toFixed(2)}` }, { label: 'Per Person (${v.sharingWith} ways)', value: `$${perPerson.toFixed(2)}` }] }
  },
  description: 'Calculate streaming costs per person when sharing accounts with family or friends, including annual discounts.',
  formula: 'PerPerson = (Services×Price×Months×(1-Discount%)) / People',
  interpretation: 'Netflix, Spotify, and many services offer 2-5 simultaneous streams. Splitting 4 services among 3 people: $15-25/person/month vs $60-100 alone. Some services restrict password sharing. Family plans offer legitimate sharing options.'
}

export default calcDef
