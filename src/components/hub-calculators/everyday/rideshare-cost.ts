import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), baseFare: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), perMile: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), perMin: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), timeMin: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), surge: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), tipPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'distance', label: 'Trip Distance (mi)', type: 'number', min: 0.5, step: '0.5' },
    { name: 'baseFare', label: 'Base Fare ($)', type: 'number', min: 0, step: '0.5' },
    { name: 'perMile', label: 'Per Mile Rate ($)', type: 'number', min: 0.5, step: '0.1' },
    { name: 'perMin', label: 'Per Minute Rate ($)', type: 'number', min: 0.1, step: '0.05' },
    { name: 'timeMin', label: 'Trip Duration (min)', type: 'number', min: 1, step: '5' },
    { name: 'surge', label: 'Surge Multiplier', type: 'number', min: 1, max: 5, step: '0.5' },
    { name: 'tipPct', label: 'Tip (%)', type: 'number', min: 0, max: 100, step: '5' },
  ],
  compute: (v) => {
    const subtotal = (v.baseFare + v.perMile * v.distance + v.perMin * v.timeMin) * v.surge
    const tip = subtotal * (v.tipPct / 100)
    const total = subtotal + tip
    return { result: total, label: 'Total Fare with Tip', unit: '$', steps: [{ label: 'Distance Charge', value: `$${(v.perMile * v.distance).toFixed(2)}` }, { label: 'Time Charge', value: `$${(v.perMin * v.timeMin).toFixed(2)}` }, { label: 'Base Fare', value: `$${v.baseFare.toFixed(2)}` }, { label: 'Surge ×' + v.surge, value: `$${subtotal.toFixed(2)}` }, { label: 'Tip', value: `$${tip.toFixed(2)}` }, { label: 'Total', value: `$${total.toFixed(2)}` }] }
  },
  description: 'Estimate rideshare fares for Uber, Lyft, or taxi including distance, time, surge pricing, and tip.',
  formula: 'Total = (Base + Distance×Rate + Time×Rate) × Surge × (1 + Tip%)',
  interpretation: 'Uber/Lyft use dynamic pricing. Surge 1.0-1.5× is common, 2.0-3.0× during peak events. Wait 10-15 min for surge to drop. Pool/share options save 20-40%. Tip 15-20% for standard service.'
}

export default calcDef
