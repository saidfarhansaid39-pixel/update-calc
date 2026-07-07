import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ petType: z.enum(['dog', 'cat']), weight: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), brand: z.enum(['budget', 'mid-range', 'premium']), bagsPerMonth: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), costPerBag: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'petType', label: 'Pet Type', type: 'select', options: [{ label: 'Dog', value: 'dog' }, { label: 'Cat', value: 'cat' }] },
    { name: 'weight', label: 'Pet Weight (lbs)', type: 'number', min: 1, step: '5' },
    { name: 'brand', label: 'Food Brand Tier', type: 'select', options: [{ label: 'Budget ($)', value: 'budget' }, { label: 'Mid-Range ($$)', value: 'mid-range' }, { label: 'Premium ($$$)', value: 'premium' }] },
    { name: 'bagsPerMonth', label: 'Bags per Month', type: 'number', min: 0, step: '0.5' },
    { name: 'costPerBag', label: 'Cost per Bag ($)', type: 'number', min: 0, step: '10' },
  ],
  compute: (v) => { const dailyCups = v.petType === 'dog' ? Math.max(0.5, v.weight / 30) : Math.max(0.25, v.weight / 20); const dailyOz = dailyCups * (v.petType === 'dog' ? 4.5 : 3.5); const monthlyLbs = dailyOz * 30 / 16; const monthlyCost = v.bagsPerMonth * v.costPerBag; const annualCost = monthlyCost * 12; const costPerDay = monthlyCost / 30; return { result: monthlyCost, label: 'Monthly Food Cost', unit: '$', steps: [{ label: 'Est. Daily Portion', value: `${dailyCups.toFixed(1)} cups (${dailyOz.toFixed(1)} oz)` }, { label: 'Monthly Consumption', value: `${monthlyLbs.toFixed(1)} lbs` }, { label: 'Bags Bought/Month', value: `${v.bagsPerMonth}` }, { label: 'Monthly Cost', value: `$${monthlyCost.toFixed(2)}` }, { label: 'Annual Cost', value: `$${annualCost.toFixed(2)}` }] } },
  description: 'Calculate pet food costs based on pet type, weight, food brand, and bag pricing. Get daily portions and annual feeding costs.',
  formula: 'Monthly Cost = Bags/Month × Cost/Bag | Daily Portion (dogs) = Weight/30 cups | Portion (cats) = Weight/20 cups',
  interpretation: 'Premium pet food costs 2-3× budget brands but has better nutrition and digestibility (less waste). Feed according to weight, activity, and life stage. Treats should be ≤10% of daily calories.'
}

export default calcDef
