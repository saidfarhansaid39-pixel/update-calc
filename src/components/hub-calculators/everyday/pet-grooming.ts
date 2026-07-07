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
  compute: (v) => { const tipAmount = v.costPerGroom * (v.tipPct / 100); const perVisit = v.costPerGroom + tipAmount + v.travelFee; const annual = perVisit * v.groomFrequency; const monthly = annual / 12; return { result: annual, label: 'Annual Grooming Cost', unit: '$', steps: [{ label: 'Per Visit', value: `$${v.costPerGroom.toFixed(0)} + $${tipAmount.toFixed(2)} tip + $${v.travelFee.toFixed(0)} fee` }, { label: 'Monthly', value: `$${monthly.toFixed(2)}` }, { label: 'Annual (${v.groomFrequency} visits)', value: `$${annual.toFixed(2)}` }] } },
  description: 'Estimate annual pet grooming expenses including service cost, tips, and any additional travel or pickup fees.',
  formula: 'Annual = (Cost + Tip% × Cost + Travel Fee) × Visits/Year',
  interpretation: 'Professional grooming costs $30-90 per session depending on breed, size, and services. Dogs need grooming every 4-8 weeks on average. Cats with long hair need grooming every 6-8 weeks.'
}

export default calcDef
