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
    return { result: monthlyTotal, label: 'Monthly Supplies Budget', unit: '$', steps: [{ label: 'Room Factor', value: `$${roomFactor.toFixed(2)}` }, { label: 'Floor Factor', value: `$${floorFactor.toFixed(2)}` }, { label: 'Frequency Adjustment', value: `${freqMultiplier.toFixed(1)}×` }, { label: 'Floor Type Surcharges', value: `$${(hardwoodAdd + carpetAdd).toFixed(2)}` }, { label: 'Monthly Total', value: `$${monthlyTotal.toFixed(2)}` }, { label: 'Annual Total', value: `$${annualTotal.toFixed(2)}` }] }
  },
  description: 'Budget for cleaning supplies based on home layout, room count, frequency, and floor types. Hardwood and carpet require specialized cleaners.',
  formula: 'Monthly = (Rooms × $2 + Floors × $5) × Frequency Factor + Floor Surcharges',
  interpretation: 'Two-story homes need duplicate supplies (one per floor). Weekly cleaning uses 30% more supplies than biweekly. Hardwood cleaners cost $5-8/bottle, carpet shampoos $8-15. Buy multi-surface cleaners to reduce the product count.'
}

export default calcDef
