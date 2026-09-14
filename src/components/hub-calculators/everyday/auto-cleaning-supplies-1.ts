import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ acs2FloorCount: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), acs2TotalRooms: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), acs2CleaningFreq: z.string().min(1), acs2HasHardwood: z.string().min(1), acs2HasCarpet: z.string().min(1) }),
  fields: [
    { name: 'acs2FloorCount', label: 'Floors in Home', type: 'number', min: 1, step: '1' },
    { name: 'acs2TotalRooms', label: 'Total Rooms', type: 'number', min: 1, step: '1' },
    { name: 'acs2CleaningFreq', label: 'Cleaning Frequency', type: 'select', options: [{ label: 'Weekly ($15/mo extra)', value: 'weekly' }, { label: 'Biweekly (standard)', value: 'biweekly' }, { label: 'Monthly (buy in bulk)', value: 'monthly' }] },
    { name: 'acs2HasHardwood', label: 'Hardwood Floors', type: 'select', options: [{ label: 'Yes (add $5/mo)', value: 'yes' }, { label: 'No', value: 'no' }] },
    { name: 'acs2HasCarpet', label: 'Carpet Areas', type: 'select', options: [{ label: 'Yes (add $8/mo)', value: 'yes' }, { label: 'No', value: 'no' }] },
  ],
  defaults: { acs2FloorCount: '2', acs2TotalRooms: '6', acs2CleaningFreq: 'biweekly', acs2HasHardwood: 'yes', acs2HasCarpet: 'yes' },
  presets: [
    { label: 'Small Apartment', values: { acs2FloorCount: '1', acs2TotalRooms: '3', acs2CleaningFreq: 'weekly', acs2HasHardwood: 'yes', acs2HasCarpet: 'no' } },
    { label: 'Family Home', values: { acs2FloorCount: '2', acs2TotalRooms: '8', acs2CleaningFreq: 'weekly', acs2HasHardwood: 'yes', acs2HasCarpet: 'yes' } },
    { label: 'Townhouse Minimalist', values: { acs2FloorCount: '3', acs2TotalRooms: '6', acs2CleaningFreq: 'monthly', acs2HasHardwood: 'yes', acs2HasCarpet: 'no' } },
  ],
  compute: (v) => {
    const roomFactor = v.acs2TotalRooms * 2
    const floorFactor = v.acs2FloorCount * 5
    let freqMultiplier = 1
    if (v.acs2CleaningFreq === 'weekly') { freqMultiplier = 1.3 }
    if (v.acs2CleaningFreq === 'monthly') { freqMultiplier = 0.8 }
    const hardwoodAdd = v.acs2HasHardwood === 'yes' ? 5 : 0
    const carpetAdd = v.acs2HasCarpet === 'yes' ? 8 : 0
    const baseMonthly = (roomFactor + floorFactor) * freqMultiplier
    const monthlyTotal = baseMonthly + hardwoodAdd + carpetAdd
    const annualTotal = monthlyTotal * 12
    const costPerRoom = monthlyTotal / v.acs2TotalRooms
    return { result: monthlyTotal, label: 'Monthly Supplies Budget', unit: '$', steps: [{ label: 'Room Factor', value: `${v.acs2TotalRooms} rooms × $2 = $${roomFactor.toFixed(2)}` }, { label: 'Floor Factor', value: `${v.acs2FloorCount} floors × $5 = $${floorFactor.toFixed(2)}` }, { label: 'Base (before frequency)', value: `$${roomFactor.toFixed(2)} + $${floorFactor.toFixed(2)} = $${(roomFactor + floorFactor).toFixed(2)}` }, { label: 'Frequency Adjustment', value: `${freqMultiplier.toFixed(1)}× = $${baseMonthly.toFixed(2)}` }, { label: 'Floor Surcharges', value: `Hardwood: $${hardwoodAdd.toFixed(2)} + Carpet: $${carpetAdd.toFixed(2)}` }, { label: 'Monthly Total', value: `$${monthlyTotal.toFixed(2)}` }, { label: 'Annual Total', value: `$${annualTotal.toFixed(2)}` }, { label: 'Cost per Room', value: `$${costPerRoom.toFixed(2)}` }] ,
    extras: [
      { label: 'Multi-Surface Strategy', value: 'Buying one all-purpose cleaner ($4-6) instead of separate products for each surface saves $8-15/month. Look for "multi-surface" labels.' },
      { label: 'Floor Type Cost Impact', value: `Hardwood adds $5/mo (special pH-balanced cleaner), carpet adds $8/mo (shampoo + deodorizer). Combined: $${(hardwoodAdd + carpetAdd).toFixed(2)}/mo.` },
      { label: 'Bulk Buying Tips', value: 'Cleaning concentrates (e.g., Mrs. Meyers, Method) cost $0.08-0.15/oz vs pre-diluted $0.30-0.50/oz. A $10 concentrate lasts 2-3 months.' },
      { label: 'DIY Alternative', value: 'White vinegar ($3/gal), baking soda ($1/lb), and castile soap ($12/32oz) replace 80% of commercial cleaners. DIY costs ~$5/month vs $25-40 for brand-name.' },
      { label: 'Frequency vs Waste', value: `Weekly cleaning uses ${(1.3 / 1).toFixed(0)}× the product of biweekly — consider spot-cleaning between deep cleans to stretch supplies.` },
      { label: 'Room-by-Room Allocation', value: `Kitchen and bathrooms consume ~60% of supplies. At $${costPerRoom.toFixed(2)}/room, allocate $${(costPerRoom * 0.6).toFixed(2)} to high-use areas.` },
      { label: 'Microfiber Savings', value: 'Switch to microfiber cloths ($8/12-pack, reusable 500+ washes). Replace paper towels — saves $10-20/month on disposables.' },
    ]}
  },
  description: 'Budget for cleaning supplies based on home layout, room count, cleaning frequency, and floor types. Get multi-surface buying tips and DIY alternatives to cut costs by 50%.',
  formula: 'Monthly = ((Rooms × $2 + Floors × $5) × Frequency Factor) + Hardwood Surcharge + Carpet Surcharge | Frequency Factor: Weekly = 1.3, Biweekly = 1.0, Monthly = 0.8',
  interpretation: 'Two-story homes need duplicate supplies carried floor-to-floor. Weekly cleaning uses 30% more product than biweekly. Hardwood-specific cleaners cost $5-8/bottle, carpet shampoos $8-15. Switching to multi-surface concentrates and microfiber cloths can cut your cleaning budget in half. DIY alternatives (vinegar, baking soda) cost ~$5/month.'
}

export default calcDef
