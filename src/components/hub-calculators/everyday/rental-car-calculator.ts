import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ days: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), dailyRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), insuranceTotal: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), fees: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), fuelCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'days', label: 'Rental Days', type: 'number', min: 1, step: '1' },
    { name: 'dailyRate', label: 'Daily Rate ($)', type: 'number', min: 10, step: '10' },
    { name: 'insuranceTotal', label: 'Total Insurance ($)', type: 'number', min: 0, step: '20' },
    { name: 'fees', label: 'Fees & Taxes ($)', type: 'number', min: 0, step: '10' },
    { name: 'fuelCost', label: 'Fuel Cost ($)', type: 'number', min: 0, step: '10' },
  ],
  defaults: { days: '5', dailyRate: '45', insuranceTotal: '80', fees: '75', fuelCost: '45' },
  presets: [
    { label: 'Weekend Getaway (2 days)', values: { days: '2', dailyRate: '50', insuranceTotal: '40', fees: '35', fuelCost: '25' } },
    { label: 'Week-Long Vacation', values: { days: '7', dailyRate: '45', insuranceTotal: '120', fees: '110', fuelCost: '70' } },
    { label: 'Business Trip (3 days)', values: { days: '3', dailyRate: '60', insuranceTotal: '0', fees: '55', fuelCost: '20' } },
  ],
  compute: (v) => {
    const baseRental = v.days * v.dailyRate
    const totalCost = baseRental + v.insuranceTotal + v.fees + v.fuelCost
    const costPerDay = totalCost / v.days
    const feesPct = (v.fees / baseRental) * 100
    const basePct = totalCost > 0 ? (baseRental / totalCost) * 100 : 0
    return { result: totalCost, label: 'Total Rental Cost', unit: '$', steps: [{ label: 'Base Rental', value: `${v.days} days × $${v.dailyRate.toFixed(2)}/day = $${baseRental.toFixed(2)}` }, { label: 'Insurance (CDW/Liability)', value: `$${v.insuranceTotal.toFixed(2)}` }, { label: 'Fees & Taxes', value: `$${v.fees.toFixed(2)} (${feesPct.toFixed(0)}% of base rate)` }, { label: 'Fuel (pre-fill or return)', value: `$${v.fuelCost.toFixed(2)}` }, { label: 'Total Actual Cost', value: `$${totalCost.toFixed(2)}` }, { label: 'Effective Daily Rate', value: `$${totalCost.toFixed(2)} ÷ ${v.days} = $${costPerDay.toFixed(2)}/day` }, { label: 'Base Rate vs Total', value: `Base is ${basePct.toFixed(0)}% of total — fees + insurance = ${(100 - basePct).toFixed(0)}%` }] ,
    extras: [
      { label: 'Insurance Decision Guide', value: 'CDW (Collision Damage Waiver): $15-30/day. Check if your personal auto policy covers rentals (most do for US rentals). Premium credit cards (Chase Sapphire, Amex Platinum) include CDW — decline at counter to save $50-150/week. Liability insurance: $10-20/day — your personal policy usually extends to rentals.' },
      { label: 'Hidden Fee Breakdown', value: 'Common fees add 20-40% to the base rate: airport concession fee (10-12%), vehicle license fee (2-5%), state/local taxes (8-15%), additional driver fee ($10-15/day), under-25 fee ($15-30/day), one-way drop fee ($50-300+). Always get the total out-the-door price before booking.' },
      { label: 'Airport vs Off-Airport Locations', value: 'Renting from an off-airport location saves 20-30% vs airport counters (airport surcharges of 10-15% plus concession fees). Check for neighborhood locations near your hotel. Free shuttle may be available. Returning to a different location (one-way) adds $50-300 in drop fees.' },
      { label: 'Fuel Policy Options', value: 'Pre-pay fuel: you buy a full tank at the rental counter rate (usually market rate or slightly higher). Return empty: risky — if you return with any fuel, you lose the pre-pay. Return full: our model — refill at a nearby station before return. Never use the rental company\'s refuel service ($8-12/gal vs $3-5/gal market).' },
      { label: 'Car Class Comparison', value: 'Economy: $30-50/day (40+ MPG). Compact: $35-55/day. Midsize: $40-65/day. Standard/Full-size: $45-75/day. SUV: $60-120/day. Luxury: $80-200+/day. Renting a smaller class than you need and getting a free upgrade at the counter is a common strategy — midsize booking often gets upgraded to standard.' },
      { label: 'Membership & Discount Programs', value: 'AAA: 5-15% off base rate. Costco Travel: competitive rates, free additional driver. Corporate codes: many employers have negotiated rates (often 20-30% off). Frequent flyer programs: rental miles/points. AARP: 10-30% off. Always check for discounts before booking — they take 1 minute to apply and save $50-200.' },
      { label: 'Rental Duration Savings', value: 'Weekly rates (7+ days) are typically cheaper than daily rates by 20-40%. A 7-day rental at $45/day = $315, but weekly rate may be $220-260. Weekend rates (Fri-Mon): often heavily discounted. Monthly rentals: 30-50% off daily rate equivalent. For long trips, check both daily × days and weekly rates.' },
    ]}
  },
  description: 'Calculate total rental car cost including daily rate, insurance, fees, taxes, and fuel. Get the effective daily rate and percentage breakdown to compare total costs across rental companies and understand hidden charges.',
  formula: 'TotalCost = (Days × DailyRate) + Insurance + Fees + Fuel. EffectiveDailyRate = TotalCost ÷ Days. FeesAsPctOfBase = (Fees ÷ BaseRental) × 100. BasePctOfTotal = (BaseRental ÷ TotalCost) × 100.',
  interpretation: 'A 5-day rental at $45/day ($225 base) with $80 insurance, $75 fees, and $45 fuel totals $425. The effective daily rate is $85/day — nearly double the advertised $45/day. Fees alone ($75) represent 33% of the base rate. Only 53% of the total cost goes to the actual vehicle rental; the remaining 47% goes to insurance (19%), fees (18%), and fuel (11%). To minimize total cost: decline CDW if your credit card covers it (saves $50-80), pick up off-airport (saves $30-60), refill before returning (saves $15-30), and avoid additional driver fees by being the only driver.'
}

export default calcDef
