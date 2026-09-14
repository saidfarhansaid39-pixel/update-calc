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
  defaults: { rentalDays: '5', weeklyRate: '350', extraDayRate: '60', mileageCharge: '0', milesDriven: '0', under25Fee: '0', additionalDriver: '0' },
  presets: [
    { label: 'Week Long Rental', values: { rentalDays: '7', weeklyRate: '350', extraDayRate: '55', mileageCharge: '0', milesDriven: '0', under25Fee: '0', additionalDriver: '0' } },
    { label: 'Weekend Trip (Age 24)', values: { rentalDays: '3', weeklyRate: '300', extraDayRate: '50', mileageCharge: '0', milesDriven: '0', under25Fee: '27', additionalDriver: '13' } },
    { label: 'Mileage-Intensive Move', values: { rentalDays: '3', weeklyRate: '280', extraDayRate: '45', mileageCharge: '0.35', milesDriven: '800', under25Fee: '0', additionalDriver: '0' } },
    { label: 'Long-Term Rental', values: { rentalDays: '14', weeklyRate: '320', extraDayRate: '50', mileageCharge: '0', milesDriven: '0', under25Fee: '0', additionalDriver: '120' } },
  ],
  compute: (v) => {
    const weeks = Math.floor(v.rentalDays / 7)
    const extraDays = v.rentalDays % 7
    const baseCost = weeks * v.weeklyRate + extraDays * v.extraDayRate
    const mileageTotal = v.mileageCharge * v.milesDriven
    const total = baseCost + mileageTotal + v.under25Fee + v.additionalDriver
    const perDay = total / v.rentalDays
    return { result: total, label: 'Total Rental Cost', unit: '$', steps: [{ label: 'Base (weekly + extra)', value: `$${baseCost.toFixed(2)}` }, { label: 'Mileage', value: `$${mileageTotal.toFixed(2)}` }, { label: 'Under-25 Fee', value: `$${v.under25Fee.toFixed(2)}` }, { label: 'Additional Driver', value: `$${v.additionalDriver.toFixed(2)}` }, { label: 'Total', value: `$${total.toFixed(2)}` }, { label: 'Cost per Day', value: `$${perDay.toFixed(2)}` }] ,
    extras: [
      { label: 'Weekly vs Daily Rate', value: 'Weekly rates are typically 4-6x the daily rate (effectively 5 days for price of 7!). A 7-day rental at $350/week vs $55/day = $350 vs $385 — save $35. Always check weekly vs daily pricing' },
      { label: 'Under-25 Fees Explained', value: 'Drivers under 25 pay $15-30/day surcharge. Age 20-24: highest fees. Age 25+: fee drops to $0 at most agencies. Exception: Enterprise charges $10/day for 21-24. Use Turo or Zipcar for better under-25 rates' },
      { label: 'Insurance Options (LDW/CDW)', value: 'Rental company LDW: $10-30/day. Your personal auto insurance often covers rentals — check with agent. Many credit cards (Chase Sapphire, Amex) include free rental insurance. Never buy both' },
      { label: 'Mileage Policy Comparison', value: 'Most agencies offer unlimited free miles on standard rentals. Budget-friendly rates may cap at 100-200 mi/day — overage costs $0.10-0.50/mi. Estimate mileage before booking to avoid surprise overage charges' },
      { label: 'Additional Driver Fees', value: 'Spouse/partner: often free at most agencies. Other additional drivers: $10-15/day ($70-105/week). Skip the fee by making the additional driver the primary renter (rotating primary driver for multi-driver trips)' },
      { label: 'Fuel Policy Trap', value: 'Agencies charge $6-10/gal for refueling. Best option: choose "full-to-full" (pick up full, return full). Fill up at a station 1-2 mi from return location. "Pre-pay" fuel options rarely save money' },
      { label: 'Hidden Fees & Add-Ons', value: 'Airport concession fee: 7-12% of rental. Vehicle licensing fee: $1-3/day. Energy surcharge: $1-3/day. GPS rental: $10-15/day (use your phone instead). Car seat: $10-15/day. Toll pass: $3-10/day plus tolls' },
    ]}
  },
  description: 'Calculate total rental car cost including weekly base rates, extra day charges, mileage fees, under-25 surcharges, and additional driver fees. Get per-day cost breakdown.',
  formula: 'BaseCost = Floor(Days ÷ 7) × WeeklyRate + (Days % 7) × ExtraDayRate. Total = BaseCost + (Mileage × MilesDriven) + Under25Fee + AdditionalDriverFee. CostPerDay = Total ÷ Days.',
  interpretation: 'A 10-day rental at $350/week + $55/day extra: 1 week ($350) + 3 extra days ($165) = $515 base. With $0 mileage, $27/day under-25 for 3 days ($81), and $13/day additional driver for all 10 days ($130) = total $726 ($72.60/day). Weekly rates save 15-30% over daily. Most major agencies offer free unlimited mileage. Under-25 surcharge ($15-30/day) can double a daily rate for young drivers — use Turo or get a parent to rent. Check your credit card (Chase Sapphire Preferred, Amex Platinum, Capital One Venture) for free primary rental insurance — saves $10-30/day on LDW. Always refuel before returning to avoid $6-10/gal refueling charges.'
}

export default calcDef
