import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ sqft: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bathrooms: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), cleaningFreq: z.string().min(1) }),
  fields: [
    { name: 'sqft', label: 'Home Size (sq ft)', type: 'number', min: 200, step: '100' },
    { name: 'bathrooms', label: 'Number of Bathrooms', type: 'number', min: 1, step: '1' },
    { name: 'cleaningFreq', label: 'Cleaning Frequency', type: 'select', options: [{ label: 'Weekly', value: 'weekly' }, { label: 'Biweekly', value: 'biweekly' }, { label: 'Monthly', value: 'monthly' }] },
  ],
  compute: (v) => {
    const baseSupplies = v.sqft < 1000 ? 15 : v.sqft < 2000 ? 25 : 40
    const bathSupplies = v.bathrooms * 5
    const totalPerSession = baseSupplies + bathSupplies
    const freqMultiplier = v.cleaningFreq === 'weekly' ? 4.33 : v.cleaningFreq === 'biweekly' ? 2.17 : 1
    const monthlyCost = totalPerSession * freqMultiplier
    return { result: monthlyCost, label: 'Monthly Cleaning Supplies', unit: '$', steps: [{ label: 'Base Supplies', value: `$${baseSupplies.toFixed(2)}` }, { label: 'Bathroom Supplies', value: `+$${bathSupplies.toFixed(2)}` }, { label: 'Per Session', value: `$${totalPerSession.toFixed(2)}` }, { label: 'Monthly Cost', value: `$${monthlyCost.toFixed(2)}` }] }
  },
  description: 'Estimate monthly spending on cleaning supplies based on home size, number of bathrooms, and cleaning frequency.',
  formula: 'Monthly Cost = (Base + Bathrooms × 5) × (4.33 / Biweekly 2.17 / Monthly 1)',
  interpretation: 'Budget $15-40 per cleaning session for supplies. Stocking up on sales and using concentrate refills can cut costs 30-50%. Consider reusable cloths and DIY cleaners to save more.'
}

export default calcDef
