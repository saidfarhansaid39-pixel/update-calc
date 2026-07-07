import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ rentalDays: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), weeklyRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), extraDayRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mileageCharge: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), milesDriven: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), under25Fee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), additionalDriver: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'rentalDays', label: 'Number of Days', type: 'number', min: 1, step: '1' },
    { name: 'weeklyRate', label: 'Weekly Rate ($)', type: 'number', min: 50, step: '25' },
    { name: 'extraDayRate', label: 'Extra Day Rate ($)', type: 'number', min: 10, step: '5' },
    { name: 'mileageCharge', label: 'Per-Mile Charge ($)', type: 'number', min: 0, step: '0.1' },
    { name: 'milesDriven', label: 'Miles You Will Drive', type: 'number', min: 0, step: '50' },
    { name: 'under25Fee', label: 'Under-25 Surcharge ($)', type: 'number', min: 0, step: '10' },
    { name: 'additionalDriver', label: 'Additional Driver Fee ($)', type: 'number', min: 0, step: '10' },
  ],
  compute: (v) => {
    const weeks = Math.floor(v.rentalDays / 7)
    const extraDays = v.rentalDays % 7
    const baseCost = weeks * v.weeklyRate + extraDays * v.extraDayRate
    const mileageTotal = v.mileageCharge * v.milesDriven
    const total = baseCost + mileageTotal + v.under25Fee + v.additionalDriver
    const perDay = total / v.rentalDays
    return { result: total, label: 'Total Rental Cost', unit: '$', steps: [{ label: 'Base (weekly + extra)', value: `$${baseCost.toFixed(2)}` }, { label: 'Mileage', value: `$${mileageTotal.toFixed(2)}` }, { label: 'Under-25 Fee', value: `$${v.under25Fee.toFixed(2)}` }, { label: 'Additional Driver', value: `$${v.additionalDriver.toFixed(2)}` }, { label: 'Total', value: `$${total.toFixed(2)}` }, { label: 'Cost per Day', value: `$${perDay.toFixed(2)}` }] }
  },
  description: 'Calculate total rental car costs including weekly rates, extra days, mileage charges, and common surcharges like under-25 and additional driver fees.',
  formula: 'Total = (Weeks×Weekly + ExtraDays×ExtraRate) + Miles×MileageRate + Under25Fee + AddDriverFee',
  interpretation: 'Weekly rates are usually cheaper than daily. Most rentals include free unlimited mileage. Under-25 surcharge: $15-30/day. Additional driver: $10-15/day. Check with your credit card for rental car insurance coverage.'
}

export default calcDef
