import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wbc3GuestCount: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), wbc3PerGuestCost: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wbc3Attire: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wbc3Photo: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wbc3Music: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wbc3Flowers: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wbc3Misc: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'wbc3GuestCount', label: 'Number of Guests', type: 'number', min: 1, step: '10' },
    { name: 'wbc3PerGuestCost', label: 'Cost per Guest ($)', type: 'number', min: 10, step: '25' },
    { name: 'wbc3Attire', label: 'Attire ($)', type: 'number', min: 0, step: '500' },
    { name: 'wbc3Photo', label: 'Photography/Video ($)', type: 'number', min: 0, step: '500' },
    { name: 'wbc3Music', label: 'Music/Entertainment ($)', type: 'number', min: 0, step: '500' },
    { name: 'wbc3Flowers', label: 'Flowers/Decor ($)', type: 'number', min: 0, step: '500' },
    { name: 'wbc3Misc', label: 'Miscellaneous ($)', type: 'number', min: 0, step: '500' },
  ],
  compute: (v) => {
    const guestTotal = v.wbc3GuestCount * v.wbc3PerGuestCost
    const total = guestTotal + v.wbc3Attire + v.wbc3Photo + v.wbc3Music + v.wbc3Flowers + v.wbc3Misc
    const pctGuests = total > 0 ? (guestTotal / total) * 100 : 0
    const pctAttire = total > 0 ? (v.wbc3Attire / total) * 100 : 0
    const pctPhoto = total > 0 ? (v.wbc3Photo / total) * 100 : 0
    const pctMusic = total > 0 ? (v.wbc3Music / total) * 100 : 0
    const pctFlowers = total > 0 ? (v.wbc3Flowers / total) * 100 : 0
    const pctMisc = total > 0 ? (v.wbc3Misc / total) * 100 : 0
    return { result: total, label: 'Total Wedding Cost', unit: '$', steps: [{ label: 'Guest-Related', value: v.wbc3GuestCount + ' x $' + v.wbc3PerGuestCost.toFixed(0) + ' = $' + guestTotal.toFixed(0) + ' (' + pctGuests.toFixed(0) + '%)' }, { label: 'Attire', value: '$' + v.wbc3Attire.toFixed(0) + ' (' + pctAttire.toFixed(0) + '%)' }, { label: 'Photo+Music', value: '$' + (v.wbc3Photo + v.wbc3Music).toFixed(0) }, { label: 'Flowers+Other', value: '$' + (v.wbc3Flowers + v.wbc3Misc).toFixed(0) }, { label: 'Grand Total', value: '$' + total.toFixed(0) }] }
  },
  description: 'Calculate total wedding cost from guest count, per-person expenses, attire, photography, music, flowers, and miscellaneous items.',
  formula: 'Total = Guests x PerGuestCost + Attire + Photo + Music + Flowers + Misc | See percentage breakdown by category',
  interpretation: 'Guest count is the biggest cost driver. Reducing guests from 150 to 100 saves $5,000-15,000. Average per-guest cost: $150-300. Peak season (May-Oct) costs 20-30% more. Create a prioritized list to cut non-essential items.'
}

export default calcDef
